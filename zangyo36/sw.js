const CACHE_NAME='zangyo36-v0.6.6';
const CHARACTER_IDS=['shiori','carrie','takeru','seojun','maru','robotan'];
const CHARACTER_ROOT='./characters-v066/';
const CHARACTERS=CHARACTER_IDS.map(id=>`${CHARACTER_ROOT}${id}.jpg?v=066`);
const ASSETS=['./','./index.html','./styles.css?v=064','./fortune-effects.css?v=064','./app.js?v=064','./fortune-effects.mjs?v=064','./logic.mjs?v=061','./extras.mjs?v=064','./manifest.webmanifest','./icon.svg',...CHARACTERS];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zangyo36-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
function characterId(pathname){const m=pathname.match(/\/(shiori|carrie|takeru|seojun|maru|robotan)(?:-v\d+)?\.jpe?g$/i);return m?.[1]?.toLowerCase()||''}
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url),id=characterId(url.pathname);
  if(id&&url.pathname.includes('/zangyo36/')){
    const target=new URL(`${CHARACTER_ROOT}${id}.jpg?v=066`,self.registration.scope);
    e.respondWith(fetch(target,{cache:'reload'}).then(async r=>{if(!r.ok)throw new Error(`character ${r.status}`);const copy=r.clone();const c=await caches.open(CACHE_NAME);await c.put(target,copy);return r}).catch(async()=>await caches.match(target)||await caches.match(e.request)||Response.error()));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))}return r}).catch(async()=>{const cached=await caches.match(e.request);if(cached)return cached;if(e.request.mode==='navigate')return caches.match('./index.html');return Response.error()}));
});
