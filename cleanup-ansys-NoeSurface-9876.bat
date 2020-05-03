@echo off
set LOCALHOST=%COMPUTERNAME%
if /i "%LOCALHOST%"=="NoeSurface" (taskkill /f /pid 9576)
if /i "%LOCALHOST%"=="NoeSurface" (taskkill /f /pid 9876)

del /F cleanup-ansys-NoeSurface-9876.bat
