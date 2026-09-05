const $=s=>document.querySelector(s);

function installStyles(){
  if($('#tm-monthly-ui-style'))return;
  const style=document.createElement('style');
  style.id='tm-monthly-ui-style';
  style.textContent=`
    body.tm-day-modal-open{overflow:hidden}
    #dayDetailBackdrop{position:fixed;inset:0;z-index:124;background:rgba(8,18,35,.58);backdrop-filter:blur(2px)}
    #dayDetailCard.tm-day-modal{position:fixed;z-index:125;left:50%;top:50%;transform:translate(-50%,-50%);width:min(720px,calc(100vw - 28px));max-height:min(760px,calc(100dvh - 28px));overflow:auto;margin:0;border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.3);overscroll-behavior:contain}
    #dayDetailCard.tm-day-modal .detail-head{position:sticky;top:-16px;z-index:2;background:var(--card);padding:16px 0 10px;border-bottom:1px solid var(--line);margin-bottom:12px}
    #dayDetailCard.tm-day-modal .detail-head h2{font-size:18px}
    #dayDetailCard.tm-day-modal #closeDetail{min-width:72px}
    #dailyRows tr.tm-selected-row{outline:2px solid var(--accent2);outline-offset:-2px;background:var(--soft)}
    #dailyRows .tm-special-leave{background:#dbeafe;color:#1d4ed8;border:1px solid #93c5fd}
    .month-navigator{position:relative;display:grid;grid-template-columns:42px minmax(132px,1fr) 42px;gap:7px;align-items:center}
    .month-navigator>button{min-height:42px;border:0;border-radius:11px;background:var(--soft);color:var(--text);font-weight:850;font-size:16px;touch-action:manipulation;user-select:none;-webkit-touch-callout:none}
    .month-navigator>button:first-child,.month-navigator>button:last-of-type{font-size:28px;line-height:1}
    .month-navigator>button:disabled{opacity:.35}
    #monthlyMonth{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;overflow:hidden!important}
    #tmMonthPicker{position:fixed;inset:0;z-index:140;background:rgba(8,18,35,.62);display:grid;place-items:center;padding:16px}
    #tmMonthPickerPanel{width:min(560px,100%);max-height:min(720px,calc(100dvh - 32px));overflow:auto;background:var(--card);border-radius:18px;padding:14px;box-shadow:0 24px 70px rgba(0,0,0,.3)}
    .tm-month-picker-head{position:sticky;top:-14px;z-index:2;display:flex;align-items:center;justify-content:space-between;background:var(--card);padding:12px 0;border-bottom:1px solid var(--line)}
    .tm-month-picker-head button{border:0;border-radius:9px;background:var(--soft);padding:8px 12px;font-weight:800}
    .tm-month-year{margin:14px 0 6px;font-weight:900}.tm-month-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
    .tm-month-grid button{border:1px solid var(--line);border-radius:9px;background:var(--card);color:var(--text);padding:9px 4px}.tm-month-grid button.active{background:var(--accent);color:#fff;border-color:var(--accent)}
    .tm-rule-details{margin:0 0 10px;border:1px solid var(--line);border-radius:10px;background:var(--card);font-size:12px;color:var(--muted)}
    .tm-rule-details summary{cursor:pointer;padding:8px 11px;font-weight:850;color:var(--text);list-style-position:inside}.tm-rule-details>div,.tm-rule-details details>div{padding:0 11px 10px;line-height:1.6}
    @media(max-width:680px){
      .month-navigator{width:100%}
      #tab-monthly .tablewrap{overflow:visible}
      #tab-monthly .monthly-table{min-width:0;width:100%;table-layout:fixed}
      #tab-monthly .monthly-table th,#tab-monthly .monthly-table td{padding:11px 3px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #tab-monthly .monthly-table th:nth-child(1),#tab-monthly .monthly-table td:nth-child(1){width:10%}
      #tab-monthly .monthly-table th:nth-child(2),#tab-monthly .monthly-table td:nth-child(2){width:10%}
      #tab-monthly .monthly-table th:nth-child(3),#tab-monthly .monthly-table td:nth-child(3){width:25%}
      #tab-monthly .monthly-table th:nth-child(4),#tab-monthly .monthly-table td:nth-child(4){width:27.5%}
      #tab-monthly .monthly-table th:nth-child(5),#tab-monthly .monthly-table td:nth-child(5){width:27.5%}
      #tab-monthly .monthly-table th:nth-child(n+6),#tab-monthly .monthly-table td:nth-child(n+6){display:none}
      #dayDetailCard.tm-day-modal{top:max(12px,env(safe-area-inset-top));transform:translateX(-50%);width:calc(100vw - 20px);max-height:calc(100dvh - max(24px,env(safe-area-inset-top)) - max(12px,env(safe-area-inset-bottom)));border-radius:18px;padding:14px}
      #dayDetailCard.tm-day-modal .detail-head{top:-14px;padding:14px 0 9px}
      #dayDetailCard.tm-day-modal .formgrid{grid-template-columns:1fr;gap:12px}
      #dayDetailCard.tm-day-modal .formgrid>div{min-width:0}
      #dayDetailCard.tm-day-modal .formgrid input,#dayDetailCard.tm-day-modal .formgrid select{min-width:0}
      #dayDetailCard.tm-day-modal .formgrid .full{grid-column:auto}
      #dayDetailCard.tm-day-modal .actions{position:sticky;bottom:-14px;background:var(--card);padding:10px 0 14px;margin-bottom:-14px;border-top:1px solid var(--line)}
      #dayDetailCard.tm-day-modal .actions button{flex:1}
    }
    @media(max-width:430px){
      #tab-monthly .monthly-table th,#tab-monthly .monthly-table td{font-size:11px;padding:10px 2px}
      .month-navigator{width:100%;grid-template-columns:40px minmax(120px,1fr) 40px}.tm-month-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
    }
  `;
  document.head.appendChild(style);
}

