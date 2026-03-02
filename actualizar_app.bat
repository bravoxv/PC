@echo off
setlocal
title Actualizador Widgets PC

echo ========================================
echo   ACTUALIZADOR DE WIDGETS PC (ELECTRON)
echo ========================================
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

:: 2. Instalar o actualizar dependencias (Vital si se descarga en otra PC)
echo [1/3] Verificando e instalando dependencias (npm install)...
call npm install --no-fund --no-audit

:: 3. Limpiar compilaciones antiguas para evitar conflictos
echo [2/3] Limpiando archivos temporales y carpetas de salida...
if exist dist rmdir /s /q dist
if exist dist_electron rmdir /s /q dist_electron

:: 4. Compilar el proyecto y generar el empaquetado final
echo [3/3] Compilando y Generando el Instalador Final...
call npm run build

echo.
echo ========================================
echo   PROCESO COMPLETADO CON EXITO
echo   El archivo ejecutable (.exe) se ha generado.
echo   Lo encuentras en: dist_electron\Widgets PC 1.0.1.exe
echo ========================================
echo.
echo Ya puedes mover o usar tu aplicacion actualizada.
pause
