const { app, BrowserWindow, ipcMain, dialog, shell, clipboard, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const BetterSqlite3 = require('better-sqlite3');

const FEATURE_KEYS = ['sync', 'export_pdf', 'themes', 'ai_assist'];
const PLAN_DEFAULTS = {
  free: { maxDevices: 1, validityDays: null, features: { sync: false, export_pdf: false, themes: false, ai_assist: false } },
  trial: { maxDevices: 1, validityDays: 14, features: { sync: true, export_pdf: true, themes: true, ai_assist: false } },
  pro: { maxDevices: 3, validityDays: 365, features: { sync: true, export_pdf: true, themes: true, ai_assist: false } },
  lifetime: { maxDevices: 5, validityDays: null, features: { sync: true, export_pdf: true, themes: true, ai_assist: false } },
};

let mainWindow = null;
let db = null;
let dbPath = '';
let startupError = '';

function nowIso() {
  return new Date().toISOString();
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || ''), 'utf8').digest('hex');
}

function generateLicenseKey() {
  const part = () => crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NP-${part()}-${part()}-${part()}-${part()}`;
}

function generateAppKey() {
  return crypto.randomBytes(32).toString('base64url');
}

function repoRoot() {
  return path.resolve(__dirname, '..');
}

function projectDataRoot() {
  const envRoot = String(process.env.NOVAPAD_PROJECT_DIR || '').trim();
  if (envRoot) return path.join(envRoot, 'server', 'data');
  return path.join(app.getPath('home'), 'Desktop', 'novapad', 'server', 'data');
}

function projectDbPath() {
  return path.join(projectDataRoot(), 'licenses.sqlite3');
}

function projectAppKeyPath() {
  return path.join(projectDataRoot(), 'app-key.txt');
}

function defaultDataRoot() {
  if (app.isPackaged && fs.existsSync(projectDataRoot())) return projectDataRoot();
  if (app.isPackaged) return path.join(app.getPath('userData'), 'server', 'data');
  return path.join(repoRoot(), 'server', 'data');
}

function defaultDbPath() {
  return path.join(defaultDataRoot(), 'licenses.sqlite3');
}

function defaultAppKeyPath() {
  return path.join(defaultDataRoot(), 'app-key.txt');
}

function settingsPath() {
  return path.join(app.getPath('userData'), 'admin-settings.json');
}

function readSettings() {
  try {
    if (!fs.existsSync(settingsPath())) return {};
    return JSON.parse(fs.readFileSync(settingsPath(), 'utf8'));
  } catch {
    return {};
  }
}

function saveSettings(patch) {
  const next = { ...readSettings(), ...(patch || {}) };
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizePlan(value) {
  const plan = String(value || 'free').trim().toLowerCase();
  return PLAN_DEFAULTS[plan] ? plan : 'free';
}

function normalizeStatus(value, plan) {
  const status = String(value || '').trim().toLowerCase();
  if (['active', 'trial', 'expired', 'revoked'].includes(status)) return status;
  return plan === 'trial' ? 'trial' : 'active';
}

function computeExpiresAt({ plan, expiresAt, validityDays }) {
  if (plan === 'lifetime') return null;
  if (expiresAt) return String(expiresAt).trim();
  const days = Number(validityDays);
  if (!Number.isFinite(days) || days <= 0) return null;
  return new Date(Date.now() + Math.floor(days) * 24 * 60 * 60 * 1000).toISOString();
}

function normalizeFeatures(features = {}, plan = 'free') {
  const defaults = PLAN_DEFAULTS[plan] || PLAN_DEFAULTS.free;
  return FEATURE_KEYS.map(featureKey => ({
    featureKey,
    enabled: Object.prototype.hasOwnProperty.call(features, featureKey)
      ? Boolean(features[featureKey])
      : Boolean(defaults.features[featureKey]),
    value: null,
  }));
}

function openDatabase(nextPath = dbPath || readSettings().dbPath || defaultDbPath()) {
  if (db) {
    try { db.close(); } catch {}
    db = null;
  }
  dbPath = nextPath;
  ensureDir(dbPath);
  db = new BetterSqlite3(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      license_key_hash TEXT NOT NULL UNIQUE,
      user_id TEXT,
      plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free', 'trial', 'pro', 'lifetime')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'trial', 'expired', 'revoked')),
      max_devices INTEGER NOT NULL DEFAULT 1,
      expires_at TEXT,
      activated_at TEXT,
      last_verified_at TEXT,
      revoked_at TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS license_devices (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
      device_fingerprint TEXT NOT NULL,
      device_name TEXT NOT NULL DEFAULT 'Dispositivo desconhecido',
      platform TEXT,
      app_version TEXT,
      approved INTEGER NOT NULL DEFAULT 1,
      activated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      revoked_at TEXT,
      UNIQUE(license_id, device_fingerprint)
    );

    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
      feature_key TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      value TEXT,
      UNIQUE(license_id, feature_key)
    );

    CREATE INDEX IF NOT EXISTS idx_licenses_key_hash ON licenses(license_key_hash);
    CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
    CREATE INDEX IF NOT EXISTS idx_license_devices_license_id ON license_devices(license_id);
    CREATE INDEX IF NOT EXISTS idx_entitlements_license_id ON entitlements(license_id);

    CREATE TRIGGER IF NOT EXISTS trg_licenses_updated_at
    AFTER UPDATE ON licenses
    BEGIN
      UPDATE licenses SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = NEW.id;
    END;
  `);
  saveSettings({ dbPath });
  return db;
}

