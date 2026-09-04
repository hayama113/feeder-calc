const CACHE_NAME='zangyo36-v0.6.0';
const ASSETS=['./','./index.html','./styles.css','./app.js','./logic.mjs','./extras.mjs','./manifest.webmanifest','./icon.svg','./characters/shiori.jpg','./characters/carrie.jpg','./characters/takeru.jpg','./characters/seojun.jpg','./characters/maru.jpg','./characters/robotan.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zangyo36-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html'))))});
