@echo off
cd ../sources
start cmd /c "compile.bat"
:wait
timeout /t 1 /nobreak >NUL
if not exist _compiled\online\main.js goto wait
cd ../release
echo.
echo.
release.bat

