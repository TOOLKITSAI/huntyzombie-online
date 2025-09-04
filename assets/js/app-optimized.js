/**
 * HUNTY ZOMBIE - 优化后的主应用程序
 * 性能优先，延迟加载非关键功能
 */

(function() {
    'use strict';

    // =============================================
    // 关键DOM元素缓存
    // =============================================
    const DOM = {};
    
    // =============================================
    // 应用状态
    // =============================================
    const STATE = {
        isMobileMenuOpen: false,
        copiedCodes: new Set()
    };

    // =============================================
    // 初始化关键功能（立即执行）
    // =============================================
    function initCritical() {
        // 缓存关键DOM元素
        DOM.navbar = document.getElementById('navbar');
        DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        DOM.navMenu = document.getElementById('navMenu');
        DOM.backToTop = document.getElementById('backToTop');
        
        // 移动菜单功能
        if (DOM.mobileMenuBtn) {
            DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        
        // 滚动效果（优化版）
        initOptimizedScroll();
        
        // 代码复制功能
        initCodeCopy();
    }

    // =============================================
    // 优化的滚动处理
    // =============================================
    function initOptimizedScroll() {
        let ticking = false;
        let lastScrollY = 0;
        
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    
                    // 导航栏显示/隐藏
                    if (DOM.navbar) {
                        if (scrollY > lastScrollY && scrollY > 100) {
                            DOM.navbar.style.transform = 'translateY(-100%)';
                        } else {
                            DOM.navbar.style.transform = 'translateY(0)';
                        }
                    }
                    
                    // 返回顶部按钮
                    if (DOM.backToTop) {
                        DOM.backToTop.classList.toggle('visible', scrollY > 500);
                    }
                    
                    lastScrollY = scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        // 使用passive监听器提升性能
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 返回顶部功能
        if (DOM.backToTop) {
            DOM.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // =============================================
    // 移动菜单切换
    // =============================================
    function toggleMobileMenu() {
        STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
        
        if (DOM.navMenu) {
            DOM.navMenu.classList.toggle('active');
        }
        
        if (DOM.mobileMenuBtn) {
            const icon = DOM.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        }
    }

    // =============================================
    // 代码复制功能（优化版）
    // =============================================
    function initCodeCopy() {
        // 使用事件委托减少监听器数量
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.copy-btn');
            if (!btn) return;
            
            e.preventDefault();
            const code = btn.dataset.code;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // 视觉反馈
                const originalHTML = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHTML;
                }, 2000);
                
                // 显示提示
                showToast(`Code "${code}" copied!`, 'success');
            } catch (err) {
                showToast('Failed to copy code', 'error');
            }
        });
    }

    // =============================================
    // 轻量级Toast通知
    // =============================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        
        // 使用CSS动画而非JS
        toast.style.animation = 'slideInRight 0.3s ease';
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =============================================
    // 延迟加载非关键功能
    // =============================================
    function loadDeferredFeatures() {
        // 延迟加载计数器动画
        setTimeout(() => {
            const counters = document.querySelectorAll('[data-count]');
            if (counters.length > 0) {
                initCounters(counters);
            }
        }, 1000);
        
        // 延迟加载代码过滤器
        setTimeout(() => {
            initCodeFilters();
        }, 1500);
        
        // 延迟加载语言切换
        setTimeout(() => {
            initLanguageSelector();
        }, 2000);
    }

    // =============================================
    // 计数器动画（优化版）
    // =============================================
    function initCounters(counters) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(target);
            }
        }
        
        requestAnimationFrame(update);
    }

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // =============================================
    // 代码过滤器
    // =============================================
    function initCodeFilters() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        if (filterTabs.length === 0) return;
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 更新活动标签
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const filter = tab.dataset.filter;
                const cards = document.querySelectorAll('.code-card');
                
                cards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const categories = card.dataset.category || '';
                        card.style.display = categories.includes(filter) ? 'block' : 'none';
                    }
                });
            });
        });
    }

    // =============================================
    // 语言选择器
    // =============================================
    function initLanguageSelector() {
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');
        
        if (!langBtn || !langDropdown) return;
        
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        
        // 点击外部关闭
        document.addEventListener('click', () => {
            langDropdown.classList.remove('active');
        });
    }

    // =============================================
    // 性能监控（仅开发环境）
    // =============================================
    function monitorPerformance() {
        if (window.location.hostname === 'localhost') {
            // 监控FCP
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('FCP:', entry.startTime);
                }
            }).observe({ entryTypes: ['paint'] });
            
            // 监控LCP
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('LCP:', entry.startTime);
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    // =============================================
    // 初始化应用
    // =============================================
    
    // 立即执行关键功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCritical);
    } else {
        initCritical();
    }
    
    // 页面加载完成后加载非关键功能
    window.addEventListener('load', () => {
        loadDeferredFeatures();
        monitorPerformance();
    });
    
    // 导出公共API
    window.HuntyZombie = {
        showToast,
        formatNumber
    };

})();