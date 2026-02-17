const { app, BrowserWindow, shell, session, ipcMain } = require('electron');
const path = require('path');

// Desactivar el particionamiento de cookies y storage para que iframes y ventanas compartan TODO
app.commandLine.appendSwitch('disable-features', 'ThirdPartyStoragePartitioning,ThirdPartyCookiePhaseout');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('lang', 'es-ES');

function createWindow() {
    // 1. Identidad Maestra (Chrome 120 para Google y Twitch)
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    // 2. Configurar la sesión unificada por defecto
    const ses = session.defaultSession;
    ses.setUserAgent(userAgent);

    // ACTIVAR EL MOD DE CAMUFLAJE PRE-CARGA (Stealth.js)
    // Asegurarse de que stealth.js existe en la misma carpeta o ruta correcta
    ses.setPreloads([path.join(__dirname, 'stealth.js')]);

    // MOD DE RED FILTRADO: Google, Twitch y Kick
    const filter = { urls: ['<all_urls>'] }; // Aplicar a TODO para evitar fugas

    ses.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        const headers = details.requestHeaders;

        // 1. Identidad: Fingir ser Chrome 120 REAL (sin 'Electron' ni 'App')
        headers['User-Agent'] = userAgent;

        // 2. Origen: Engañar al servidor diciendo que venimos de su propio dominio (vital para iFrames)
        if (details.url.includes('twitch.tv')) {
            headers['Origin'] = 'https://www.twitch.tv';
            headers['Referer'] = 'https://www.twitch.tv/';
        } else if (details.url.includes('kick.com')) {
            headers['Origin'] = 'https://kick.com';
            headers['Referer'] = 'https://kick.com/';
        }

        // 3. Limpieza: Eliminar cualquier rastro de embebido/automatización
        delete headers['X-Requested-With'];
        delete headers['Sec-Fetch-Dest'];     // Ocultar que es un iframe/webview
        delete headers['Sec-Fetch-Mode'];     // Ocultar modo navigate
        delete headers['Sec-Fetch-Site'];     // Ocultar cross-site

        callback({ cancel: false, requestHeaders: headers });
    });

    // Permitir cookies de terceros y permisos (Cámara/Microfono etc)
    ses.setPermissionCheckHandler(() => true);

    // ROMPE-BLOQUEOS: Elimina las cabeceras que prohíben meter la web en la app
    ses.webRequest.onHeadersReceived((details, callback) => {
        const headers = details.responseHeaders;

        if (headers) {
            // Lista negra de cabeceras de seguridad que impiden iframes
            const badHeaders = [
                'x-frame-options',
                'content-security-policy',
                'x-content-security-policy',
                'frame-ancestors'
            ];

            // Eliminar todas las cabeceras malas (case-insensitive)
            Object.keys(headers).forEach(key => {
                if (badHeaders.includes(key.toLowerCase())) {
                    delete headers[key];
                }
            });

            // Fix de Cookies para sesiones cruzadas (SameSite=None)
            if (headers['set-cookie']) {
                headers['set-cookie'] = headers['set-cookie'].map(cookie => {
                    let c = cookie;
                    // Forzar SameSite=None; Secure para que funcionen dentro de la app
                    if (!c.toLowerCase().includes('samesite')) c += '; SameSite=None; Secure';
                    else c = c.replace(/SameSite=(Lax|Strict)/gi, 'SameSite=None');
                    if (!c.toLowerCase().includes('secure')) c += '; Secure';
                    return c;
                });
            }
        }
        callback({ cancel: false, responseHeaders: headers });
    });

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'Widgets PC',
        autoHideMenuBar: true,
        backgroundColor: '#0f172a',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false, // Permitir carga de contenidos externos
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true // EL PODER DE ELECTRON: Motor de navegación embebido
        },
    });

    // Abrir herramientas de desarrollo si es necesario
    ipcMain.on('open-devtools', () => {
        win.webContents.openDevTools({ mode: 'detach' });
    });

    // SISTEMA "VENTANA DE NAVEGADOR NATIVA": Abre popouts usando el motor del sistema en modo APP
    ipcMain.on('open-external', (event, url) => {
        console.log('[DEBUG] Lanzando Navegador Nativo en Modo App:', url);

        // Comando para Windows: start chrome --app=URL
        // Esto abre una ventana de Chrome "limpia" (sin pestañas ni barra de direcciones)
        // Funciona tambien con Edge si es el default, o Brave
        require('child_process').exec(`start chrome --app=${url}`, (err) => {
            if (err) {
                console.error('Error al abrir modo app, intentando metodo estandar:', err);
                shell.openExternal(url);
            }
        });
    });

    const isDev = !app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Manejador de ventanas internas
    win.webContents.setWindowOpenHandler(({ url }) => {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                width: 1000,
                height: 800,
                autoHideMenuBar: false,
                title: 'Navegador Interno - Widgets PC',
                backgroundColor: '#0f172a',
                parent: win,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    webSecurity: false, // Importante para que Twitch/Kick carguen aqui tambien sin iframe blocks
                    partition: 'persist:main',
                    preload: path.join(__dirname, 'preload.js') // Preload para la ventana hija tambien
                }
            }
        };
    });

    // Interceptores de navegación para dashboards
    const handleNavigation = (url) => {
        const u = url.toLowerCase();
        const keywords = ['kick.com/dashboard', '/popout/', 'stream-info', 'accounts.google.com', 'login', 'auth', 'twitch.tv/dashboard'];
        return keywords.some(k => u.includes(k));
    };

    win.webContents.on('will-navigate', (event, url) => {
        // En Electron "nativo" dejamos que navegue internamente, los filtros de headers se encargan del bloqueo
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
