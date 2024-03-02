@echo off
::init
del _compiled\index.offline.html
del _compiled\index.server.php
del _compiled\base.php
echo setting cheat version? current 1.0.10
set /p cheatVer=
echo testedOn? .4.5.3
set /p testedOn=
::base
copy index.min.php _compiled\base.php
echo ^<script^> >> _compiled\base.php
echo setTimeout(function() { >> _compiled\base.php
echo var debug=0; >>_compiled\base.php
echo var cheatVer="%cheatVer%"; >>_compiled\base.php
echo var testedOn="%testedOn%"; >>_compiled\base.php
:: server ver
copy _compiled\base.php _compiled\index.server.php
echo var isServer=1; >>_compiled\index.server.php
copy _compiled\index.server.php + main.min.js _compiled\index.server.php
echo }, 1000); >> _compiled\index.server.php
echo ^</script^> >> _compiled\index.server.php
::offline
copy _compiled\base.php _compiled\base.offline.html
echo var isServer=0; >>_compiled\base.offline.html
copy _compiled\base.offline.html + main.min.js _compiled\base.offline.html
echo }, 1000); >> _compiled\base.offline.html
echo ^</script^> >> _compiled\base.offline.html
copy _compiled\main.html+_compiled\base.offline.html _compiled\index.offline.html
del _compiled\base.offline.html
del _compiled\base.php
pause