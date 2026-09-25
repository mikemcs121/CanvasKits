@echo off
rem Opens Kit Viewer: a Chromium (Edge or Chrome) app window for browsing the kits.
where node >nul 2>nul || (echo Kit Viewer needs Node.js on the PATH. & pause & exit /b 1)
node "%~dp0server.cjs"