function ensureBackdrop(){
  let backdrop=$('#dayDetailBackdrop');
  if(backdrop)return backdrop;
  backdrop=document.createElement('div');
  backdrop.id='dayDetailBackdrop';
  backdrop.className='hidden';
  backdrop.setAttribute('aria-hidden','true');
  document.body.appendChild(backdrop);
  return backdrop;
}

function selectedDate(){return $('#detailDate')?.value||'';}
function markSelectedRow(date=selectedDate()){
  document.querySelectorAll('#dailyRows tr.tm-selected-row').forEach(row=>row.classList.remove('tm-selected-row'));
  if(!date)return;
  document.querySelector(`#dailyRows tr[data-day="${CSS.escape(date)}"]`)?.classList.add('tm-selected-row');
}

function closeDialog(){
  const card=$('#dayDetailCard');
  if(!card||card.classList.contains('hidden'))return;
  card.classList.add('hidden');
  syncDialog();
}

function syncDialog(){
  const card=$('#dayDetailCard'),backdrop=ensureBackdrop();
  if(!card)return;
  const open=!card.classList.contains('hidden');
  // The observer below watches this same attribute. Avoid writing an
  // unchanged class value, otherwise WebKit can enqueue syncDialog forever.
  if(!card.classList.contains('tm-day-modal'))card.classList.add('tm-day-modal');
  card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','true');
  card.setAttribute('aria-labelledby','detailTitle');
  backdrop.classList.toggle('hidden',!open);
  document.body.classList.toggle('tm-day-modal-open',open);
  if(open){
    markSelectedRow();
    card.tabIndex=-1;
    requestAnimationFrame(()=>card.focus({preventScroll:true}));
  }else{
    document.querySelectorAll('#dailyRows tr.tm-selected-row').forEach(row=>row.classList.remove('tm-selected-row'));
  }
}

function installEvents(){
  const card=$('#dayDetailCard');
  if(!card)return;
  const backdrop=ensureBackdrop();
  new MutationObserver(syncDialog).observe(card,{attributes:true,attributeFilter:['class']});
  document.addEventListener('click',e=>{
    const row=e.target.closest?.('#dailyRows tr[data-day]');
    if(row){
      markSelectedRow(row.dataset.day);
      setTimeout(syncDialog,0);
    }
  },true);
  $('#closeDetail')?.addEventListener('click',()=>setTimeout(syncDialog,0));
  backdrop.addEventListener('click',closeDialog);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!card.classList.contains('hidden')){
      e.preventDefault();
      closeDialog();
    }
  });
  $('#dayDetailForm')?.addEventListener('submit',()=>setTimeout(syncDialog,0));
  $('#deleteDay')?.addEventListener('click',()=>setTimeout(syncDialog,0));
}

