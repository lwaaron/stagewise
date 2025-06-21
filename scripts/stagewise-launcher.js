#!/usr/bin/env node

/**
 * Stagewise 统一启动器
 * 自动在项目的所有页面注入工具栏
 * 支持多种启动模式和智能注入
 * @author OctopusDev
 */

const express = require('express');
const { createServer } = require('http');
const open = require('open');
const readline = require('readline');
const path = require('path');
const fs = require('fs');
const { createAutoInjectMiddleware } = require('./autoInjectToolbar');

// 配置常量
const CONFIG = {
  DEFAULT_PORT: 3001,
  TOOLBAR_PORT: 3002,
  COLORS: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
  }
};

/**
 * 控制台颜色输出
 * @param {string} message - 输出消息
 * @param {string} color - 颜色名称
 */
function colorLog(message, color = 'reset') {
  console.log(`${CONFIG.COLORS[color]}${message}${CONFIG.COLORS.reset}`);
}

/**
 * 显示欢迎信息
 */
function showWelcome() {
  console.clear();
  colorLog('╔══════════════════════════════════════════════════════════════╗', 'cyan');
  colorLog('║                   🚀 Stagewise 统一启动器                    ║', 'cyan');
  colorLog('║                 自动注入式工具栏启动系统                      ║', 'cyan');
  colorLog('║                      by OctopusDev                          ║', 'cyan');
  colorLog('╚══════════════════════════════════════════════════════════════╝', 'cyan');
  console.log();
  colorLog('🎯 特性：项目内所有页面自动显示工具栏（开发/测试模式）', 'green');
  console.log();
}

/**
 * 显示启动模式菜单
 */
function showMenu() {
  colorLog('请选择启动模式：', 'bright');
  console.log();
  colorLog('  1️⃣  启动测试页面服务器 (推荐)', 'green');
  colorLog('     → 启动本地测试环境，自动注入工具栏', 'yellow');
  console.log();
  colorLog('  2️⃣  启动静态文件服务器', 'cyan');
  colorLog('     → 服务当前目录文件，自动注入工具栏', 'yellow');
  console.log();
  colorLog('  3️⃣  生成使用说明', 'magenta');
  colorLog('     → 查看如何在现有项目中集成', 'yellow');
  console.log();
  colorLog('  0️⃣  退出', 'red');
  console.log();
}

/**
 * 创建readline接口
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * 启动测试页面服务器
 */
async function startTestPageServer() {
  colorLog('🚀 启动测试页面服务器...', 'cyan');
  
  const app = express();
  
  // 设置环境变量确保工具栏显示
  process.env.NODE_ENV = 'development';
  
  // 应用自动注入中间件
  app.use(createAutoInjectMiddleware());
  
  // 静态文件服务
  app.use(express.static(path.join(__dirname)));
  
  // 主页路由 - 提供测试页面
  app.get('/', (req, res) => {
    const testPagePath = path.join(__dirname, 'testPage.html');
    if (fs.existsSync(testPagePath)) {
      res.sendFile(testPagePath);
    } else {
      res.send(getDefaultTestPage());
    }
  });
  
  // API测试路由
  app.get('/api/test', (req, res) => {
    res.json({
      message: 'Stagewise API 测试成功',
      timestamp: new Date().toISOString(),
      toolbar: 'injected'
    });
  });
  
  // 动态页面测试
  app.get('/dynamic', (req, res) => {
    res.send(getDynamicTestPage());
  });
  
  const server = app.listen(CONFIG.DEFAULT_PORT, () => {
    colorLog(`✅ 测试服务器已启动!`, 'green');
    colorLog(`🌐 本地地址: http://localhost:${CONFIG.DEFAULT_PORT}`, 'cyan');
    colorLog(`🔧 工具栏会自动显示在页面右下角`, 'yellow');
    console.log();
    colorLog('💡 提示：工具栏只在开发/测试模式下显示', 'blue');
    colorLog('💡 测试页面：/', 'blue');
    colorLog('💡 动态页面：/dynamic', 'blue');
    console.log();
  });
  
  // 等待服务器启动后打开浏览器
  setTimeout(async () => {
    try {
      await open(`http://localhost:${CONFIG.DEFAULT_PORT}`);
      colorLog('🌏 浏览器已自动打开', 'green');
    } catch (error) {
      colorLog('⚠️  无法自动打开浏览器，请手动访问上述地址', 'yellow');
    }
  }, 1000);
  
  return server;
}

