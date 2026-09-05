import {classifyFlexMonth,wageEstimate,fmtMinutes} from './logic.mjs?v=076c4';

const $=s=>document.querySelector(s);
const DB_NAME='zangyo36_db';
const DB_VERSION=3;
const yen=n=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(Math.round(Number(n)||0));

function req(r){return new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
async function readAll(db,store){return req(db.transaction(store).objectStore(store).getAll());}
async function readPayrollData(monthKey){
  const db=await openDB();
  try{
    const [entries,settingsRows,payslip]=await Promise.all([
      readAll(db,'entries'),readAll(db,'settings'),req(db.transaction('payslips').objectStore('payslips').get(monthKey))
    ]);
    const settings=settingsRows.find(x=>x.key==='main')?.value||{};
    return {entries,settings,payslip:payslip||null};
  }finally{db.close();}
}
async function savePayslip(row){
  const db=await openDB();
  try{
    const tx=db.transaction('payslips','readwrite');
    tx.objectStore('payslips').put(row);
    await new Promise((ok,no)=>{tx.oncomplete=ok;tx.onerror=()=>no(tx.error);tx.onabort=()=>no(tx.error);});
  }finally{db.close();}
}

export function payrollAmounts(summary,settings={}){
  const w=wageEstimate(summary,settings);
  const ot60Amount=w.hourly*w.ot60*1.25;
  const otOverAmount=w.hourly*w.otOver*1.50;
  const deepAmount=w.hourly*w.deepH*.25;
  const holidayAmount=w.hourly*w.holidayH*1.35;
  const holidayDeepAmount=w.hourly*w.holidayDeepH*.25;
  return {...w,ot60Amount,otOverAmount,deepAmount,holidayAmount,holidayDeepAmount,appTotal:ot60Amount+otOverAmount+deepAmount+holidayAmount+holidayDeepAmount};
}

function installStyles(){
  if($('#tm-payroll-style'))return;
  const style=document.createElement('style');
  style.id='tm-payroll-style';
  style.textContent=`
    .tm-payroll-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 0 12px}
    .tm-payroll-meta>div,.tm-pay-row{padding:10px 12px;border:1px solid var(--line,#e4e8ef);border-radius:10px;background:var(--soft,#f7f9fc)}
    .tm-payroll-meta span,.tm-pay-row span{display:block;font-size:11px;color:var(--muted,#667085)}
    .tm-payroll-meta b,.tm-pay-row b{display:block;margin-top:3px;font-size:15px}
    .tm-pay-breakdown{display:grid;gap:7px}.tm-pay-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}
    .tm-pay-row b{text-align:right}.tm-company-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .tm-company-grid label{display:block;font-size:12px;margin-bottom:4px}.tm-company-total{margin-top:12px;padding:12px;border-radius:10px;background:var(--soft,#f7f9fc)}
    .tm-company-total-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.tm-company-total span{font-size:11px;color:var(--muted,#667085);display:block}.tm-company-total b{font-size:17px;display:block;margin-top:3px}
    .tm-pay-status{margin-top:10px}.tm-pay-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}
    .tm-pay-legacy{display:none!important}
    @media(max-width:680px){.tm-payroll-meta,.tm-company-total-grid{grid-template-columns:1fr}.tm-company-grid{grid-template-columns:1fr}.tm-pay-row{grid-template-columns:1fr}.tm-pay-row b{text-align:left}}
  `;
  document.head.appendChild(style);
}

function installUI(){
  const legacy=$('#actualAllowance');
  const card=legacy?.closest('.card');
  if(!card||$('#tmPayrollReview'))return;
  legacy.classList.add('tm-pay-legacy');
  $('#allowanceDiff')?.classList.add('tm-pay-legacy');
  $('#savePayslip')?.classList.add('tm-pay-legacy');
  card.querySelectorAll('label').forEach(l=>{if(l.htmlFor==='actualAllowance'||l.textContent.includes('会社明細の時間外'))l.classList.add('tm-pay-legacy');if(l.textContent.trim()==='差額')l.classList.add('tm-pay-legacy');});
  const box=document.createElement('div');
  box.id='tmPayrollReview';
  box.innerHTML=`
    <p class="helper">会社の給与明細と、TokiMate Proが算出した時間外・深夜・法定休日の追加支給額を照合します。</p>
    <div class="tm-company-grid">
      <div><label for="tmActualOvertime">会社明細：時間外手当</label><input id="tmActualOvertime" type="number" min="0" step="1" placeholder="0"></div>
      <div><label for="tmActualDeep">会社明細：深夜手当</label><input id="tmActualDeep" type="number" min="0" step="1" placeholder="0"></div>
      <div><label for="tmActualHoliday">会社明細：休日手当</label><input id="tmActualHoliday" type="number" min="0" step="1" placeholder="0"></div>
      <div><label for="tmActualTotal">会社明細：手当合計（任意）</label><input id="tmActualTotal" type="number" min="0" step="1" placeholder="内訳合計を使用"></div>
    </div>
    <p class="helper">「手当合計」を入力した場合はその金額を優先します。空欄なら上の3項目を合計します。</p>
    <div class="tm-company-total">
      <div class="tm-company-total-grid">
        <div><span>TokiMate計算</span><b id="tmAppAllowance">¥0</b></div>
        <div><span>会社明細</span><b id="tmCompanyAllowance">—</b></div>
        <div><span>差額（会社−TokiMate）</span><b id="tmAllowanceDiff">—</b></div>
      </div>
      <div id="tmAllowanceStatus" class="helper tm-pay-status">会社明細を入力すると比較します。</div>
    </div>
    <div class="tm-pay-actions"><button id="tmSavePayslip" type="button" class="primary">明細額を保存</button><span id="tmPayslipSaveState" class="helper"></span></div>`;
  card.appendChild(box);
  for(const id of ['tmActualOvertime','tmActualDeep','tmActualHoliday','tmActualTotal'])$('#'+id).addEventListener('input',recalcComparison);
  $('#tmSavePayslip').addEventListener('click',persistCurrent);
}

function installBreakdownUI(){
  const breakdown=$('#wageBreakdown');
  const card=breakdown?.closest('.card');
  if(!card||$('#tmPayrollBreakdown'))return;
  breakdown.classList.add('tm-pay-legacy');
  const box=document.createElement('div');
  box.id='tmPayrollBreakdown';
  box.innerHTML=`<div class="tm-payroll-meta"><div><span>計算基礎月額</span><b id="tmWageBase">¥0</b></div><div><span>月平均所定労働時間</span><b id="tmAvgHours">0h</b></div><div><span>基礎時給</span><b id="tmHourlyBasis">¥0</b></div></div><div id="tmBreakdownRows" class="tm-pay-breakdown"></div><p class="helper">当月の会社規定勤務時間ではなく、給与設定の「月平均所定労働時間」を時給換算に使用します。</p>`;
  card.appendChild(box);
}

function num(id){const v=$('#'+id)?.value;return v===''||v==null?null:Math.max(0,Number(v)||0);}
function selectedCompanyTotal(){
  const explicit=num('tmActualTotal');
  if(explicit!=null)return explicit;
  const vals=['tmActualOvertime','tmActualDeep','tmActualHoliday'].map(num);
  if(vals.every(v=>v==null))return null;
  return vals.reduce((s,v)=>s+(v||0),0);
}
function recalcComparison(){
  const app=Number($('#tmPayrollReview')?.dataset.appTotal)||0;
  const company=selectedCompanyTotal();
  $('#tmAppAllowance').textContent=yen(app);
  if(company==null){$('#tmCompanyAllowance').textContent='—';$('#tmAllowanceDiff').textContent='—';$('#tmAllowanceStatus').textContent='会社明細を入力すると比較します。';return;}
  const diff=company-app;
  $('#tmCompanyAllowance').textContent=yen(company);
  $('#tmAllowanceDiff').textContent=(diff>0?'+':'')+yen(diff);
  const abs=Math.abs(Math.round(diff));
  $('#tmAllowanceStatus').textContent=abs<=1?'概算上は一致しています。':diff<0?`会社明細がTokiMate概算より ${yen(abs)} 少ない状態です。`:`会社明細がTokiMate概算より ${yen(abs)} 多い状態です。`;
}

let currentMonth='';
async function render(){
  installStyles(); installUI(); installBreakdownUI();
  const monthKey=$('#wageMonth')?.value;
  if(!monthKey)return;
  currentMonth=monthKey;
  const {entries,settings,payslip}=await readPayrollData(monthKey);
  if(currentMonth!==monthKey)return;
  const summary=classifyFlexMonth(entries,monthKey);
  const a=payrollAmounts(summary,settings);
  const baseMonthly=Math.max(0,Number(settings.wageBaseMonthly||settings.baseSalary||0));
  const avgHours=Math.max(0,Number(settings.avgMonthlyScheduledHours||160));
  $('#tmWageBase').textContent=yen(baseMonthly);
  $('#tmAvgHours').textContent=`${avgHours.toFixed(avgHours%1?1:0)}h`;
  $('#tmHourlyBasis').textContent=yen(a.hourly);
  $('#tmBreakdownRows').innerHTML=`
    <div class="tm-pay-row"><div><span>時間外 60h以下</span>${a.ot60.toFixed(2)}h × 基礎時給 × 1.25</div><b>${yen(a.ot60Amount)}</b></div>
    <div class="tm-pay-row"><div><span>時間外 60h超</span>${a.otOver.toFixed(2)}h × 基礎時給 × 1.50</div><b>${yen(a.otOverAmount)}</b></div>
    <div class="tm-pay-row"><div><span>深夜割増（22:00〜5:00）</span>${a.deepH.toFixed(2)}h × 基礎時給 × 0.25</div><b>${yen(a.deepAmount)}</b></div>
    <div class="tm-pay-row"><div><span>法定休日（日曜）</span>${a.holidayH.toFixed(2)}h × 基礎時給 × 1.35</div><b>${yen(a.holidayAmount)}</b></div>
    <div class="tm-pay-row"><div><span>法定休日の深夜加算</span>${a.holidayDeepH.toFixed(2)}h × 基礎時給 × 0.25</div><b>${yen(a.holidayDeepAmount)}</b></div>`;
  $('#tmPayrollReview').dataset.appTotal=String(a.appTotal);
  $('#tmActualOvertime').value=payslip?.actualOvertime??'';
  $('#tmActualDeep').value=payslip?.actualDeep??'';
  $('#tmActualHoliday').value=payslip?.actualHoliday??'';
  $('#tmActualTotal').value=payslip?.actualTotal??payslip?.actualAllowance??'';
  $('#tmPayslipSaveState').textContent='';
  recalcComparison();
}

async function persistCurrent(){
  const monthKey=$('#wageMonth')?.value;
  if(!monthKey)return;
  const company=selectedCompanyTotal();
  const row={
    month:monthKey,
    actualOvertime:num('tmActualOvertime'),
    actualDeep:num('tmActualDeep'),
    actualHoliday:num('tmActualHoliday'),
    actualTotal:num('tmActualTotal'),
    actualAllowance:company??0,
    updatedAt:new Date().toISOString()
  };
  await savePayslip(row);
  const state=$('#tmPayslipSaveState'); if(state)state.textContent='保存しました。';
  const legacy=$('#actualAllowance'); if(legacy)legacy.value=company??'';
  recalcComparison();
}

function scheduleRender(){setTimeout(()=>render().catch(e=>console.error('payroll review render failed',e)),40);}
function init(){
  installStyles(); installUI(); installBreakdownUI(); scheduleRender();
  $('#wageMonth')?.addEventListener('change',scheduleRender);
  $('#saveSettings')?.addEventListener('click',()=>setTimeout(scheduleRender,180));
  window.addEventListener('tokimate:tabchange',e=>{if(e.detail?.tab==='payroll')scheduleRender();});
  window.addEventListener('tokimate:wagebasischange',()=>{if(document.querySelector('#tab-payroll.active'))scheduleRender();});
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
}
