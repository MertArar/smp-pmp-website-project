@echo off
setlocal
cd /d "%~dp0"
if exist "dist\desktop\Media Studio.exe" (
  start "" "dist\desktop\Media Studio.exe"
  exit /b
)
if exist "dist\Media Studio\Media Studio.exe" (
  start "" "dist\Media Studio\Media Studio.exe"
  exit /b
)
if exist ".venv\Scripts\pythonw.exe" (
  start "" ".venv\Scripts\pythonw.exe" "main.py"
  exit /b
)
python main.py
if errorlevel 1 pause
