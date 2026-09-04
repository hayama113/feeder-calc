import {isSunday,isSaturday,isJapanHoliday,fmtMinutes} from './logic.mjs?v=075';

export const STANDARD_DAILY_MINUTES=8*60;

export function scheduledWorkdays(monthKey){
  const [year,month]=String(monthKey||'').split('-').map(Number);
  if(!year||!month)return [];
  const days=new Date(year,month,0).getDate();
  const out=[];
  for(let d=1;d<=days;d++){
    const date=`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if(isSunday(date)||isSaturday(date)||isJapanHoliday(date))continue;
    out.push(date);
  }
  return out;
}

export function prescribedMonthlyMinutes(monthKey,dailyMinutes=STANDARD_DAILY_MINUTES){
  return scheduledWorkdays(monthKey).length*Math.max(0,Number(dailyMinutes)||0);
}

function currentMonthKey(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

function installMonthlyNote(){
  const limit=document.getElementById('sLimit');
  const card=limit?.closest('.metric-card');
  if(card){
    const label=card.querySelector('span');
    if(label)label.textContent='法定総枠（法令）';
  }
  if(document.getElementById('tmPrescribedMonthNote'))return;
  const grid=document.querySelector('#tab-monthly .grid.four');
  if(!grid)return;
  const note=document.createElement('div');
  note.id='tmPrescribedMonthNote';
  note.className='notice';
  note.style.margin='0 0 12px';
  grid.insertAdjacentElement('afterend',note);
}

function installTodayNote(){
  if(document.getElementById('tmPrescribedTodayNote'))return;
  const card=document.querySelector('#tab-today .grid.two .card');
  const helper=card?.querySelector('.helper');
  if(!helper)return;
  const note=document.createElement('p');
  note.id='tmPrescribedTodayNote';
  note.className='helper';
  note.style.margin='6px 0 0';
  helper.insertAdjacentElement('afterend',note);
}

function renderFor(monthKey){
  const key=monthKey||currentMonthKey();
  const workdays=scheduledWorkdays(key);
  const prescribed=workdays.length*STANDARD_DAILY_MINUTES;
  const monthNote=document.getElementById('tmPrescribedMonthNote');
  if(monthNote){
    monthNote.innerHTML=`<strong>会社所定労働時間</strong><br>${key.replace('-','年')}月：${workdays.length}日 × 8:00 ＝ <b>${fmtMinutes(prescribed)}</b>。土曜・日曜・国民の祝日・休日は所定勤務日から除外します。<br><span class="helper">「法定総枠」はフレックスタイム制の法令上の上限で、暦日数から算定するため別表示です。</span>`;
  }
  const todayNote=document.getElementById('tmPrescribedTodayNote');
  if(todayNote&&key===currentMonthKey()){
    todayNote.innerHTML=`会社所定：<b>${fmtMinutes(prescribed)}</b>（${workdays.length}日 × 8:00、土日・祝日除外）／ 法定総枠は別基準です。`;
  }
}

function update(){
  installMonthlyNote();
  installTodayNote();
  const selected=document.getElementById('monthlyMonth')?.value||currentMonthKey();
  renderFor(selected);
}

function init(){
  update();
  document.getElementById('monthlyMonth')?.addEventListener('change',()=>setTimeout(update,0));
  window.addEventListener('tokimate:tabchange',()=>setTimeout(update,0));
  const rows=document.getElementById('dailyRows');
  if(rows)new MutationObserver(()=>update()).observe(rows,{childList:true});
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
}
