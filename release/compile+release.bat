@echo off
cd ../sources
start cmd /c "compile.bat"
:wait
timeout /t 1 /nobreak >NUL
if not exist _compiled\online\main.js goto wait
cd ../release
echo..
echo..
echo copying files to release..
copy "..\sources\_compiled\nwjs" "nwjs\www\cheat"
copy "..\sources\_compiled\offline\game.html" "offline\DoL 0.4.5.3 - cheatPlus.html"
copy "..\sources\_compiled\online\main.js" "online\online DoL - cheatPlus.js"
copy "..\sources\_compiled\server\index.php" "server\index.php"
copy "..\sources\_compiled\server\start.bat" "server\start.bat"
copy "..\sources\_compiled\server\start-admin.bat" "server\start-admin.bat"
echo done!
echo.
echo.
echo operation complete