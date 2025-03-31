@echo off
setlocal enabledelayedexpansion

title Add PHP to Windows PATH
echo ==========================================
echo This script will add PHP to your Windows PATH.
echo This will allow you to run PHP globally without copying the PHP folder for each local site.
echo.
echo If you prefer to keep PHP portable, just run `start.bat` and manually copy the PHP folder to each site.
echo ==========================================
echo.
choice /c YN /n /m "Press Y to continue. Y/N "
if !errorlevel! equ 0 (
	goto exit
) 
echo checking if php in path already...
php -v >nul 2>&1
IF !errorlevel! EQU 0 (
    echo PHP is already in your system PATH.
    echo No changes are needed.
    goto exit
)
echo php not exist.
echo getting php path...
if not exist php\php.exe (
	echo php\php.exe doesnt exist
	goto exit
)
set PHP_PATH=!CD!\php
setx PATH "!PATH!;!PHP_DIR!"
if %ERRORLEVEL% EQU 0 (
    echo PHP has been successfully added to your system PATH!
    echo Restart your command prompt or PC for changes to take effect.
) else (
    echo ERROR: Failed to update PATH. Try running this script as Administrator.
)

:exit
pause
exit /b 0