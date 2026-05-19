const fs = require('node:fs');
const path = require('node:path');
const BetterSqlite3 = require('better-sqlite3');

const DEFAULT_ENTITLEMENTS = [
  { featureKey: 'sync', enabled: 0 },
  { featureKey: 'export_pdf', enabled: 0 },
  { featureKey: 'themes', enabled: 0 },
  { featureKey: 'ai_assist', enabled: 0 },
];

function utcNow() {
  return new Date().toISOString();
}

function safeJsonParse(value, fallback = {}) {
  if (value == null || value === '') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Database wrapper for NovaPad local storage.
 * Keeps schema bootstrapping, low-level queries, and future auth/license helpers
 * in the main process only.
 */
class NovaPadDatabase {
  constructor({ dbPath, schemaPath, logger = console } = {}) {
    this.dbPath = dbPath;
    this.schemaPath = schemaPath;
    this.logger = logger;
    this.db = null;
  }

  /**
   * Opens the database file and runs the schema bootstrap.
   * @returns {NovaPadDatabase}
   */
  init() {
    if (this.db) return this;
    if (!this.dbPath) throw new Error('Database path is required.');

    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    this.db = new BetterSqlite3(this.dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');

    if (this.schemaPath && fs.existsSync(this.schemaPath)) {
      this.db.exec(fs.readFileSync(this.schemaPath, 'utf8'));
    }

    return this;
  }

  /**
   * Returns a basic info object for diagnostics.
   */
  getInfo() {
    return {
      dbPath: this.dbPath,
      ready: Boolean(this.db),
    };
  }

  /**
   * Returns the raw BetterSqlite3 instance.
   */
  raw() {
    if (!this.db) throw new Error('Database is not initialized.');
    return this.db;
  }

  /**
   * Executes a SQL statement directly.
   */
  exec(sql) {
    return this.raw().exec(sql);
  }

  /**
   * Prepares a statement.
   */
  prepare(sql) {
    return this.raw().prepare(sql);
  }

  /**
   * Executes one run statement.
   */
  run(sql, params = {}) {
    return this.prepare(sql).run(params);
  }

  /**
   * Fetches one row.
   */
  get(sql, params = {}) {
    return this.prepare(sql).get(params);
  }

  /**
   * Fetches all rows.
   */
  all(sql, params = {}) {
    return this.prepare(sql).all(params);
  }

  /**
   * Creates a SQL transaction helper.
   */
  transaction(fn) {
    return this.raw().transaction(fn);
  }

  /**
   * Closes the database connection.
   */
  close() {
    if (!this.db) return;
    this.db.close();
    this.db = null;
  }

  /**
   * Looks up a user by email.
   */
  getUserByEmail(email) {
    return this.get('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [normalizeEmail(email)]);
  }

  /**
   * Looks up a user by id.
   */
  getUserById(userId) {
    return this.get('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [userId]);
  }

  /**
   * Creates a local user and the default app/license rows.
   */
  createLocalUser({ name, email, passwordHash = null, avatarUrl = null } = {}) {
    const normalizedEmail = normalizeEmail(email);
    if (!name || !normalizedEmail) throw new Error('Name and email are required.');

    const insertUser = this.prepare(`
      INSERT INTO users (name, email, password_hash, avatar_url)
      VALUES (?, ?, ?, ?)
    `);
    const insertAccount = this.prepare(`
      INSERT INTO accounts (user_id, provider, provider_id)
      VALUES (?, 'local', ?)
    `);
    const insertLicense = this.prepare(`
      INSERT INTO licenses (user_id, plan, status, max_devices)
      VALUES (?, 'free', 'active', 1)
    `);
    const insertEntitlement = this.prepare(`
      INSERT INTO entitlements (license_id, feature_key, enabled)
      VALUES (?, ?, ?)
    `);
    const insertSettings = this.prepare(`
      INSERT INTO settings (user_id, extra)
      VALUES (?, '{}')
    `);

    return this.transaction(() => {
      insertUser.run(name, normalizedEmail, passwordHash, avatarUrl);
      const user = this.getUserByEmail(normalizedEmail);
      if (!user) throw new Error('User creation failed.');

      insertAccount.run(user.id, user.id);
      insertLicense.run(user.id);
      const license = this.getLicenseByUserId(user.id);
      if (!license) throw new Error('License creation failed.');

      for (const entitlement of DEFAULT_ENTITLEMENTS) {
        insertEntitlement.run(license.id, entitlement.featureKey, entitlement.enabled);
      }

      insertSettings.run(user.id);
      return {
        user,
        license: this.getLicenseByUserId(user.id),
        entitlements: this.listEntitlements(license.id),
      };
    })();
  }

  /**
   * Creates a plain account link for a user.
   */
  createAccount({ userId, provider = 'local', providerId = null, accessToken = null, refreshToken = null } = {}) {
    const result = this.run(
      `INSERT INTO accounts (user_id, provider, provider_id, access_token, refresh_token)
       VALUES (@userId, @provider, @providerId, @accessToken, @refreshToken)`,
      { userId, provider, providerId, accessToken, refreshToken }
    );
    return { changes: result.changes };
  }

  /**
   * Returns the local license row for a user.
   */
  getLicenseByUserId(userId) {
    return this.get('SELECT * FROM licenses WHERE user_id = ?', [userId]);
  }

  /**
   * Returns the entitlements for a license.
   */
  listEntitlements(licenseId) {
    return this.all('SELECT * FROM entitlements WHERE license_id = ? ORDER BY feature_key', [licenseId]);
  }

  /**
   * Updates a license row with remote validation data.
   */
  updateLicense(userId, patch = {}) {
    const keys = ['plan', 'status', 'license_key_hash', 'max_devices', 'expires_at', 'activated_at', 'revoked_at', 'last_verified_at'];
    const pairs = keys
      .filter(key => Object.prototype.hasOwnProperty.call(patch, key))
      .map(key => `${key} = @${key}`);
    if (!pairs.length) return { changes: 0 };
    return this.run(`UPDATE licenses SET ${pairs.join(', ')} WHERE user_id = @userId`, { ...patch, userId });
  }

  /**
   * Replaces the current entitlements for a license.
   */
  replaceEntitlements(licenseId, entitlements = []) {
    const write = this.transaction(items => {
      this.run('DELETE FROM entitlements WHERE license_id = ?', [licenseId]);
      const insert = this.prepare(`
        INSERT INTO entitlements (license_id, feature_key, enabled, value)
        VALUES (?, ?, ?, ?)
      `);
      for (const item of items) {
        insert.run(licenseId, item.featureKey, item.enabled ? 1 : 0, item.value ?? null);
      }
      return this.listEntitlements(licenseId);
    });
    return write(entitlements);
  }

  /**
   * Returns the settings row for a user.
   */
  getSettings(userId) {
    return this.get('SELECT * FROM settings WHERE user_id = ?', [userId]);
  }

  /**
   * Saves a settings JSON payload for a user.
   */
  saveSettings(userId, settingsObject = {}) {
    const extra = JSON.stringify(settingsObject.extra || {});
    return this.run(
      `
      INSERT INTO settings (user_id, theme, language, sidebar_state, font_size, editor_mode, extra)
      VALUES (@userId, @theme, @language, @sidebarState, @fontSize, @editorMode, @extra)
      ON CONFLICT(user_id) DO UPDATE SET
        theme = excluded.theme,
        language = excluded.language,
        sidebar_state = excluded.sidebar_state,
        font_size = excluded.font_size,
        editor_mode = excluded.editor_mode,
        extra = excluded.extra
      `,
      {
        userId,
        theme: settingsObject.theme || 'system',
        language: settingsObject.language || 'pt-BR',
        sidebarState: settingsObject.sidebar_state || 'expanded',
        fontSize: settingsObject.font_size || 'medium',
        editorMode: settingsObject.editor_mode || 'wysiwyg',
        extra,
      }
    );
  }

  /**
   * Returns all notes for a user, including soft-deleted rows if requested.
   */
  listNotes(userId, { includeDeleted = false } = {}) {
    return this.all(
      `SELECT * FROM notes WHERE user_id = ? ${includeDeleted ? '' : 'AND deleted = 0'} ORDER BY pinned DESC, updated_at DESC`,
      [userId]
    );
  }

  /**
   * Creates a note row.
   */
  createNote(userId, { title = '', content = '', contentType = 'markdown', pinned = 0, archived = 0 } = {}) {
    const result = this.run(
      `
      INSERT INTO notes (user_id, title, content, content_type, pinned, archived)
      VALUES (@userId, @title, @content, @contentType, @pinned, @archived)
      `,
      { userId, title, content, contentType, pinned, archived }
    );
    const note = this.get('SELECT * FROM notes WHERE rowid = ?', [result.lastInsertRowid]);
    return { changes: result.changes, note };
  }

  /**
   * Returns one note by id, optionally constrained to a user.
   */
  getNoteById(noteId, userId = null) {
    if (userId) {
      return this.get('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
    }
    return this.get('SELECT * FROM notes WHERE id = ?', [noteId]);
  }

  /**
   * Applies a remote note snapshot while keeping the original record id.
   * This helper clears the sync marker rows created by local triggers so the
   * remote write does not bounce back as a fresh outbound change.
   */
  upsertNoteFromSync(userId, noteId, patch = {}) {
    const txnStart = utcNow();
    const existing = this.getNoteById(noteId, userId);
    const title = patch.title ?? existing?.title ?? '';
    const content = patch.content ?? existing?.content ?? '';
    const contentType = patch.content_type ?? existing?.content_type ?? 'markdown';
    const pinned = patch.pinned ?? existing?.pinned ?? 0;
    const archived = patch.archived ?? existing?.archived ?? 0;
    const deleted = patch.deleted ?? existing?.deleted ?? 0;

    const apply = this.transaction(() => {
      if (existing) {
        this.run(
          `
          UPDATE notes
          SET title = @title,
              content = @content,
              content_type = @contentType,
              pinned = @pinned,
              archived = @archived,
              deleted = @deleted
          WHERE id = @noteId AND user_id = @userId
          `,
          { noteId, userId, title, content, contentType, pinned, archived, deleted }
        );
      } else {
        this.run(
          `
          INSERT INTO notes (id, user_id, title, content, content_type, pinned, archived, deleted)
          VALUES (@noteId, @userId, @title, @content, @contentType, @pinned, @archived, @deleted)
          `,
          { noteId, userId, title, content, contentType, pinned, archived, deleted }
        );
      }

      this.run(
        `
        DELETE FROM sync_changes
        WHERE user_id = @userId
          AND table_name = 'notes'
          AND record_id = @noteId
          AND synced = 0
          AND created_at >= @txnStart
        `,
        { userId, noteId, txnStart }
      );

      return this.getNoteById(noteId, userId);
    });

    return apply();
  }

  /**
   * Updates a note row.
   */
  updateNote(noteId, patch = {}) {
    const keys = ['title', 'content', 'content_type', 'pinned', 'archived', 'deleted'];
    const pairs = keys
      .filter(key => Object.prototype.hasOwnProperty.call(patch, key))
      .map(key => `${key} = @${key}`);
    if (!pairs.length) return { changes: 0 };
    return this.run(`UPDATE notes SET ${pairs.join(', ')} WHERE id = @noteId`, { ...patch, noteId });
  }

  /**
   * Soft deletes a note.
   */
  softDeleteNote(noteId) {
    return this.updateNote(noteId, { deleted: 1 });
  }

  /**
   * Inserts an audit log entry.
   */
  logAudit(userId, action, metadata = {}) {
    return this.run(
      'INSERT INTO audit_logs (user_id, action, metadata) VALUES (?, ?, ?)',
      [userId || null, action, JSON.stringify(metadata || {})]
    );
  }

  /**
   * Adds or refreshes a sync change marker.
   */
  listPendingSyncChanges(userId) {
    return this.all('SELECT * FROM sync_changes WHERE user_id = ? AND synced = 0 ORDER BY created_at ASC', [userId]);
  }

  /**
   * Marks one or more sync changes as synced.
   */
  markSyncChangesSynced(ids = []) {
    if (!Array.isArray(ids) || !ids.length) return { changes: 0 };
    const update = this.prepare(`
      UPDATE sync_changes
      SET synced = 1, synced_at = @syncedAt
      WHERE id = @id
    `);
    const syncedAt = utcNow();
    const transaction = this.transaction(changeIds => {
      let changes = 0;
      for (const id of changeIds) {
        const result = update.run({ id, syncedAt });
        changes += result.changes || 0;
      }
      return changes;
    });
    return { changes: transaction(ids) };
  }

  /**
   * Registers a device for a license.
   */
  registerDevice(licenseId, { deviceFingerprint, deviceName = 'Dispositivo desconhecido', platform = null, appVersion = null } = {}) {
    this.run(
      `
      INSERT INTO devices (user_id, device_fingerprint, device_name, platform, app_version)
      VALUES (
        (SELECT user_id FROM licenses WHERE id = @licenseId),
        @deviceFingerprint,
        @deviceName,
        @platform,
        @appVersion
      )
      ON CONFLICT(device_fingerprint) DO UPDATE SET
        user_id = excluded.user_id,
        device_name = excluded.device_name,
        platform = excluded.platform,
        app_version = excluded.app_version,
        last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      `,
      { licenseId, deviceFingerprint, deviceName, platform, appVersion }
    );
    const result = this.run(
      `
      INSERT INTO license_devices (license_id, device_fingerprint, device_name)
      VALUES (@licenseId, @deviceFingerprint, @deviceName)
      ON CONFLICT(license_id, device_fingerprint) DO UPDATE SET
        device_name = excluded.device_name,
        last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      `,
      { licenseId, deviceFingerprint, deviceName }
    );
    return { changes: result.changes, platform, appVersion };
  }

  /**
   * Returns a compact summary of the database state.
   */
  getSummary() {
    return {
      users: this.get('SELECT COUNT(*) AS count FROM users')?.count || 0,
      notes: this.get('SELECT COUNT(*) AS count FROM notes')?.count || 0,
      licenses: this.get('SELECT COUNT(*) AS count FROM licenses')?.count || 0,
      pendingSync: this.get('SELECT COUNT(*) AS count FROM sync_changes WHERE synced = 0')?.count || 0,
    };
  }
}

module.exports = {
  NovaPadDatabase,
  safeJsonParse,
};
