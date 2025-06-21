#!/usr/bin/env node

/**
 * Stagewise 一键启动脚本
 * 支持默认网址和自定义网址启动
 * @author OctopusDev
 */

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置常量
const CONFIG = {
  DEFAULT_URL: 'http://localhost:3001', // 默认本地测试页面
  DEFAULT_EXTERNAL_URL: 'https://example.com', // 默认外部页面
  TEST_PAGE_PORT: 3001,
  COLORS: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
  }
};

/**
 * 控制台颜色输出
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
  colorLog('║                     🐙 Stagewise 启动器                      ║', 'cyan');
  colorLog('║                    通用本地工具栏启动器                       ║', 'cyan');
  colorLog('║                      by OctopusDev                          ║', 'cyan');
  colorLog('╚══════════════════════════════════════════════════════════════╝', 'cyan');
  console.log();
}

/**
 * 显示主菜单
 */
function showMenu() {
  colorLog('请选择启动模式：', 'bright');
  console.log();
  colorLog('  1️⃣  启动默认测试页面 (推荐)', 'green');
  colorLog('     → 本地测试环境，包含工具栏功能演示', 'yellow');
  console.log();
  colorLog('  2️⃣  使用自定义网址', 'blue');
  colorLog('     → 在任意网站上注入工具栏', 'yellow');
  console.log();
  colorLog('  3️⃣  启动开发环境', 'cyan');
  colorLog('     → 启动完整的开发服务器', 'yellow');
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
 * 启动本地测试服务器
 */
async function startTestServer() {
  colorLog('🚀 正在启动本地测试服务器...', 'cyan');
  
  const serverPath = join(__dirname, 'testServer.js');
  
  // 检查测试服务器文件是否存在
  if (!existsSync(serverPath)) {
    colorLog('❌ 测试服务器文件不存在，正在创建...', 'yellow');
    await createTestServer();
  }
  
  // 启动服务器
  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    shell: true
  });
  
  // 等待服务器启动
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 打开浏览器
  await openBrowser(CONFIG.DEFAULT_URL);
  
  return server;
}

/**
 * 创建测试服务器
 */
async function createTestServer() {
  const testServerContent = `#!/usr/bin/env node

/**
 * Stagewise 测试服务器
 * 提供包含工具栏的测试页面
 */

import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// 静态文件服务
app.use(express.static(join(__dirname, 'public')));

// 主页路由
app.get('/', (req, res) => {
  const htmlPath = join(__dirname, 'testPage.html');
  try {
    const html = readFileSync(htmlPath, 'utf8');
    res.send(html);
  } catch (error) {
    res.send(getDefaultTestPage());
  }
});

// 默认测试页面
function getDefaultTestPage() {
  return \`<!DOCTYPE html>
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
        
        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .demo-card {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }
        
        .demo-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .demo-card h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s ease;
            border: none;
            cursor: pointer;
            margin: 0.5rem 0.5rem 0.5rem 0;
        }
        
        .btn:hover {
            background: #5a67d8;
        }
        
        .btn-secondary {
            background: #718096;
        }
        
        .btn-secondary:hover {
            background: #4a5568;
        }
        
        .toolbar-info {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 1rem;
            margin: 2rem 0;
        }
        
        .toolbar-info h4 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .feature-list li:before {
            content: "✨";
            margin-right: 0.5rem;
        }
        
        .status-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
        }
        
        .status-online {
            color: #48bb78;
        }
        
        .status-offline {
            color: #f56565;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .container {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="status-indicator">
        <div id="connection-status" class="status-offline">
            🔴 工具栏未连接
        </div>
    </div>

    <div class="container">
        <header class="header">
            <h1>🐙 Stagewise 工具栏</h1>
            <p>通用前端开发工具栏 - 测试页面</p>
        </header>

        <section class="demo-section">
            <h2>🎯 工具栏功能演示</h2>
            
            <div class="toolbar-info">
                <h4>📌 使用说明</h4>
                <p>工具栏位于页面右下角，点击可展开功能面板。您可以：</p>
                <ul class="feature-list">
                    <li>选择页面元素进行分析</li>
                    <li>发送提示到AI代理</li>
                    <li>查看元素信息和样式</li>
                    <li>配置工具栏设置</li>
                </ul>
            </div>
            
            <div class="demo-grid">
                <div class="demo-card">
                    <h3>🎨 界面元素</h3>
                    <p>这些是可以被工具栏选择和分析的界面元素示例。</p>
                    <button class="btn">主要按钮</button>
                    <button class="btn btn-secondary">次要按钮</button>
                </div>
                
                <div class="demo-card">
                    <h3>📝 表单控件</h3>
                    <p>表单元素也可以被工具栏分析。</p>
                    <input type="text" placeholder="输入框示例" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <select style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; border: 1px solid #e2e8f0; border-radius: 4px;">
                        <option>选择选项</option>
                        <option>选项 1</option>
                        <option>选项 2</option>
                    </select>
                </div>
                
                <div class="demo-card">
                    <h3>📊 数据展示</h3>
                    <p>数据表格和列表元素。</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: #f7fafc;">
                            <th style="padding: 0.5rem; border: 1px solid #e2e8f0;">列 1</th>
                            <th style="padding: 0.5rem; border: 1px solid #e2e8f0;">列 2</th>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">数据 1</td>
                            <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">数据 2</td>
                        </tr>
                    </table>
                </div>
                
                <div class="demo-card">
                    <h3>🖼️ 媒体内容</h3>
                    <p>图片和媒体元素示例。</p>
                    <div style="width: 100%; height: 100px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; margin: 0.5rem 0;">
                        示例图片区域
                    </div>
                </div>
            </div>
        </section>
        
        <section class="demo-section">
            <h2>🛠️ 开发工具</h2>
            <p>使用右下角的工具栏来：</p>
            <ul class="feature-list">
                <li>选择任意页面元素</li>
                <li>查看元素的详细信息</li>
                <li>发送分析请求到AI代理</li>
                <li>配置工具栏行为</li>
                <li>连接到IDE扩展</li>
            </ul>
        </section>
    </div>

    <!-- 工具栏脚本 -->
    <script type="module">
        // 检查工具栏连接状态
        function checkToolbarConnection() {
            const statusEl = document.getElementById('connection-status');
            
            // 检查是否存在工具栏元素
            const toolbar = document.querySelector('[data-stagewise-toolbar]') || 
                           document.querySelector('.stagewise-toolbar') ||
                           document.querySelector('#stagewise-toolbar');
            
            if (toolbar) {
                statusEl.textContent = '🟢 工具栏已连接';
                statusEl.className = 'status-online';
            } else {
                statusEl.textContent = '🔴 工具栏未连接';
                statusEl.className = 'status-offline';
            }
        }
        
        // 定期检查连接状态
        setInterval(checkToolbarConnection, 1000);
        checkToolbarConnection();
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🐙 Stagewise 测试页面已加载');
            console.log('📌 使用右下角的工具栏开始测试功能');
        });
    </script>
</body>
</html>\`;
}

app.listen(PORT, () => {
  console.log(\`🚀 Stagewise 测试服务器运行在: http://localhost:\${PORT}\`);
  console.log(\`📌 在浏览器中打开上述地址开始使用工具栏\`);
});
`;

  // 写入测试服务器文件
  const fs = await import('fs/promises');
  const testServerPath = join(__dirname, 'testServer.js');
  await fs.writeFile(testServerPath, testServerContent);
  
  colorLog('✅ 测试服务器文件已创建', 'green');
}

