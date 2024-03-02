@echo off
cd ../sources
start cmd /c "_quick_compile.bat"
:wait
timeout /t 1 /nobreak >NUL
if not exist _compiled\index.offline.html goto wait
cd ../release
echo..
echo..
echo copying files to release..
copy "..\sources\_compiled\index.offline.html" "offline\DoL 0.4.5.3 - cheat non server version.html"
copy "..\sources\_compiled\index.server.php" "server\index.php"
del offline\changelog*.txt
del server\changelog*.txt
copy changelog*.txt offline
copy changelog*.txt server
echo done!
echo.
echo.
echo operation complete