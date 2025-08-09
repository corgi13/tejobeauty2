self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.open('tejo-static-v1').then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      } catch {
        return new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
      }
    })
  );
});


