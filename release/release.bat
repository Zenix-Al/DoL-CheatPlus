@echo off
echo current version of the game :
set /p version=
echo copying files to release..
copy "..\sources\_compiled\nwjs" "nwjs\www\cheat"
copy "..\sources\_compiled\offline\game.html" "offline\DoL %version% - cheatPlus.html"
copy "..\sources\_compiled\online\main.js" "online\online DoL - cheatPlus.js"
copy "..\sources\_compiled\server\index.php" "server\index.php"
copy "..\sources\_compiled\server\start.bat" "server\start.bat"
copy "..\sources\_compiled\server\start-admin.bat" "server\start-admin.bat"
echo done!
echo.
echo.
echo operation complete