@echo off
if not exist "bak\injected" (
    echo No injection detected. Nothing to restore.
    pause
    exit
)

copy "bak\Degrees of Lewdity.html" "..\Degrees of Lewdity.html" >NUL
del "bak\injected" >NUL
echo Game restored successfully!
pause
exit
