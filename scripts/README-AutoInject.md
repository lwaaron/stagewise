# 🚀 Stagewise 自动注入工具栏系统

> **简洁高效的解决方案**：将工具栏源码放在项目根目录下，运行服务后，项目下的任何网页都会在开发者模式和测试模式下右下角自动出现工具栏。

## 📋 目录

- [特性概览](#特性概览)
- [快速开始](#快速开始)
- [集成方式](#集成方式)
- [配置选项](#配置选项)
- [功能详解](#功能详解)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)

## ✨ 特性概览

### 🎯 核心特性
- **🔄 自动注入**：无需手动修改HTML，自动在所有页面注入工具栏
- **🌍 通用兼容**：支持任何Express.js项目，无论技术栈
- **🚦 智能显示**：只在开发/测试模式下显示，生产环境自动隐藏
- **🎨 美观设计**：现代化UI设计，渐变背景，半透明效果
- **⚡ 零依赖**：工具栏代码完全自包含，不依赖外部资源

### 🛠️ 工具栏功能
- **🔍 元素检查**：快速启动页面元素检查模式
- **📄 页面信息**：查看当前页面的详细技术信息
- **🔧 控制台**：快速访问开发者控制台和调试工具
- **⚡ 性能分析**：实时分析页面性能指标和加载时间
- **💾 数据导出**：导出页面分析报告为JSON格式

## 🚀 快速开始

### 方式一：使用统一启动器（推荐）

1. **下载核心文件**
```bash
# 确保以下文件在你的项目目录中：
# - autoInjectToolbar.js      # 核心注入中间件
# - stagewise-launcher.js     # 统一启动器
# - start-universal.bat       # Windows启动脚本
```

2. **运行启动器**
```bash
# Windows
双击 start-universal.bat

# 或手动运行
node stagewise-launcher.js
```

3. **选择模式**
```
请选择启动模式：
  1️⃣  启动测试页面服务器 (推荐)
  2️⃣  启动静态文件服务器  
  3️⃣  生成使用说明
  0️⃣  退出
```

### 方式二：直接集成到现有项目

1. **复制核心文件**
```bash
cp autoInjectToolbar.js /your/project/root/
```

2. **修改项目代码**
```javascript
// 在你的Express应用中添加
const { createAutoInjectMiddleware } = require('./autoInjectToolbar');

const app = express();

// 添加这一行（越早越好）
app.use(createAutoInjectMiddleware());

// 其他中间件和路由...
```

3. **启动项目**
```bash
npm start
# 或
node server.js
```

## 🔧 集成方式

### Express.js 集成（推荐）

```javascript
/**
 * 完整的Express.js集成示例
 */
const express = require('express');
const { createAutoInjectMiddleware } = require('./autoInjectToolbar');

const app = express();

// 1. 首先应用Stagewise中间件
app.use(createAutoInjectMiddleware());

// 2. 然后添加其他中间件
app.use(express.static('public'));
app.use(express.json());

// 3. 定义路由
app.get('/', (req, res) => {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.listen(3000, () => {
  console.log('服务器已启动，工具栏已自动注入到所有页面');
});
```

### Next.js 集成

```javascript
// middleware.js
import { NextResponse } from 'next/server';
import { getToolbarCode } from './autoInjectToolbar.js';

export function middleware(request) {
  const response = NextResponse.next();
  
  // 只在开发模式下注入
  if (process.env.NODE_ENV === 'development') {
    // 修改HTML响应来注入工具栏
    const html = response.body.replace('</body>', getToolbarCode() + '</body>');
    return new NextResponse(html, response);
  }
  
  return response;
}
```

### 手动HTML注入

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
</head>
<body>
    <h1>Your Content</h1>
    
    <!-- 在 </body> 标签前添加工具栏代码 -->
    <!-- 复制 autoInjectToolbar.js 中 getToolbarCode() 函数的返回值 -->
</body>
</html>
```

## ⚙️ 配置选项

### 环境变量控制

```bash
# 显示工具栏
NODE_ENV=development
NODE_ENV=test

# 隐藏工具栏
NODE_ENV=production
```

### URL参数控制

```
# 强制隐藏工具栏
http://localhost:3000/?stagewise=false

# 强制显示工具栏
http://localhost:3000/?stagewise=true
```

### 自定义配置

```javascript
// 在 autoInjectToolbar.js 中修改
function shouldShowToolbar(req) {
  // 自定义显示逻辑
  const nodeEnv = process.env.NODE_ENV;
  const userAgent = req.get('User-Agent');
  
  // 例：只在特定浏览器中显示
  if (userAgent && userAgent.includes('Chrome')) {
    return nodeEnv !== 'production';
  }
  
  return false;
}
```

## 🎨 功能详解

### 🔍 元素检查
- 启动浏览器开发者工具的元素检查模式
- 帮助快速定位和调试DOM元素
- 提供元素选择和属性查看功能

### 📄 页面信息
显示详细的页面技术信息：
- URL、标题、域名、协议
- 用户代理、屏幕分辨率、视口大小
- 文档加载状态、Cookie数量
- 本地存储和会话存储使用情况

### ⚡ 性能分析
实时监控页面性能：
- 页面加载时间和响应时间
- DOM节点、图片、脚本数量统计
- DNS查询、TCP连接、DOM构建时间
- 性能API数据分析

### 💾 数据导出
导出完整的页面分析报告：
- JSON格式的结构化数据
- 包含性能指标、页面信息、时间戳
- 便于后续分析和报告生成

## 🐛 故障排除

### 工具栏不显示

**检查环境变量**
```bash
echo $NODE_ENV
# 应该是 development 或 test
```

**检查控制台错误**
```javascript
// 打开浏览器控制台查看错误信息
console.log('[Stagewise] 工具栏已加载');
```

**检查文件路径**
```bash
# 确保 autoInjectToolbar.js 在正确位置
ls -la autoInjectToolbar.js
```

### 工具栏功能异常

**检查JavaScript错误**
```javascript
// 在控制台测试工具栏对象
console.log(window.stagewise);
```

**检查网络请求**
- 打开Network标签查看是否有请求失败
- 确保没有CORS或CSP策略阻止脚本执行

### 样式显示问题

**检查CSS冲突**
```css
/* 工具栏使用高z-index确保在最顶层 */
#stagewise-toolbar-container {
    z-index: 999999 !important;
}
```

**检查响应式兼容性**
- 在不同屏幕尺寸下测试工具栏显示
- 检查移动设备上的触摸交互

## 📚 最佳实践

### 🎯 性能优化

1. **按需加载**
```javascript
// 只在需要时初始化工具栏
if (shouldShowToolbar(req)) {
    // 注入工具栏代码
}
```

2. **缓存优化**
```javascript
// 缓存工具栏代码避免重复生成
let cachedToolbarCode = null;
function getToolbarCode() {
    if (!cachedToolbarCode) {
        cachedToolbarCode = generateToolbarCode();
    }
    return cachedToolbarCode;
}
```

### 🔒 安全考虑

1. **生产环境隔离**
```javascript
// 确保生产环境不注入工具栏
if (process.env.NODE_ENV === 'production') {
    return next();
}
```

2. **敏感信息保护**
```javascript
// 避免在工具栏中显示敏感信息
const pageInfo = {
    url: req.url,
    // 不包含用户数据或API密钥
};
```

### 🧪 测试策略

1. **自动化测试**
```javascript
// 测试工具栏注入功能
describe('Stagewise Toolbar', () => {
    it('should inject toolbar in development mode', () => {
        process.env.NODE_ENV = 'development';
        const response = testRequest('/');
        expect(response.body).toContain('stagewise-toolbar');
    });
});
```

2. **手动测试清单**
- [ ] 工具栏在开发模式下显示
- [ ] 工具栏在生产模式下隐藏
- [ ] 所有功能按钮正常工作
- [ ] 响应式设计在不同设备上正常
- [ ] 不与现有页面样式冲突

## 📞 支持与帮助

### 🔗 相关链接
- **项目地址**: https://github.com/lwaaron/stagewise
- **问题反馈**: https://x.com/linusorii
- **文档网站**: [待更新]

### 💬 常见问题

**Q: 工具栏会影响页面性能吗？**
A: 工具栏代码经过优化，只在开发环境下加载，对性能影响极小。

**Q: 可以自定义工具栏样式吗？**
A: 可以，修改 `autoInjectToolbar.js` 中的CSS样式即可。

**Q: 支持哪些浏览器？**
A: 支持所有现代浏览器，包括Chrome、Firefox、Safari、Edge。

**Q: 如何在团队中共享配置？**
A: 将 `autoInjectToolbar.js` 提交到版本控制系统，团队成员即可共享同样的工具栏配置。

---

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 首个版本发布
- 🎯 支持自动注入功能
- 🔧 完整的工具栏功能集
- 📱 响应式设计支持
- 🌍 跨平台兼容性

---

<div align="center">

**🎉 感谢使用 Stagewise 自动注入工具栏系统！**

如果这个项目对您有帮助，请给我们一个 ⭐ Star！

*Made with ❤️ by OctopusDev*

</div> 