@echo off
copy "..\sources\_compiled\index.offline.html" "offline\DoL 0.4.5.3 - cheat non server version.html"
copy "..\sources\_compiled\index.server.php" "server\index.php"
copy changelog*.txt offline
copy changelog*.txt server
pause