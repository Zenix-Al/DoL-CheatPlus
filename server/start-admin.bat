@echo off
setlocal enabledelayedexpansion
title PHP Local Server Admin
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:-------------------------------------- 

cd %~dp0


echo ==========================================
echo Getting local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4 Address"') do (
    set local=%%a
    set "local=!local:~1!"  REM Remove leading space
)
echo Done.
echo.

:: Find first HTML file
set "HTML_FILE="
for %%f in (*.html) do (
    if not defined HTML_FILE set "HTML_FILE=%%f"
)

:: Default to index.html if exists
if exist index.html set "HTML_FILE=index.html"

:: If no HTML file found, default to empty string
if not defined HTML_FILE set "HTML_FILE="

:: Check if PHP is available globally
echo Checking PHP...
php -v >nul 2>&1
IF !ERRORLEVEL! EQU 0 (
    echo Using system-installed PHP.
    set PHP_CMD=php
    goto ask_debug
)

:: Check if portable PHP exists
if exist php\php.exe (
    echo Using portable PHP.
    set PHP_CMD=php\php.exe
    goto ask_debug
)

:: PHP not found, display an error and exit
echo ERROR: PHP not found!
echo Ensure the 'php' folder is fully extracted or run 'install.bat' to install PHP globally.
goto exit

:ask_debug
echo.
choice /c YN /n /m "Enable debug mode? (Y/N): "
if !ERRORLEVEL! EQU 1 (
    set DEBUG=1
) else (
    set DEBUG=0
)

:start
cls
echo ==========================================
echo Server is starting...
echo If the server doesn't start or you want to access it from another device on the same WiFi:
if defined HTML_FILE (
    echo Visit: http://%local%:8000/%HTML_FILE% from your browser.
) else (
    echo Visit: http://%local%:8000 from your browser.
)
echo ==========================================
echo Press Ctrl+C or close this window to stop the server.

:: Open browser with found HTML file
if defined HTML_FILE (
    start http://%local%:8000/%HTML_FILE%
) else (
    start http://%local%:8000
)

:: Start PHP server
if !DEBUG! EQU 1 (
    echo Debug enabled.
    %PHP_CMD% -S %local%:8000 -d memory_limit=512M
) else (
    echo Debug disabled.
    %PHP_CMD% -S %local%:8000 -d memory_limit=512M > nul 2>&1
)

:exit
pause
exit /b 0
