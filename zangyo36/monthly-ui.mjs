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
    @media(max-width:680px){
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
      #dayDetailCard.tm-day-modal .formgrid{grid-template-columns:1fr 1fr}
      #dayDetailCard.tm-day-modal .formgrid .full{grid-column:1/-1}
      #dayDetailCard.tm-day-modal .actions{position:sticky;bottom:-14px;background:var(--card);padding:10px 0 14px;margin-bottom:-14px;border-top:1px solid var(--line)}
      #dayDetailCard.tm-day-modal .actions button{flex:1}
    }
    @media(max-width:430px){
      #tab-monthly .monthly-table th,#tab-monthly .monthly-table td{font-size:11px;padding:10px 2px}
      #dayDetailCard.tm-day-modal .formgrid{grid-template-columns:1fr}
      #dayDetailCard.tm-day-modal .formgrid .full{grid-column:auto}
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
  // The observer below watches this same attribute. Avoid writing an\n  // unchanged class value, otherwise WebKit can enqueue syncDialog forever.\n  if(!card.classList.contains('tm-day-modal'))card.classList.add('tm-day-modal');
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
  if(helper)helper.textContent='日付をタップすると入力画面をポップアップ表示します。スマホでは出勤・退勤を一覧で確認できます。';
}

function init(){
  installStyles();
  ensureBackdrop();
  updateHelper();
  installEvents();
  syncDialog();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
