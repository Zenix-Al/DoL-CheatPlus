@echo off
setlocal enabledelayedexpansion
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
start http://%local%:8000/index.server.php
php -S %local%:8000 -d memory_limit=512M > nul 2>&1
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
    echo No matching files found.
	pause
	exit
)
goto :EOF