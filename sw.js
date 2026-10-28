// Service worker offline-first para la app de Yuly · wil 2026-10-27
const V = "ysb-v1";
const F = ["./index.html", "./manifest.json", "./icono192.png", "./icono512.png", "./icono180.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(F)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k != V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(x => {
    if (x.ok && e.request.method == "GET") { const c = x.clone(); caches.open(V).then(c2 => c2.put(e.request, c)); }
    return x;
  }).catch(() => caches.match("./index.html"))));
});
