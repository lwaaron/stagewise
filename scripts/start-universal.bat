@echo off
setlocal EnableDelayedExpansion

:: ============================================================================
:: Stagewise 统一启动器 - Windows批处理文件
:: 自动注入式工具栏启动系统
:: by OctopusDev
:: ============================================================================

title Stagewise 统一启动器

:: 设置控制台编码为UTF-8
chcp 65001 >nul

:: 设置颜色代码
set "COLOR_RESET="
set "COLOR_CYAN=^[36m"
set "COLOR_GREEN=^[32m"
set "COLOR_YELLOW=^[33m"
set "COLOR_RED=^[31m"
set "COLOR_BLUE=^[34m"

echo.
echo %COLOR_CYAN%╔══════════════════════════════════════════════════════════════╗%COLOR_RESET%
echo %COLOR_CYAN%║                   🚀 Stagewise 统一启动器                    ║%COLOR_RESET%
echo %COLOR_CYAN%║                 自动注入式工具栏启动系统                      ║%COLOR_RESET%
echo %COLOR_CYAN%║                      by OctopusDev                          ║%COLOR_RESET%
echo %COLOR_CYAN%╚══════════════════════════════════════════════════════════════╝%COLOR_RESET%
echo.
echo %COLOR_GREEN%🎯 特性：项目内所有页面自动显示工具栏（开发/测试模式）%COLOR_RESET%
echo.

:: 检查Node.js是否已安装
echo %COLOR_BLUE%🔍 检查Node.js环境...%COLOR_RESET%
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %COLOR_RED%❌ 未检测到Node.js，请先安装Node.js%COLOR_RESET%
    echo %COLOR_YELLOW%💡 下载地址: https://nodejs.org/%COLOR_RESET%
    pause
    exit /b 1
)

for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
echo %COLOR_GREEN%✅ Node.js已安装: %NODE_VERSION%%COLOR_RESET%

:: 检查依赖是否已安装
echo %COLOR_BLUE%🔍 检查项目依赖...%COLOR_RESET%
if not exist "node_modules" (
    echo %COLOR_YELLOW%📦 依赖未安装，正在安装...%COLOR_RESET%
    npm install
    if %errorlevel% neq 0 (
        echo %COLOR_RED%❌ 依赖安装失败%COLOR_RESET%
        pause
        exit /b 1
    )
)

echo %COLOR_GREEN%✅ 依赖检查完成%COLOR_RESET%
echo.

:: 检查必要文件
if not exist "autoInjectToolbar.js" (
    echo %COLOR_RED%❌ 缺少核心文件: autoInjectToolbar.js%COLOR_RESET%
    pause
    exit /b 1
)

if not exist "stagewise-launcher.js" (
    echo %COLOR_RED%❌ 缺少启动文件: stagewise-launcher.js%COLOR_RESET%
    pause
    exit /b 1
)

echo %COLOR_GREEN%✅ 核心文件检查完成%COLOR_RESET%
echo.

:: 启动统一启动器
echo %COLOR_CYAN%🚀 启动Stagewise统一启动器...%COLOR_RESET%
echo.

node stagewise-launcher.js

:: 如果程序异常退出
if %errorlevel% neq 0 (
    echo.
    echo %COLOR_RED%❌ 程序异常退出，错误代码: %errorlevel%%COLOR_RESET%
    echo %COLOR_YELLOW%💡 请检查控制台错误信息%COLOR_RESET%
    echo.
    pause
)

echo.
echo %COLOR_CYAN%👋 感谢使用Stagewise！%COLOR_RESET%
pause 