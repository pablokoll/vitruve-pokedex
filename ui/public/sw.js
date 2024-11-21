// public/sw.js

const CACHE_NAME = 'ionic-react-cache-v1';
const API_CACHE = 'api-cache';
const IMAGE_CACHE = 'image-cache';

const STATIC_ASSETS = [
  '/', // index.html
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

const VITE_FILES = [
  '/',
  '/@vite/client',
  '/src/main.tsx',
  '/manifest.json',
];

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activación: Limpia cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (![CACHE_NAME, API_CACHE, IMAGE_CACHE].includes(cache)) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  const isImage = IMAGE_EXTENSIONS.some((ext) =>
    requestUrl.pathname.endsWith(ext)
  );  
  
  if (isImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(event.request)
            .then((response) => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => {
              console.log('Imagen no disponible en cache o red');
            });
        })
      )
    );
    return;
  }

  if (requestUrl.pathname.startsWith('/api')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
    return;
  }

  if (requestUrl.origin === 'https://raw.githubusercontent.com') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log(`[SW] Imagen cacheada encontrada: ${event.request.url}`);
            return cachedResponse;
          }

          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
              console.log(`[SW] Imagen cacheada: ${event.request.url}`);
            }
            return response;
          });
        })
      )
    );
    return;
  }

  if (VITE_FILES.includes(requestUrl.pathname) || event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request) || caches.match(OFFLINE_URL))
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/index.html').then((cachedResponse) => cachedResponse)
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
