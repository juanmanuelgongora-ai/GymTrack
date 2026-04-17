@echo off
title GymTrack - Servidor Completo
echo.
echo ============================================
echo    GYMTRACK - Iniciando Servidor Completo
echo ============================================
echo.
echo [1/2] Iniciando Backend (Laravel) en puerto 8000...
echo [2/2] Iniciando Frontend (Vite) en puerto 5173...
echo.
echo Backend API:  http://127.0.0.1:8000
echo Frontend:     http://localhost:5173
echo.
echo Presiona Ctrl+C para detener ambos servidores.
echo ============================================
echo.

REM Start Laravel backend in the background
start "GymTrack Backend" /D "%~dp0backend" cmd /c "php artisan serve --host=127.0.0.1 --port=8000"

REM Give the backend a moment to start
timeout /t 2 /nobreak >nul

REM Start Vite frontend (blocking - keeps the window open)
cd /D "%~dp0frontend"
call npx vite --host
