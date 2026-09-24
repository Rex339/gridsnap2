@echo off
setlocal
cd /d "%~dp0"
echo Void Studio for Windows
 echo.
echo This launcher opens the local Void Studio web workspace.
echo Start the VoidVerse website in IIS Express, then return here.
start "" "http://localhost:port/VoidVerse/Studio.html"
pause
