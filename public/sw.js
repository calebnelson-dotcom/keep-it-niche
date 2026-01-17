importScripts('/scram/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = req.url;

  // 🔴 HARD BYPASS — do NOT touch these
  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) return;

  if (
    url.includes("googlesyndication.com") ||
    url.includes("doubleclick.net") ||
    url.includes("googleadservices.com") ||
    url.includes("adtrafficquality.google")
  ) {
    return; // let browser handle it
  }

  // 🔴 Already proxied — DO NOT rewrap
  if (url.includes("/scramjet/")) {
    return;
  }

  event.respondWith(handleScramjetFetch(event));
});


  // Let TMDB images bypass Scramjet cleanly
  if (url.hostname === 'image.tmdb.org') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith((async () => {
    try {
      await scramjet.loadConfig();

      if (scramjet.route(event)) {
        return scramjet.fetch(event);
      }

      return fetch(event.request);
    } catch (err) {
      console.error('[Scramjet SW] Fatal error, resetting:', err);

      // HARD fallback — don't partially proxy
      return fetch(event.request);
    }
  })());
});
