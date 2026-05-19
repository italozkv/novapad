function serializeError(error) {
  if (!error) return 'Erro inesperado.';
  if (typeof error === 'string') return error;
  return error.message || error.stack || 'Erro inesperado.';
}

function createSuccess(data) {
  return { success: true, data };
}

function createFailure(error) {
  return { success: false, error: serializeError(error) };
}

function parseSettingsRow(row) {
  if (!row) return null;
  let extra = row.extra;
  if (typeof extra === 'string') {
    try {
      extra = JSON.parse(extra);
    } catch {
      extra = {};
    }
  }
  return {
    user_id: row.user_id,
    theme: row.theme || 'system',
    language: row.language || 'pt-BR',
    sidebar_state: row.sidebar_state || 'expanded',
    font_size: row.font_size || 'medium',
    editor_mode: row.editor_mode || 'wysiwyg',
    extra: extra && typeof extra === 'object' ? extra : {},
    updated_at: row.updated_at || null,
  };
}

function normalizeSettingsInput(input = {}) {
  return {
    theme: input.theme || 'system',
    language: input.language || 'pt-BR',
    sidebar_state: input.sidebar_state || input.sidebarState || 'expanded',
    font_size: input.font_size || input.fontSize || 'medium',
    editor_mode: input.editor_mode || input.editorMode || 'wysiwyg',
    extra: input.extra && typeof input.extra === 'object' ? input.extra : {},
  };
}

function normalizeNoteInput(input = {}) {
  return {
    title: String(input.title || '').trim(),
    content: String(input.content || ''),
    contentType: input.contentType || input.content_type || 'markdown',
    pinned: input.pinned ? 1 : 0,
    archived: input.archived ? 1 : 0,
  };
}

function redactPayload(value) {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(redactPayload);

  const redacted = {};
  for (const [key, item] of Object.entries(value)) {
    const lower = key.toLowerCase();
    if (['password', 'password_hash', 'licensekey', 'license_key', 'token', 'access_token', 'refresh_token', 'content'].includes(lower)) {
      redacted[key] = '[redacted]';
    } else if (item && typeof item === 'object') {
      redacted[key] = redactPayload(item);
    } else {
      redacted[key] = item;
    }
  }
  return redacted;
}

function getSession(authManager) {
  return authManager?.getSession?.() || null;
}

function getUserIdFromSession(authManager) {
  const session = getSession(authManager);
  return session?.user?.id || null;
}

function requireSession(authManager) {
  const session = getSession(authManager);
  if (!session?.user?.id) {
    throw new Error('Sessao invalida.');
  }
  return session;
}

function logHandlerError({ db, action, userId, error, payload }) {
  try {
    db?.logAudit?.(userId || null, `ipc.${action}.error`, {
      message: serializeError(error),
      payload: payload ? JSON.stringify(redactPayload(payload)).slice(0, 500) : null,
    });
  } catch (auditError) {
    if (console?.warn) console.warn('Failed to log IPC error:', auditError);
  }
}

function registerHandler(ipcMain, channel, action, handler, { authManager, db, requireAuth = true } = {}) {
  ipcMain.handle(channel, async (_event, payload = {}) => {
    const session = getSession(authManager);
    const userId = session?.user?.id || null;

    try {
      if (requireAuth) {
        requireSession(authManager);
      }
      const data = await handler({ payload, session, userId });
      return createSuccess(data);
    } catch (error) {
      logHandlerError({ db, action, userId, error, payload });
      return createFailure(error);
    }
  });
}

/**
 * Registers NovaPad IPC handlers for auth, license, notes, settings and sync.
 * @param {object} options
 * @param {Electron.IpcMain} options.ipcMain
 * @param {object} options.authManager
 * @param {object} options.licenseManager
 * @param {object} options.syncManager
 * @param {object} options.db
 * @param {Function} [options.legacyReadSettings]
 * @param {Function} [options.legacyWriteSettings]
 */
