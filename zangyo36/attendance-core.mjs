const $=s=>document.querySelector(s);

function installRuleCard(){
  if($('#tmAttendanceCoreNote')) return;
  const anchor=$('#tab-monthly .month-head');
  if(!anchor) return;
  const card=document.createElement('details');
  card.id='tmAttendanceCoreNote';
  card.className='tm-rule-details';
  card.innerHTML=`<summary>勤怠集計ルール</summary><div>
    フレックスは毎月1日〜末日で清算。日曜の0:00〜24:00を法定休日として別計上し、土曜・日本の祝日は特休（非法定休日）として扱います。<br>
    夜勤は日付境界で分割し、月をまたぐ勤務も各月へ分けて集計します。月またぎ・日曜またぎで休憩の時刻が未指定の場合、通常休憩は各日区間の勤務時間比で按分します。</div>`;
  anchor.insertAdjacentElement('afterend',card);
}

function decorateRows(){
  document.querySelectorAll('#dailyRows tr[data-day]').forEach(row=>{
    row.classList.remove('day-sun','day-sat');
    row.title=`勤務種別：${row.dataset.workType||'未入力'}`;
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
  legend.textContent='勤務種別の色：特休＝青 ／ 公休＝赤 ／ 有休＝緑 ／ その他＝黒';
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
