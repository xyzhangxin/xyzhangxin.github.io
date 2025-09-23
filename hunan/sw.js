const CACHE_NAME = 'zjj-trip-v1';
const urlsToCache = [
  './trip-assistant.html',
  './trip-data.json',
  './todo-data.json',
  './manifest.json'
];

// 安装Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 获取资源
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果缓存中有响应，则返回缓存版本
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request);
      }
    )
  );
});

// 更新Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
