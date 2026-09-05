const CACHE_NAME='zangyo36-v0.7.6-payslip-review9';
const CHARACTER_IDS=['shiori','carrie','takeru','seojun','maru','robotan'];
const CHARACTER_ROOT='./characters-v066/';
const CHARACTERS=CHARACTER_IDS.map(id=>`${CHARACTER_ROOT}${id}.jpg?v=076`);
const ASSETS=['./','./index.html','./styles.css?v=076','./fortune-effects.css?v=076','./app.js?v=076b7','./fortune-effects.mjs?v=076','./logic.mjs?v=076c4','./extras.mjs?v=076m10','./navigation.js?v=076','./attendance-core.mjs?v=076c5','./character-motion.mjs?v=076','./salary-basis.mjs?v=076','./payroll-review.mjs?v=076p1','./payslip-comparison.mjs?v=076p1','./scheduled-hours.mjs?v=076c4','./monthly-ui.mjs?v=076m6','./manifest.webmanifest','./icon.svg',...CHARACTERS];

self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k.startsWith('zangyo36-')&&k!==CACHE_NAME).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim())
));

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-cache'})
      .then(r=>{
        if(r.ok){
          const copy=r.clone();
          caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));
        }
        return r;
      })
      .catch(async()=>{
        const cached=await caches.match(e.request);
        if(cached)return cached;
        if(e.request.mode==='navigate')return caches.match('./index.html');
        return Response.error();
      })
  );
});