/**
 * 打开浏览器
 */
async function openBrowser(url) {
  const open = (await import('open')).default;
  
  colorLog(`🌐 正在打开浏览器: ${url}`, 'cyan');
  
  try {
    await open(url);
    colorLog('✅ 浏览器已打开', 'green');
  } catch (error) {
    colorLog(`❌ 无法自动打开浏览器: ${error.message}`, 'red');
    colorLog(`请手动访问: ${url}`, 'yellow');
  }
}

/**
 * 启动开发环境
 */
async function startDevEnvironment() {
  colorLog('🔧 正在启动开发环境...', 'cyan');
  
  const rootPath = join(__dirname, '..');
  const devProcess = spawn('pnpm', ['dev'], {
    cwd: rootPath,
    stdio: 'inherit',
    shell: true
  });
  
  return devProcess;
}

/**
 * 处理自定义网址
 */
async function handleCustomUrl() {
  const rl = createInterface();
  
  return new Promise((resolve) => {
    colorLog('🌐 请输入要打开的网址:', 'cyan');
    colorLog('  例如: https://example.com', 'yellow');
    console.log();
    
    rl.question('网址: ', async (url) => {
      rl.close();
      
      if (!url) {
        colorLog('❌ 网址不能为空', 'red');
        return resolve(false);
      }
      
      // 添加协议前缀
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      colorLog(`🚀 正在打开: ${url}`, 'cyan');
      colorLog('💡 注意: 工具栏需要网站支持或已集成才能使用', 'yellow');
      
      await openBrowser(url);
      resolve(true);
    });
  });
}

/**
 * 主程序
 */
async function main() {
  showWelcome();
  
  let running = true;
  
  while (running) {
    showMenu();
    
    const rl = createInterface();
    const choice = await new Promise((resolve) => {
      rl.question('请选择 (0-3): ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
    
    console.log();
    
    switch (choice) {
      case '1':
        colorLog('🎯 启动默认测试页面', 'bright');
        const server = await startTestServer();
        
        colorLog('✅ 测试页面已启动！', 'green');
        colorLog('📌 按 Ctrl+C 停止服务器', 'yellow');
        
        // 等待用户停止
        process.on('SIGINT', () => {
          colorLog('\n🛑 正在停止服务器...', 'yellow');
          server.kill();
          process.exit(0);
        });
        
        // 保持进程运行
        await new Promise(() => {});
        break;
        
      case '2':
        colorLog('🌐 自定义网址模式', 'bright');
        await handleCustomUrl();
        break;
        
      case '3':
        colorLog('🔧 启动开发环境', 'bright');
        const devProcess = await startDevEnvironment();
        
        colorLog('✅ 开发环境已启动！', 'green');
        colorLog('📌 按 Ctrl+C 停止开发服务器', 'yellow');
        
        // 等待用户停止
        process.on('SIGINT', () => {
          colorLog('\n🛑 正在停止开发服务器...', 'yellow');
          devProcess.kill();
          process.exit(0);
        });
        
        // 保持进程运行
        await new Promise(() => {});
        break;
        
      case '0':
        colorLog('👋 再见！', 'cyan');
        running = false;
        break;
        
      default:
        colorLog('❌ 无效选择，请输入 0-3', 'red');
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
    }
  }
}

// 错误处理
process.on('uncaughtException', (error) => {
  colorLog(`❌ 未捕获的异常: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  colorLog(`❌ 未处理的Promise拒绝: ${reason}`, 'red');
  process.exit(1);
});

// 启动程序
main().catch((error) => {
  colorLog(`❌ 程序错误: ${error.message}`, 'red');
  process.exit(1);
}); 