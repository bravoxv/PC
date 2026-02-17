@echo off
setlocal

echo ========================================
echo   ACTUALIZADOR DE WIDGETS PC (ELECTRON)
echo ========================================
echo.

echo [1/2] Limpiando carpeta dist_electron...
if exist dist_electron rmdir /s /q dist_electron

echo [2/2] Compilando y Empaquetando Aplicacion...
call npm run build

echo.
echo ========================================
echo   PROCESO TERMINADO CON EXITO
echo   Tu nuevo .exe esta en: dist_electron\Widgets PC 1.0.1.exe
echo ========================================
pause
