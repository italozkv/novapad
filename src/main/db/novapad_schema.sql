PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA synchronous = NORMAL;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'markdown',
  pinned INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0,
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
CREATE INDEX IF NOT EXISTS idx_notes_deleted ON notes(deleted);

CREATE TABLE IF NOT EXISTS settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system',
  language TEXT NOT NULL DEFAULT 'pt-BR',
  sidebar_state TEXT NOT NULL DEFAULT 'expanded',
  font_size TEXT NOT NULL DEFAULT 'medium',
  editor_mode TEXT NOT NULL DEFAULT 'wysiwyg',
  extra TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL DEFAULT 'Dispositivo desconhecido',
  platform TEXT,
  app_version TEXT,
  registered_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_fingerprint ON devices(device_fingerprint);

CREATE TABLE IF NOT EXISTS sync_changes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('insert', 'update', 'delete')),
  payload TEXT NOT NULL DEFAULT '{}',
  synced INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  synced_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_changes_user_id ON sync_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_changes_synced ON sync_changes(synced);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'local',
  provider_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(provider, provider_id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider, provider_id);

CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK(plan IN ('free', 'trial', 'pro', 'lifetime')),
  license_key_hash TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK(status IN ('active', 'trial', 'expired', 'revoked')),
  max_devices INTEGER NOT NULL DEFAULT 1,
  issued_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT,
  activated_at TEXT,
  revoked_at TEXT,
  last_verified_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_key_hash ON licenses(license_key_hash);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  license_id TEXT NOT NULL UNIQUE REFERENCES licenses(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_sub_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK(status IN ('active', 'past_due', 'canceled', 'paused')),
  current_period_start TEXT,
  current_period_end TEXT,
  canceled_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_license_id ON subscriptions(license_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider_sub_id);

CREATE TABLE IF NOT EXISTS license_devices (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT NOT NULL DEFAULT 'Dispositivo desconhecido',
  activated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  revoked_at TEXT,
  UNIQUE(license_id, device_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_license_devices_license_id ON license_devices(license_id);
CREATE INDEX IF NOT EXISTS idx_license_devices_fingerprint ON license_devices(device_fingerprint);

CREATE TABLE IF NOT EXISTS entitlements (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  value TEXT,
  UNIQUE(license_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_license_id ON entitlements(license_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_feature_key ON entitlements(feature_key);

CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_notes_updated_at
AFTER UPDATE ON notes
BEGIN
  UPDATE notes SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_settings_updated_at
AFTER UPDATE ON settings
BEGIN
  UPDATE settings SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE user_id = NEW.user_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_sync_settings_insert
AFTER INSERT ON settings
BEGIN
  INSERT INTO sync_changes (user_id, table_name, record_id, action, payload)
  VALUES (
    NEW.user_id,
    'settings',
    NEW.user_id,
    'insert',
    json_object(
      'theme', NEW.theme,
      'language', NEW.language,
      'sidebar_state', NEW.sidebar_state,
      'font_size', NEW.font_size,
      'editor_mode', NEW.editor_mode,
      'extra', NEW.extra,
      'updated_at', NEW.updated_at
    )
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_sync_settings_update
AFTER UPDATE ON settings
BEGIN
  INSERT INTO sync_changes (user_id, table_name, record_id, action, payload)
  VALUES (
    NEW.user_id,
    'settings',
    NEW.user_id,
    'update',
    json_object(
      'theme', NEW.theme,
      'language', NEW.language,
      'sidebar_state', NEW.sidebar_state,
      'font_size', NEW.font_size,
      'editor_mode', NEW.editor_mode,
      'extra', NEW.extra,
      'updated_at', NEW.updated_at
    )
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_subscriptions_updated_at
AFTER UPDATE ON subscriptions
BEGIN
  UPDATE subscriptions SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_sync_notes_insert
AFTER INSERT ON notes
BEGIN
  INSERT INTO sync_changes (user_id, table_name, record_id, action, payload)
  VALUES (NEW.user_id, 'notes', NEW.id, 'insert',
    json_object('title', NEW.title, 'content', NEW.content, 'updated_at', NEW.updated_at));
END;

CREATE TRIGGER IF NOT EXISTS trg_sync_notes_update
AFTER UPDATE ON notes
BEGIN
  INSERT INTO sync_changes (user_id, table_name, record_id, action, payload)
  VALUES (NEW.user_id, 'notes', NEW.id, 'update',
    json_object('title', NEW.title, 'content', NEW.content, 'updated_at', NEW.updated_at));
END;

CREATE TRIGGER IF NOT EXISTS trg_sync_notes_delete
AFTER UPDATE OF deleted ON notes
WHEN NEW.deleted = 1
BEGIN
  INSERT INTO sync_changes (user_id, table_name, record_id, action, payload)
  VALUES (NEW.user_id, 'notes', NEW.id, 'delete',
    json_object('deleted_at', strftime('%Y-%m-%dT%H:%M:%fZ', 'now')));
END;
