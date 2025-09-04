/**
 * 高性能懒加载模块
 * 处理图片、iframe和其他资源的延迟加载
 */

(function() {
    'use strict';

    // 配置选项
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01,
        loadedClass: 'lazy-loaded',
        loadingClass: 'lazy-loading',
        errorClass: 'lazy-error'
    };

    // 图片懒加载
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // 添加loading类
                img.classList.add(config.loadingClass);
                
                // 创建新图片对象来预加载
                const tempImg = new Image();
                
                tempImg.onload = () => {
                    img.src = tempImg.src;
                    img.classList.remove(config.loadingClass);
                    img.classList.add(config.loadedClass);
                    
                    // 如果有srcset
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                };
                
                tempImg.onerror = () => {
                    img.classList.remove(config.loadingClass);
                    img.classList.add(config.errorClass);
                };
                
                // 开始加载
                tempImg.src = img.dataset.src;
                
                // 移除data属性
                img.removeAttribute('data-src');
                img.removeAttribute('data-srcset');
                
                // 停止观察
                observer.unobserve(img);
            }
        });
    }, config);
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // YouTube iframe懒加载（Facade模式）
    const initYouTubeFacade = () => {
        const youtubeContainers = document.querySelectorAll('.youtube-facade');
        
        youtubeContainers.forEach(container => {
            const videoId = container.dataset.videoId;
            if (!videoId) return;
            
            // 创建缩略图
            const thumbnail = document.createElement('img');
            thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            thumbnail.alt = 'Video thumbnail';
            thumbnail.loading = 'lazy';
            thumbnail.className = 'youtube-thumbnail';
            
            // 创建播放按钮
            const playButton = document.createElement('button');
            playButton.className = 'youtube-play-button';
            playButton.innerHTML = `
                <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                    <path fill="#212121" fill-opacity="0.8" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path>
                    <path fill="#fff" d="M 45,24 27,14 27,34"></path>
                </svg>
            `;
            playButton.setAttribute('aria-label', 'Play video');
            
            // 添加到容器
            container.appendChild(thumbnail);
            container.appendChild(playButton);
            
            // 点击时加载真实iframe
            container.addEventListener('click', () => {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.className = 'youtube-iframe';
                
                // 替换内容
                container.innerHTML = '';
                container.appendChild(iframe);
            }, { once: true });
        });
    };

    // 延迟加载Font Awesome
    const loadFontAwesome = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        link.media = 'print';
        link.onload = function() { this.media = 'all'; };
        document.head.appendChild(link);
    };

    // 延迟加载非关键CSS
    const loadDeferredStyles = () => {
        const links = document.querySelectorAll('link[data-defer]');
        links.forEach(link => {
            link.removeAttribute('data-defer');
            link.media = 'all';
        });
    };

    // 初始化
    if ('IntersectionObserver' in window) {
        // 现代浏览器
        document.addEventListener('DOMContentLoaded', () => {
            initYouTubeFacade();
            setTimeout(loadFontAwesome, 100);
            setTimeout(loadDeferredStyles, 200);
        });
    } else {
        // 降级处理
        document.addEventListener('DOMContentLoaded', () => {
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
            loadFontAwesome();
            loadDeferredStyles();
        });
    }

    // 预加载关键图片
    const preloadCriticalImages = () => {
        const criticalImages = [
            '/assets/images/weapons/Greatsword.webp',
            '/assets/images/weapons/Guitar.jpeg',
            '/assets/images/weapons/Dual Gun.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    };

    // 立即预加载关键图片
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalImages);
    } else {
        preloadCriticalImages();
    }

})();