function updateHelper(){
  const helper=document.querySelector('#tab-monthly .month-head .helper');
  if(helper)helper.remove();
}

function monthLabel(value=''){
  const [year,month]=value.split('-');
  return year&&month?`${year}年${Number(month)}月`:'年月';
}

function syncMonthNavigator(){
  const select=$('#monthlyMonth'),label=$('#monthlyPickerButton');
  if(!select||!label)return;
  label.textContent=monthLabel(select.value);
  $('#monthlyPrev').disabled=select.selectedIndex<=0;
  $('#monthlyNext').disabled=select.selectedIndex<0||select.selectedIndex>=select.options.length-1;
}

function chooseMonth(value){
  const select=$('#monthlyMonth');
  if(!select||![...select.options].some(option=>option.value===value))return;
  select.value=value;
  select.dispatchEvent(new Event('change',{bubbles:true}));
  syncMonthNavigator();
}

function shiftMonth(delta){
  const select=$('#monthlyMonth'),next=select?.options[select.selectedIndex+delta];
  if(next)chooseMonth(next.value);
}

function closeMonthPicker(){
  $('#tmMonthPicker')?.classList.add('hidden');
}

function openMonthPicker(){
  const select=$('#monthlyMonth');
  if(!select?.options.length)return;
  let picker=$('#tmMonthPicker');
  if(!picker){
    picker=document.createElement('div');
    picker.id='tmMonthPicker';
    picker.className='hidden';
    picker.innerHTML='<div id="tmMonthPickerPanel" role="dialog" aria-modal="true" aria-labelledby="tmMonthPickerTitle"><div class="tm-month-picker-head"><strong id="tmMonthPickerTitle">表示月を選択</strong><button id="tmCloseMonthPicker" type="button">閉じる</button></div><div id="tmMonthPickerYears"></div></div>';
    document.body.appendChild(picker);
    picker.addEventListener('click',event=>{if(event.target===picker)closeMonthPicker();});
    $('#tmCloseMonthPicker').addEventListener('click',closeMonthPicker);
  }
  const years=new Map();
  for(const option of select.options){
    const year=option.value.slice(0,4);
    if(!years.has(year))years.set(year,[]);
    years.get(year).push(option.value);
  }
  $('#tmMonthPickerYears').innerHTML=[...years].map(([year,values])=>`<section><div class="tm-month-year">${year}年</div><div class="tm-month-grid">${values.map(value=>`<button type="button" data-month="${value}" class="${value===select.value?'active':''}">${Number(value.slice(5))}月</button>`).join('')}</div></section>`).join('');
  picker.querySelectorAll('[data-month]').forEach(button=>button.addEventListener('click',()=>{chooseMonth(button.dataset.month);closeMonthPicker();}));
  picker.classList.remove('hidden');
  picker.querySelector('.active')?.scrollIntoView({block:'center'});
}

function installMonthNavigator(){
  const select=$('#monthlyMonth'),button=$('#monthlyPickerButton');
  if(!select||!button||button.dataset.bound)return;
  button.dataset.bound='1';
  $('#monthlyPrev')?.addEventListener('click',()=>shiftMonth(-1));
  $('#monthlyNext')?.addEventListener('click',()=>shiftMonth(1));
  let timer=0;
  const cancel=()=>{clearTimeout(timer);timer=0;};
  button.addEventListener('pointerdown',()=>{cancel();timer=setTimeout(()=>{timer=0;openMonthPicker();},550);});
  button.addEventListener('pointerup',cancel);
  button.addEventListener('pointercancel',cancel);
  button.addEventListener('pointerleave',cancel);
  button.addEventListener('contextmenu',event=>event.preventDefault());
  button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openMonthPicker();}});
  select.addEventListener('change',syncMonthNavigator);
  new MutationObserver(syncMonthNavigator).observe(select,{childList:true});
  syncMonthNavigator();
}

function init(){
  installStyles();
  ensureBackdrop();
  updateHelper();
  installMonthNavigator();
  installEvents();
  syncDialog();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
