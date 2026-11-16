@echo off
rem ============================================================
rem  Inicia el administrador del portafolio con doble clic.
rem  Levanta el servidor local y abre Chrome o Edge en el panel.
rem  Para detenerlo: cierra esta ventana o pulsa Ctrl+C.
rem ============================================================
setlocal
cd /d "%~dp0"

set "PY="
where py >nul 2>&1
if not errorlevel 1 set "PY=py -3"
if not defined PY (
    where python >nul 2>&1
    if not errorlevel 1 set "PY=python"
)
if not defined PY (
    where python3 >nul 2>&1
    if not errorlevel 1 set "PY=python3"
)
if not defined PY (
    echo.
    echo ERROR: no se encontro Python.
    echo Instala Python desde https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

set "PORT=8766"
:findport
netstat -ano 2>nul | findstr /C:":%PORT% " | findstr /C:"LISTENING" >nul
if errorlevel 1 goto portfree
set /A PORT+=1
if %PORT% GTR 8770 goto portfull
goto findport

:portfull
echo ERROR: los puertos 8766 a 8770 estan ocupados.
echo Cierra el otro administrador y vuelve a intentarlo.
echo.
pause
exit /b 1

:portfree
set "URL=http://localhost:%PORT%/admin.html"
set "BROWSER="
set "PF86=%ProgramFiles(x86)%"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%PF86%\Google\Chrome\Application\chrome.exe" set "BROWSER=%PF86%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%PF86%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%PF86%\Microsoft\Edge\Application\msedge.exe"

echo.
echo Iniciando el administrador del portafolio...
echo   Servidor: http://localhost:%PORT%/
echo   Panel:    %URL%
echo.
echo IMPORTANTE: pulsa "Conectar carpeta del proyecto" y elige la RAIZ
echo (la carpeta que contiene data/ e img/).
echo Para detener el servidor, cierra esta ventana o pulsa Ctrl+C.
echo.

if defined BROWSER (
    start "" "%BROWSER%" "%URL%"
) else (
    echo No se encontro Chrome ni Edge: se abrira el navegador por defecto.
    echo Si el panel no puede guardar, instala Chrome o Edge.
    start "" "%URL%"
)

%PY% -m http.server %PORT%
