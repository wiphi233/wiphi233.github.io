// 移动端菜单切换功能
console.log('Script loaded successfully!');
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // 页面跳转配置
    const pageRoutes = {
        'Home': 'index.html',
        'Minecraft': 'minecraft.html',
        'Support': 'support.html'
    };
    
    // 点击菜单切换按钮
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // 为每个菜单项添加点击事件
    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // 防止默认行为
            
            // 检查元素是否有id
            const pageId = this.id;
            console.log('点击了菜单项，ID:', pageId); // 调试信息
            
            if (!pageId) {
                console.error('菜单项没有设置id属性');
                return;
            }
            
            // 如果配置了该页面的路由，则跳转
            if (pageRoutes[pageId]) {
                console.log('准备跳转到:', pageRoutes[pageId]); // 调试信息
                
                // 如果是移动端菜单，先关闭菜单
                if (window.innerWidth <= 768) {
                    if (navMenu) navMenu.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    
                    // 延迟跳转，让用户看到菜单关闭动画
                    setTimeout(() => {
                        window.location.href = pageRoutes[pageId];
                    }, 300);
                } else {
                    // 桌面端直接跳转
                    window.location.href = pageRoutes[pageId];
                }
            } else {
                console.warn(`未找到页面 ${pageId} 的路由配置`);
            }
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
        if (!navMenu || !menuToggle) return;
        
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // 窗口大小变化时调整菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    });
});