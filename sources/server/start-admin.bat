@echo off
setlocal enabledelayedexpansion
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
if not exist main.html ( call :create )
echo getting local ip...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4 Address"') do (
    set local=%%a
	set "local=!local:~1!"
)
cls
echo if server didnt start running
echo or if you wanna access it from other device same wifi, 
echo you can access it via http://%local%:8000 from browser
echo.
echo press ctrl+c or close this window to stop the server...
start http://%local%:8000
php\php.exe -S %local%:8000 -d memory_limit=512M > nul 2>&1
exit

:create
rem rename the source pattern and tokens to what you need
set "sourcePattern=Degrees of Lewdity *.html"
set "latestVersion=0"
set "latestFile="

for %%F in (%sourcePattern%) do (
   for /f "tokens=2,3,4 delims=." %%V in ("%%~nF") do (
        set "version=%%V%%W%%X"
		echo !version!
        if !version! gtr !latestVersion! (
            set "latestVersion=!version!"
            set "latestFile=%%F"
        )
    )
)
if defined latestFile (
    ren "!latestFile!" "main.html"
    echo Renamed "!latestFile!" to "main.html"
) else (
    echo automated rename file failed.
	echo please rename latest DoL html name to main.html
	pause
)
goto :EOF