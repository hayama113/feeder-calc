import {isSunday,isSaturday,isJapanHoliday} from './logic.mjs?v=075';

const $=s=>document.querySelector(s);

function installRuleCard(){
  if($('#tmAttendanceCoreNote')) return;
  const anchor=$('#tab-monthly .month-head');
  if(!anchor) return;
  const card=document.createElement('div');
  card.id='tmAttendanceCoreNote';
  card.className='card notice';
  card.innerHTML=`<strong>勤怠集計ルール</strong><br>
    フレックスは毎月1日〜末日で清算。日曜の0:00〜24:00を法定休日として別計上し、土曜・日本の祝日は特休（非法定休日）として扱います。<br>
    夜勤は日付境界で分割し、月をまたぐ勤務も各月へ分けて集計します。月またぎ・日曜またぎで休憩の時刻が未指定の場合、通常休憩は各日区間の勤務時間比で按分します。`;
  anchor.insertAdjacentElement('afterend',card);
}

function decorateRows(){
  document.querySelectorAll('#dailyRows tr[data-day]').forEach(row=>{
    const date=row.dataset.day;
    if(!date) return;
    row.classList.toggle('day-sun',isSunday(date));
    row.classList.toggle('day-sat',isSaturday(date));
    const holiday=isJapanHoliday(date);
    if(isSunday(date)) row.title='日曜：法定休日';
    else if(isSaturday(date)) row.title='土曜：特休（非法定休日）';
    else if(holiday) row.title='祝日：特休（非法定休日）';
    else row.removeAttribute('title');
  });
}

function installLegend(){
  if($('#tmAttendanceLegend')) return;
  const table=$('#tab-monthly .tablewrap');
  if(!table) return;
  const legend=document.createElement('div');
  legend.id='tmAttendanceLegend';
  legend.className='helper';
  legend.style.margin='-4px 4px 12px';
  legend.textContent='日曜＝法定休日 ／ 土曜・祝日＝特休（非法定休日） ／ 夜勤・月またぎは日付単位で分割集計';
  table.insertAdjacentElement('afterend',legend);
}

function watchRows(){
  const rows=$('#dailyRows');
  if(!rows) return;
  new MutationObserver(decorateRows).observe(rows,{childList:true,subtree:true});
  decorateRows();
}

function init(){
  installRuleCard();
  installLegend();
  watchRows();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
else init();