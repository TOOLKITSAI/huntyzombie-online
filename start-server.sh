#!/bin/bash

# Hunty Zombie本地测试服务器启动脚本

echo "🚀 启动Hunty Zombie性能优化版..."
echo "================================"
echo ""

# 检查Python版本
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ 错误: 未找到Python，请先安装Python"
    exit 1
fi

# 启动服务器
PORT=8000
echo "📡 在端口 $PORT 启动HTTP服务器..."
echo ""
echo "🌐 访问地址:"
echo "   主页: http://localhost:$PORT"
echo "   性能测试: http://localhost:$PORT/test-performance.html"
echo ""
echo "📊 在线测试工具:"
echo "   - PageSpeed Insights: https://pagespeed.web.dev/"
echo "   - GTmetrix: https://gtmetrix.com/"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"
echo ""

# 启动HTTP服务器
$PYTHON_CMD -m http.server $PORT