export const MIN = 60;
const DEEP_START = 22 * MIN;
const DEEP_END_NEXT = 29 * MIN;

export function parseTimeToMinutes(t){
  if(!t || !/^\d{2}:\d{2}$/.test(t)) return null;
  const [h,m]=t.split(':').map(Number);
  if(h>23||m>59) return null;
  return h*60+m;
}

export function grossShiftMinutes(start,end){
  const s=parseTimeToMinutes(start), e0=parseTimeToMinutes(end);
  if(s==null||e0==null) return 0;
  const e=e0<=s?e0+1440:e0;
  return Math.max(0,e-s);
}

export function workMinutes(entry){
  return Math.max(0,grossShiftMinutes(entry.start,entry.end)-Math.max(0,Number(entry.breakMinutes)||0));
}

export function statutoryBreakSuggestionMinutes(start,end){
  const gross=grossShiftMinutes(start,end);
  if(gross>8*MIN) return 60;
  if(gross>6*MIN) return 45;
  return 0;
}

export function companyBreakSuggestionMinutes(start,end){
  const gross=grossShiftMinutes(start,end);
  if(!gross) return 0;
  return gross>=6*MIN?60:45;
}

export function deepNightOverlapMinutes(start,end){
  const s=parseTimeToMinutes(start), e0=parseTimeToMinutes(end);
  if(s==null||e0==null) return 0;
  const e=e0<=s?e0+1440:e0;
  let total=0;
  for(let d=-1;d<=1;d++){
    const a=d*1440+DEEP_START, b=d*1440+DEEP_END_NEXT;
    total+=Math.max(0,Math.min(e,b)-Math.max(s,a));
  }
  return total;
}

export function deepMinutes(entry){
  const work=workMinutes(entry);
  const raw=deepNightOverlapMinutes(entry.start,entry.end)-Math.max(0,Number(entry.nightBreakMinutes)||0);
  return Math.max(0,Math.min(work,raw));
}

export function daysInMonth(monthKey){
  const [y,m]=monthKey.split('-').map(Number);
  return new Date(y,m,0).getDate();
}

export function flexLegalLimitMinutes(monthKey){
  return Math.floor(daysInMonth(monthKey)*40*MIN/7);
}

export function monthKey(dateStr){return dateStr.slice(0,7)}
export function isSunday(dateStr){return new Date(`${dateStr}T12:00:00`).getDay()===0}
export function isSaturday(dateStr){return new Date(`${dateStr}T12:00:00`).getDay()===6}

