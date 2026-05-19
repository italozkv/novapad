const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const { initializeDatabase, getDatabase, closeDatabase, getDbPaths } = require('./main/db');
const { AuthManager } = require('./main/auth/AuthManager');
const { LicenseManager } = require('./main/license/LicenseManager');
const { SyncManager } = require('./main/sync/SyncManager');
const { registerIpcHandlers } = require('./main/ipc/handlers');

const NOTES_FILE = path.join(app.getPath('userData'), 'notes.json');
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');
const DISCORD_RICH_PRESENCE_CLIENT_ID = '1500357586283921488';
const DISCORD_PLUGIN_MAIN = path.join(__dirname, '..', 'plugins', 'discord-rich-presence', 'plugin.js');

let mainWindow;
let compactNoteWindow;
let updaterConfiguredUrl = '';
let lastBackupAt = 0;
let loadedPlugins = [];
let authManager = null;
let licenseManager = null;
let syncManager = null;
const pluginRuntime = {
  buttons: [],
  panels: [],
  actions: new Map(),
  listeners: new Map(),
  owners: new Map(),
};
let discordPresenceContext = {
  currentNoteTitle: '',
  currentWorkspace: '',
  active: true,
};
let database = null;

function nowStr() {
  return new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Failed to read JSON from ${filePath}:`, error);
    try {
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, `${filePath}.corrupt-${safeFileStamp()}`);
      }
    } catch (backupError) {
      console.error(`Failed to back up corrupt JSON from ${filePath}:`, backupError);
    }
    return null;
  }
}

function writeJson(filePath, value) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Failed to write JSON to ${filePath}:`, error);
    return false;
  }
}

function safeFileStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function getPastedImageExtension(name, mimeType) {
  const byMime = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  const byName = path.extname(String(name || '')).toLowerCase();
  return byMime[String(mimeType || '').toLowerCase()] || (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(byName) ? byName : '.png');
}

function getPastedImageFolder() {
  return path.join(app.getPath('userData'), 'assets', 'images');
}

function writeBackupSnapshot(notes, settings, backupFolder) {
  fs.mkdirSync(backupFolder, { recursive: true });
  const payload = {
    app: 'NovaPad',
    createdAt: new Date().toISOString(),
    notes,
    settings,
  };
  fs.writeFileSync(path.join(backupFolder, 'novapad-backup-latest.json'), JSON.stringify(payload, null, 2), 'utf-8');
  fs.writeFileSync(path.join(backupFolder, `novapad-backup-${safeFileStamp()}.json`), JSON.stringify(payload, null, 2), 'utf-8');
}

function writeAutomaticBackup(notes) {
  const settings = readSettings();
  if (settings.auto_backup === false) return;
  const backupFolder = String(settings.backup_folder || '').trim();
  if (!backupFolder) return;
  const interval = Math.max(60_000, Number(settings.backup_interval_ms) || 300_000);
  if (Date.now() - lastBackupAt < interval) return;
  writeBackupSnapshot(notes, settings, backupFolder);
  lastBackupAt = Date.now();
}

function sendUpdaterEvent(status, extra = {}) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:event', { status, ...extra });
  }
}

function readSettings() {
  return readJson(SETTINGS_FILE) || {};
}

function clonePluginUiItem(item) {
  return {
    ...item,
    buttons: Array.isArray(item.buttons) ? item.buttons.map(button => ({ ...button })) : undefined,
  };
}

function getPluginUiSnapshot() {
  return {
    buttons: pluginRuntime.buttons.map(clonePluginUiItem),
    panels: pluginRuntime.panels.map(clonePluginUiItem),
  };
}

function broadcastPluginUi() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('plugins:ui-changed', getPluginUiSnapshot());
  }
}

function registerPluginAction(pluginId, actionId, handler) {
  const id = String(actionId || '').trim();
  if (!id || typeof handler !== 'function') return null;
  pluginRuntime.actions.set(id, { pluginId, handler });
  let actions = pluginRuntime.owners.get(pluginId);
  if (!actions) {
    actions = { buttons: new Set(), panels: new Set(), events: new Map() };
    pluginRuntime.owners.set(pluginId, actions);
  }
  return id;
}

