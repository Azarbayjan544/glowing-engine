// برنامه آذربایجان — حافظه آفلاین (PWA)
const CACHE = "az-v21";
const CORE = [
  "./",
  "./index.html",
  "./shop.html",
  "./customer.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./hero.jpg"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(()=>{})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => {
      const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)).catch(()=>{});
      return r;
    }).catch(() => caches.match(req).then((m) => m || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then((m) => {
    if (m) return m;
    return fetch(req).then((r) => {
      if (r && r.status === 200) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)).catch(()=>{}); }
      return r;
    }).catch(() => m);
  }));
});
