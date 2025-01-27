@echo off

:: Check if Node.js is installed
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/.
    exit /b 1
)

echo Installing dependencies...
npm install express http ws body-parser axios path

echo Dependencies installed successfully.

echo Setup complete. You can start the server with: npm start.