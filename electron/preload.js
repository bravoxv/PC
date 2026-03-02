const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openDevTools: () => ipcRenderer.send('open-devtools'),
    openExternal: (url, browser) => ipcRenderer.send('open-external', { url, browser }),
    clearData: () => ipcRenderer.send('clear-data'),
    openMiniPlayer: (url, name) => ipcRenderer.send('open-mini-player', { url, name })
});
