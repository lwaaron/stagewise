@echo off
chcp 65001 >nul
title Stagewise 工具栏启动器

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     🐙 Stagewise 启动器                      ║
echo ║                    通用本地工具栏启动器                       ║
echo ║                      by OctopusDev                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 检查Node.js是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo 📥 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 显示Node.js版本
echo 🟢 Node.js 版本:
node --version
echo.

:: 检查并安装依赖
echo 📦 正在检查依赖包...
if not exist "node_modules" (
    echo 🔄 首次运行，正在安装依赖包...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        echo 💡 请确保网络连接正常并重试
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
    echo.
)

:: 启动脚本
echo 🚀 正在启动 Stagewise 工具栏...
echo.
node launchStagewise.js

:: 脚本结束时暂停
echo.
echo 📌 按任意键退出...
pause >nul 