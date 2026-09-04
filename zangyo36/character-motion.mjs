const $=s=>document.querySelector(s);
const MOTION={enabled:true,level:'standard',fortune:true};
const ACTION_CLASSES=['tm-enter','tm-nod','tm-cheer','tm-talk','tm-alert'];

const style=document.createElement('style');
style.id='tokimate-character-motion-style';
style.textContent=`
#heroCharacter,#shopCharacter,#fortuneCharacter,.character-card img{transform-origin:50% 72%;backface-visibility:hidden}
body.tm-motion-standard #heroCharacter{animation:tmIdle 5.2s ease-in-out infinite;will-change:transform}
body.tm-motion-light #heroCharacter{animation:tmIdleLight 8s ease-in-out infinite;will-change:transform}
body.tm-motion-standard #shopCharacter{animation:tmIdle 6.4s ease-in-out infinite;will-change:transform}
body.tm-motion-light #shopCharacter{animation:tmIdleLight 9s ease-in-out infinite;will-change:transform}
body.tm-motion-standard #heroCharacter[data-character-id="maru"],body.tm-motion-standard #shopCharacter[data-character-id="maru"]{animation:tmMaruIdle 3.8s ease-in-out infinite}
body.tm-motion-standard #heroCharacter[data-character-id="robotan"],body.tm-motion-standard #shopCharacter[data-character-id="robotan"]{animation:tmRobotIdle 3.2s ease-in-out infinite}
body.tm-motion-light #heroCharacter[data-character-id="robotan"],body.tm-motion-light #shopCharacter[data-character-id="robotan"]{animation:tmRobotLight 6.5s ease-in-out infinite}
.character-card:hover img{transform:translateY(-3px) scale(1.025);transition:transform .22s ease}
#heroCharacter.tm-enter{animation:tmEnter .7s cubic-bezier(.2,.9,.3,1.2)!important}
#heroCharacter.tm-nod{animation:tmNod .7s ease-in-out!important}
#heroCharacter.tm-cheer{animation:tmCheer .9s cubic-bezier(.2,.9,.3,1.2)!important}
#heroCharacter.tm-talk{animation:tmTalk .9s ease-in-out!important}
#heroCharacter.tm-alert{animation:tmAlert .75s ease-in-out!important}
body.tm-motion-off #heroCharacter,body.tm-motion-off #shopCharacter,body.tm-motion-off #fortuneCharacter,body.tm-motion-off .fortune-stage *,body.tm-motion-off .character-card img{animation:none!important;transform:none!important;transition:none!important}
body.tm-fortune-off #fortuneCharacter,body.tm-fortune-off #fortuneAnimation,body.tm-fortune-off .fortune-stage *,body.tm-fortune-off .spark{animation:none!important}
body.tm-fortune-off .spark{display:none!important}
@keyframes tmIdle{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-3px) scale(1.012)}}
@keyframes tmIdleLight{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
@keyframes tmMaruIdle{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-3px) rotate(-.6deg)}70%{transform:translateY(-1px) rotate(.6deg)}}
@keyframes tmRobotIdle{0%,100%{transform:translateY(0) scale(1);filter:brightness(1)}50%{transform:translateY(-5px) scale(1.008);filter:brightness(1.04)}}
@keyframes tmRobotLight{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes tmEnter{0%{opacity:.35;transform:translateY(10px) scale(.96)}70%{opacity:1;transform:translateY(-2px) scale(1.015)}100%{opacity:1;transform:none}}
@keyframes tmNod{0%,100%{transform:none}30%{transform:translateY(3px) rotate(.6deg)}62%{transform:translateY(-1px) rotate(-.3deg)}}
@keyframes tmCheer{0%,100%{transform:none}32%{transform:translateY(-8px) scale(1.025)}58%{transform:translateY(1px) scale(.995)}78%{transform:translateY(-3px) scale(1.01)}}
@keyframes tmTalk{0%,100%{transform:none}20%{transform:translateY(-2px) rotate(-.5deg)}45%{transform:translateY(1px) rotate(.45deg)}70%{transform:translateY(-1px) rotate(-.2deg)}}
@keyframes tmAlert{0%,100%{transform:none}25%{transform:translateX(-2px)}50%{transform:translateX(2px)}75%{transform:translateX(-1px)}}
@media (prefers-reduced-motion:reduce){body.tm-motion-standard #heroCharacter,body.tm-motion-standard #shopCharacter{animation:tmIdleLight 10s ease-in-out infinite}#heroCharacter.tm-enter,#heroCharacter.tm-nod,#heroCharacter.tm-cheer,#heroCharacter.tm-talk,#heroCharacter.tm-alert{animation-duration:.25s!important}}
`;
document.head.appendChild(style);

