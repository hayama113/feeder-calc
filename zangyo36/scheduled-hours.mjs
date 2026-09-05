import {companyScheduledWorkdays,companyPrescribedMinutes,fmtMinutes} from './logic.mjs?v=076c2';

export const STANDARD_DAILY_MINUTES=8*60;

export function scheduledWorkdays(monthKey){
  return companyScheduledWorkdays(monthKey);
}

export function prescribedMonthlyMinutes(monthKey,dailyMinutes=STANDARD_DAILY_MINUTES){
  return companyPrescribedMinutes(monthKey,dailyMinutes);
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
    if(label)label.textContent='会社規定勤務時間';
  }
  if(document.getElementById('tmPrescribedMonthNote'))return;
  const grid=document.querySelector('#tab-monthly .grid.four');
  if(!grid)return;
  const note=document.createElement('div');
  note.id='tmPrescribedMonthNote';
  note.className='tm-rule-details';
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
    monthNote.innerHTML=`<details><summary>会社規定勤務時間の算定</summary><div>${key.replace('-','年')}月：${workdays.length}日 × 8:00 ＝ <b>${fmtMinutes(prescribed)}</b><br><span class="helper">土曜・日曜・国民の祝日・休日を勤務日から除外し、この時間を超えた分を「時間外」と表示します。</span></div></details>`;
  }
  const todayNote=document.getElementById('tmPrescribedTodayNote');
  if(todayNote&&key===currentMonthKey()){
    todayNote.innerHTML=`会社規定勤務時間：<b>${fmtMinutes(prescribed)}</b>（${workdays.length}日 × 8:00）`;
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