function unregisterPluginOwner(pluginId) {
  const owner = pluginRuntime.owners.get(pluginId);
  if (!owner) return;
  for (const actionId of owner.buttons) pluginRuntime.actions.delete(actionId);
  for (const panelId of owner.panels) pluginRuntime.panels = pluginRuntime.panels.filter(panel => panel.id !== panelId);
  for (const eventName of owner.events.keys()) {
    const handlers = pluginRuntime.listeners.get(eventName);
    if (!handlers) continue;
    for (const handler of owner.events.get(eventName) || []) {
      for (const entry of Array.from(handlers)) {
        if (entry.pluginId === pluginId && entry.handler === handler) handlers.delete(entry);
      }
    }
    if (!handlers.size) pluginRuntime.listeners.delete(eventName);
  }
  pluginRuntime.buttons = pluginRuntime.buttons.filter(button => button.pluginId !== pluginId);
  pluginRuntime.panels = pluginRuntime.panels.filter(panel => panel.pluginId !== pluginId);
  pluginRuntime.owners.delete(pluginId);
  broadcastPluginUi();
}

function emitPluginEvent(eventName, payload = {}, sourcePluginId = null) {
  const name = String(eventName || '').trim();
  if (!name) return [];
  const handlers = Array.from(pluginRuntime.listeners.get(name) || []);
  const results = [];
  for (const entry of handlers) {
    try {
      results.push(Promise.resolve(entry.handler(payload, { eventName: name, sourcePluginId })));
    } catch (error) {
      console.warn(`Plugin event handler failed for ${name}:`, error);
    }
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('plugins:event', { eventName: name, payload, sourcePluginId });
  }
  return results;
}

