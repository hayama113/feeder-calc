// Keep an explicitly blank total distinct from legacy total-only records.
export function restoredTotal(row){
  if(!row)return null;
  return Object.hasOwn(row,'actualTotal') ? row.actualTotal : row.actualAllowance??null;
}

export function companyTotal(values){
  const amount=value=>{
    if(value==null||value==='')return null;
    const n=Number(value);
    if(!Number.isFinite(n)||n<0)throw new Error('明細額は0以上の数値で入力してください。');
    return n;
  };
  const total=amount(values.actualTotal);
  const parts=['actualOvertime','actualDeep','actualHoliday'].map(key=>amount(values[key]));
  if(total!=null)return total;
  return parts.every(v=>v==null)?null:parts.reduce((sum,v)=>sum+(v??0),0);
}

export function comparison(appTotal,company){
  const app=Math.round(appTotal);
  const paid=company==null?null:Math.round(company);
  return {app,company:paid,difference:paid==null?null:paid-app};
}
