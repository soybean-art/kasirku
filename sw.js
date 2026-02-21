// sw.js - Service Worker untuk Kasir Pro 2.0
const CACHE_NAME = 'kasir-pro-v1';

// Daftar file yang akan disimpan di memori HP agar bisa dibuka offline
const urlsToCache = [
  './',
  './index.html',
  './kasir.css',
  './kasir.js',
  './kasir-data.js',
  './manifest.json'
];

// 1. Proses Install: Menyimpan file ke Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Proses Activate: Membersihkan Cache lama jika ada update versi (v1 ke v2 dst)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Proses Fetch: Mengambil dari Cache dulu saat offline, jika tidak ada baru ke Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, gunakan itu (bisa buka tanpa internet)
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari internet
        return fetch(event.request);
      })
      .catch(() => {
        // Fallback jika internet mati dan file tidak ada di cache
        console.log('Service Worker: Fetch failed, offline mode');
      })
  );
});
