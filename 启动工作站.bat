@echo off
chcp 65001 >nul
title 嵩山一号 · 科研工作站
cd /d "%~dp0"

set PORT=8901

echo ============================================
echo   嵩山一号 · 科研工作站
echo   本机地址： http://localhost:%PORT%
echo   关闭此窗口即停止服务
echo ============================================
echo.

start "" http://localhost:%PORT%/index.html

where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server %PORT% --bind 127.0.0.1
    goto :end
)

if exist "C:\Users\1\.workbuddy\binaries\python\envs\default\Scripts\python.exe" (
    "C:\Users\1\.workbuddy\binaries\python\envs\default\Scripts\python.exe" -m http.server %PORT% --bind 127.0.0.1
    goto :end
)

echo 未找到 Python。请安装 Python，或手动在本目录执行：
echo   python -m http.server %PORT%
echo.
echo 也可以直接用浏览器打开 index.html（但 AI 导师与部分功能会因 file:// 限制失效）。

:end
pause
