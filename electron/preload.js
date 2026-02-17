const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openDevTools: () => ipcRenderer.send('open-devtools'),
    openExternal: (url) => ipcRenderer.send('open-external', url)
});