function getDb() {
  return db || openDatabase();
}

function dbGet(sql, params = []) {
  const stmt = getDb().prepare(sql);
  return Array.isArray(params) ? stmt.get(...params) : stmt.get(params);
}

function dbAll(sql, params = []) {
  const stmt = getDb().prepare(sql);
  return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
}

function upsertEntitlements(licenseId, features, plan = 'free') {
  const items = normalizeFeatures(features, plan);
  const stmt = getDb().prepare(`
    INSERT INTO entitlements (license_id, feature_key, enabled, value)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(license_id, feature_key) DO UPDATE SET
      enabled = excluded.enabled,
      value = excluded.value
  `);
  const tx = getDb().transaction(() => {
    for (const item of items) stmt.run(licenseId, item.featureKey, item.enabled ? 1 : 0, item.value);
  });
  tx();
  return items;
}

function licenseResponse(row, includeFeatures = true) {
  if (!row) return null;
  const deviceCount = dbGet('SELECT COUNT(*) AS count FROM license_devices WHERE license_id = ? AND revoked_at IS NULL', [row.id])?.count || 0;
  const features = includeFeatures
    ? dbAll('SELECT feature_key, enabled, value FROM entitlements WHERE license_id = ? ORDER BY feature_key', [row.id])
    : [];
  return {
    ...row,
    device_count: deviceCount,
    features: features.map(item => ({ featureKey: item.feature_key, enabled: item.enabled === 1, value: item.value })),
  };
}

function listLicenses(query = '') {
  const needle = String(query || '').trim();
  const maybeHash = /^NP-[A-Z0-9_-]+/i.test(needle) ? sha256(needle) : '';
  const rows = needle
    ? dbAll(`
        SELECT * FROM licenses
        WHERE id LIKE @q OR user_id LIKE @q OR plan LIKE @q OR status LIKE @q OR license_key_hash = @hash
        ORDER BY created_at DESC
        LIMIT 300
      `, { q: `%${needle}%`, hash: maybeHash })
    : dbAll('SELECT * FROM licenses ORDER BY created_at DESC LIMIT 300');
  return rows.map(row => licenseResponse(row, false));
}

