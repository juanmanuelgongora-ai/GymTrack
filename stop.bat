@echo off
title GymTrack - Deteniendo Servidores
echo.
echo Deteniendo servidores de GymTrack...
echo.
taskkill /FI "WINDOWTITLE eq GymTrack*" /F >nul 2>&1
taskkill /FI "IMAGENAME eq php.exe" /F >nul 2>&1
taskkill /FI "IMAGENAME eq node.exe" /F >nul 2>&1
echo Servidores detenidos.
pause
