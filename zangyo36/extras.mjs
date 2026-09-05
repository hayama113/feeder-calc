const $=s=>document.querySelector(s);
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open('zangyo36_db',2);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
function readAll(db,store){return new Promise((ok,no)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
function clearStore(db,store){return new Promise((ok,no)=>{const r=db.transaction(store,'readwrite').objectStore(store).clear();r.onsuccess=()=>ok();r.onerror=()=>no(r.error)})}
function putAll(db,store,rows){return new Promise((ok,no)=>{const tx=db.transaction(store,'readwrite'),os=tx.objectStore(store);for(const row of rows||[])os.put(row);tx.oncomplete=()=>ok();tx.onerror=()=>no(tx.error)})}
const b64=u=>btoa(String.fromCharCode(...u));
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function derive(password,salt){const raw=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function snapshot(){const db=await openDB();const out={app:'recolife-zangyo36',version:3,exportedAt:new Date().toISOString()};for(const s of ['entries','settings','payslips','extras'])out[s]=db.objectStoreNames.contains(s)?await readAll(db,s):[];db.close();return out}
async function exportBackup(){try{const data=JSON.stringify(await snapshot()),password=$('#backupPassword')?.value||'';let payload,name;if(password){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await derive(password,salt),cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(data)));payload=JSON.stringify({format:'recolife-aesgcm-v1',salt:b64(salt),iv:b64(iv),data:b64(cipher)});name=`recolife-backup-${new Date().toISOString().slice(0,10)}.zgbak`}else{payload=data;name=`recolife-backup-${new Date().toISOString().slice(0,10)}.json`}const blob=new Blob([payload],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch(e){console.error(e);alert('バックアップの書き出しに失敗しました。')}}
async function importBackup(file){if(!file)return;try{let text=await file.text(),obj=JSON.parse(text);if(obj.format==='recolife-aesgcm-v1'){const password=$('#backupPassword')?.value||prompt('バックアップのパスワードを入力してください')||'';if(!password)throw new Error('password required');const key=await derive(password,unb64(obj.salt)),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(obj.iv)},key,unb64(obj.data));obj=JSON.parse(new TextDecoder().decode(plain))}if(!obj||!Array.isArray(obj.entries))throw new Error('invalid backup');if(!confirm('現在の端末内データをバックアップ内容で置き換えますか？'))return;const db=await openDB();for(const s of ['entries','settings','payslips','extras'])if(db.objectStoreNames.contains(s)){await clearStore(db,s);await putAll(db,s,obj[s]||[])}db.close();alert('復元しました。アプリを再読み込みします。');location.reload()}catch(e){console.error(e);alert('復元できませんでした。ファイルまたはパスワードを確認してください。')}}
async function persist(){const el=$('#storageState');if(!navigator.storage?.persist){if(el)el.textContent='永続保存API非対応';return}const ok=await navigator.storage.persist();if(el){el.textContent=ok?'永続保存：有効':'永続保存：未確定';el.className=`pill ${ok?'ok':'warn'}`}}
async function showPersist(){const el=$('#storageState');if(!el||!navigator.storage?.persisted)return;const ok=await navigator.storage.persisted();el.textContent=ok?'永続保存：有効':'永続保存：未確定';el.className=`pill ${ok?'ok':'warn'}`}
async function clearEntries(){if(!confirm('勤務データを全削除しますか？この操作は元に戻せません。'))return;const db=await openDB();await clearStore(db,'entries');db.close();location.reload()}
function voiceInput(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return alert('このブラウザでは音声入力を利用できません。文字入力をご利用ください。');const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;r.onresult=e=>{const input=$('#chatInput');if(input)input.value=e.results[0][0].transcript};r.onerror=()=>alert('音声入力を開始できませんでした。');r.start()}
$('#exportBackup')?.addEventListener('click',exportBackup);
$('#importBackup')?.addEventListener('change',e=>importBackup(e.target.files?.[0]));
$('#requestPersist')?.addEventListener('click',persist);
$('#clearAll')?.addEventListener('click',clearEntries);
$('#micBtn')?.addEventListener('click',voiceInput);
showPersist();

const APP_NAME='TokiMate Pro';
const APP_VERSION='v0.7.6';
const CHARACTER_IDS=['shiori','carrie','takeru','seojun','maru','robotan'];
const CHARACTER_ROOT='./characters-v066/';
function applyBranding(){
  document.title=APP_NAME;
  const brand=document.querySelector('.brand strong'); if(brand)brand.textContent=APP_NAME;
  const mark=document.querySelector('.brandmark'); if(mark)mark.textContent='T';
  const sub=document.querySelector('.brand small'); if(sub)sub.textContent=`勤怠・給与アシスタント ${APP_VERSION}`;
}
function characterIdFromSrc(src=''){
  const m=src.match(/\/(shiori|carrie|takeru|seojun|maru|robotan)(?:-v\d+)?\.jpe?g(?:[?#].*)?$/i);
  return m?.[1]?.toLowerCase()||'';
}
function repairCharacterImage(img){
  if(!(img instanceof HTMLImageElement))return;
  const src=img.getAttribute('src')||'';
  const id=characterIdFromSrc(src);
  if(!id||!CHARACTER_IDS.includes(id))return;
  img.dataset.characterId=id;
  if(!src.includes('/characters-v066/'))img.src=`${CHARACTER_ROOT}${id}.jpg?v=076`;
}
function repairAllCharacters(root=document){root.querySelectorAll?.('img').forEach(repairCharacterImage)}
const characterObserver=new MutationObserver(records=>{for(const r of records){if(r.type==='attributes'&&r.target instanceof HTMLImageElement)repairCharacterImage(r.target);for(const n of r.addedNodes)if(n instanceof Element){if(n instanceof HTMLImageElement)repairCharacterImage(n);repairAllCharacters(n)}}});
characterObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
document.addEventListener('error',e=>{const img=e.target;if(!(img instanceof HTMLImageElement))return;const id=img.dataset.characterId||characterIdFromSrc(img.getAttribute('src')||'');if(!id||img.dataset.characterFallback==='1')return;img.dataset.characterFallback='1';img.src=`./characters/${id}.jpg?v=076`;},true);
applyBranding();
repairAllCharacters();

import('./navigation.js?v=076').catch(e=>console.error('navigation fallback load failed',e));
import('./attendance-core.mjs?v=076c2').catch(e=>console.error('attendance core load failed',e));
import('./character-motion.mjs?v=068').catch(e=>console.error('character motion load failed',e));
import('./salary-basis.mjs?v=076').catch(e=>console.error('salary basis load failed',e));
import('./payroll-review.mjs?v=076c2').catch(e=>console.error('payroll review load failed',e));
import('./scheduled-hours.mjs?v=076c2').catch(e=>console.error('scheduled hours load failed',e));
import('./monthly-ui.mjs?v=076m5').catch(e=>console.error('monthly UI load failed',e));
