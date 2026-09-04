const CACHE_NAME='zangyo36-v0.6.5';
const CHARACTERS=['./characters/shiori.jpg?v=065','./characters/carrie.jpg?v=065','./characters/takeru.jpg?v=065','./characters/seojun.jpg?v=065','./characters/maru.jpg?v=065','./characters/robotan.jpg?v=065'];
const ASSETS=['./','./index.html','./styles.css?v=064','./fortune-effects.css?v=064','./app.js?v=064','./fortune-effects.mjs?v=064','./logic.mjs?v=061','./extras.mjs?v=064','./manifest.webmanifest','./icon.svg',...CHARACTERS];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zangyo36-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isCharacter=url.pathname.includes('/zangyo36/characters/')&&/\.jpe?g$/i.test(url.pathname);
  if(isCharacter){
    e.respondWith(fetch(e.request,{cache:'reload'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))}return r}).catch(async()=>{const cached=await caches.match(e.request);if(cached)return cached;if(e.request.mode==='navigate')return caches.match('./index.html');return Response.error()}));
});
