/**
 * Stagewise 工具栏集成示例
 * 展示如何在现有Express项目中集成自动注入工具栏
 * @author OctopusDev
 */

const express = require('express');
const path = require('path');

// 1. 引入Stagewise自动注入中间件
const { createAutoInjectMiddleware } = require('./autoInjectToolbar');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. 应用Stagewise自动注入中间件（越早越好）
// 这会自动在所有HTML响应中注入工具栏
app.use(createAutoInjectMiddleware());

// 3. 设置静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 4. 设置模板引擎（可选）
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 5. 定义路由
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>项目首页</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            .info-box {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                backdrop-filter: blur(10px);
            }
            .link {
                color: #00b894;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 欢迎来到您的项目</h1>
            <div class="info-box">
                <h2>✨ Stagewise工具栏已集成</h2>
                <p>查看页面右下角的工具栏 - 它会自动出现在所有页面上！</p>
                <p>只在开发和测试模式下显示，生产环境自动隐藏。</p>
            </div>
            <div class="info-box">
                <h3>🔗 测试页面</h3>
                <p><a href="/about" class="link">关于页面</a></p>
                <p><a href="/contact" class="link">联系页面</a></p>
                <p><a href="/api/info" class="link">API信息</a></p>
            </div>
        </div>
        
        <script>
            console.log('%c🚀 项目首页已加载', 'color: #74b9ff; font-weight: bold; font-size: 16px;');
            console.log('Stagewise工具栏会自动注入到这个页面');
        </script>
    </body>
    </html>
  `);
});

app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>关于我们</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            .nav {
                text-align: center;
                margin-bottom: 2rem;
            }
            .nav a {
                color: white;
                text-decoration: none;
                margin: 0 10px;
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="nav">
                <a href="/">首页</a>
                <a href="/about">关于</a>
                <a href="/contact">联系</a>
            </div>
            <h1>📖 关于我们</h1>
            <p>这是关于页面。工具栏也会自动显示在这里！</p>
            <p>Stagewise工具栏提供了强大的开发和调试功能，帮助您更高效地开发Web应用。</p>
        </div>
        
        <script>
            console.log('%c📖 关于页面已加载', 'color: #fd79a8; font-weight: bold; font-size: 16px;');
        </script>
    </body>
    </html>
  `);
});

app.get('/contact', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>联系我们</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            .nav {
                text-align: center;
                margin-bottom: 2rem;
            }
            .nav a {
                color: white;
                text-decoration: none;
                margin: 0 10px;
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
            }
            .form-group {
                margin: 20px 0;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
            }
            .form-group input, .form-group textarea {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 5px;
                box-sizing: border-box;
            }
            .submit-btn {
                background: #fd79a8;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="nav">
                <a href="/">首页</a>
                <a href="/about">关于</a>
                <a href="/contact">联系</a>
            </div>
            <h1>📞 联系我们</h1>
            <form onsubmit="handleSubmit(event)">
                <div class="form-group">
                    <label for="name">姓名:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">邮箱:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">消息:</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" class="submit-btn">发送消息</button>
            </form>
        </div>
        
        <script>
            console.log('%c📞 联系页面已加载', 'color: #00b894; font-weight: bold; font-size: 16px;');
            
            function handleSubmit(event) {
                event.preventDefault();
                alert('表单提交功能仅为演示。Stagewise工具栏可以帮助您调试表单行为！');
                console.log('表单数据:', {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                });
            }
        </script>
    </body>
    </html>
  `);
});

// API路由
app.get('/api/info', (req, res) => {
  res.json({
    project: 'Stagewise集成示例',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    toolbar: 'auto-injected',
    environment: process.env.NODE_ENV || 'development',
    features: [
      '自动工具栏注入',
      '开发模式检测',
      '页面性能分析',
      '元素检查',
      '数据导出'
    ]
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>页面未找到</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .error-container {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 40px;
                backdrop-filter: blur(10px);
            }
            h1 {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>404</h1>
            <h2>页面未找到</h2>
            <p>请求的页面不存在，但Stagewise工具栏仍然可用！</p>
            <a href="/" style="color: #fd79a8; text-decoration: none; font-weight: bold;">返回首页</a>
        </div>
        
        <script>
            console.log('%c❌ 404页面已加载', 'color: #a29bfe; font-weight: bold; font-size: 16px;');
            console.log('即使在错误页面，工具栏依然正常工作');
        </script>
    </body>
    </html>
  `);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('应用错误:', err);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>服务器错误</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .error-container {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 40px;
                backdrop-filter: blur(10px);
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>🚨 服务器错误</h1>
            <p>抱歉，服务器遇到了一个错误。</p>
            <p>使用Stagewise工具栏可以帮助诊断问题！</p>
            <a href="/" style="color: #fd79a8; text-decoration: none; font-weight: bold;">返回首页</a>
        </div>
    </body>
    </html>
  `);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
🚀 Stagewise集成示例服务器已启动！

🌐 访问地址: http://localhost:${PORT}
🔧 工具栏: 自动注入到所有页面
📝 环境: ${process.env.NODE_ENV || 'development'}

💡 测试页面：
   • 首页: http://localhost:${PORT}/
   • 关于: http://localhost:${PORT}/about
   • 联系: http://localhost:${PORT}/contact
   • API: http://localhost:${PORT}/api/info

✨ 功能特性：
   • 🎯 自动工具栏注入
   • 🔄 开发模式检测
   • 📊 页面性能分析
   • 🔍 元素检查工具
   • 💾 数据导出功能

💡 提示：工具栏出现在页面右下角
`);
});

module.exports = app; 