function nthMonday(year,month,n){
  const d=new Date(year,month-1,1,12), first=(8-d.getDay())%7||7;
  return first+(n-1)*7;
}
function vernalDay(y){return Math.floor(20.8431+0.242194*(y-1980)-Math.floor((y-1980)/4))}
function autumnDay(y){return Math.floor(23.2488+0.242194*(y-1980)-Math.floor((y-1980)/4))}
function iso(y,m,d){return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`}

export function japanHolidaySet(year){
  const s=new Set([
    iso(year,1,1), iso(year,1,nthMonday(year,1,2)), iso(year,2,11), iso(year,2,23),
    iso(year,3,vernalDay(year)), iso(year,4,29), iso(year,5,3), iso(year,5,4), iso(year,5,5),
    iso(year,7,nthMonday(year,7,3)), iso(year,8,11), iso(year,9,nthMonday(year,9,3)),
    iso(year,9,autumnDay(year)), iso(year,10,nthMonday(year,10,2)), iso(year,11,3), iso(year,11,23)
  ]);
  for(let d=new Date(year,0,2,12); d.getFullYear()===year; d.setDate(d.getDate()+1)){
    const k=iso(d.getFullYear(),d.getMonth()+1,d.getDate());
    const prev=new Date(d); prev.setDate(prev.getDate()-1);
    const next=new Date(d); next.setDate(next.getDate()+1);
    const pk=iso(prev.getFullYear(),prev.getMonth()+1,prev.getDate());
    const nk=iso(next.getFullYear(),next.getMonth()+1,next.getDate());
    if(!s.has(k)&&s.has(pk)&&s.has(nk)) s.add(k);
  }
  const originals=[...s].sort();
  for(const k of originals){
    if(!isSunday(k)) continue;
    const d=new Date(`${k}T12:00:00`);
    do{d.setDate(d.getDate()+1)}while(s.has(iso(d.getFullYear(),d.getMonth()+1,d.getDate())));
    s.add(iso(d.getFullYear(),d.getMonth()+1,d.getDate()));
  }
  return s;
}

const holidayCache=new Map();
export function isJapanHoliday(dateStr){
  const y=Number(dateStr.slice(0,4));
  if(!holidayCache.has(y)) holidayCache.set(y,japanHolidaySet(y));
  return holidayCache.get(y).has(dateStr);
}

export function defaultAttendanceType(dateStr){
  if(isSunday(dateStr)) return '公休';
  if(isSaturday(dateStr)||isJapanHoliday(dateStr)) return '特休';
  return '出勤日';
}

export function classifyFlexMonth(entries,key){
  const rows=entries.filter(e=>monthKey(e.date)===key);
  let actual=0, legalHoliday=0, deep=0, holidayDeep=0;
  const detailed=rows.map(e=>{
    const work=workMinutes(e), d=deepMinutes(e), sunday=isSunday(e.date);
    actual+=work;
    if(sunday){legalHoliday+=work; holidayDeep+=d;} else deep+=d;
    return {...e,calc:{workMinutes:work,deepMinutes:d,isLegalHoliday:sunday,legalHolidayMinutes:sunday?work:0}};
  });
  const nonHolidayWork=Math.max(0,actual-legalHoliday);
  const legalLimit=flexLegalLimitMinutes(key);
  const overtime=Math.max(0,nonHolidayWork-legalLimit);
  return {rows:detailed,actual,nonHolidayWork,legalHoliday,deep,holidayDeep,legalLimit,overtime,combined:overtime+legalHoliday};
}

export function addMonths(key,delta){
  const [y,m]=key.split('-').map(Number),d=new Date(y,m-1+delta,1,12);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

export function agreementPeriodForMonth(key,startMonth=4){
  const [y,m]=key.split('-').map(Number),sy=m>=startMonth?y:y-1,months=[];
  for(let i=0;i<12;i++){
    const d=new Date(sy,startMonth-1+i,1,12);
    months.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }
  return {startYear:sy,months};
}

export function limitStatus(entries,currentMonth,settings={}){
  const period=agreementPeriodForMonth(currentMonth,Number(settings.agreementStartMonth)||4);
  const monthly=period.months.map(key=>({key,...classifyFlexMonth(entries,key)}));
  const current=monthly.find(m=>m.key===currentMonth)||{...classifyFlexMonth(entries,currentMonth),key:currentMonth};
  const annualOT=monthly.reduce((s,m)=>s+m.overtime,0);
  const over45Count=monthly.filter(m=>m.overtime>45*MIN).length;
  const idx=period.months.indexOf(currentMonth),averages=[];
  for(let n=2;n<=6;n++){
    if(idx-(n-1)<0) continue;
    const span=monthly.slice(idx-(n-1),idx+1);
    averages.push({n,minutes:span.reduce((s,m)=>s+m.combined,0)/n});
  }
  const disaster=!!settings.disasterRestoration;
  const candidates=[];
  if(!disaster)candidates.push({label:'単月100h未満',minutes:Math.max(0,100*MIN-1-current.combined)});
  candidates.push({label:'年720h',minutes:Math.max(0,720*MIN-annualOT)});
  const priorOver45=monthly.filter((m,i)=>i!==idx&&m.overtime>45*MIN).length;
  if(priorOver45>=6)candidates.push({label:'45h超は年6か月まで',minutes:Math.max(0,45*MIN-current.overtime)});
  if(!disaster){
    for(let n=2;n<=6;n++){
      if(idx-(n-1)<0) continue;
      const prior=monthly.slice(idx-(n-1),idx).reduce((s,m)=>s+m.combined,0);
      candidates.push({label:`${n}か月平均80h`,minutes:Math.max(0,80*MIN*n-prior-current.combined)});
    }
  }
  const tightest=candidates.sort((a,b)=>a.minutes-b.minutes)[0]||{label:'-',minutes:0};
  const breaches=[];
  if(annualOT>720*MIN)breaches.push('年720時間超');
  if(over45Count>6)breaches.push('45時間超が年7か月以上');
  if(!disaster&&current.combined>=100*MIN)breaches.push('単月100時間未満を満たさない');
  if(!disaster)averages.filter(a=>a.minutes>80*MIN).forEach(a=>breaches.push(`${a.n}か月平均80時間超`));
  return {current,period,monthly,annualOT,over45Count,averages,tightest,breaches};
}

export function wageEstimate(summary,settings={}){
  const baseMonthly=Number(settings.wageBaseMonthly||settings.baseSalary||0);
  const monthlyHours=Number(settings.avgMonthlyScheduledHours||160);
  const hourly=monthlyHours>0?baseMonthly/monthlyHours:0;
  const otH=summary.overtime/MIN, ot60=Math.min(otH,60), otOver=Math.max(0,otH-60);
  const deepH=summary.deep/MIN, holidayH=summary.legalHoliday/MIN, holidayDeepH=summary.holidayDeep/MIN;
  const overtimePay=hourly*(ot60*1.25+otOver*1.50);
  const deepPremium=hourly*deepH*.25;
  const holidayPay=hourly*holidayH*1.35;
  const holidayDeepPremium=hourly*holidayDeepH*.25;
  const total=overtimePay+deepPremium+holidayPay+holidayDeepPremium;
  const premiumOnly=hourly*(ot60*.25+otOver*.50+deepH*.25+holidayH*.35+holidayDeepH*.25);
  return {hourly,ot60,otOver,deepH,holidayH,holidayDeepH,overtimePay,deepPremium,holidayPay,holidayDeepPremium,total,premiumOnly};
}

export function pointAwardForOvertime(overtimeMinutes){
  const h=overtimeMinutes/MIN;
  if(h<=10)return 1000;
  if(h<=20)return 750;
  if(h<=30)return 500;
  if(h<=45)return 250;
  return 0;
}

export function fmtMinutes(mins){
  const sign=mins<0?'-':'',v=Math.abs(Math.round(mins||0));
  return `${sign}${Math.floor(v/60)}:${String(v%60).padStart(2,'0')}`;
}
