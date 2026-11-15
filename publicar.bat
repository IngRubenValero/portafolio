@echo off
rem ============================================================
rem  Publica el portafolio en GitHub Pages desde Windows.
rem  Doble clic para ejecutar. Requiere Git for Windows.
rem  Equivale a:  bash publicar.sh
rem ============================================================
setlocal
cd /d "%~dp0"

set "PF86=%ProgramFiles(x86)%"
set "BASH="
if exist "%ProgramFiles%\Git\bin\bash.exe" set "BASH=%ProgramFiles%\Git\bin\bash.exe"
if not defined BASH if exist "%PF86%\Git\bin\bash.exe" set "BASH=%PF86%\Git\bin\bash.exe"
if not defined BASH if exist "%LOCALAPPDATA%\Programs\Git\bin\bash.exe" set "BASH=%LOCALAPPDATA%\Programs\Git\bin\bash.exe"

if not defined BASH (
    echo.
    echo ERROR: no se encontro Git Bash.
    echo Instala Git for Windows desde https://git-scm.com/download/win
    echo o ejecuta "bash publicar.sh" desde Git Bash.
    echo.
    pause
    exit /b 1
)

echo Ejecutando publicar.sh con:
echo   %BASH%
echo.
"%BASH%" publicar.sh
set "CODE=%ERRORLEVEL%"
echo.
if not "%CODE%"=="0" (
    echo La publicacion NO se completo. Revisa el mensaje de arriba.
) else (
    echo Publicacion enviada. GitHub Pages tarda 1-2 minutos en reconstruir.
    echo https://ingrubenvalero.github.io/portafolio/
)
echo.
pause
exit /b %CODE%
