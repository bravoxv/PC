# Widgets PC

Esta es la versión para PC de la aplicación Widgets Celular. Ha sido adaptada para funcionar como un programa de escritorio independiente utilizando **Electron** y **Vite**.

## Requisitos

- [Node.js](https://nodejs.org/) instalado.

## Instalación

1. Entra en la carpeta `PC`:
   ```bash
   cd PC
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Desarrollo

Para ejecutar la aplicación en modo desarrollo:

1. Inicia el servidor de Vite:
   ```bash
   npm run dev
   ```
2. En otra terminal, inicia Electron:
   ```bash
   npm run electron:dev
   ```

## Construcción (Build)

Para generar la aplicación ejecutable (.exe):

1. Asegúrate de tener las dependencias instaladas:
   ```bash
   npm install
   ```
2. Ejecuta el comando de construcción:
   ```bash
   npm run build
   ```
Esto creará una carpeta llamada `dist_electron` que contendrá el archivo `Widgets PC.exe` (versión portable).

## Cambios realizados
- Se configuró `electron-builder` para generar ejecutables portables.
- Se eliminaron las dependencias de Capacitor (StatusBar, Browser).
- Se configuró la apertura de enlaces externos para que usen el navegador del sistema.
- Se añadió la lógica de Electron para manejar la ventana principal.
