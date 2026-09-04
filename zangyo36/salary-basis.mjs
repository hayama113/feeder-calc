const $=s=>document.querySelector(s);
const KEY='wageBasis';
const state={allowances:[],legacyWarning:''};

export function computeWageBase(baseSalary,allowances=[]){
  const base=Math.max(0,Number(baseSalary)||0);
  const extras=allowances.reduce((sum,row)=>sum+(row?.include?Math.max(0,Number(row.amount)||0):0),0);
  return base+extras;
}

function yen(n){return new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(Math.round(Number(n)||0));}
function uid(){return crypto.randomUUID?.()||`a-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;}
function request(r){return new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open('zangyo36_db',3);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
async function loadStored(){
  const db=await openDB();
  try{return await request(db.transaction('extras').objectStore('extras').get(KEY));}
  finally{db.close();}
}
async function saveStored(){
  const db=await openDB();
  try{
    const tx=db.transaction('extras','readwrite');
    tx.objectStore('extras').put({key:KEY,value:{version:1,allowances:state.allowances}});
    await new Promise((ok,no)=>{tx.oncomplete=ok;tx.onerror=()=>no(tx.error);});
  }finally{db.close();}
}

function waitForApp(){
  return new Promise(resolve=>{
    let tries=0;
    const tick=()=>{
      if($('#baseSalary')&&$('#wageBaseMonthly')&&$('#avgMonthlyScheduledHours')&&$('#characterSelect option'))return resolve();
      if(++tries>60)return resolve();
      setTimeout(tick,100);
    };
    tick();
  });
}

function migrateIfNeeded(saved){
  if(saved?.value?.allowances){
    state.allowances=saved.value.allowances.map(row=>({id:row.id||uid(),name:String(row.name||''),amount:Math.max(0,Number(row.amount)||0),include:row.include!==false}));
    return;
  }
  const base=Math.max(0,Number($('#baseSalary')?.value)||0);
  const legacy=Math.max(0,Number($('#wageBaseMonthly')?.value)||0);
  if(legacy>base){
    state.allowances=[{id:uid(),name:'既存設定の追加分',amount:legacy-base,include:true}];
  }else if(legacy>0&&legacy<base){
    state.legacyWarning='旧設定の計算基礎月額が基本給より低い状態でした。内容を確認して保存してください。';
  }
}

function installStyles(){
  if($('#tm-wage-basis-style'))return;
  const s=document.createElement('style');
  s.id='tm-wage-basis-style';
  s.textContent=`
  .wage-basis-editor{margin-top:16px;padding-top:14px;border-top:1px solid var(--line,#e5e7eb)}
  .wage-basis-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
  .wage-basis-head strong{font-size:14px}.wage-basis-note{margin:6px 0 12px;font-size:12px;line-height:1.55;color:var(--muted,#667085)}
  .wage-allowance-list{display:grid;gap:8px}.wage-allowance-row{display:grid;grid-template-columns:minmax(120px,1.4fr) minmax(100px,.8fr) auto auto;gap:8px;align-items:center}
  .wage-allowance-row input[type="text"],.wage-allowance-row input[type="number"]{width:100%;min-width:0}
  .wage-include{display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:12px}.wage-remove{padding:8px 10px!important;min-width:auto!important}
  .wage-basis-summary{margin-top:12px;padding:12px;border-radius:10px;background:var(--soft,#f5f7fb);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .wage-basis-summary span{display:block;font-size:11px;color:var(--muted,#667085)}.wage-basis-summary b{display:block;margin-top:2px;font-size:16px}
  .wage-basis-warning{margin-top:8px;font-size:12px;color:#a15c00}
  #wageBaseMonthly[readonly]{background:var(--soft,#f5f7fb);font-weight:700}
  @media(max-width:680px){.wage-allowance-row{grid-template-columns:1fr 110px}.wage-include,.wage-remove{justify-self:start}.wage-basis-summary{grid-template-columns:1fr}}
  `;
  document.head.appendChild(s);
}

function installUI(){
  const wageInput=$('#wageBaseMonthly'); if(!wageInput||$('#wageAllowanceEditor'))return;
  wageInput.readOnly=true;
  const label=wageInput.closest('div')?.querySelector('label');
  if(label)label.textContent='割増賃金の計算基礎月額（自動）';
  const card=[...document.querySelectorAll('#tab-settings .card')].find(x=>x.querySelector('h2')?.textContent.includes('給与設定'));
  if(!card)return;
  const editor=document.createElement('div');
  editor.id='wageAllowanceEditor';
  editor.className='wage-basis-editor';
  editor.innerHTML=`
    <div class="wage-basis-head"><strong>手当の算入設定</strong><button id="addWageAllowance" type="button" class="soft">＋ 手当を追加</button></div>
    <p class="wage-basis-note">基本給は自動で計算基礎に含めます。手当は「算入」をONにしたものだけ加算します。手当の名称だけでは算入・除外を確定できないため、給与規程や実際の支給条件に合わせて設定してください。</p>
    <div id="wageAllowanceList" class="wage-allowance-list"></div>
    <div class="wage-basis-summary">
      <div><span>割増賃金の計算基礎月額</span><b id="wageBasisTotal">¥0</b></div>
      <div><span>1時間あたりの計算基礎</span><b id="wageBasisHourly">¥0</b></div>
    </div>
    <div id="wageBasisWarning" class="wage-basis-warning"></div>`;
  card.appendChild(editor);
  $('#addWageAllowance').addEventListener('click',()=>{state.allowances.push({id:uid(),name:'',amount:0,include:true});renderRows();});
  $('#baseSalary').addEventListener('input',recalculate);
  $('#avgMonthlyScheduledHours').addEventListener('input',recalculate);
  $('#saveSettings')?.addEventListener('click',()=>{recalculate();saveStored().catch(console.error);},true);
}

function renderRows(){
  const list=$('#wageAllowanceList'); if(!list)return;
  if(!state.allowances.length){list.innerHTML='<div class="helper">手当の登録なし：現在は基本給のみで計算します。</div>';recalculate();return;}
  list.innerHTML=state.allowances.map(row=>`<div class="wage-allowance-row" data-id="${row.id}">
    <input class="wage-name" type="text" maxlength="30" placeholder="例：職務手当" value="${escapeHtml(row.name)}">
    <input class="wage-amount" type="number" min="0" step="100" value="${Number(row.amount)||0}" aria-label="手当月額">
    <label class="wage-include"><input type="checkbox" ${row.include?'checked':''}>算入</label>
    <button type="button" class="soft wage-remove" aria-label="削除">削除</button>
  </div>`).join('');
  list.querySelectorAll('.wage-allowance-row').forEach(el=>{
    const row=state.allowances.find(x=>x.id===el.dataset.id); if(!row)return;
    el.querySelector('.wage-name').addEventListener('input',e=>{row.name=e.target.value;});
    el.querySelector('.wage-amount').addEventListener('input',e=>{row.amount=Math.max(0,Number(e.target.value)||0);recalculate();});
    el.querySelector('.wage-include input').addEventListener('change',e=>{row.include=e.target.checked;recalculate();});
    el.querySelector('.wage-remove').addEventListener('click',()=>{state.allowances=state.allowances.filter(x=>x.id!==row.id);renderRows();});
  });
  recalculate();
}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function recalculate(){
  const base=Number($('#baseSalary')?.value)||0;
  const total=computeWageBase(base,state.allowances);
  const hours=Math.max(0,Number($('#avgMonthlyScheduledHours')?.value)||0);
  const wage=$('#wageBaseMonthly'); if(wage)wage.value=Math.round(total);
  if($('#wageBasisTotal'))$('#wageBasisTotal').textContent=yen(total);
  if($('#wageBasisHourly'))$('#wageBasisHourly').textContent=hours?yen(total/hours):'—';
  if($('#wageBasisWarning'))$('#wageBasisWarning').textContent=state.legacyWarning;
  window.dispatchEvent(new CustomEvent('tokimate:wagebasischange',{detail:{baseMonthly:total,hours}}));
}

async function init(){
  await waitForApp();
  installStyles();
  const saved=await loadStored().catch(()=>null);
  migrateIfNeeded(saved);
  installUI();
  renderRows();
}

if(typeof document!=='undefined')init().catch(e=>console.error('wage basis init failed',e));