/**
 * 启动静态文件服务器
 */
async function startStaticServer() {
  const rl = createInterface();
  
  try {
    colorLog('📁 静态文件服务器启动中...', 'cyan');
    console.log();
    
    const rootDir = await new Promise((resolve) => {
      rl.question('请输入要服务的目录 (直接回车使用当前目录): ', (answer) => {
        resolve(answer || process.cwd());
      });
    });
    
    if (!fs.existsSync(rootDir)) {
      colorLog('❌ 指定目录不存在', 'red');
      return;
    }
    
    const app = express();
    
    // 设置环境变量确保工具栏显示
    process.env.NODE_ENV = 'development';
    
    // 应用自动注入中间件
    app.use(createAutoInjectMiddleware());
    
    // 静态文件服务
    app.use(express.static(rootDir));
    
    const server = app.listen(CONFIG.DEFAULT_PORT, () => {
      colorLog(`✅ 静态文件服务器已启动!`, 'green');
      colorLog(`🌐 服务地址: http://localhost:${CONFIG.DEFAULT_PORT}`, 'cyan');
      colorLog(`📂 根目录: ${rootDir}`, 'blue');
      colorLog(`🔧 所有HTML页面都会自动注入工具栏`, 'yellow');
      console.log();
    });
    
    // 打开浏览器
    setTimeout(async () => {
      try {
        await open(`http://localhost:${CONFIG.DEFAULT_PORT}`);
        colorLog('🌏 浏览器已自动打开', 'green');
      } catch (error) {
        colorLog('⚠️  无法自动打开浏览器，请手动访问上述地址', 'yellow');
      }
    }, 1000);
    
    return server;
    
  } catch (error) {
    colorLog(`❌ 静态服务器启动失败: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
}

/**
 * 生成使用说明
 */
function showUsageGuide() {
  console.clear();
  colorLog('📖 Stagewise 工具栏集成指南', 'bright');
  colorLog('══════════════════════════════════════════════════════════════', 'cyan');
  console.log();
  
  colorLog('🎯 在现有项目中集成工具栏', 'green');
  console.log();
  
  colorLog('方法一：Express中间件集成 (推荐)', 'blue');
  console.log('  1. 复制 autoInjectToolbar.js 到你的项目');
  console.log('  2. 在你的Express应用中添加：');
  console.log();
  colorLog('     const { createAutoInjectMiddleware } = require("./autoInjectToolbar");', 'yellow');
  colorLog('     app.use(createAutoInjectMiddleware());', 'yellow');
  console.log();
  
  colorLog('方法二：手动HTML注入', 'blue');
  console.log('  1. 复制工具栏代码（从autoInjectToolbar.js中的getToolbarCode函数）');
  console.log('  2. 在HTML页面的</body>标签前粘贴代码');
  console.log();
  
  colorLog('方法三：项目根目录集成', 'blue');
  console.log('  1. 将 autoInjectToolbar.js 放在项目根目录');
  console.log('  2. 修改你的服务器启动脚本：');
  console.log();
  colorLog('     const { createAutoInjectMiddleware } = require("./autoInjectToolbar");', 'yellow');
  colorLog('     app.use(createAutoInjectMiddleware());', 'yellow');
  console.log();
  
  colorLog('🔧 环境变量配置', 'green');
  console.log('  NODE_ENV=development   显示工具栏');
  console.log('  NODE_ENV=test          显示工具栏');
  console.log('  NODE_ENV=production    隐藏工具栏');
  console.log();
  
  colorLog('📋 URL参数控制', 'green');
  console.log('  ?stagewise=false       强制隐藏工具栏');
  console.log('  ?stagewise=true        强制显示工具栏');
  console.log();
  
  colorLog('💡 工具栏功能', 'green');
  console.log('  🔍 元素检查    - 快速检查页面元素');
  console.log('  📄 页面信息    - 显示当前页面详细信息');
  console.log('  🔧 控制台      - 快速访问开发者控制台');
  console.log('  ⚡ 性能分析    - 分析页面性能指标');
  console.log('  💾 导出数据    - 导出页面分析报告');
  console.log();
  
  colorLog('🎨 自定义样式', 'green');
  console.log('  可以修改 autoInjectToolbar.js 中的CSS样式');
  console.log('  工具栏使用高z-index确保显示在最顶层');
  console.log();
  
  colorLog('按任意键返回主菜单...', 'cyan');
  
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    });
  });
}

/**
 * 获取默认测试页面
 */
function getDefaultTestPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stagewise 工具栏测试页面</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .demo-section {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .demo-section h2 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .demo-card {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            transition: all 0.3s;
            cursor: pointer;
        }
        
        .demo-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .demo-card h3 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .demo-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s;
            margin: 0.25rem;
        }
        
        .demo-btn:hover {
            background: #5a67d8;
        }
        
        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #10b981;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Stagewise 工具栏</h1>
            <p>自动注入式开发工具栏 - 测试页面</p>
            <div style="margin-top: 1rem;">
                <span class="status-indicator">
                    <span class="status-dot"></span>
                    工具栏已自动加载
                </span>
            </div>
        </div>
        
        <div class="demo-section">
            <h2>🎯 工具栏功能测试</h2>
            <p>查看页面右下角的工具栏，点击测试各项功能：</p>
            
            <div class="demo-grid">
                <div class="demo-card">
                    <h3>🔍 元素检查</h3>
                    <p>快速启动元素检查模式</p>
                </div>
                
                <div class="demo-card">
                    <h3>📄 页面信息</h3>
                    <p>查看当前页面的详细信息</p>
                </div>
                
                <div class="demo-card">
                    <h3>⚡ 性能分析</h3>
                    <p>分析页面性能指标</p>
                </div>
                
                <div class="demo-card">
                    <h3>💾 数据导出</h3>
                    <p>导出页面分析报告</p>
                </div>
            </div>
        </div>
        
        <div class="demo-section">
            <h2>🧪 交互功能测试</h2>
            <p>测试工具栏与页面的交互能力：</p>
            
            <div style="margin-top: 1rem;">
                <button class="demo-btn" onclick="addDynamicElement()">添加动态元素</button>
                <button class="demo-btn" onclick="toggleTestSection()">切换测试区域</button>
                <button class="demo-btn" onclick="simulateError()">模拟错误</button>
                <button class="demo-btn" onclick="testApiCall()">测试API调用</button>
            </div>
            
            <div id="dynamic-content" style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; min-height: 100px;">
                <p>动态内容区域 - 这里会显示测试结果</p>
            </div>
        </div>
        
        <div class="demo-section">
            <h2>📋 使用说明</h2>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                    ✅ 工具栏自动注入到所有HTML页面
                </li>
                <li style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                    ✅ 只在开发和测试环境下显示
                </li>
                <li style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                    ✅ 使用ESC键可以隐藏工具栏
                </li>
                <li style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                    ✅ 点击SW图标可以重新显示工具栏
                </li>
            </ul>
        </div>
    </div>
    
    <script>
        let elementCounter = 0;
        
        function addDynamicElement() {
            elementCounter++;
            const container = document.getElementById('dynamic-content');
            const newElement = document.createElement('div');
            newElement.style.cssText = 'margin: 0.5rem 0; padding: 0.5rem; background: #667eea; color: white; border-radius: 4px;';
            newElement.textContent = \`动态元素 #\${elementCounter} - \${new Date().toLocaleTimeString()}\`;
            container.appendChild(newElement);
            
            // 使用工具栏的日志功能
            if (window.stagewise) {
                console.log('[Stagewise Test] 添加了新的动态元素:', newElement);
            }
        }
        
        function toggleTestSection() {
            const sections = document.querySelectorAll('.demo-section');
            sections.forEach((section, index) => {
                if (index > 0) {
                    section.style.display = section.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
        
        function simulateError() {
            try {
                throw new Error('这是一个模拟错误，用于测试工具栏的错误处理能力');
            } catch (error) {
                console.error('[Test Error]', error);
                alert('模拟错误已触发，请查看控制台');
            }
        }
        
        async function testApiCall() {
            try {
                const response = await fetch('/api/test');
                const data = await response.json();
                
                const container = document.getElementById('dynamic-content');
                const resultElement = document.createElement('div');
                resultElement.style.cssText = 'margin: 0.5rem 0; padding: 0.5rem; background: #10b981; color: white; border-radius: 4px;';
                resultElement.textContent = \`API测试成功: \${data.message}\`;
                container.appendChild(resultElement);
                
                console.log('[API Test]', data);
            } catch (error) {
                console.error('[API Test Error]', error);
                alert('API测试失败，请查看控制台');
            }
        }
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('%c🎉 测试页面已加载完成', 'color: #667eea; font-weight: bold; font-size: 16px;');
            console.log('可以在右下角看到Stagewise工具栏');
            
            // 5秒后显示提示
            setTimeout(() => {
                if (window.stagewise) {
                    console.log('%c💡 提示：尝试点击工具栏中的各个功能按钮', 'color: #10b981; font-weight: bold;');
                }
            }, 5000);
        });
    </script>
</body>
</html>`;
}

/**
 * 获取动态测试页面
 */
function getDynamicTestPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stagewise 动态页面测试</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
            min-height: 100vh;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .content {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; }
        
        .time {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 1rem 0;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>🌟 动态页面测试</h1>
        <p>这是一个动态生成的测试页面</p>
        <div class="time" id="current-time"></div>
        <p>工具栏已自动注入到此页面</p>
        <p>查看右下角的Stagewise工具栏</p>
    </div>
    
    <script>
        function updateTime() {
            document.getElementById('current-time').textContent = 
                '当前时间: ' + new Date().toLocaleString();
        }
        
        updateTime();
        setInterval(updateTime, 1000);
        
        console.log('%c🌈 动态页面已加载', 'color: #ff6b6b; font-weight: bold; font-size: 18px;');
    </script>
</body>
</html>`;
}

/**
 * 处理用户选择
 */
async function handleUserChoice(choice) {
  switch (choice) {
    case '1':
      return await startTestPageServer();
    case '2':
      return await startStaticServer();
    case '3':
      await showUsageGuide();
      return null;
    case '0':
      colorLog('👋 感谢使用 Stagewise！', 'cyan');
      process.exit(0);
    default:
      colorLog('❌ 无效选择，请重新输入', 'red');
      return null;
  }
}

/**
 * 主函数
 */
async function main() {
  let server = null;
  
  while (true) {
    showWelcome();
    showMenu();
    
    const rl = createInterface();
    
    try {
      const choice = await new Promise((resolve) => {
        rl.question('请输入选择 (0-3): ', resolve);
      });
      
      if (server) {
        server.close();
        server = null;
      }
      
      server = await handleUserChoice(choice.trim());
      
      if (server) {
        colorLog('🔄 服务器正在运行中...', 'green');
        colorLog('按 Ctrl+C 停止服务器并返回菜单', 'blue');
        console.log();
        
        // 等待用户按Ctrl+C
        await new Promise((resolve) => {
          process.once('SIGINT', () => {
            colorLog('\n🛑 正在停止服务器...', 'yellow');
            server.close(() => {
              colorLog('✅ 服务器已停止', 'green');
              resolve();
            });
          });
        });
      }
      
    } catch (error) {
      colorLog(`❌ 发生错误: ${error.message}`, 'red');
    } finally {
      rl.close();
    }
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  colorLog(`❌ 未捕获的异常: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  colorLog(`❌ 未处理的Promise拒绝: ${reason}`, 'red');
  process.exit(1);
});

// 启动应用
if (require.main === module) {
  main().catch((error) => {
    colorLog(`❌ 启动失败: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  startTestPageServer,
  startStaticServer,
  createAutoInjectMiddleware: () => require('./autoInjectToolbar').createAutoInjectMiddleware()
}; 