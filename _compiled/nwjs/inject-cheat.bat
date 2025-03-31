@echo off
setlocal enabledelayedexpansion

:: Init
if not exist info.ini goto fail
if exist "..\Degrees of Lewdity.html" (
    if not exist bak mkdir bak
    if not exist bak\injected (
        copy "..\Degrees of Lewdity.html" bak >NUL
    )
) else goto fail

:: Inject
echo injecting...
copy "..\Degrees of Lewdity.html"+"_compiled/nwjs/cheat.html" "..\Degrees of Lewdity.html" >NUL
echo. >bak\injected

:end
echo Cheat injected, run restore.bat to restore the game.
pause
exit

:fail
echo Injecting failed, make sure you extract the file in the game directory.
pause
exit
