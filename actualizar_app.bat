@echo off
setlocal enabledelayedexpansion
title Actualizador Widgets PC

cd /d "%~dp0"

echo ========================================
echo   ACTUALIZADOR DE WIDGETS PC
echo ========================================
echo.

:: 1. Verificar si Node.js está instalado
node -v >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Por favor, instala Node.js antes de continuar.
    pause
    exit /b
)

:: 2. Instalar dependencias
echo [1/3] Instalando dependencias...
call npm install --no-fund --no-audit

:: 3. Limpiar compilaciones antiguas
echo [2/3] Limpiando archivos antiguos...
if exist dist rmdir /s /q dist
if exist dist_electron rmdir /s /q dist_electron

:: 4. Compilar
echo [3/3] Compilando aplicacion...
call npm run build

echo.
echo ========================================
echo   PROCESO COMPLETADO
echo ========================================
pause
