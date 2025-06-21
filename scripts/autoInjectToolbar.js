/**
 * 自动注入工具栏中间件
 * 在项目的所有HTML页面中自动注入Stagewise工具栏
 * 只在开发和测试模式下显示
 */

const fs = require('fs');
const path = require('path');

/**
 * 检测是否应该显示工具栏
 * @param {Object} req - Express请求对象
 * @returns {boolean} 是否显示工具栏
 */
function shouldShowToolbar(req) {
    // 检查环境变量
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') {
        return false;
    }
    
    // 检查URL参数
    const showToolbar = req.query.stagewise;
    if (showToolbar === 'false' || showToolbar === '0') {
        return false;
    }
    
    // 默认在开发模式下显示
    return nodeEnv === 'development' || nodeEnv === 'test' || !nodeEnv;
}

/**
 * 获取工具栏HTML代码
 * @returns {string} 完整的工具栏HTML和JavaScript代码
 */
function getToolbarCode() {
    return `
<!-- Stagewise Universal Toolbar - Auto Injected -->
<div id="stagewise-universal-toolbar" style="display: none;">
    <style>
        #stagewise-toolbar-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        }
        
        #stagewise-toolbar-panel {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            padding: 16px;
            min-width: 280px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateY(10px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        #stagewise-toolbar-panel.visible {
            transform: translateY(0);
            opacity: 1;
        }
        
        .stagewise-toolbar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .stagewise-toolbar-title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .stagewise-toolbar-logo {
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #667eea;
            font-size: 12px;
        }
        
        .stagewise-toolbar-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            font-size: 18px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .stagewise-toolbar-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .stagewise-toolbar-content {
            display: grid;
            gap: 8px;
        }
        
        .stagewise-toolbar-item {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 10px 12px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .stagewise-toolbar-item:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }
        
        .stagewise-toolbar-item-label {
            font-weight: 500;
        }
        
        .stagewise-toolbar-item-value {
            opacity: 0.8;
            font-size: 12px;
        }
        
        .stagewise-toolbar-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            opacity: 0.8;
        }
        
        .stagewise-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4ade80;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .stagewise-minimize-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .stagewise-minimize-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        .stagewise-minimize-btn.hidden {
            display: none;
        }
    </style>
    
    <!-- 最小化按钮 -->
    <button id="stagewise-minimize-btn" class="stagewise-minimize-btn" title="展开Stagewise工具栏">
        SW
    </button>
    
    <!-- 工具栏面板 -->
    <div id="stagewise-toolbar-container">
        <div id="stagewise-toolbar-panel">
            <div class="stagewise-toolbar-header">
                <div class="stagewise-toolbar-title">
                    <div class="stagewise-toolbar-logo">SW</div>
                    Stagewise工具栏
                </div>
                <button class="stagewise-toolbar-close" id="stagewise-toolbar-close" title="最小化">×</button>
            </div>
            
            <div class="stagewise-toolbar-content">
                <div class="stagewise-toolbar-item" onclick="stagewise.inspectElement()">
                    <span class="stagewise-toolbar-item-label">🔍 元素检查</span>
                    <span class="stagewise-toolbar-item-value">点击检查页面元素</span>
                </div>
                
                <div class="stagewise-toolbar-item" onclick="stagewise.showPageInfo()">
                    <span class="stagewise-toolbar-item-label">📄 页面信息</span>
                    <span class="stagewise-toolbar-item-value">查看当前页面详情</span>
                </div>
                
                <div class="stagewise-toolbar-item" onclick="stagewise.toggleConsole()">
                    <span class="stagewise-toolbar-item-label">🔧 控制台</span>
                    <span class="stagewise-toolbar-item-value">打开开发者控制台</span>
                </div>
                
                <div class="stagewise-toolbar-item" onclick="stagewise.analyzePerformance()">
                    <span class="stagewise-toolbar-item-label">⚡ 性能分析</span>
                    <span class="stagewise-toolbar-item-value">分析页面性能指标</span>
                </div>
                
                <div class="stagewise-toolbar-item" onclick="stagewise.exportData()">
                    <span class="stagewise-toolbar-item-label">💾 导出数据</span>
                    <span class="stagewise-toolbar-item-value">导出页面分析报告</span>
                </div>
            </div>
            
            <div class="stagewise-toolbar-status">
                <div class="stagewise-status-dot"></div>
                <span>工具栏已激活 - 开发模式</span>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    'use strict';
    
    // Stagewise 工具栏核心功能
    window.stagewise = {
        // 初始化工具栏
        init: function() {
            console.log('[Stagewise] 工具栏已加载');
            this.setupEventListeners();
            this.showToolbar();
        },
        
        // 设置事件监听器
        setupEventListeners: function() {
            const minimizeBtn = document.getElementById('stagewise-minimize-btn');
            const closeBtn = document.getElementById('stagewise-toolbar-close');
            const panel = document.getElementById('stagewise-toolbar-panel');
            
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => this.showToolbar());
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hideToolbar());
            }
            
            // 按Esc键隐藏工具栏
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isToolbarVisible()) {
                    this.hideToolbar();
                }
            });
        },
        
        // 显示工具栏
        showToolbar: function() {
            const container = document.getElementById('stagewise-toolbar-container');
            const panel = document.getElementById('stagewise-toolbar-panel');
            const minimizeBtn = document.getElementById('stagewise-minimize-btn');
            
            if (container && panel && minimizeBtn) {
                container.style.display = 'block';
                minimizeBtn.classList.add('hidden');
                
                // 延迟添加visible类以触发动画
                setTimeout(() => {
                    panel.classList.add('visible');
                }, 10);
            }
        },
        
        // 隐藏工具栏
        hideToolbar: function() {
            const container = document.getElementById('stagewise-toolbar-container');
            const panel = document.getElementById('stagewise-toolbar-panel');
            const minimizeBtn = document.getElementById('stagewise-minimize-btn');
            
            if (container && panel && minimizeBtn) {
                panel.classList.remove('visible');
                
                setTimeout(() => {
                    container.style.display = 'none';
                    minimizeBtn.classList.remove('hidden');
                }, 300);
            }
        },
        
        // 检查工具栏是否可见
        isToolbarVisible: function() {
            const container = document.getElementById('stagewise-toolbar-container');
            return container && container.style.display !== 'none';
        },
        
        // 元素检查功能
        inspectElement: function() {
            console.log('[Stagewise] 启动元素检查模式');
            alert('元素检查功能已启动！\\n请打开浏览器开发者工具的元素检查器。');
            
            // 如果支持，自动打开开发者工具
            if (window.chrome && window.chrome.devtools) {
                window.chrome.devtools.inspectedWindow.eval('inspect(document.body)');
            }
        },
        
        // 显示页面信息
        showPageInfo: function() {
            const info = {
                'URL': window.location.href,
                '标题': document.title,
                '域名': window.location.hostname,
                '协议': window.location.protocol,
                '端口': window.location.port || '默认',
                '用户代理': navigator.userAgent.split(' ')[0],
                '屏幕分辨率': screen.width + 'x' + screen.height,
                '视口大小': window.innerWidth + 'x' + window.innerHeight,
                '文档加载状态': document.readyState,
                'Cookie数量': document.cookie.split(';').length - 1,
                '本地存储项': localStorage.length,
                '会话存储项': sessionStorage.length
            };
            
            let infoText = '📄 当前页面信息:\\n\\n';
            for (let [key, value] of Object.entries(info)) {
                infoText += key + ': ' + value + '\\n';
            }
            
            alert(infoText);
            console.log('[Stagewise] 页面信息:', info);
        },
        
        // 切换控制台
        toggleConsole: function() {
            console.log('[Stagewise] 尝试打开开发者控制台');
            alert('提示：请按F12或右键选择"检查"来打开开发者控制台');
            console.log('%c[Stagewise] 开发者控制台功能', 'color: #667eea; font-weight: bold; font-size: 16px;');
            console.log('可用的Stagewise命令:', Object.keys(window.stagewise));
        },
        
        // 性能分析
        analyzePerformance: function() {
            console.log('[Stagewise] 开始性能分析');
            
            const perfData = {
                '页面加载时间': this.getPageLoadTime(),
                'DOM节点数量': document.querySelectorAll('*').length,
                '图片数量': document.images.length,
                '脚本数量': document.scripts.length,
                '样式表数量': document.styleSheets.length,
                '链接数量': document.links.length,
                '表单数量': document.forms.length
            };
            
            // 添加性能API数据
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                perfData['DNS查询时间'] = (timing.domainLookupEnd - timing.domainLookupStart) + 'ms';
                perfData['TCP连接时间'] = (timing.connectEnd - timing.connectStart) + 'ms';
                perfData['页面响应时间'] = (timing.responseEnd - timing.requestStart) + 'ms';
                perfData['DOM构建时间'] = (timing.domComplete - timing.domLoading) + 'ms';
            }
            
            let perfText = '⚡ 页面性能分析报告:\\n\\n';
            for (let [key, value] of Object.entries(perfData)) {
                perfText += key + ': ' + value + '\\n';
            }
            
            alert(perfText);
            console.log('[Stagewise] 性能数据:', perfData);
        },
        
        // 获取页面加载时间
        getPageLoadTime: function() {
            if (window.performance && window.performance.timing) {
                const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                return loadTime > 0 ? loadTime + 'ms' : '计算中...';
            }
            return '不支持';
        },
        
        // 导出数据
        exportData: function() {
            console.log('[Stagewise] 准备导出页面分析数据');
            
            const exportData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                title: document.title,
                performance: {
                    loadTime: this.getPageLoadTime(),
                    domNodes: document.querySelectorAll('*').length,
                    images: document.images.length,
                    scripts: document.scripts.length,
                    stylesheets: document.styleSheets.length
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                userAgent: navigator.userAgent
            };
            
            // 创建下载链接
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'stagewise-analysis-' + Date.now() + '.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log('[Stagewise] 数据已导出:', exportData);
            alert('📁 页面分析数据已导出为JSON文件！');
        }
    };
    
    // 自动初始化工具栏
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.stagewise.init());
    } else {
        window.stagewise.init();
    }
    
    // 显示初始化日志
    console.log('%c🚀 Stagewise Universal Toolbar Loaded!', 'color: #667eea; font-weight: bold; font-size: 18px;');
    console.log('%cType "stagewise" in console to access toolbar functions', 'color: #764ba2;');
})();
</script>
<!-- End Stagewise Universal Toolbar -->
`;
}

/**
 * 创建自动注入中间件
 * @returns {Function} Express中间件函数
 */
function createAutoInjectMiddleware() {
    return function autoInjectToolbar(req, res, next) {
        // 只处理HTML响应
        const originalSend = res.send;
        
        res.send = function(data) {
            // 检查是否应该注入工具栏
            if (!shouldShowToolbar(req)) {
                return originalSend.call(this, data);
            }
            
            // 检查是否为HTML内容
            const contentType = res.get('Content-Type') || '';
            if (!contentType.includes('text/html')) {
                return originalSend.call(this, data);
            }
            
            // 检查是否有HTML内容
            if (typeof data === 'string' && data.includes('<html') && data.includes('</body>')) {
                console.log('[Stagewise] 注入工具栏到页面:', req.url);
                
                // 在</body>标签前注入工具栏代码
                const toolbarCode = getToolbarCode();
                const modifiedData = data.replace('</body>', toolbarCode + '\n</body>');
                
                return originalSend.call(this, modifiedData);
            }
            
            return originalSend.call(this, data);
        };
        
        next();
    };
}

module.exports = {
    createAutoInjectMiddleware,
    shouldShowToolbar,
    getToolbarCode
}; 