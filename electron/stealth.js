
// CAMUFLAJE AVANZADO (Stealth 3.0)
// Este script se inyecta antes de que las webs puedan detectar que es Electron

// 1. Ocultar WebDriver
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

// 2. Camuflaje de Client Hints (VITAL para Google/Chrome moderno)
if (!navigator.userAgentData) {
    const userAgentData = {
        brands: [
            { brand: 'Not A(Brand', version: '99' },
            { brand: 'Google Chrome', version: '120' },
            { brand: 'Chromium', version: '120' }
        ],
        mobile: false,
        platform: 'Windows'
    };
    Object.defineProperty(navigator, 'userAgentData', {
        get: () => userAgentData,
        configurable: true
    });
}

// 3. Simular Lenguajes (Crucial para parecer una instalación real)
Object.defineProperty(navigator, 'languages', {
    get: () => ['es-ES', 'es', 'en-US', 'en'],
    configurable: true
});

// 4. Parchear window.chrome (Google busca esto obsesivamente)
window.chrome = {
    app: {
        isInstalled: false,
        InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' },
        RunningState: { CANNOT_RUN: 'cannot_run', READY_TO_RUN: 'ready_to_run', RUNNING: 'running' }
    },
    runtime: {
        OnInstalledReason: { CHROME_UPDATE: 'chrome_update', INSTALL: 'install', SHARED_MODULE_UPDATE: 'shared_module_update', UPDATE: 'update' },
        OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' },
        PlatformArch: { ARM: 'arm', ARM64: 'arm64', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' },
        PlatformNaclArch: { ARM: 'arm', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' },
        PlatformOs: { ANDROID: 'android', CROS: 'cros', LINUX: 'linux', MACOS: 'mac', OPENBSD: 'openbsd', WIN: 'win' }
    }
};

// 5. Simular plugins estándar de Chrome
Object.defineProperty(navigator, 'plugins', {
    get: () => [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
        { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
    ],
    configurable: true
});

// 6. Engañar Permissions API
const originalQuery = window.navigator.permissions.query;
window.navigator.permissions.query = (parameters) => (
    parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
);
