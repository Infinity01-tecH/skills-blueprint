// Navigator — minimal service worker
// Purpose: Chrome/Android require an active service worker before they'll
// offer the "Install app" prompt at all — that's the main job here. As a
// bonus it caches the app shell so Navigator still opens (with cached data)
// on a flaky connection, though live features (roadmap generation, sync)
// still need real network.

const CACHE_NAME = 'navigator-shell-v1';
const SHELL_FILES = [
  'navigator-app-v32.html',
  'icon128.png',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for navigation/app files (so users always get your latest
// version when online), falling back to cache only when offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
