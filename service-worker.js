/**
 * Service Worker for Hunty Zombie
 * 实现智能缓存策略和离线支持
 */

const CACHE_NAME = 'hunty-zombie-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';

// 核心资源 - 首次安装时缓存
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/css/critical.css',
  '/assets/js/lazy-loader.js',
  '/assets/js/app-optimized.js',
  // 离线页面
  '/offline.html'
];

// 动态缓存策略配置
const CACHE_STRATEGIES = {
  // 网络优先，适用于API和动态内容
  networkFirst: [
    '/api/',
    '/codes/',
    '/wiki/'
  ],
  // 缓存优先，适用于静态资源
  cacheFirst: [
    '/assets/css/',
    '/assets/js/',
    '/assets/images/',
    '/assets/data/'
  ],
  // 仅网络，适用于分析和追踪
  networkOnly: [
    'google-analytics.com',
    'googletagmanager.com'
  ]
};

// 安装事件 - 缓存核心资源
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching core assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch事件 - 智能缓存策略
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 忽略非GET请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 忽略Chrome扩展和开发者工具
  if (url.protocol === 'chrome-extension:' || 
      url.hostname === 'localhost' && url.port === '3000') {
    return;
  }
  
  // 判断使用哪种缓存策略
  const strategy = getStrategy(url.pathname);
  
  switch (strategy) {
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'networkOnly':
      event.respondWith(fetch(request));
      break;
    default:
      // 默认策略：缓存优先，网络回退
      event.respondWith(cacheFirst(request));
  }
});

// 获取URL对应的缓存策略
function getStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy;
    }
  }
  return 'cacheFirst';
}

// 网络优先策略
async function networkFirst(request) {
  try {
    // 设置网络超时
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), 5000)
    );
    
    const response = await Promise.race([networkPromise, timeoutPromise]);
    
    // 如果网络请求成功，更新缓存
    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // 网络失败，尝试从缓存获取
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果是导航请求，返回离线页面
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// 缓存优先策略
async function cacheFirst(request) {
  // 先检查缓存
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // 后台更新缓存（stale-while-revalidate）
    updateCache(request);
    return cachedResponse;
  }
  
  // 缓存未命中，从网络获取
  try {
    const response = await fetch(request);
    
    // 只缓存成功的响应
    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Fetch failed:', error);
    
    // 如果是导航请求，返回离线页面
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// 后台更新缓存
async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response);
    }
  } catch (error) {
    // 静默失败，不影响用户体验
    console.log('[SW] Background update failed:', error);
  }
}

// 监听消息事件
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting on message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing all caches');
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
});

// 后台同步（如果浏览器支持）
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered');
  
  if (event.tag === 'update-cache') {
    event.waitUntil(
      updateAllCaches()
    );
  }
});

// 更新所有缓存
async function updateAllCaches() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  
  const updatePromises = requests.map(request => 
    fetch(request).then(response => {
      if (response && response.ok) {
        return cache.put(request, response);
      }
    }).catch(() => {})
  );
  
  return Promise.all(updatePromises);
}