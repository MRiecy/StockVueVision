// 调试数据模式设置脚本
// 在浏览器控制台中运行此脚本来修复数据模式问题

console.log('=== 数据模式调试脚本 ===');

// 1. 检查当前localStorage设置
console.log('当前localStorage设置:');
console.log('useMockData:', localStorage.getItem('useMockData'));

// 2. 强制设置为真实数据模式
localStorage.setItem('useMockData', 'false');
console.log('已设置为真实数据模式');

// 3. 验证设置
console.log('验证设置:', localStorage.getItem('useMockData'));

// 4. 刷新页面以应用新设置
console.log('3秒后自动刷新页面...');
setTimeout(() => {
    window.location.reload();
}, 3000);
