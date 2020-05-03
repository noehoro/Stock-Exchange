@echo off
set LOCALHOST=%COMPUTERNAME%
if /i "%LOCALHOST%"=="NoeSurface" (taskkill /f /pid 19828)
if /i "%LOCALHOST%"=="NoeSurface" (taskkill /f /pid 12292)

del /F cleanup-ansys-NoeSurface-12292.bat
