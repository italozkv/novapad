const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Store = require('electron-store');
const { app } = require('electron');
const { machineIdSync } = require('node-machine-id');

const STORE_NAME = 'novapad-license';
const OFFLINE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_FEATURE_KEYS = ['sync', 'export_pdf', 'themes', 'ai_assist'];
const DEV_APP_KEY_FILE = path.join(process.cwd(), 'server', 'data', 'app-key.txt');

function utcNow() {
  return new Date().toISOString();
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || ''), 'utf8').digest('hex');
}

function normalizeFeatureKey(value) {
  return String(value || '').trim();
}

function normalizeBoolean(value) {
  return value === 1 || value === true || value === '1' || value === 'true';
}

function parseIso(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

function unwrapRemotePayload(payload = {}) {
  if (!payload || typeof payload !== 'object') return {};
  const data = payload.data && typeof payload.data === 'object' ? payload.data : null;
  const license = payload.license && typeof payload.license === 'object' ? payload.license : null;
  return {
    ...payload,
    ...(license || {}),
    ...(data || {}),
  };
}

function publicLicenseState(license, entitlements = []) {
  if (!license) return null;
  return {
    license,
    entitlements,
    features: entitlements.reduce((acc, item) => {
      acc[item.feature_key] = normalizeBoolean(item.enabled);
      return acc;
    }, {}),
  };
}

function normalizeServerFeatures(payload = {}) {
  const normalized = [];
  const seen = new Set();
  const push = (featureKey, enabled, value = null) => {
    const key = normalizeFeatureKey(featureKey);
    if (!key || seen.has(key)) return;
    seen.add(key);
    normalized.push({
      featureKey: key,
      enabled: normalizeBoolean(enabled),
      value: value == null ? null : String(value),
    });
  };

  const raw = payload.features ?? payload.entitlements ?? payload.items ?? [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === 'string') {
        push(item, true, null);
        continue;
      }
      if (!item || typeof item !== 'object') continue;
      push(
        item.featureKey || item.key || item.name || item.id,
        item.enabled ?? item.active ?? item.value ?? true,
        item.value ?? null
      );
    }
  } else if (raw && typeof raw === 'object') {
    for (const [featureKey, enabled] of Object.entries(raw)) {
      push(featureKey, enabled, null);
    }
  }

  for (const key of DEFAULT_FEATURE_KEYS) {
    push(key, payload[key] ?? false, null);
  }

  return normalized;
}

/**
 * License manager for NovaPad.
 * Handles local license state, online validation, entitlement checks,
 * and device registration in the main process only.
 */
class LicenseManager {
  /**
   * @param {object} options
   * @param {object} options.db - NovaPad database instance.
   * @param {Console} [options.logger=console] - Logger target.
   * @param {string} [options.storeName='novapad-license'] - electron-store namespace.
   * @param {string} [options.serverBaseUrl] - Optional remote license server base URL.
   * @param {string} [options.appKey] - Optional API key for the license server.
   * @param {number} [options.requestTimeoutMs=15000] - Network timeout in milliseconds.
   */
  constructor({ db, logger = console, storeName = STORE_NAME, serverBaseUrl, appKey, requestTimeoutMs = 15000 } = {}) {
    if (!db) throw new Error('LicenseManager requires a database instance.');
    this.db = db;
    this.logger = logger;
    this.storeName = storeName;
    this.requestTimeoutMs = requestTimeoutMs;
    this.store = null;

    if (serverBaseUrl || appKey) {
      this.setServerConfig({ baseUrl: serverBaseUrl, appKey });
    }
  }

  /**
   * Returns the lazily-created electron-store instance.
   * @returns {Store}
   */
  getStore() {
    if (!this.store) {
      this.store = new Store({ name: this.storeName });
    }
    return this.store;
  }

  /**
   * Reads the configured license server settings.
   * Environment variables can override missing local values.
   * @returns {{ baseUrl: string, appKey: string }}
   */
  getServerConfig() {
    const store = this.getStore();
    const fallbackBaseUrl = 'http://localhost:3333';
    const fallbackAppKey = 'novapad-dev-key';
    const baseUrl = String(
      store.get('license.serverBaseUrl') ||
        process.env.NOVAPAD_LICENSE_SERVER_URL ||
        process.env.NOVAPAD_LICENSE_URL ||
        fallbackBaseUrl
    ).trim();
    const appKey = String(
      store.get('license.appKey') ||
        process.env.NOVAPAD_LICENSE_APP_KEY ||
        process.env.NOVAPAD_APP_KEY ||
        fallbackAppKey
    ).trim();
    return { baseUrl, appKey };
  }

  /**
   * Stores the remote license server configuration locally.
   * @param {object} options
   * @param {string} [options.baseUrl]
   * @param {string} [options.appKey]
   * @returns {{ baseUrl: string, appKey: string }}
   */
  setServerConfig({ baseUrl, appKey } = {}) {
    const store = this.getStore();
    if (baseUrl !== undefined) {
      store.set('license.serverBaseUrl', String(baseUrl || '').trim());
    }
    if (appKey !== undefined) {
      store.set('license.appKey', String(appKey || '').trim());
    }
    return this.getServerConfig();
  }