function createPluginContext(pluginId = 'plugin') {
  const ownerId = String(pluginId || 'plugin').trim() || 'plugin';
  const ensureOwner = () => {
    let owner = pluginRuntime.owners.get(ownerId);
    if (!owner) {
      owner = { buttons: new Set(), panels: new Set(), events: new Map() };
      pluginRuntime.owners.set(ownerId, owner);
    }
    return owner;
  };
  const registerUiItem = (kind, item, actionHandler) => {
    const owner = ensureOwner();
    const id = String(item?.id || item?.actionId || `${ownerId}-${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`).trim();
    const actionId = actionHandler ? registerPluginAction(ownerId, id, actionHandler) || id : String(item?.actionId || id);
    const entry = {
      id,
      pluginId: ownerId,
      actionId,
      label: String(item?.label || item?.title || item?.name || 'Plugin').trim(),
      hint: String(item?.hint || item?.subtitle || '').trim(),
      tooltip: String(item?.tooltip || item?.title || item?.label || '').trim(),
      icon: String(item?.icon || '').trim(),
      active: Boolean(item?.active),
      tone: String(item?.tone || '').trim(),
    };
    if (kind === 'button') {
      pluginRuntime.buttons = pluginRuntime.buttons.filter(button => !(button.pluginId === ownerId && button.id === entry.id));
      pluginRuntime.buttons.push(entry);
      owner.buttons.add(entry.actionId || entry.id);
    } else if (kind === 'panel') {
      const panelButtons = Array.isArray(item?.buttons) ? item.buttons.map((button, index) => {
        const buttonId = String(button?.id || `${id}-button-${index + 1}`).trim();
        const buttonActionId = button?.onClick ? registerPluginAction(ownerId, buttonId, button.onClick) || buttonId : String(button?.actionId || buttonId);
        owner.buttons.add(buttonActionId);
        return {
          id: buttonId,
          actionId: buttonActionId,
          label: String(button?.label || button?.title || 'Ação').trim(),
          hint: String(button?.hint || '').trim(),
          icon: String(button?.icon || '').trim(),
        };
      }) : [];
      entry.body = String(item?.body || item?.content || '').trim();
      entry.buttons = panelButtons;
      pluginRuntime.panels = pluginRuntime.panels.filter(panel => !(panel.pluginId === ownerId && panel.id === entry.id));
      pluginRuntime.panels.push(entry);
      owner.panels.add(entry.id);
    }
    broadcastPluginUi();
    return entry;
  };
  return {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    shell,
    path,
    fs,
    pluginId: ownerId,
    manifest: null,
    readSettings,
    saveSettings: (settings) => writeJson(SETTINGS_FILE, settings),
    writeJson,
    getMainWindow: () => mainWindow,
    getDatabase: () => getDatabase(),
    db: getDatabase(),
    getAuthManager: () => authManager,
    getLicenseManager: () => licenseManager,
    getSyncManager: () => syncManager,
    getContext: () => ({ ...discordPresenceContext }),
    setContext: (patch) => {
      discordPresenceContext = { ...discordPresenceContext, ...(patch || {}) };
      return { ...discordPresenceContext };
    },
    ui: {
      addButton: (item = {}) => registerUiItem('button', item, item.onClick),
      addPanel: (item = {}) => registerUiItem('panel', item, item.onClick),
      removeButton: (id) => {
        const actionId = String(id || '').trim();
        pluginRuntime.buttons = pluginRuntime.buttons.filter(button => !(button.pluginId === ownerId && (button.id === actionId || button.actionId === actionId)));
        pluginRuntime.actions.delete(actionId);
        const owner = pluginRuntime.owners.get(ownerId);
        owner?.buttons.delete(actionId);
        broadcastPluginUi();
      },
      removePanel: (id) => {
        const panelId = String(id || '').trim();
        pluginRuntime.panels = pluginRuntime.panels.filter(panel => !(panel.pluginId === ownerId && panel.id === panelId));
        const owner = pluginRuntime.owners.get(ownerId);
        owner?.panels.delete(panelId);
        broadcastPluginUi();
      },
      clear: () => unregisterPluginOwner(ownerId),
      getSnapshot: () => getPluginUiSnapshot(),
    },
    events: {
      on: (eventName, handler) => {
        const name = String(eventName || '').trim();
        if (!name || typeof handler !== 'function') return () => {};
        const handlers = pluginRuntime.listeners.get(name) || new Set();
        handlers.add({ pluginId: ownerId, handler });
        pluginRuntime.listeners.set(name, handlers);
        const owner = ensureOwner();
        const ownerHandlers = owner.events.get(name) || new Set();
        ownerHandlers.add(handler);
        owner.events.set(name, ownerHandlers);
        return () => {
          const nextHandlers = pluginRuntime.listeners.get(name);
          if (nextHandlers) {
            for (const entry of Array.from(nextHandlers)) {
              if (entry.pluginId === ownerId && entry.handler === handler) nextHandlers.delete(entry);
            }
            if (!nextHandlers.size) pluginRuntime.listeners.delete(name);
          }
          const ownerSet = owner.events.get(name);
          if (ownerSet) {
            ownerSet.delete(handler);
            if (!ownerSet.size) owner.events.delete(name);
          }
        };
      },
      emit: (eventName, payload = {}) => emitPluginEvent(eventName, payload, ownerId),
    },
    emitEvent: (eventName, payload = {}) => emitPluginEvent(eventName, payload, ownerId),
  };
}

function getPluginAction(actionId) {
  return pluginRuntime.actions.get(String(actionId || '').trim()) || null;
}

function createPluginApiHandlers() {
  return {
    'plugins:get-ui': async () => getPluginUiSnapshot(),
    'plugins:invoke-action': async (_event, payload = {}) => {
      const actionId = String(payload?.actionId || payload?.id || '').trim();
      const entry = getPluginAction(actionId);
      if (!entry) throw new Error('Plugin action not found.');
      return await entry.handler(payload?.payload ?? payload, { actionId });
    },
    'plugins:emit-event': async (_event, payload = {}) => {
      const eventName = String(payload?.eventName || payload?.name || '').trim();
      emitPluginEvent(eventName, payload?.payload ?? payload?.data ?? {}, 'renderer');
      return { received: true };
    },
  };
}

