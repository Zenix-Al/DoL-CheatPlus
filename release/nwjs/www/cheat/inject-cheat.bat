@echo off
setlocal enabledelayedexpansion
:: init
if not exist info.ini goto fail
if exist base.html del base.html
if not exist cheat.js goto fail
if not exist "..\Degrees of Lewdity.html" goto fail
if not exist bak mkdir bak
if exist bak\injected goto end
copy "..\Degrees of Lewdity.html" bak >NUL
::inject
echo injecting...
set lap=0
for /F "delims=" %%x in (info.ini) do (
	if !lap!==0 set cheatVer=%%x
	if !lap!==1 set testedOn=%%x
	set /a lap=lap+1
)
::base
copy cheat-interface.html base.html >NUL
echo ^<script^> >> base.html
echo var convertStringIndexArrayToObject; >>base.html
echo setTimeout(function() { >>base.html
echo var DEBUG=false; >>base.html
echo var cheatVer="!cheatVer!"; >>base.html
echo var testedOn="!testedOn!"; >>base.html
echo var isServer=0; >>base.html
copy base.html + cheat.js base.html >NUL
echo. >> base.html
echo }, 1000); >>base.html
echo ^</script^> >> base.html
copy "..\Degrees of Lewdity.html"+base.html "..\Degrees of Lewdity.html" >NUL
if exist base.html del base.html
echo. >bak\injected

:end
echo cheat injected, run restore.bat to restore the game.
pause
exit

:fail
echo injecting fail, make sure you extract the file in the game directory.
pause
exit