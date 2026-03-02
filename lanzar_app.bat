@echo off
setlocal
title Lanzador Widgets PC

echo.
echo ------------------------------------------
echo       INICIANDO WIDGETS PC
echo ------------------------------------------
echo.

:: 1. Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Node.js no esta instalado en este equipo.
    echo [!] Por favor, instala Node.js (LTS recomendado) desde https://nodejs.org/
    echo.
    pause
    exit /b
)

:: 2. Comprobar si existe la carpeta node_modules
if not exist node_modules (
    echo [!] No se han instalado las dependencias.
    echo [!] Ejecutando 'npm install' por primera vez...
    call npm install --no-fund --no-audit
)

echo [1/2] Iniciando servidor de widgets localmente...
:: Iniciamos Vite en segundo plano
start /b "" npm run dev

echo [2/2] Lanzando ventana de aplicacion...
:: Esperamos unos segundos para asegurar que el servidor Vite esta listo
echo Esperando al servidor...
timeout /t 3 /nobreak > nul

:: Lanzamos Electron
call npm run electron:dev

echo.
echo Aplicacion cerrada. 
echo Limpiando procesos de fondo...
:: Matamos los procesos de Node iniciados por este script para no dejar el servidor Vite colgado
taskkill /F /FI "WINDOWTITLE eq Lanzador Widgets PC" /T > nul 2>&1
echo Listo.
pause
