
// CAMUFLAJE DE NIVEL MILITAR PARA IFRAMES/WEBVIEWS
// Este script se inyecta antes de que cargue cualquier página

console.log('--- ACTIVANDO MODO FANTASMA ---');

// 1. Eliminar rastro de WebDriver (la bandera principal de los bots)
delete Object.getPrototypeOf(navigator).webdriver;
Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined,
    configurable: true
});

// 2. Camuflar el User-Agent para que parezca Chrome 120 REAL
const originalUA = navigator.userAgent;
Object.defineProperty(navigator, 'userAgent', {
    get: () => originalUA.replace('Electron', '').replace(/Electron\/[0-9\.]+ /, ''),
    configurable: true
});

// 3. Simular plugins (Electron vacía esto, Chrome tiene varios)
Object.defineProperty(navigator, 'plugins', {
    get: () => {
        const p = [
            { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
            { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
        ];
        // Propiedades mágicas para pasar validaciones
        p.item = (i) => p[i];
        p.namedItem = (name) => p.find(x => x.name === name);
        p.refresh = () => { };
        return p;
    },
    configurable: true
});

// 4. Parchear window.chrome (Electron lo tiene diferente)
if (!window.chrome) {
    window.chrome = {};
}
if (!window.chrome.runtime) {
    window.chrome.runtime = {};
}

// 5. Engañar a las pruebas de permisos
const originalQuery = window.navigator.permissions.query;
window.navigator.permissions.query = (parameters) => (
    parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
);

console.log('--- MODO FANTASMA ACTIVADO ---');
