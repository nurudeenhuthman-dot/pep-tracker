// Minimal service worker — its main job is to satisfy iOS PWA install
// criteria so Notifications API is unlocked. It also caches the shell so
// the page works offline once installed.

const CACHE = 'pep-tracker-v2'; // bumped 2026-06-24: pinned Babel 7.26.4 fix (classic JSX runtime)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network-first for the HTML so updates propagate; cache-first for assets.
  const url = new URL(e.request.url);
  const isHtml = e.request.mode === 'navigate' || url.pathname.endsWith('.html');
  if (isHtml) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return r;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});

// If you later add Web Push, this is where push events would be handled.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => {
    if (cs.length) return cs[0].focus();
    return self.clients.openWindow('./');
  }));
});
