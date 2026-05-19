const dns = require('node:dns/promises');
const Store = require('electron-store');

const STORE_NAME = 'novapad-sync';
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_BACKOFF_MS = 500;
const DNS_PROBE_HOST = 'example.com';

function utcNow() {
  return new Date().toISOString();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseIso(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function normalizeTableName(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeAction(value) {
  return String(value || '').trim().toLowerCase();
}

function unwrapPayload(payload = {}) {
  if (!payload || typeof payload !== 'object') return {};
  if (payload.data && typeof payload.data === 'object') return payload.data;
  if (payload.record && typeof payload.record === 'object') return payload.record;
  return payload;
}

function toChangeBatchItem(item = {}) {
  return {
    id: item.id,
    user_id: item.user_id,
    table_name: item.table_name,
    record_id: item.record_id,
    action: item.action,
    payload: typeof item.payload === 'string' ? (() => {
      try {
        return JSON.parse(item.payload);
      } catch {
        return {};
      }
    })() : (item.payload || {}),
    created_at: item.created_at,
  };
}

/**
 * Sync manager for NovaPad.
 * Handles local-to-remote pushes, remote pulls, conflict resolution,
 * and retry-backed network calls in the main process only.
 */
class SyncManager {
  /**
   * @param {object} options
   * @param {object} options.db - NovaPad database instance.
   * @param {Console} [options.logger=console] - Logger target.
   * @param {string} [options.storeName='novapad-sync'] - electron-store namespace.
   * @param {string} [options.serverBaseUrl] - Optional sync server base URL.
   * @param {string} [options.appKey] - Optional API key for the sync server.
   * @param {number} [options.requestTimeoutMs=15000] - Request timeout in ms.
   * @param {number} [options.retryCount=3] - Retry count for transient failures.
   * @param {number} [options.backoffMs=500] - Base backoff delay.
   */
  constructor({
    db,
    logger = console,
    storeName = STORE_NAME,
    serverBaseUrl,
    appKey,
    requestTimeoutMs = DEFAULT_TIMEOUT_MS,
    retryCount = DEFAULT_RETRY_COUNT,
    backoffMs = DEFAULT_BACKOFF_MS,
  } = {}) {
    if (!db) throw new Error('SyncManager requires a database instance.');
    this.db = db;
    this.logger = logger;
    this.storeName = storeName;
    this.requestTimeoutMs = requestTimeoutMs;
    this.retryCount = Math.max(1, retryCount);
    this.backoffMs = Math.max(100, backoffMs);
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
   * Reads sync server configuration from store or env.
   * @returns {{ baseUrl: string, appKey: string }}
   */
  getServerConfig() {
    const store = this.getStore();
    const baseUrl = String(
      store.get('sync.serverBaseUrl') ||
        process.env.NOVAPAD_SYNC_SERVER_URL ||
        process.env.NOVAPAD_SYNC_URL ||
        ''
    ).trim();
    const appKey = String(
      store.get('sync.appKey') ||
        process.env.NOVAPAD_SYNC_APP_KEY ||
        process.env.NOVAPAD_APP_KEY ||
        ''
    ).trim();
    return { baseUrl, appKey };
  }

  /**
   * Persists sync server settings locally.
   * @param {object} options
   * @param {string} [options.baseUrl]
   * @param {string} [options.appKey]
   * @returns {{ baseUrl: string, appKey: string }}
   */
  setServerConfig({ baseUrl, appKey } = {}) {
    const store = this.getStore();
    if (baseUrl !== undefined) {
      store.set('sync.serverBaseUrl', String(baseUrl || '').trim());
    }
    if (appKey !== undefined) {
      store.set('sync.appKey', String(appKey || '').trim());
    }
    return this.getServerConfig();
  }

  /**
   * Checks whether internet access is available before syncing.
   * @returns {Promise<boolean>}
   */
  async hasInternetConnection() {
    try {
      await dns.lookup(DNS_PROBE_HOST);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Performs a JSON request with retry/backoff support.
   * @private
   * @param {string} pathname
   * @param {object} options
   * @returns {Promise<object>}
   */
  async requestJson(pathname, { method = 'GET', body = null, headers = {} } = {}) {
    const { baseUrl, appKey } = this.getServerConfig();
    if (!baseUrl) throw new Error('Sync server is not configured.');

    const url = new URL(pathname, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
    let lastError = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt += 1) {
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
          throw new Error(parsed.error || parsed.message || 'Sync server rejected the request.');
        }

        return parsed || {};
      } catch (error) {
        lastError = error;
        if (attempt >= this.retryCount) break;
        await sleep(this.backoffMs * (2 ** (attempt - 1)));
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError || new Error('Sync request failed.');
  }

  /**
   * Returns the most recent record by updated_at.
   * @param {object|null} local
   * @param {object|null} remote
   * @returns {object|null}
   */
  resolveConflict(local, remote) {
    if (!local) return remote || null;
    if (!remote) return local || null;
    return parseIso(remote.updated_at) >= parseIso(local.updated_at) ? remote : local;
  }

  /**
   * Reads pending sync changes and pushes them in batch to the server.
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async pushChanges(userId) {
    if (!userId) throw new Error('userId is required.');
    if (!(await this.hasInternetConnection())) {
      throw new Error('No internet connection.');
    }

    const pending = (this.db.listPendingSyncChanges(userId) || []).map(toChangeBatchItem);
    if (!pending.length) {
      return { pushed: 0, changes: [] };
    }

    const payload = {
      userId,
      pushedAt: utcNow(),
      changes: pending,
    };

    const remote = await this.requestJson('/sync/push', {
      method: 'POST',
      body: payload,
    });

    const syncedIds = pending.map(item => item.id);
    this.db.markSyncChangesSynced(syncedIds);
    this.db.logAudit(userId, 'sync.pushChanges', {
      pushed: pending.length,
      remote: remote?.message || remote?.status || 'ok',
    });

    return {
      pushed: pending.length,
      changes: pending,
      remote,
    };
  }

  /**
   * Pulls remote changes and applies them locally with last-write-wins.
   * @param {string} userId
   * @param {string} since - ISO 8601 timestamp.
   * @returns {Promise<object>}
   */
  async pullChanges(userId, since) {
    if (!userId) throw new Error('userId is required.');
    if (!(await this.hasInternetConnection())) {
      throw new Error('No internet connection.');
    }

    const remote = await this.requestJson('/sync/pull', {
      method: 'POST',
      body: {
        userId,
        since: since || '1970-01-01T00:00:00.000Z',
      },
    });

    const changes = Array.isArray(remote?.changes)
      ? remote.changes
      : Array.isArray(remote?.data)
        ? remote.data
        : Array.isArray(remote)
          ? remote
          : [];

    const applied = [];
    for (const change of changes) {
      const result = this.applyRemoteChange(userId, change);
      if (result) applied.push(result);
    }

    if (applied.length) {
      this.db.logAudit(userId, 'sync.pullChanges', {
        pulled: applied.length,
        since: since || null,
      });
    }

    return {
      pulled: applied.length,
      changes: applied,
      remote,
    };
  }

  /**
   * Applies one remote change locally using last-write-wins.
   * Supports notes and settings today.
   * @param {string} userId
   * @param {object} change
   * @returns {object|null}
   */
  applyRemoteChange(userId, change) {
    const tableName = normalizeTableName(change?.table_name || change?.tableName);
    const recordId = String(change?.record_id || change?.recordId || '').trim();
    const action = normalizeAction(change?.action);
    const payload = unwrapPayload(change?.payload);
    const remoteRecord = {
      table_name: tableName,
      record_id: recordId,
      action,
      ...payload,
      updated_at: payload.updated_at || change?.updated_at || utcNow(),
    };

    if (!tableName) return null;

    if (tableName === 'notes') {
      const local = this.db.get('SELECT * FROM notes WHERE id = ? AND user_id = ?', [recordId, userId]);
      const winner = this.resolveConflict(local, remoteRecord);
      if (winner !== remoteRecord) return { table_name: tableName, record_id: recordId, skipped: true };

      if (action === 'delete' || payload.deleted === 1 || payload.deleted === true || payload.deleted_at) {
        if (local) {
          this.db.softDeleteNote(local.id);
          return { table_name: tableName, record_id: recordId, action: 'delete', applied: true };
        }
        return { table_name: tableName, record_id: recordId, action: 'delete', applied: false };
      }

      this.db.upsertNoteFromSync(userId, recordId, {
        title: payload.title ?? local?.title ?? '',
        content: payload.content ?? local?.content ?? '',
        content_type: payload.content_type ?? local?.content_type ?? 'markdown',
        pinned: payload.pinned ?? local?.pinned ?? 0,
        archived: payload.archived ?? local?.archived ?? 0,
        deleted: payload.deleted ?? local?.deleted ?? 0,
      });

      return { table_name: tableName, record_id: recordId, action, applied: true };
    }

    if (tableName === 'settings') {
      const local = this.db.getSettings(userId);
      const winner = this.resolveConflict(local, remoteRecord);
      if (winner !== remoteRecord) return { table_name: tableName, record_id: recordId, skipped: true };

      this.db.saveSettings(userId, {
        theme: payload.theme ?? local?.theme ?? 'system',
        language: payload.language ?? local?.language ?? 'pt-BR',
        sidebar_state: payload.sidebar_state ?? local?.sidebar_state ?? 'expanded',
        font_size: payload.font_size ?? local?.font_size ?? 'medium',
        editor_mode: payload.editor_mode ?? local?.editor_mode ?? 'wysiwyg',
        extra: payload.extra ?? (() => {
          try {
            return JSON.parse(local?.extra || '{}');
          } catch {
            return {};
          }
        })(),
      });
      return { table_name: tableName, record_id: recordId || userId, action, applied: true };
    }

    return { table_name: tableName, record_id: recordId, skipped: true };
  }

  /**
   * Runs push + pull sequentially.
   * @param {string} userId
   * @param {string} [since]
   * @returns {Promise<object>}
   */
  async syncNow(userId, since = null) {
    if (!userId) throw new Error('userId is required.');
    if (!(await this.hasInternetConnection())) {
      throw new Error('No internet connection.');
    }

    const pushed = await this.pushChanges(userId);
    const pulled = await this.pullChanges(userId, since);

    const result = {
      success: true,
      userId,
      pushed: pushed?.pushed || 0,
      pulled: pulled?.pulled || 0,
      syncedAt: utcNow(),
    };

    this.getStore().set('sync.lastSyncAt', result.syncedAt);
    this.getStore().set('sync.lastError', null);

    this.db.logAudit(userId, 'sync.syncNow', {
      pushed: result.pushed,
      pulled: result.pulled,
    });

    return result;
  }

  /**
   * Returns a compact status snapshot for the sync subsystem.
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async getStatus(userId) {
    const pending = this.db.get('SELECT COUNT(*) AS count FROM sync_changes WHERE user_id = ? AND synced = 0', [userId])?.count || 0;
    const { baseUrl } = this.getServerConfig();
    const online = baseUrl ? await this.hasInternetConnection() : false;
    return {
      userId,
      configured: Boolean(baseUrl),
      online,
      pending,
      lastSyncAt: this.getStore().get('sync.lastSyncAt') || null,
      lastError: this.getStore().get('sync.lastError') || null,
    };
  }
}

module.exports = {
  SyncManager,
  utcNow,
  sleep,
  parseIso,
  normalizeTableName,
  normalizeAction,
};

/**
 * Example usage:
 *
 * const { getDatabase } = require('../db');
 * const { SyncManager } = require('./SyncManager');
 * const sync = new SyncManager({ db: getDatabase() });
 * await sync.syncNow('user-id');
 */
