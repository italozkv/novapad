const crypto = require('node:crypto');
const Store = require('electron-store');
const bcrypt = require('bcrypt');
const { app } = require('electron');

const SALT_ROUNDS = 12;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const STORE_NAME = 'novapad-auth';
const LICENSE_STORE_NAME = 'novapad-license';
const DEFAULT_LICENSE_SERVER_URL = 'http://localhost:3333';
const DEFAULT_PRODUCTION_LICENSE_SERVER_URL = 'https://novapad-server-dtjc.onrender.com';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function base64UrlEncode(input) {
  return Buffer.from(typeof input === 'string' ? input : JSON.stringify(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input) {
  const normalized = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function timingSafeEquals(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function publicUser(user) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

/**
 * Auth manager for NovaPad.
 * Handles local registration, login, logout, and session recovery.
 */
class AuthManager {
  /**
   * @param {object} options
   * @param {object} options.db - NovaPad database instance
   * @param {Console} [options.logger=console] - Logger target
   */
  constructor({ db, logger = console } = {}) {
    if (!db) throw new Error('AuthManager requires a database instance.');
    this.db = db;
    this.logger = logger;
    this.store = null;
  }

  /**
   * Lazily creates the electron-store instance.
   * @returns {Store}
   */
  getStore() {
    if (!this.store) {
      this.store = new Store({ name: STORE_NAME });
    }
    return this.store;
  }

  /**
   * Returns or creates the local JWT secret.
   * @returns {string}
   */
  getJwtSecret() {
    const store = this.getStore();
    let secret = store.get('auth.jwtSecret');
    if (!secret) {
      secret = crypto.randomBytes(32).toString('hex');
      store.set('auth.jwtSecret', secret);
    }
    return String(secret);
  }

  /**
   * Builds a signed JWT-like token using HMAC SHA-256.
   * @param {object} payload
   * @returns {string}
   */
  signJwt(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const body = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(body);
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto
      .createHmac('sha256', this.getJwtSecret())
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `${data}.${signature}`;
  }

  /**
   * Verifies a locally signed token.
   * @param {string} token
   * @returns {object|null}
   */
  verifyJwt(token) {
    const parts = String(token || '').split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    const expected = crypto
      .createHmac('sha256', this.getJwtSecret())
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    if (!timingSafeEquals(signature, expected)) return null;
    try {
      const payload = JSON.parse(base64UrlDecode(encodedPayload));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
      return payload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Persists the current session in electron-store.
   * @param {object} session
   */
  setSession(session) {
    this.getStore().set('auth.session', session);
  }

  /**
   * Clears any local session.
   */
  clearSession() {
    this.getStore().delete('auth.session');
  }

  /**
   * Reads the configured remote registration endpoint.
   * Reuses the same settings store as the license manager when available.
   * @returns {{ baseUrl: string, appKey: string }}
   */
  getRemoteRegistrationConfig() {
    const store = new Store({ name: LICENSE_STORE_NAME });
    const packaged = Boolean(app?.isPackaged);
    return {
      baseUrl: String(
        store.get('license.serverBaseUrl') ||
        process.env.NOVAPAD_LICENSE_SERVER_URL ||
        process.env.NOVAPAD_LICENSE_URL ||
        (packaged ? DEFAULT_PRODUCTION_LICENSE_SERVER_URL : DEFAULT_LICENSE_SERVER_URL)
      ).trim(),
      appKey: String(
        store.get('license.appKey') ||
        process.env.NOVAPAD_LICENSE_APP_KEY ||
        process.env.NOVAPAD_APP_KEY ||
        ''
      ).trim(),
    };
  }

  /**
   * Mirrors a newly created local user to the remote site database.
   * Failures are logged but do not block registration.
   * @param {object} user
   * @param {string} passwordHash
   * @returns {Promise<void>}
   */
  async syncRegisteredUser(user, passwordHash) {
    const { baseUrl, appKey } = this.getRemoteRegistrationConfig();
    if (!baseUrl) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const url = new URL('/users/register', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(appKey ? { 'X-App-Key': appKey } : {}),
        },
        body: JSON.stringify({
          name: user?.name || '',
          email: user?.email || '',
          password_hash: passwordHash || user?.password_hash || '',
          avatar_url: user?.avatar_url || null,
        }),
        signal: controller.signal,
      });

      const text = await response.text();
      let parsed = null;
      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(parsed?.error || parsed?.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      this.logger?.warn?.('Failed to sync registered user to remote DB:', error);
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Creates a local user, account, free license and default entitlements.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {object}
   */
  async register(name, email, password, options = {}) {
    const normalizedEmail = normalizeEmail(email);
    if (!name || !normalizedEmail || !password) {
      throw new Error('Name, email and password are required.');
    }

    const existing = this.db.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error('Email already registered.');
    }

    const passwordHash = bcrypt.hashSync(String(password), SALT_ROUNDS);
    const created = this.db.createLocalUser({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = this.signJwt({ sub: created.user.id, email: created.user.email, name: created.user.name });
    const session = {
      userId: created.user.id,
      token,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
    };

    if (options.remember === false) this.clearSession();
    else this.setSession(session);
    this.db.logAudit(created.user.id, 'auth.register', { email: normalizedEmail });

    this.syncRegisteredUser(created.user, passwordHash).catch(error => {
      this.logger?.warn?.('Failed to schedule remote user sync:', error);
    });

    return {
      user: publicUser(created.user),
      license: created.license,
      entitlements: created.entitlements,
      session,
    };
  }

  /**
   * Validates credentials and creates a new local session token.
   * @param {string} email
   * @param {string} password
   * @returns {object}
   */
  login(email, password, options = {}) {
    const normalizedEmail = normalizeEmail(email);
    const user = this.db.getUserByEmail(normalizedEmail);
    if (!user || !user.password_hash) {
      throw new Error('Invalid credentials.');
    }

    const ok = bcrypt.compareSync(String(password), String(user.password_hash));
    if (!ok) {
      throw new Error('Invalid credentials.');
    }

    const token = this.signJwt({ sub: user.id, email: user.email, name: user.name });
    const session = {
      userId: user.id,
      token,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
    };

    if (options.remember === false) this.clearSession();
    else this.setSession(session);
    this.db.logAudit(user.id, 'auth.login', { email: normalizedEmail });

    return {
      user: publicUser(user),
      license: this.db.getLicenseByUserId(user.id),
      entitlements: this.db.listEntitlements(this.db.getLicenseByUserId(user.id)?.id || null),
      session,
    };
  }

  /**
   * Invalidates the current local session.
   * @param {string} [userId]
   * @returns {boolean}
   */
  logout(userId) {
    const current = this.getSession();
    if (!current || !current.user) {
      this.clearSession();
      return true;
    }
    this.db.logAudit(current.user.id, 'auth.logout', { requestedUserId: userId || null });
    this.clearSession();
    return true;
  }

  /**
   * Reads the current session from electron-store and resolves the user.
   * @returns {object|null}
   */
  getSession() {
    const session = this.getStore().get('auth.session');
    if (!session?.token || !session?.userId) return null;

    const payload = this.verifyJwt(session.token);
    if (!payload || String(payload.sub) !== String(session.userId)) {
      this.clearSession();
      return null;
    }

    const user = this.db.getUserById(session.userId);
    if (!user) {
      this.clearSession();
      return null;
    }

    const license = this.db.getLicenseByUserId(user.id);
    const entitlements = license ? this.db.listEntitlements(license.id) : [];

    return {
      user: publicUser(user),
      license,
      entitlements,
      session: {
        ...session,
        payload,
      },
    };
  }

  /**
   * Restores a previously issued local session token.
   * @param {object} session
   * @returns {object|null}
   */
  restoreSession(session) {
    if (!session?.token || !session?.userId) return null;

    const payload = this.verifyJwt(session.token);
    if (!payload || String(payload.sub) !== String(session.userId)) return null;

    const user = this.db.getUserById(session.userId);
    if (!user) return null;

    this.setSession({
      userId: session.userId,
      token: session.token,
      issuedAt: session.issuedAt || new Date().toISOString(),
      expiresAt: session.expiresAt || new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
    });

    return this.getSession();
  }

  /**
   * Convenience helper to check whether the current session is valid.
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(this.getSession()?.user);
  }
}

module.exports = {
  AuthManager,
  normalizeEmail,
  publicUser,
};

/**
 * Example usage:
 *
 * const { getDatabase } = require('../db');
 * const { AuthManager } = require('./AuthManager');
 * const auth = new AuthManager({ db: getDatabase() });
 * const result = auth.register('Ithalo', 'ithalo@example.com', 'secret123');
 * const session = auth.getSession();
 */