function loadLocalPlugins() {
  const pluginsRoot = path.join(__dirname, '..', 'plugins');
  if (!fs.existsSync(pluginsRoot)) return [];

  const controllers = [];
  for (const entry of fs.readdirSync(pluginsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pluginDir = path.join(pluginsRoot, entry.name);
    const manifestPath = path.join(pluginDir, 'manifest.json');
    const pluginMain = path.join(pluginDir, 'plugin.js');
    if (!fs.existsSync(manifestPath) || !fs.existsSync(pluginMain)) continue;

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const pluginModule = require(pluginMain);
      const activate = pluginModule.activate || pluginModule.createDiscordRichPresence || pluginModule.default || pluginModule;
      if (typeof activate !== 'function') continue;
      const pluginId = String(manifest.name || entry.name || 'plugin').trim() || entry.name;
      const controller = activate({
        ...createPluginContext(pluginId),
        manifest,
        clientId: DISCORD_RICH_PRESENCE_CLIENT_ID,
      }) || {};
      controllers.push({ manifest, pluginId, controller });
      if (typeof controller.handleAppStart === 'function') {
        controller.handleAppStart();
      }
    } catch (error) {
      console.warn(`Failed to load plugin ${entry.name}:`, error);
    }
  }
  return controllers;
}

function configureAutoUpdater() {
  const settings = readSettings();
  const feedUrl = String(settings.update_url || '').trim();
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  if (feedUrl && feedUrl !== updaterConfiguredUrl) {
    autoUpdater.setFeedURL({ provider: 'generic', url: feedUrl });
    updaterConfiguredUrl = feedUrl;
  }
  return { feedUrl, autoUpdate: settings.auto_update !== false };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 800,
    minHeight: 500,
    resizable: true,
    frame: false,
    thickFrame: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#0E0E12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'novapad.ico'),
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  Menu.setApplicationMenu(null);
}

function createCompactNoteWindow() {
  if (compactNoteWindow && !compactNoteWindow.isDestroyed()) {
    compactNoteWindow.show();
    compactNoteWindow.focus();
    return compactNoteWindow;
  }

  compactNoteWindow = new BrowserWindow({
    width: 340,
    height: 430,
    minWidth: 300,
    minHeight: 360,
    resizable: false,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    maximizable: false,
    minimizable: false,
    backgroundColor: '#2D2D30',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'novapad.ico'),
  });

  compactNoteWindow.loadFile(path.join(__dirname, 'compact-note.html'));
  compactNoteWindow.on('closed', () => {
    compactNoteWindow = null;
  });
  return compactNoteWindow;
}

app.whenReady().then(createWindow);
app.whenReady().then(() => {
  database = initializeDatabase();
  authManager = new AuthManager({ db: database });
  licenseManager = new LicenseManager({ db: database });
  syncManager = new SyncManager({ db: database });
  registerIpcHandlers({
    ipcMain,
    authManager,
    licenseManager,
    syncManager,
    db: database,
    legacyWriteSettings: (settings) => writeJson(SETTINGS_FILE, settings),
  });
  for (const [channel, handler] of Object.entries(createPluginApiHandlers())) {
    ipcMain.handle(channel, handler);
  }
  loadedPlugins = loadLocalPlugins();
  autoUpdater.on('checking-for-update', () => sendUpdaterEvent('checking'));
  autoUpdater.on('update-available', info => sendUpdaterEvent('available', { version: info?.version || '' }));
  autoUpdater.on('update-not-available', () => sendUpdaterEvent('not-available'));
  autoUpdater.on('download-progress', progress => sendUpdaterEvent('progress', { percent: progress?.percent || 0 }));
  autoUpdater.on('update-downloaded', info => sendUpdaterEvent('downloaded', { version: info?.version || '' }));
  autoUpdater.on('error', error => sendUpdaterEvent('error', { message: error?.message || String(error) }));
  const { feedUrl, autoUpdate } = configureAutoUpdater();
  if (feedUrl && autoUpdate) {
    setTimeout(() => autoUpdater.checkForUpdates().catch(err => sendUpdaterEvent('error', { message: err.message })), 3500);
  }
});
app.on('before-quit', () => {
  for (const plugin of loadedPlugins) {
    try {
      plugin.controller?.handleAppClose?.();
    } catch (error) {
      console.warn('Plugin close error:', error);
    } finally {
      unregisterPluginOwner(plugin.pluginId);
    }
  }
  closeDatabase();
  authManager = null;
  licenseManager = null;
  syncManager = null;
});
app.on('window-all-closed', () => app.quit());

