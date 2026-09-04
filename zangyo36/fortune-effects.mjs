const $=s=>document.querySelector(s);
function applyBrand(){
  document.title='TokiMate Pro';
  const name=$('.brand strong'),mark=$('.brandmark'),sub=$('.brand small');
  if(name)name.textContent='TokiMate Pro';
  if(mark)mark.textContent='T';
  if(sub)sub.textContent='勤怠・給与アシスタント v0.6.5';
}
applyBrand();
const FX={
  shiori:{icon:'🎋',cls:'fx-shiori',step2:'しおりがおみくじを開いています…'},
  carrie:{icon:'🃏',cls:'fx-carrie',step2:'キャリーがカードをめくっています…'},
  takeru:{icon:'🎋',cls:'fx-takeru',step2:'たけるがおみくじ棒を確認しています…'},
  seojun:{icon:'✉️',cls:'fx-seojun',step2:'ソジュンが封筒を開いています…'},
  maru:{icon:'🐕',cls:'fx-maru',step2:'まるがおみくじを届けました…'},
  robotan:{icon:'✨',cls:'fx-robotan',step2:'ロボたんが結果を解析しています…'}
};
const ids=['shiori','carrie','takeru','seojun','maru','robotan'];
function currentId(){
  const src=$('#fortuneCharacter')?.getAttribute('src')||'';
  return ids.find(id=>src.includes(`/${id}.jpg`)||src.includes(`/${id}-`))||'shiori';
}
function clearFx(){
  const stage=$('.fortune-stage'),img=$('#fortuneCharacter'),anim=$('#fortuneAnimation');
  stage?.classList.remove(...Object.values(FX).map(x=>x.cls),'fortune-big-win');
  img?.classList.remove('fortune-performing');
  anim?.classList.remove('fortune-performing');
  stage?.querySelectorAll('.spark').forEach(x=>x.remove());
}
function burst(rank){
  const stage=$('.fortune-stage'); if(!stage)return;
  const strong=rank==='大吉';
  const glyphs=strong?['✨','🌸','🎊','⭐']:['✨','🌸'];
  const count=strong?22:10;
  for(let i=0;i<count;i++){
    const s=document.createElement('span');
    s.className='spark'; s.textContent=glyphs[i%glyphs.length];
    s.style.left=`${42+Math.random()*16}%`; s.style.top=`${42+Math.random()*16}%`;
    s.style.setProperty('--x',`${(Math.random()-.5)*360}px`);
    s.style.setProperty('--y',`${(Math.random()-.5)*300}px`);
    s.style.animationDelay=`${Math.random()*.18}s`;
    stage.appendChild(s);
    setTimeout(()=>s.remove(),1900);
  }
  if(strong)stage.classList.add('fortune-big-win');
}
function startFx(){
  const modal=$('#fortuneModal'); if(!modal||modal.classList.contains('hidden'))return;
  clearFx();
  const id=currentId(),fx=FX[id],stage=$('.fortune-stage'),img=$('#fortuneCharacter'),anim=$('#fortuneAnimation'),icon=$('#fortuneIcon'),action=$('#fortuneAction');
  stage?.classList.add(fx.cls);
  img?.classList.add('fortune-performing');
  anim?.classList.add('fortune-performing');
  if(icon)icon.textContent=fx.icon;
  setTimeout(()=>{if(action&&!$('#fortuneAnimation')?.classList.contains('hidden'))action.textContent=fx.step2},700);
}
function watchResult(){
  const result=$('#fortuneResult'); if(!result)return;
  new MutationObserver(()=>{
    if(!result.classList.contains('hidden')){
      const rank=$('#fortuneRank')?.textContent?.trim()||'';
      burst(rank);
      $('#fortuneCharacter')?.classList.remove('fortune-performing');
      $('#fortuneAnimation')?.classList.remove('fortune-performing');
    }
  }).observe(result,{attributes:true,attributeFilter:['class']});
}
$('#fortuneBtn')?.addEventListener('click',()=>setTimeout(startFx,0));
$('#closeFortune')?.addEventListener('click',clearFx);
watchResult();
