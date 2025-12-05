// Tap Quest Service Worker
const CACHE_NAME = 'tapquest-v2.54';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/data.js',
    './js/game.js',
    './js/ui.js',
    './js/save.js',
    './js/main.js',
    './manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // 即座にアクティブ化
    );
});

// アクティブ化時に古いキャッシュを削除
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 即座にクライアントを制御
    );
});

// フェッチ時：ネットワーク優先、失敗時にキャッシュ
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // 成功したらキャッシュを更新
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // オフライン時はキャッシュから
                return caches.match(event.request);
            })
    );
});

// メッセージでキャッシュクリア
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    if (event.data === 'clearCache') {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        }).then(() => {
            event.ports[0].postMessage('cacheCleared');
        });
    }
});