// ── Notes ──────────────────────────────────────────────
ipcMain.handle('notes:load', () => {
  try {
    if (!fs.existsSync(NOTES_FILE)) return null;
    return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
  } catch (err) {
    const backup = NOTES_FILE + '.corrupt-' + Date.now();
    try { fs.copyFileSync(NOTES_FILE, backup); } catch (_) {}
    return null;
  }
});

ipcMain.handle('notes:save', (_, notes) => {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
  try { writeAutomaticBackup(notes); } catch (error) { console.error('NovaPad backup failed:', error); }
  return true;
});

ipcMain.handle('compact-note:save', (_, rawContent) => {
  const content = String(rawContent || '').trim();
  if (!content) return false;

  const settings = readJson(SETTINGS_FILE) || {};
  const notes = readJson(NOTES_FILE) || [];
  const firstLine = content.split(/\r?\n/).find(Boolean) || '';
  const title = firstLine.slice(0, 42) || 'Nota compacta';
  const tag = 'pessoal';
  const note = {
    id: Date.now(),
    title,
    tag,
    content,
    accentColor: '#FCA5A5',
    workspace: settings.currentWorkspace || 'General',
    pinned: true,
    favorite: false,
    deletedAt: null,
    reminderAt: null,
    reminderDone: false,
    images: [],
    created: nowStr(),
    modified: nowStr(),
    versions: [],
  };

  notes.unshift(note);
  writeJson(NOTES_FILE, notes);
  try { writeAutomaticBackup(notes); } catch (error) { console.error('NovaPad backup failed:', error); }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('notes:external-changed');
  }
  return true;
});

// ── Settings ───────────────────────────────────────────
ipcMain.handle('settings:load', () => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return null;
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
  } catch (err) {
    const backup = SETTINGS_FILE + '.corrupt-' + Date.now();
    try { fs.copyFileSync(SETTINGS_FILE, backup); } catch (_) {}
    return null;
  }
});

  ipcMain.handle('app:get-info', () => ({
    userDataPath: app.getPath('userData'),
    notesFile: NOTES_FILE,
    settingsFile: SETTINGS_FILE,
    databaseFile: getDbPaths().dbPath,
    appVersion: app.getVersion(),
    isPackaged: app.isPackaged,
  }));

