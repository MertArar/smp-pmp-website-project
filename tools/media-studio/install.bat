@echo off
setlocal
cd /d "%~dp0"
python -m venv .venv
if errorlevel 1 goto error
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto error
echo Kurulum tamamlandi. start.bat ile acabilirsiniz.
pause
exit /b 0
:error
echo Kurulum tamamlanamadi. Python 3.11 veya ustu gereklidir.
pause
exit /b 1
