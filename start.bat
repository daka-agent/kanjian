@echo off
echo ============================================
echo   Starting local server for "Kan Jian" game
echo   Open browser: http://127.0.0.1:8765
echo   Press Ctrl+C to stop
echo ============================================
cd /d "%~dp0"
node server.js
pause
