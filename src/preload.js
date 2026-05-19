const { contextBridge, ipcRenderer } = require('electron');

const novapad = {
  auth: {
    register: (payload) => ipcRenderer.invoke('auth:register', payload),
    login: (payload) => ipcRenderer.invoke('auth:login', payload),
    logout: (payload) => ipcRenderer.invoke('auth:logout', payload),
    getSession: () => ipcRenderer.invoke('auth:getSession'),
    restoreSession: (payload) => ipcRenderer.invoke('auth:restoreSession', payload),
  },
  license: {
    get: () => ipcRenderer.invoke('license:get'),
    activate: (payload) => ipcRenderer.invoke('license:activate', payload),
    hasFeature: (payload) => ipcRenderer.invoke('license:hasFeature', payload),
    verifyOnline: () => ipcRenderer.invoke('license:verifyOnline'),
  },
  notes: {
    getAll: (payload) => ipcRenderer.invoke('notes:getAll', payload),
    create: (payload) => ipcRenderer.invoke('notes:create', payload),
    update: (payload) => ipcRenderer.invoke('notes:update', payload),
    delete: (payload) => ipcRenderer.invoke('notes:delete', payload),
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    save: (payload) => ipcRenderer.invoke('settings:save', payload),
  },
  sync: {
    now: (payload) => ipcRenderer.invoke('sync:now', payload),
    status: () => ipcRenderer.invoke('sync:status'),
  },
};

const api = {
  notes: {
    load: () => ipcRenderer.invoke('notes:load'),
    save: (notes) => ipcRenderer.invoke('notes:save', notes),
    onExternalChange: (callback) => ipcRenderer.on('notes:external-changed', () => callback()),
  },
  settings: {
    load: () => ipcRenderer.invoke('settings:load'),
    save: (s) => ipcRenderer.invoke('settings:save', s),
  },
  app: {
    getInfo: () => ipcRenderer.invoke('app:get-info'),
    openPath: (targetPath) => ipcRenderer.invoke('app:open-path', targetPath),
  },
  images: {
    savePasted: (payload) => ipcRenderer.invoke('images:save-pasted', payload),
  },
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },
  compactNote: {
    toggle: () => ipcRenderer.send('compact-note:toggle'),
    close: () => ipcRenderer.send('compact-note:close'),
    save: (content) => ipcRenderer.invoke('compact-note:save', content),
  },
  updater: {
    check: () => ipcRenderer.invoke('updater:check'),
    install: () => ipcRenderer.invoke('updater:install'),
    onEvent: (callback) => ipcRenderer.on('updater:event', (_event, payload) => callback(payload)),
  },
  plugins: {
    getUI: () => ipcRenderer.invoke('plugins:get-ui'),
    invokeAction: (actionId, payload) => ipcRenderer.invoke('plugins:invoke-action', { actionId, payload }),
    emitEvent: (eventName, payload) => ipcRenderer.invoke('plugins:emit-event', { eventName, payload }),
    onUIChange: (callback) => {
      const listener = (_event, payload) => callback(payload);
      ipcRenderer.on('plugins:ui-changed', listener);
      return () => ipcRenderer.removeListener('plugins:ui-changed', listener);
    },
    onEvent: (callback) => {
      const listener = (_event, payload) => callback(payload);
      ipcRenderer.on('plugins:event', listener);
      return () => ipcRenderer.removeListener('plugins:event', listener);
    },
  },
  backup: {
    chooseFolder: () => ipcRenderer.invoke('backup:choose-folder'),
    runNow: (notes) => ipcRenderer.invoke('backup:run-now', notes),
  },
  export: {
    dialog: (opts) => ipcRenderer.invoke('export:dialog', opts),
    write: (opts) => ipcRenderer.invoke('export:write', opts),
    writeBinary: (opts) => ipcRenderer.invoke('export:write-binary', opts),
  },
  import: {
    dialog: (opts) => ipcRenderer.invoke('import:dialog', opts),
    read: (opts) => ipcRenderer.invoke('import:read', opts),
    readImageData: (opts) => ipcRenderer.invoke('import:read-image-data', opts),
    readBinary: (opts) => ipcRenderer.invoke('import:read-binary', opts),
  },
  discordPresence: {
    updateContext: (context) => ipcRenderer.invoke('discord-presence:update-context', context),
    setEnabled: (enabled) => ipcRenderer.invoke('discord-presence:set-enabled', enabled),
    refresh: () => ipcRenderer.invoke('discord-presence:refresh'),
  },
  novapad,
};

contextBridge.exposeInMainWorld('novapad', novapad);
contextBridge.exposeInMainWorld('api', api);
