(function(){
  'use strict';
  const VALID=new Set(['today','monthly','payroll','fun','settings']);
  function activate(name,opts={}){
    if(!VALID.has(name))return false;
    const target=document.getElementById(`tab-${name}`);
    if(!target)return false;
    document.querySelectorAll('.tab').forEach(el=>el.classList.toggle('active',el===target));
    document.querySelectorAll('.tabbtn').forEach(btn=>{
      const active=btn.dataset.tab===name;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
      btn.setAttribute('role','tab');
    });
    document.querySelector('.tabs')?.setAttribute('role','tablist');
    if(opts.scroll!==false)window.scrollTo({top:0,behavior:'auto'});
    window.dispatchEvent(new CustomEvent('tokimate:tabchange',{detail:{tab:name}}));
    return true;
  }
  function clickHandler(ev){
    const tabBtn=ev.target.closest?.('.tabbtn[data-tab]');
    if(tabBtn){
      if(activate(tabBtn.dataset.tab))ev.preventDefault();
      return;
    }
    const jump=ev.target.closest?.('[data-tabjump]');
    if(jump&&activate(jump.dataset.tabjump))ev.preventDefault();
  }
  document.addEventListener('click',clickHandler,true);
  document.addEventListener('keydown',ev=>{
    const btn=ev.target.closest?.('.tabbtn[data-tab]');
    if(!btn||!['Enter',' '].includes(ev.key))return;
    if(activate(btn.dataset.tab))ev.preventDefault();
  },true);

  function showCoreError(message){
    if(document.getElementById('tokimateCoreError'))return;
    const anchor=document.querySelector('#tab-monthly .month-head');
    if(!anchor)return;
    const note=document.createElement('div');
    note.id='tokimateCoreError';
    note.className='notice danger';
    note.style.margin='0 0 12px';
    note.textContent=message;
    anchor.insertAdjacentElement('afterend',note);
  }

  function coreLooksReady(){
    const month=document.getElementById('monthlyMonth');
    const wage=document.getElementById('wageMonth');
    return !!(month?.options?.length&&wage?.options?.length);
  }

  async function recoverCore(){
    if(coreLooksReady()){
      document.documentElement.dataset.coreReady='1';
      return;
    }
    try{
      const appUrl=new URL('./app.js?v=074',location.href);
      const response=await fetch(appUrl,{cache:'no-store'});
      if(!response.ok)throw new Error(`app.js ${response.status}`);
      await response.text();
      await import(appUrl.href);
      setTimeout(()=>{
        if(coreLooksReady()){
          document.documentElement.dataset.coreReady='1';
          document.documentElement.dataset.coreRecovered='1';
          document.getElementById('tokimateCoreError')?.remove();
        }else{
          showCoreError('勤怠データ画面の初期化に失敗しました。再読み込みしてください。');
        }
      },250);
    }catch(e){
      console.error('TokiMate core recovery failed',e);
      showCoreError('勤怠データ画面の初期化に失敗しました。再読み込みしてください。');
    }
  }

  function init(){
    const current=document.querySelector('.tabbtn.active[data-tab]')?.dataset.tab||'today';
    activate(VALID.has(current)?current:'today',{scroll:false});
    document.documentElement.dataset.navigationReady='1';
    setTimeout(recoverCore,900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.TokiMateNavigation={activate,recoverCore};
})();