function createLicense(payload = {}) {
  const plan = normalizePlan(payload.plan);
  const status = normalizeStatus(payload.status, plan);
  const licenseKey = String(payload.licenseKey || payload.license_key || '').trim() || generateLicenseKey();
  const expiresAt = computeExpiresAt({
    plan,
    expiresAt: payload.expiresAt || payload.expires_at,
    validityDays: payload.validityDays ?? payload.validity_days ?? PLAN_DEFAULTS[plan].validityDays,
  });
  const maxDevices = Math.max(1, Number(payload.maxDevices ?? payload.max_devices ?? PLAN_DEFAULTS[plan].maxDevices) || 1);
  const userId = String(payload.userId || payload.user_id || '').trim() || null;
  const now = nowIso();
  const result = getDb().prepare(`
    INSERT INTO licenses (license_key_hash, user_id, plan, status, max_devices, expires_at, activated_at, last_verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(sha256(licenseKey), userId, plan, status, maxDevices, expiresAt, now, now);
  const row = dbGet('SELECT * FROM licenses WHERE rowid = ?', [result.lastInsertRowid]);
  upsertEntitlements(row.id, payload.features || {}, plan);
  return { licenseKey, license: licenseResponse(dbGet('SELECT * FROM licenses WHERE id = ?', [row.id])) };
}

function updateLicense(payload = {}) {
  const id = String(payload.id || '').trim();
  if (!id) throw new Error('id is required');
  const current = dbGet('SELECT * FROM licenses WHERE id = ?', [id]);
  if (!current) throw new Error('License not found');
  const plan = normalizePlan(payload.plan || current.plan);
  const status = normalizeStatus(payload.status || current.status, plan);
  const maxDevices = Math.max(1, Number(payload.maxDevices ?? payload.max_devices ?? current.max_devices) || 1);
  const expiresAt = payload.expiresAt !== undefined ? String(payload.expiresAt || '').trim() || null : current.expires_at;
  const userId = payload.userId !== undefined ? String(payload.userId || '').trim() || null : current.user_id;
  const revokedAt = status === 'revoked' ? (current.revoked_at || nowIso()) : null;
  getDb().prepare(`
    UPDATE licenses
    SET user_id = ?, plan = ?, status = ?, max_devices = ?, expires_at = ?, revoked_at = ?
    WHERE id = ?
  `).run(userId, plan, status, maxDevices, expiresAt, revokedAt, id);
  if (payload.features) upsertEntitlements(id, payload.features, plan);
  return licenseResponse(dbGet('SELECT * FROM licenses WHERE id = ?', [id]));
}

function readAppKey() {
  const target = readSettings().appKeyPath || defaultAppKeyPath();
  try {
    if (!fs.existsSync(target)) return { appKey: '', appKeyPath: target };
    return { appKey: String(fs.readFileSync(target, 'utf8') || '').trim(), appKeyPath: target };
  } catch {
    return { appKey: '', appKeyPath: target };
  }
}

function writeAppKey(appKey, appKeyPath = readSettings().appKeyPath || defaultAppKeyPath()) {
  const normalized = String(appKey || '').trim();
  ensureDir(appKeyPath);
  fs.writeFileSync(appKeyPath, `${normalized}\n`, 'utf8');
  saveSettings({ appKeyPath });
  return { appKey: normalized, appKeyPath };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 960,
    minHeight: 620,
    backgroundColor: '#111827',
    title: 'NovaPad Admin',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(repoRoot(), 'src', 'novapad.ico'),
  });
  Menu.setApplicationMenu(null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.center();
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.webContents.on('did-fail-load', (_event, code, description) => {
    startupError = `Falha ao carregar interface (${code}): ${description}`;
    mainWindow.show();
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html')).catch(error => {
    startupError = error?.message || String(error);
    mainWindow.show();
  });
}

function ok(data) {
  return { ok: true, data };
}

function fail(error) {
  return { ok: false, error: error?.message || String(error) };
}

function handle(channel, fn) {
  ipcMain.handle(channel, async (_event, payload) => {
    try {
      return ok(await fn(payload));
    } catch (error) {
      return fail(error);
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  try {
    openDatabase();
  } catch (error) {
    startupError = error?.message || String(error);
  }
});

app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => {
  if (db) {
    try { db.close(); } catch {}
    db = null;
  }
});

handle('admin:getState', () => ({
  dbPath,
  startupError,
  ...readAppKey(),
  summary: {
    licenses: dbGet('SELECT COUNT(*) AS count FROM licenses')?.count || 0,
    active: dbGet("SELECT COUNT(*) AS count FROM licenses WHERE status IN ('active', 'trial')")?.count || 0,
    revoked: dbGet("SELECT COUNT(*) AS count FROM licenses WHERE status = 'revoked'")?.count || 0,
    devices: dbGet('SELECT COUNT(*) AS count FROM license_devices WHERE revoked_at IS NULL')?.count || 0,
  },
}));

handle('admin:chooseDb', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Escolher banco de licencas',
    filters: [{ name: 'SQLite', extensions: ['sqlite3', 'db', 'sqlite'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths[0]) return { dbPath };
  openDatabase(result.filePaths[0]);
  return { dbPath };
});

handle('admin:useProjectData', () => {
  ensureDir(projectDbPath());
  openDatabase(projectDbPath());
  saveSettings({ dbPath: projectDbPath(), appKeyPath: projectAppKeyPath() });
  return { dbPath, appKeyPath: projectAppKeyPath() };
});

handle('admin:listLicenses', ({ query } = {}) => listLicenses(query));
handle('admin:createLicense', payload => createLicense(payload));
handle('admin:updateLicense', payload => updateLicense(payload));
handle('admin:deleteLicense', ({ id }) => {
  getDb().prepare('DELETE FROM licenses WHERE id = ?').run(String(id || ''));
  return { deleted: true };
});
handle('admin:getLicense', ({ id }) => licenseResponse(dbGet('SELECT * FROM licenses WHERE id = ?', [String(id || '')])));
handle('admin:listDevices', ({ licenseId }) => dbAll('SELECT * FROM license_devices WHERE license_id = ? ORDER BY last_seen_at DESC', [String(licenseId || '')]));
handle('admin:revokeDevice', ({ id }) => {
  getDb().prepare('UPDATE license_devices SET revoked_at = ? WHERE id = ?').run(nowIso(), String(id || ''));
  return { revoked: true };
});
handle('admin:deleteDevice', ({ id }) => {
  getDb().prepare('DELETE FROM license_devices WHERE id = ?').run(String(id || ''));
  return { deleted: true };
});
handle('admin:generateAppKey', () => writeAppKey(generateAppKey()));
handle('admin:saveAppKey', ({ appKey, appKeyPath }) => writeAppKey(appKey, appKeyPath));
handle('admin:copy', ({ text }) => {
  clipboard.writeText(String(text || ''));
  return { copied: true };
});
handle('admin:openPath', ({ targetPath }) => {
  const target = String(targetPath || dbPath || repoRoot());
  shell.openPath(fs.existsSync(target) && fs.statSync(target).isFile() ? path.dirname(target) : target);
  return { opened: true };
});
handle('admin:backupDb', () => {
  const backupPath = `${dbPath}.backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(dbPath, backupPath);
  return { backupPath };
});
