// 网站运行状况计时器
// 设定网站上线起始时间（此处以 2024-01-01 00:00:00 为例，你可以按需修改）
const START_DATE = new Date('2024-01-01T00:00:00');

function formatUptime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days} 天 ${hours} 小时 ${minutes} 分钟`;
}

function updateUptime() {
    const now = new Date();
    const diff = now - START_DATE;
    if (diff < 0) {
        // 如果当前时间早于起始时间，显示为 0
        document.getElementById('uptime').textContent = '0 天 0 小时 0 分钟';
        return;
    }
    document.getElementById('uptime').textContent = formatUptime(diff);
}

// 初次更新
updateUptime();
// 每秒更新一次
setInterval(updateUptime, 1000);

// 可选：控制台提示
console.log('✨ WiPhi Blog 已启动 — 毛玻璃 + 悬停动效');