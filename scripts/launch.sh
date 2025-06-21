#!/bin/bash

# Stagewise 工具栏启动器 - Unix/Linux/macOS版本
# 作者: OctopusDev

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 清屏
clear

# 显示欢迎信息
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                     🐙 Stagewise 启动器                      ║${NC}"
echo -e "${CYAN}║                    通用本地工具栏启动器                       ║${NC}"
echo -e "${CYAN}║                      by OctopusDev                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到 Node.js${NC}"
    echo -e "${YELLOW}📥 请先安装 Node.js: https://nodejs.org/${NC}"
    echo
    read -p "按回车键退出..."
    exit 1
fi

# 显示Node.js版本
echo -e "${GREEN}🟢 Node.js 版本:${NC}"
node --version
echo

# 检查并安装依赖
echo -e "${BLUE}📦 正在检查依赖包...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}🔄 首次运行，正在安装依赖包...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        echo -e "${YELLOW}💡 请确保网络连接正常并重试${NC}"
        read -p "按回车键退出..."
        exit 1
    fi
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
    echo
fi

# 启动脚本
echo -e "${CYAN}🚀 正在启动 Stagewise 工具栏...${NC}"
echo
node launchStagewise.js

# 脚本结束时暂停
echo
echo -e "${YELLOW}📌 按回车键退出...${NC}"
read 