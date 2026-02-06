@echo off
title Actualizar Widgets PC
echo ------------------------------------------
echo       CREANDO NUEVA VERSION (.EXE)
echo ------------------------------------------

:: Comprobar si existe la carpeta node_modules
if not exist node_modules (
    echo [!] No se han instalado las dependencias.
    echo [!] Instalando...
    call npm install
)

echo.
echo [1/1] Compilando y empaquetando aplicacion...
echo (Esto puede tardar un par de minutos, por favor espera)
echo.

call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ------------------------------------------
    echo       ¡ACTUALIZACION COMPLETADA!
    echo ------------------------------------------
    echo Tu nuevo archivo .exe esta listo en:
    echo Carpeta: PC\dist_electron
    echo.
) else (
    echo.
    echo [ERROR] Hubo un problema al crear la actualizacion.
    echo Revisa los mensajes de arriba.
)

pause