ipcMain.handle('images:save-pasted', (_, { name, mimeType, bytes }) => {
  try {
    const folder = getPastedImageFolder();
    fs.mkdirSync(folder, { recursive: true });
    const ext = getPastedImageExtension(name, mimeType);
    const safeBase = String(name || 'imagem')
      .replace(/\.[^.]+$/, '')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'imagem';
    const fileName = `${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(folder, fileName);
    fs.writeFileSync(filePath, Buffer.from(Array.isArray(bytes) ? bytes : []));
    return {
      ok: true,
      fileName,
      relativePath: path.posix.join('assets', 'images', fileName),
      absolutePath: filePath,
    };
  } catch (error) {
    return { ok: false, reason: 'save_failed', message: error?.message || String(error) };
  }
});

ipcMain.handle('app:open-path', (_, targetPath) => {
  if (!targetPath) return false;
  shell.openPath(targetPath);
  return true;
});

ipcMain.handle('backup:choose-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('backup:run-now', (_, notes) => {
  const settings = readSettings();
  const backupFolder = String(settings.backup_folder || '').trim();
  if (!backupFolder) return { ok: false, reason: 'missing_folder' };
  writeBackupSnapshot(Array.isArray(notes) ? notes : readJson(NOTES_FILE) || [], settings, backupFolder);
  lastBackupAt = Date.now();
  return { ok: true, folder: backupFolder };
});

ipcMain.handle('updater:check', async () => {
  const { feedUrl } = configureAutoUpdater();
  if (!feedUrl) return { ok: false, reason: 'missing_url' };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    sendUpdaterEvent('error', { message: error?.message || String(error) });
    return { ok: false, reason: 'error', message: error?.message || String(error) };
  }
});

ipcMain.handle('updater:install', () => {
  setImmediate(() => autoUpdater.quitAndInstall());
  return true;
});

ipcMain.handle('discord-presence:update-context', (_, context) => {
  discordPresenceContext = {
    ...discordPresenceContext,
    ...(context || {}),
  };
  for (const plugin of loadedPlugins) {
    try {
      plugin.controller?.setContext?.(discordPresenceContext);
      plugin.controller?.updatePresence?.();
    } catch (error) {
      console.warn('Discord presence update failed:', error);
    }
  }
  return true;
});

ipcMain.handle('discord-presence:set-enabled', (_, enabled) => {
  const settings = readSettings();
  settings.discord_rich_presence = {
    ...(settings.discord_rich_presence || {}),
    enabled: Boolean(enabled),
  };
  writeJson(SETTINGS_FILE, settings);
  discordPresenceContext.active = Boolean(enabled);
  for (const plugin of loadedPlugins) {
    try {
      plugin.controller?.setContext?.(discordPresenceContext);
      plugin.controller?.updatePresence?.();
    } catch (error) {
      console.warn('Discord presence toggle failed:', error);
    }
  }
  return true;
});

ipcMain.handle('discord-presence:refresh', () => {
  for (const plugin of loadedPlugins) {
    try {
      plugin.controller?.updatePresence?.();
    } catch (error) {
      console.warn('Discord presence refresh failed:', error);
    }
  }
  return true;
});


// -- Import ------------------------------------------------------------
ipcMain.handle('import:dialog', async (_, { filters }) => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openFile'], filters });
  return result.canceled || !result.filePaths.length ? null : result.filePaths[0];
});

ipcMain.handle('import:read', (_, { filePath }) => {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const buffer = fs.readFileSync(filePath);
  let content = '';
  if (['.txt', '.md', '.csv', '.html'].includes(ext)) {
    content = buffer.toString('utf-8').replace(/^\uFEFF/, '');
    if (ext === '.html') content = htmlToText(content);
    if (ext === '.csv') content = csvToText(content);
  } else if (ext === '.json') {
    const parsed = JSON.parse(buffer.toString('utf-8').replace(/^\uFEFF/, ''));
    if (parsed && parsed.novapad_export && parsed.note) return { title: parsed.note.title || base, content: parsed.note.content || '', tag: parsed.note.tag || 'pessoal', ext };
    content = JSON.stringify(parsed, null, 2);
  } else if (ext === '.docx') content = extractDocxText(buffer);
  else if (ext === '.xlsx') content = extractXlsxText(buffer);
  else if (ext === '.pdf') content = extractPdfText(buffer);
  else throw new Error('Formato não suportado para importação.');
  return { title: base || 'Nota importada', content: content.trim(), tag: 'pessoal', ext };
});

ipcMain.handle('import:read-image-data', (_, { filePath }) => {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const buffer = fs.readFileSync(filePath);
  const mimeByExt = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
  };
  const mime = mimeByExt[ext] || 'application/octet-stream';
  return {
    title: base || 'Importação OCR',
    name: path.basename(filePath),
    dataUrl: `data:${mime};base64,${buffer.toString('base64')}`,
  };
});

ipcMain.handle('import:read-binary', (_, { filePath }) => {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const buffer = fs.readFileSync(filePath);
  return {
    title: base || 'Arquivo importado',
    name: path.basename(filePath),
    ext,
    bytes: Array.from(buffer),
  };
});

function extractZipEntries(buffer) {
  const entries = {};
  let i = 0;
  while (i < buffer.length - 30) {
    if (buffer.readUInt32LE(i) !== 0x04034b50) break;
    const method = buffer.readUInt16LE(i + 8);
    const compressedSize = buffer.readUInt32LE(i + 18);
    const fileNameLength = buffer.readUInt16LE(i + 26);
    const extraLength = buffer.readUInt16LE(i + 28);
    const nameStart = i + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const fileName = buffer.slice(nameStart, nameStart + fileNameLength).toString('utf-8');
    const compressed = buffer.slice(dataStart, dataStart + compressedSize);
    try {
      if (method === 0) entries[fileName] = compressed.toString('utf-8');
      else if (method === 8) entries[fileName] = zlib.inflateRawSync(compressed).toString('utf-8');
    } catch (_) {}
    i = dataStart + compressedSize;
  }
  return entries;
}
function xmlEntityDecode(str) { return String(str).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&'); }
function extractDocxText(buffer) {
  const xml = extractZipEntries(buffer)['word/document.xml'];
  if (!xml) throw new Error('Não foi possível ler o conteúdo do DOCX.');
  return xml.replace(/<w:p[\s\S]*?<\/w:p>/g, p => [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map(m => xmlEntityDecode(m[1])).join('') + '\n').replace(/<[^>]+>/g, '').trim();
}
function extractXlsxText(buffer) {
  const entries = extractZipEntries(buffer);
  const shared = [];
  if (entries['xl/sharedStrings.xml']) for (const m of entries['xl/sharedStrings.xml'].matchAll(/<si[\s\S]*?<\/si>/g)) shared.push([...m[0].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => xmlEntityDecode(x[1])).join(''));
  const sheetName = Object.keys(entries).find(k => /^xl\/worksheets\/sheet\d+\.xml$/.test(k));
  const xml = sheetName ? entries[sheetName] : entries['xl/worksheets/sheet1.xml'];
  if (!xml) throw new Error('Não foi possível ler o conteúdo do XLSX.');
  const rows = [];
  for (const row of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const cell of row[1].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cell[1], body = cell[2];
      const inline = body.match(/<t[^>]*>([\s\S]*?)<\/t>/);
      const v = body.match(/<v>([\s\S]*?)<\/v>/);
      if (/t="s"/.test(attrs) && v) cells.push(shared[Number(v[1])] || '');
      else if (inline) cells.push(xmlEntityDecode(inline[1]));
      else if (v) cells.push(xmlEntityDecode(v[1]));
      else cells.push('');
    }
    if (cells.some(Boolean)) rows.push(cells.join(' | '));
  }
  return rows.join('\n').trim();
}
function extractPdfText(buffer) {
  const raw = buffer.toString('latin1');
  const chunks = [];
  for (const m of raw.matchAll(/\(([^()]*)\)\s*Tj/g)) chunks.push(m[1].replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\'));
  if (!chunks.length) throw new Error('PDF sem texto extraível. Alguns PDFs são imagem e precisam de OCR.');
  return chunks.join('\n');
}
function htmlToText(html) { return html.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>|<\/h1>|<\/h2>|<\/li>|<\/div>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim(); }
function csvToText(csv) { return csv.split(/\r?\n/).map(line => line.split(',').map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"')).join(' | ')).join('\n'); }

// ── Window controls ────────────────────────────────────
ipcMain.on('window:minimize', () => mainWindow.minimize());
ipcMain.on('window:maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on('window:close', () => mainWindow.close());
ipcMain.on('compact-note:toggle', () => {
  if (compactNoteWindow && !compactNoteWindow.isDestroyed() && compactNoteWindow.isVisible()) {
    compactNoteWindow.close();
    return;
  }
  createCompactNoteWindow();
});
ipcMain.on('compact-note:close', () => {
  if (compactNoteWindow && !compactNoteWindow.isDestroyed()) compactNoteWindow.close();
});

// ── Export ─────────────────────────────────────────────
ipcMain.handle('export:dialog', async (_, { defaultName, filters }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters,
  });
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('export:write', (_, { filePath, content, encoding }) => {
  fs.writeFileSync(filePath, content, encoding || 'utf-8');
  return true;
});

ipcMain.handle('export:write-binary', (_, { filePath, buffer }) => {
  fs.writeFileSync(filePath, Buffer.from(buffer));
  return true;
});