function registerIpcHandlers({
  ipcMain,
  authManager,
  licenseManager,
  syncManager,
  db,
  legacyReadSettings,
  legacyWriteSettings,
} = {}) {
  if (!ipcMain) throw new Error('ipcMain is required.');
  if (!authManager) throw new Error('authManager is required.');
  if (!licenseManager) throw new Error('licenseManager is required.');
  if (!syncManager) throw new Error('syncManager is required.');
  if (!db) throw new Error('db is required.');

  registerHandler(ipcMain, 'auth:register', 'auth.register', async ({ payload }) => {
    const name = payload?.name;
    const email = payload?.email;
    const password = payload?.password;
    const remember = payload?.remember !== false;
    return authManager.register(name, email, password, { remember });
  }, { authManager, db, requireAuth: false });

  registerHandler(ipcMain, 'auth:login', 'auth.login', async ({ payload }) => {
    const email = payload?.email;
    const password = payload?.password;
    const remember = payload?.remember !== false;
    return authManager.login(email, password, { remember });
  }, { authManager, db, requireAuth: false });

  registerHandler(ipcMain, 'auth:logout', 'auth.logout', async ({ payload, session }) => {
    const userId = payload?.userId || session?.user?.id || null;
    authManager.logout(userId);
    return { loggedOut: true };
  }, { authManager, db, requireAuth: false });

  registerHandler(ipcMain, 'auth:getSession', 'auth.getSession', async () => authManager.getSession(), {
    authManager,
    db,
    requireAuth: false,
  });

  registerHandler(ipcMain, 'auth:restoreSession', 'auth.restoreSession', async ({ payload }) => {
    return authManager.restoreSession(payload?.session || payload || null);
  }, { authManager, db, requireAuth: false });

  registerHandler(ipcMain, 'license:get', 'license.get', async ({ session, userId }) => {
    const localLicense = licenseManager.getLocalLicense(userId || session?.user?.id);
    return localLicense;
  }, { authManager, db });

  registerHandler(ipcMain, 'license:activate', 'license.activate', async ({ payload, session, userId }) => {
    const key = payload?.licenseKey || payload?.license_key || '';
    return licenseManager.activateLicense(userId || session?.user?.id, key, session?.user || null);
  }, { authManager, db });

  registerHandler(ipcMain, 'license:hasFeature', 'license.hasFeature', async ({ payload, session, userId }) => {
    const featureKey = payload?.featureKey || payload?.feature_key || '';
    return licenseManager.hasFeature(userId || session?.user?.id, featureKey);
  }, { authManager, db });

  registerHandler(ipcMain, 'license:verifyOnline', 'license.verifyOnline', async ({ session, userId }) => {
    return licenseManager.verifyOnline(userId || session?.user?.id);
  }, { authManager, db });

  registerHandler(ipcMain, 'notes:getAll', 'notes.getAll', async ({ payload, userId }) => {
    const includeDeleted = Boolean(payload?.includeDeleted);
    return db.listNotes(userId, { includeDeleted });
  }, { authManager, db });

  registerHandler(ipcMain, 'notes:create', 'notes.create', async ({ payload, userId }) => {
    const note = normalizeNoteInput(payload);
    const created = db.createNote(userId, note);
    return created.note || null;
  }, { authManager, db });

  registerHandler(ipcMain, 'notes:update', 'notes.update', async ({ payload, userId }) => {
    const noteId = payload?.noteId || payload?.id;
    if (!noteId) throw new Error('noteId is required.');
    const existing = db.getNoteById(noteId, userId);
    if (!existing) throw new Error('Nota nao encontrada.');

    const patch = {};
    if (Object.prototype.hasOwnProperty.call(payload || {}, 'title')) patch.title = String(payload.title ?? '');
    if (Object.prototype.hasOwnProperty.call(payload || {}, 'content')) patch.content = String(payload.content ?? '');
    if (Object.prototype.hasOwnProperty.call(payload || {}, 'contentType') || Object.prototype.hasOwnProperty.call(payload || {}, 'content_type')) {
      patch.content_type = payload.contentType || payload.content_type || existing.content_type || 'markdown';
    }
    if (Object.prototype.hasOwnProperty.call(payload || {}, 'pinned')) patch.pinned = payload.pinned ? 1 : 0;
    if (Object.prototype.hasOwnProperty.call(payload || {}, 'archived')) patch.archived = payload.archived ? 1 : 0;
    if (Object.prototype.hasOwnProperty.call(payload || {}, 'deleted')) patch.deleted = payload.deleted ? 1 : 0;

    db.updateNote(noteId, patch);
    return db.getNoteById(noteId, userId);
  }, { authManager, db });

  registerHandler(ipcMain, 'notes:delete', 'notes.delete', async ({ payload, userId }) => {
    const noteId = payload?.noteId || payload?.id;
    if (!noteId) throw new Error('noteId is required.');
    const existing = db.getNoteById(noteId, userId);
    if (!existing) throw new Error('Nota nao encontrada.');
    db.softDeleteNote(noteId);
    return { deleted: true, noteId };
  }, { authManager, db });

  registerHandler(ipcMain, 'settings:get', 'settings.get', async ({ session, userId }) => {
    const settings = db.getSettings(userId || session?.user?.id);
    return parseSettingsRow(settings);
  }, { authManager, db });

  registerHandler(ipcMain, 'settings:save', 'settings.save', async ({ payload, session, userId }) => {
    const normalized = normalizeSettingsInput(payload);
    const sessionUserId = userId || session?.user?.id || null;
    const extra = normalized.extra || {};
    const licenseServerUrl = String(extra.licenseServerUrl || extra.license_server_url || payload?.licenseServerUrl || '').trim();
    const licenseAppKey = String(extra.licenseAppKey || extra.license_app_key || payload?.licenseAppKey || '').trim();

    if (licenseServerUrl || licenseAppKey) {
      const configPatch = {};
      if (licenseServerUrl) configPatch.baseUrl = licenseServerUrl;
      if (licenseAppKey) configPatch.appKey = licenseAppKey;
      licenseManager.setServerConfig(configPatch);
      if (licenseAppKey) licenseManager.persistDevAppKey?.(licenseAppKey);
    }

    if (typeof legacyWriteSettings === 'function') {
      legacyWriteSettings(payload || normalized);
    }

    if (sessionUserId) {
      db.saveSettings(sessionUserId, normalized);
      return parseSettingsRow(db.getSettings(sessionUserId));
    }

    return {
      ...normalized,
      legacy: true,
    };
  }, { authManager, db, requireAuth: false });

  registerHandler(ipcMain, 'sync:now', 'sync.now', async ({ payload, userId }) => {
    return syncManager.syncNow(userId, payload?.since || null);
  }, { authManager, db });

  registerHandler(ipcMain, 'sync:status', 'sync.status', async ({ userId }) => {
    return syncManager.getStatus(userId);
  }, { authManager, db });
}

module.exports = {
  registerIpcHandlers,
  createSuccess,
  createFailure,
  parseSettingsRow,
  normalizeSettingsInput,
  normalizeNoteInput,
};

/**
 * Example usage:
 *
 * const { registerIpcHandlers } = require('./ipc/handlers');
 * registerIpcHandlers({
 *   ipcMain,
 *   authManager,
 *   licenseManager,
 *   syncManager,
 *   db,
 *   legacyWriteSettings: settings => writeJson(SETTINGS_FILE, settings),
 * });
 */
