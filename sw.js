const CACHE_NAME = "oe-adventure-v11-reminder";
const APP_FILES = [
  "./", "./index.html", "./offline.html", "./styles.css", "./audio.js", "./data.js", "./app.js", "./adventure-lab.js", "./v2-upgrade.js", "./manifest.json",
  "./cbot-ai.js", "./cbot-ai.css", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-192.png",
  "./icon-maskable-512.png", "./apple-touch-icon.png", "./favicon-32.png"
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

// Daily reminder: show the notification sent by the server, and open the app when tapped.
self.addEventListener("push", event => {
  let d = { title: "O-E Adventure", body: "Time to practise!", url: "/" };
  try { d = Object.assign(d, event.data.json()); } catch (e) {}
  event.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, icon: "assets/icon-192.png", badge: "assets/icon-192.png", data: { url: d.url }
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(clients.openWindow(url));
});
