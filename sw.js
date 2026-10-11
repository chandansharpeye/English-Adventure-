const CACHE_NAME = "english-adventure-v4";
const APP_FILES = [
  "./", "./index.html", "./offline.html", "./styles.css", "./audio.js", "./data.js", "./app.js", "./manifest.json",
  "./assets/icon.svg", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-maskable-192.png",
  "./assets/icon-maskable-512.png", "./assets/apple-touch-icon.png", "./assets/favicon-32.png"
];
// Cache every file on its own so one missing file can never stop the app from installing.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => Promise.allSettled(APP_FILES.map(f => cache.add(f))))
  );
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});
// Network first (updates show up right away); cache is the offline fallback.
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).then(response => {
      if (response && response.status === 200) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return response;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(cached =>
        cached || (req.mode === "navigate" ? caches.match("./index.html").then(r => r || caches.match("./offline.html")) : Response.error())
      )
    )
  );
});
