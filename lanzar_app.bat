@echo off
title Lanzador Widgets PC
echo ------------------------------------------
echo       INICIANDO WIDGETS PC
echo ------------------------------------------

:: Comprobar si existe la carpeta node_modules
if not exist node_modules (
    echo [!] No se han instalado las dependencias.
    echo [!] Ejecutando 'npm install' por primera vez...
    call npm install
)

echo [1/2] Iniciando servidor de widgets...
:: Iniciamos Vite en segundo plano
start /b "" npm run dev

echo [2/2] Abriendo ventana de aplicacion...
:: Esperamos 3 segundos para que Vite arranque
timeout /t 3 /nobreak > nul

:: Lanzamos Electron (esto bloquea el .bat hasta que se cierre la app)
call npm run electron:dev

echo.
echo Aplicacion cerrada. 
echo Limpiando procesos de fondo...
:: Matamos los procesos de Node iniciados por este script para no dejar el servidor Vite colgado
taskkill /F /FI "WINDOWTITLE eq Lanzador Widgets PC" /T > nul 2>&1
echo Listo.
pause