  /**
   * Persists a development-only app key to the shared server file.
   * This keeps the local renderer and local license server in sync.
   * @param {string} appKey
   * @returns {boolean}
   */
  persistDevAppKey(appKey) {
    const normalized = String(appKey || '').trim();
    if (!normalized) return false;
    if (app?.isPackaged) return false;
    try {
      fs.mkdirSync(path.dirname(DEV_APP_KEY_FILE), { recursive: true });
      fs.writeFileSync(DEV_APP_KEY_FILE, `${normalized}\n`, 'utf8');
      return true;
    } catch (error) {
      this.logger?.warn?.('Failed to persist dev app key:', error);
      return false;
    }
  }

  /**
   * Hashes a license key using SHA-256.
   * @param {string} licenseKey
   * @returns {string}
   */
  hashLicenseKey(licenseKey) {
    return sha256(licenseKey);
  }

  /**
   * Returns a stable fingerprint for the current machine.
   * @returns {string}
   */
  getDeviceFingerprint() {
    return sha256(`novapad:${machineIdSync(true)}`);
  }

  /**
   * Returns a snapshot of the current machine metadata.
   * @returns {{ deviceName: string, platform: string, appVersion: string|null }}
   */
  getDeviceMetadata() {
    return {
      deviceName: os.hostname() || app?.getName?.() || 'NovaPad',
      platform: process.platform,
      appVersion: app?.getVersion?.() || process.versions?.electron || null,
    };
  }

  /**
   * Returns the current license and local entitlements for a user.
   * @param {string} userId
   * @returns {{ license: object, entitlements: Array, features: object, canUseOffline: boolean, deviceCount: number }|null}
   */
  getLocalLicense(userId) {
    const license = this.db.getLicenseByUserId(userId);
    if (!license) return null;
    const entitlements = this.db.listEntitlements(license.id);
    const deviceCount = this.db.get(
      'SELECT COUNT(*) AS count FROM license_devices WHERE license_id = ? AND revoked_at IS NULL',
      [license.id]
    )?.count || 0;
    return {
      ...publicLicenseState(license, entitlements),
      canUseOffline: this.canUseOffline(userId),
      deviceCount,
    };
  }

  /**
   * Activates a license key against the remote validation server.
   * Only the SHA-256 hash of the key is persisted locally.
   * @param {string} userId
   * @param {string} licenseKey
   * @returns {Promise<object>}
   */
  async activateLicense(userId, licenseKey, user = null) {
    const normalizedKey = String(licenseKey || '').trim();
    if (!userId) throw new Error('userId is required.');
    if (!normalizedKey) throw new Error('licenseKey is required.');

    const license = this.db.getLicenseByUserId(userId);
    if (!license) throw new Error('Local license not found for this user.');

    const licenseKeyHash = this.hashLicenseKey(normalizedKey);
    const deviceFingerprint = this.getDeviceFingerprint();
    const deviceMetadata = this.getDeviceMetadata();
    const remote = unwrapRemotePayload(await this.requestJson('/license/activate', {
      method: 'POST',
      body: {
        userId,
        user_email: user?.email || user?.user_email || null,
        license_key_hash: licenseKeyHash,
        device_fingerprint: deviceFingerprint,
        device_name: deviceMetadata.deviceName,
        platform: deviceMetadata.platform,
        app_version: deviceMetadata.appVersion,
      },
    }));

    const now = utcNow();
    const normalizedFeatures = normalizeServerFeatures(remote);
    const plan = String(remote.plan || license.plan || 'free').trim();
    const status = String(remote.status || 'active').trim();
    const maxDevices = Number.isFinite(Number(remote.max_devices))
      ? Math.max(1, Number(remote.max_devices))
      : Math.max(1, Number(license.max_devices) || 1);

    this.db.transaction(() => {
      this.db.updateLicense(userId, {
        plan,
        status,
        license_key_hash: licenseKeyHash,
        max_devices: maxDevices,
        expires_at: remote.expires_at ?? license.expires_at ?? null,
        activated_at: remote.activated_at ?? license.activated_at ?? now,
        revoked_at: remote.revoked_at ?? null,
        last_verified_at: now,
      });
      const updatedLicense = this.db.getLicenseByUserId(userId);
      this.db.replaceEntitlements(updatedLicense.id, normalizedFeatures);
    })();

    this.db.logAudit(userId, 'license.activate', {
      plan,
      status,
      max_devices: maxDevices,
      source: 'remote',
    });

    return this.getLocalLicense(userId);
  }

