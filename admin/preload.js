const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

contextBridge.exposeInMainWorld('adminApi', {
  getState: () => invoke('admin:getState'),
  chooseDb: () => invoke('admin:chooseDb'),
  useProjectData: () => invoke('admin:useProjectData'),
  listLicenses: (payload) => invoke('admin:listLicenses', payload),
  createLicense: (payload) => invoke('admin:createLicense', payload),
  updateLicense: (payload) => invoke('admin:updateLicense', payload),
  deleteLicense: (payload) => invoke('admin:deleteLicense', payload),
  getLicense: (payload) => invoke('admin:getLicense', payload),
  listDevices: (payload) => invoke('admin:listDevices', payload),
  revokeDevice: (payload) => invoke('admin:revokeDevice', payload),
  deleteDevice: (payload) => invoke('admin:deleteDevice', payload),
  generateAppKey: () => invoke('admin:generateAppKey'),
  saveAppKey: (payload) => invoke('admin:saveAppKey', payload),
  copy: (payload) => invoke('admin:copy', payload),
  openPath: (payload) => invoke('admin:openPath', payload),
  backupDb: () => invoke('admin:backupDb'),
});
