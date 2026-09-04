const CACHE_NAME='zangyo36-v0.6.3';
const SHIORI='./characters/shiori-v063.jpg?v=063';
const ASSETS=['./','./index.html','./styles.css?v=061','./app.js?v=061','./logic.mjs?v=061','./extras.mjs?v=061','./manifest.webmanifest','./icon.svg',SHIORI,'./characters/carrie.jpg?v=061','./characters/takeru.jpg?v=061','./characters/seojun.jpg?v=061','./characters/maru.jpg?v=061','./characters/robotan.jpg?v=061'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zangyo36-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('/zangyo36/characters/shiori.jpg')){
    e.respondWith(fetch(new URL(SHIORI,self.registration.scope),{cache:'reload'}).then(r=>r.ok?r:Promise.reject(new Error('shiori fetch failed'))).catch(()=>caches.match(SHIORI)));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))}return r}).catch(async()=>{const cached=await caches.match(e.request);if(cached)return cached;if(e.request.mode==='navigate')return caches.match('./index.html');return Response.error()}));
});