  /**
   * Verifies the license online and refreshes the local snapshot.
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async verifyOnline(userId) {
    if (!userId) throw new Error('userId is required.');
    const local = this.db.getLicenseByUserId(userId);
    if (!local) throw new Error('Local license not found for this user.');

    const remote = unwrapRemotePayload(await this.requestJson(`/license/status/${encodeURIComponent(userId)}`, {
      method: 'GET',
    }));

    const now = utcNow();
    const normalizedFeatures = normalizeServerFeatures(remote);
    const plan = String(remote.plan || local.plan || 'free').trim();
    const status = String(remote.status || local.status || 'active').trim();
    const maxDevices = Number.isFinite(Number(remote.max_devices))
      ? Math.max(1, Number(remote.max_devices))
      : Math.max(1, Number(local.max_devices) || 1);

    this.db.transaction(() => {
      this.db.updateLicense(userId, {
        plan,
        status,
        max_devices: maxDevices,
        expires_at: remote.expires_at ?? local.expires_at ?? null,
        activated_at: remote.activated_at ?? local.activated_at ?? now,
        revoked_at: remote.revoked_at ?? null,
        last_verified_at: now,
      });
      const updatedLicense = this.db.getLicenseByUserId(userId);
      this.db.replaceEntitlements(updatedLicense.id, normalizedFeatures);
    })();

    this.db.logAudit(userId, 'license.verifyOnline', {
      plan,
      status,
      max_devices: maxDevices,
      source: 'remote',
    });

    return this.getLocalLicense(userId);
  }

  /**
   * Returns whether the user can keep using the app offline.
   * Free licenses are always allowed; paid licenses require a verification
   * timestamp newer than the offline window.
   * @param {string} userId
   * @returns {boolean}
   */
  canUseOffline(userId) {
    const license = this.db.getLicenseByUserId(userId);
    if (!license) return false;
    if (license.status === 'revoked') return false;
    if (license.plan === 'free') return true;
    const lastVerifiedAt = parseIso(license.last_verified_at);
    if (!lastVerifiedAt) return false;
    return Date.now() - lastVerifiedAt <= OFFLINE_WINDOW_MS;
  }

  /**
   * Checks whether a feature is enabled locally for the user's license.
   * @param {string} userId
   * @param {string} featureKey
   * @returns {boolean}
   */
  hasFeature(userId, featureKey) {
    const license = this.db.getLicenseByUserId(userId);
    if (!license) return false;
    const entitlements = this.db.listEntitlements(license.id);
    const normalizedKey = normalizeFeatureKey(featureKey);
    const entitlement = entitlements.find(item => item.feature_key === normalizedKey);
    return Boolean(entitlement && normalizeBoolean(entitlement.enabled));
  }

  /**
   * Registers the current device for a license and validates the device limit.
   * Uses node-machine-id to derive a stable device fingerprint.
   * @param {string} userId
   * @param {string} licenseId
   * @returns {object}
   */
  registerDevice(userId, licenseId) {
    if (!userId) throw new Error('userId is required.');
    if (!licenseId) throw new Error('licenseId is required.');

    const license = this.db.get(
      'SELECT * FROM licenses WHERE id = ? AND user_id = ?',
      [licenseId, userId]
    );
    if (!license) {
      throw new Error('License not found for this user.');
    }

    const deviceFingerprint = this.getDeviceFingerprint();
    const existing = this.db.get(
      'SELECT * FROM license_devices WHERE license_id = ? AND device_fingerprint = ? AND revoked_at IS NULL',
      [licenseId, deviceFingerprint]
    );
    const activeDeviceCount = this.db.get(
      'SELECT COUNT(*) AS count FROM license_devices WHERE license_id = ? AND revoked_at IS NULL',
      [licenseId]
    )?.count || 0;

    if (!existing && activeDeviceCount >= Math.max(1, Number(license.max_devices) || 1)) {
      throw new Error('Device limit reached for this license.');
    }

    this.db.registerDevice(licenseId, {
      deviceFingerprint,
      ...this.getDeviceMetadata(),
    });

    const device = this.db.get(
      'SELECT * FROM license_devices WHERE license_id = ? AND device_fingerprint = ?',
      [licenseId, deviceFingerprint]
    );

    this.db.logAudit(userId, 'license.registerDevice', {
      licenseId,
      deviceFingerprint,
      activeDeviceCount: existing ? activeDeviceCount : activeDeviceCount + 1,
    });

    return device;
  }

  /**
   * Performs a JSON request against the configured license server.
   * @private
   * @param {string} pathname
   * @param {object} options
   * @returns {Promise<object>}
   */
  async requestJson(pathname, { method = 'GET', body = null, headers = {} } = {}) {
    const { baseUrl, appKey } = this.getServerConfig();
    if (!baseUrl) {
      throw new Error('License server is not configured.');
    }

    const url = new URL(pathname, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(appKey ? { 'X-App-Key': appKey } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
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
        const message = parsed?.error || parsed?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      if (parsed && (parsed.success === false || parsed.ok === false)) {
        throw new Error(parsed.error || parsed.message || 'License server rejected the request.');
      }

      return parsed || {};
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = {
  LicenseManager,
  sha256,
  normalizeServerFeatures,
  DEFAULT_FEATURE_KEYS,
};

/**
 * Example usage:
 *
 * const { getDatabase } = require('../db');
 * const { LicenseManager } = require('./LicenseManager');
 * const licenses = new LicenseManager({ db: getDatabase() });
 * const local = licenses.getLocalLicense('user-id');
 * const allowed = licenses.hasFeature('user-id', 'sync');
 */
