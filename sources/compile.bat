@echo off
setlocal enabledelayedexpansion
::init
for /F "delims=" %%x in (required.ini) do (
	if not exist "%%x" (
		set error=One of the required file is not found "%%x"
		goto fail
	)
)

echo deleting compiled trace...
rmdir /s /q _compiled\nwjs >NUL
rmdir /s /q _compiled\offline >NUL
rmdir /s /q _compiled\online >NUL
rmdir /s /q _compiled\server >NUL
del _compiled\main.min.js >NUL
del _compiled\main.min.css >NUL
del _compiled\base.php >NUL
echo deleted!

echo ----------------------------------------
echo.
echo making new js and css...
cd includes
start cmd /c "combine.bat"
start cmd /c "minifycss.bat"
cd ..
:wait
timeout /t 1 /nobreak >NUL
if not exist _compiled\main.min.js goto wait
if not exist _compiled\main.min.css goto wait
echo new js and css created!
echo ----------------------------------------
echo.
echo compiling...
mkdir _compiled\nwjs >NUL
mkdir _compiled\offline >NUL
mkdir _compiled\online >NUL
mkdir _compiled\server >NUL 
set lap=0
for /F "delims=" %%x in (info.ini) do (
	if !lap!==0 set cheatVer=%%x
	if !lap!==1 set testedOn=%%x
	set /a lap=lap+1
)
echo compiling base...
::base
echo ^<style^> > _compiled\base.php
copy _compiled\base.php+_compiled\main.min.css _compiled\base.php >NUL
echo. >> _compiled\base.php
echo ^</style^> >> _compiled\base.php
copy _compiled\base.php + base\index.php _compiled\base.php >NUL
echo ^<script^> >> _compiled\base.php
echo var convertStringIndexArrayToObject; >>_compiled\base.php
echo var DEBUG=false; >>_compiled\base.php
echo setTimeout(function() { >>_compiled\base.php
echo var cheatVer="!cheatVer!"; >>_compiled\base.php
echo var testedOn="!testedOn!"; >>_compiled\base.php

:: server ver
echo compiling server version...
copy _compiled\base.php _compiled\server\index.php >NUL
echo var isServer=1; >>_compiled\server\index.php
copy _compiled\server\index.php + _compiled\main.min.js _compiled\server\index.php >NUL
echo. >> _compiled\server\index.php
echo }, 1000); >>_compiled\server\index.php
echo ^</script^> >> _compiled\server\index.php
copy server\start-admin.bat _compiled\server >NUL
copy server\start.bat _compiled\server >NUL
copy server\mystart.bat _compiled\server >NUL

::offline
echo compiling offline version...
copy _compiled\base.php _compiled\offline\base.html >NUL
echo var isServer=0; >>_compiled\offline\base.html
copy _compiled\offline\base.html + _compiled\main.min.js _compiled\offline\base.html >NUL
echo. >> _compiled\offline\base.html
echo }, 1000); >>_compiled\offline\base.html
echo ^</script^> >> _compiled\offline\base.html
copy base\game.html+_compiled\offline\base.html _compiled\offline\game.html >NUL
del _compiled\offline\base.html

::nwjs
echo compiling NWJS version...
copy _compiled\main.min.js _compiled\nwjs\cheat.js > NUL
echo ^<style^> > _compiled\nwjs\cheat-interface.html
copy _compiled\nwjs\cheat-interface.html+_compiled\main.min.css _compiled\nwjs\cheat-interface.html >NUL
echo. >> _compiled\nwjs\cheat-interface.html
echo ^</style^> >> _compiled\nwjs\cheat-interface.html
copy _compiled\nwjs\cheat-interface.html + base\index.php _compiled\nwjs\cheat-interface.html >NUL
copy nwjs\inject-cheat.bat _compiled\nwjs\ > NUL
copy nwjs\restore.bat _compiled\nwjs\ > NUL
copy info.ini _compiled\nwjs\ > NUL

::online
echo compiling online version...
copy online\header.js _compiled\online\main.js > NUL
echo. >>_compiled\online\main.js
echo (function() { >> _compiled\online\main.js
copy _compiled\online\main.js+online\interface.js _compiled\online\main.js > NUL
echo. >>_compiled\online\main.js
echo var convertStringIndexArrayToObject; >>_compiled\online\main.js
echo setTimeout(function() { >>_compiled\online\main.js
echo var DEBUG=false; >>_compiled\online\main.js
echo var isServer=0; >>_compiled\online\main.js
echo var cheatVer="!cheatVer!"; >>_compiled\online\main.js
echo var testedOn="!testedOn!"; >>_compiled\online\main.js
copy _compiled\online\main.js + _compiled\main.min.js _compiled\online\main.js >NUL
echo. >> _compiled\online\main.js
echo }, 1000); >>_compiled\online\main.js
echo })(); >> _compiled\online\main.js
echo compiled!

echo ----------------------------------------
echo.
echo complete!
exit

:fail
echo !error!
pause