function req(r){return new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open('zangyo36_db',2);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
async function readStoredMotion(){
  try{
    const db=await openDB();
    const rec=await req(db.transaction('settings').objectStore('settings').get('main'));
    db.close();
    const v=rec?.value||{};
    MOTION.enabled=v.motionEnabled??true;
    MOTION.level=v.motionLevel==='light'?'light':'standard';
    MOTION.fortune=v.fortuneMotionEnabled??true;
  }catch(e){console.warn('motion settings read failed',e)}
}
async function writeStoredMotion(){
  try{
    const db=await openDB();
    const tx=db.transaction('settings','readwrite'),os=tx.objectStore('settings');
    const rec=await req(os.get('main'));
    os.put({key:'main',value:{...(rec?.value||{}),motionEnabled:MOTION.enabled,motionLevel:MOTION.level,fortuneMotionEnabled:MOTION.fortune}});
    await new Promise((ok,no)=>{tx.oncomplete=ok;tx.onerror=()=>no(tx.error)});
    db.close();
  }catch(e){console.warn('motion settings write failed',e)}
}
function applyMode(){
  document.body.classList.toggle('tm-motion-off',!MOTION.enabled);
  document.body.classList.toggle('tm-motion-standard',MOTION.enabled&&MOTION.level==='standard');
  document.body.classList.toggle('tm-motion-light',MOTION.enabled&&MOTION.level==='light');
  document.body.classList.toggle('tm-fortune-off',!MOTION.fortune);
}
function installSettingsUI(){
  const card=[...document.querySelectorAll('#tab-settings .card')].find(x=>x.querySelector('h2')?.textContent.includes('表示・キャラクター'));
  const grid=card?.querySelector('.formgrid');
  if(!grid||$('#motionEnabled'))return;
  const enabled=document.createElement('div');enabled.className='check';enabled.innerHTML='<input id="motionEnabled" type="checkbox"><label for="motionEnabled">キャラクター動作ON</label>';
  const level=document.createElement('div');level.innerHTML='<label>動作モード</label><select id="motionLevel"><option value="standard">標準</option><option value="light">軽量</option></select>';
  const fortune=document.createElement('div');fortune.className='check';fortune.innerHTML='<input id="fortuneMotionEnabled" type="checkbox"><label for="fortuneMotionEnabled">おみくじ演出ON</label>';
  grid.append(enabled,level,fortune);
  $('#motionEnabled').checked=MOTION.enabled;
  $('#motionLevel').value=MOTION.level;
  $('#fortuneMotionEnabled').checked=MOTION.fortune;
  $('#motionEnabled').addEventListener('change',async e=>{MOTION.enabled=e.target.checked;applyMode();await writeStoredMotion()});
  $('#motionLevel').addEventListener('change',async e=>{MOTION.level=e.target.value==='light'?'light':'standard';applyMode();await writeStoredMotion()});
  $('#fortuneMotionEnabled').addEventListener('change',async e=>{MOTION.fortune=e.target.checked;applyMode();await writeStoredMotion()});
  $('#saveSettings')?.addEventListener('click',()=>setTimeout(writeStoredMotion,80));
}
function play(kind){
  if(!MOTION.enabled)return;
  const img=$('#heroCharacter');if(!img)return;
  ACTION_CLASSES.forEach(c=>img.classList.remove(c));
  void img.offsetWidth;
  img.classList.add(kind);
  setTimeout(()=>img.classList.remove(kind),1100);
}
function monitorPunch(){
  const el=$('#todayPunchMessage');if(!el)return;
  let last=el.textContent;
  new MutationObserver(()=>{
    const t=el.textContent||'';if(t===last)return;last=t;
    if(/^出勤 .*保存しました。/.test(t))play('tm-nod');
    else if(/^退勤 .*保存しました。/.test(t))play('tm-cheer');
    else if(/勤務中です|先に出勤|記録済み/.test(t))play('tm-alert');
  }).observe(el,{childList:true,subtree:true,characterData:true});
}
function monitorChat(){
  const log=$('#chatLog');if(!log)return;
  new MutationObserver(rs=>{
    for(const r of rs)for(const n of r.addedNodes)if(n instanceof Element&&n.classList.contains('bot'))play('tm-talk');
  }).observe(log,{childList:true});
  $('#openChat')?.addEventListener('click',()=>play('tm-nod'));
}
function monitorCharacterChange(){
  const img=$('#heroCharacter');if(!img)return;
  new MutationObserver(()=>play('tm-enter')).observe(img,{attributes:true,attributeFilter:['src']});
}
function monitorPoints(){
  const el=$('#pointsBalance');if(!el)return;let prev=Number(el.textContent)||0;
  new MutationObserver(()=>{const now=Number(el.textContent)||0;if(now>prev)play('tm-cheer');prev=now}).observe(el,{childList:true,subtree:true,characterData:true});
}
async function init(){
  await readStoredMotion();
  applyMode();
  installSettingsUI();
  monitorPunch();monitorChat();monitorCharacterChange();monitorPoints();
}
init();
