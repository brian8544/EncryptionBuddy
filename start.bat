@echo off

node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/.
    exit /b 1
)

cd /d "%~dp0"

call npm install
call npm start

pause
exit