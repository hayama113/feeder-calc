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
  function init(){
    const current=document.querySelector('.tabbtn.active[data-tab]')?.dataset.tab||'today';
    activate(VALID.has(current)?current:'today',{scroll:false});
    document.documentElement.dataset.navigationReady='1';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  window.TokiMateNavigation={activate};
})();
