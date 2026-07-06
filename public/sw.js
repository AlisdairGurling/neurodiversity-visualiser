/* Minimal service worker for the Neurodiversity Visualiser.
 *
 * Strategy:
 * - Hashed build assets, fonts and icons: cache-first (they're immutable —
 *   a content change produces a new URL).
 * - Navigations: network-first with a cached fallback, so the app shell
 *   still opens offline after the first visit.
 * Everything else (e.g. cross-origin API calls) passes straight through.
 */
const CACHE = 'nv-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isImmutableAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/icons/');

  if (isImmutableAsset) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/')),
    );
  }
});
