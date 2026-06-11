@echo off
title GymTrack - Servidor Completo
echo.
echo ============================================
echo    GYMTRACK - Iniciando Servidor Completo
echo ============================================
echo.
echo [1/3] Iniciando Backend (Laravel) en puerto 8000...
echo [2/3] Iniciando 6 Microservicios...
echo [3/3] Iniciando Frontend (Vite) en puerto 5173...
echo.
echo Backend API:  http://127.0.0.1:8000
echo Frontend:     http://localhost:5173
echo MS Reportes:  http://localhost:5001
echo MS Calc:      http://localhost:3000
echo MS Chat:      http://localhost:3006
echo MS Notif:     http://localhost:3005
echo MS Acceso:    http://localhost:3007
echo MS Rutinas:   http://localhost:3008
echo.
echo Presiona Ctrl+C para detener ambos servidores.
echo ============================================
echo.

REM Start Laravel backend in the background
start "GymTrack Backend" /D "%~dp0backend" cmd /c "php artisan serve --host=127.0.0.1 --port=8000"

REM Start Microservicios
start "GymTrack MS Reportes" /D "%~dp0microservicio-reportes" cmd /c "npm start"
start "GymTrack MS Calculadora" /D "%~dp0microservicio-calculadora" cmd /c "npm start"
start "GymTrack MS Chat" /D "%~dp0microservicio-chat" cmd /c "npm start"
start "GymTrack MS Notificaciones" /D "%~dp0microservicio-notificaciones" cmd /c "npm start"
start "GymTrack MS Acceso" /D "%~dp0microservicio-acceso" cmd /c "npm start"
start "GymTrack MS Rutinas" /D "%~dp0microservicio-rutinas" cmd /c "npm start"

REM Give the backend a moment to start
timeout /t 2 /nobreak >nul

REM Start Vite frontend (blocking - keeps the window open)
cd /D "%~dp0frontend"
call npx vite --host
