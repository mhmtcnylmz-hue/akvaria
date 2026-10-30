// Akvaria çevrimdışı önbellek. Sürüm değişince eski önbellek silinir.
const V = "akvaria-v182";
// Resim ve ses dosyaları (a/ klasörü) içerik özetiyle adlandırılır, değişmez; sürümler arasında ayrı önbellekte saklanır
const A = "akvaria-assets";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== A).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  // Başka sitelere (Firebase, Google) giden istekler önbelleğe alınmaz
  if (new URL(r.url).origin !== self.location.origin) return;
  if (new URL(r.url).pathname.includes("/a/")) {
    e.respondWith(caches.open(A).then(c => c.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }))));
    return;
  }
  const nav = r.mode === "navigate";
  // Sayfa: önce ağ (güncel sürüm), ağ yoksa önbellek. Diğerleri: önce önbellek.
  if (nav) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put("./index.html", cp)); return res; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => hit)));
});
