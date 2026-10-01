@echo off
title Vamos Pues - Iniciar
set "RAIZ=%~dp0"
echo ========================================================
echo        INICIANDO VAMOS PUES - ENCUENTRA TU PROXIMO PARCHE
echo ========================================================
echo.

rem Revisar que este computador tenga lo necesario antes de arrancar
set "FALTA="
where java >nul 2>&1
if errorlevel 1 (
    echo  [X] Falta Java 21 o superior. Descargalo de: https://adoptium.net/
    set "FALTA=1"
)
where npm >nul 2>&1
if errorlevel 1 (
    echo  [X] Falta Node.js. Descargalo de: https://nodejs.org/  ^(version LTS^)
    set "FALTA=1"
)
if defined FALTA (
    echo.
    echo Instala lo que falta, reinicia el computador y vuelve a abrir este archivo.
    pause
    exit /b 1
)

echo [1/3] Iniciando backend (Spring Boot, puerto 8086)...
netstat -ano | findstr /R /C:":8086 .*LISTENING" >nul
if %errorlevel%==0 (
    echo       El puerto 8086 ya esta en uso: el backend ya esta corriendo, no se abre otro.
) else (
    start "Vamos Pues - Backend" /D "%RAIZ%vamos-pues-backend" cmd /k mvnw.cmd spring-boot:run
)

echo [2/3] Iniciando frontend (React + Vite, puerto 5173)...
netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if %errorlevel%==0 (
    echo       El puerto 5173 ya esta en uso: el frontend ya esta corriendo, no se abre otro.
) else (
    if not exist "%RAIZ%vamos-pues-frontend\node_modules" (
        start "Vamos Pues - Frontend" /D "%RAIZ%vamos-pues-frontend" cmd /k "npm install && npm run dev"
    ) else (
        start "Vamos Pues - Frontend" /D "%RAIZ%vamos-pues-frontend" cmd /k npm run dev
    )
)

echo [3/3] Abriendo el navegador en unos segundos...
timeout /t 15 /nobreak >nul
start "" http://localhost:5173/
echo.
echo ========================================================
echo  Para que otras personas entren (mismo WiFi), comparte:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do for /f "tokens=*" %%b in ("%%a") do echo      http://%%b:5173/
echo ========================================================
echo.
echo Listo. Para detener todo, cierra las ventanas "Vamos Pues - Backend" y "Vamos Pues - Frontend".
pause
