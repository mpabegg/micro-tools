// Service worker para micro-tools.
// Tudo relativo a self.registration.scope para funcionar em qualquer subcaminho
// (ex.: GitHub Pages em /<repo>/).
//
// Ao adicionar uma nova ferramenta:
//   1. inclua o caminho em APP_SHELL abaixo
//   2. suba a versão do CACHE para forçar refresh nos clientes

const CACHE = "tools-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./sets-tracker.html",
  "./riff-trainer.html",
  "./manifest.json",
  "./icon.svg",
  "./icon-maskable.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isGoogleFont =
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com";

  if (sameOrigin) {
    // App shell: cache-first, com fallback de rede e atualização opportunista.
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  if (isGoogleFont) {
    // Fontes do Google: stale-while-revalidate oportunista.
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
