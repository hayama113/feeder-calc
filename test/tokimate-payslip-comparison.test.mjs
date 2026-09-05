import test from 'node:test';
import assert from 'node:assert/strict';
import {restoredTotal,companyTotal,comparison} from '../zangyo36/payslip-comparison.mjs';

test('blank explicit total stays blank after a breakdown record is restored',()=>{
  const row={actualTotal:null,actualOvertime:10000,actualDeep:2000,actualAllowance:12000};
  assert.equal(restoredTotal(row),null);
  assert.equal(companyTotal({...row,actualTotal:restoredTotal(row),actualOvertime:15000}),17000);
});
test('legacy total-only records and explicit zero are preserved',()=>{
  assert.equal(restoredTotal({actualAllowance:12000}),12000);
  assert.equal(restoredTotal({actualTotal:0,actualAllowance:12000}),0);
  assert.equal(companyTotal({actualTotal:0,actualOvertime:12000}),0);
});
test('empty amounts differ from an entered zero',()=>{
  assert.equal(companyTotal({}),null);
  assert.equal(companyTotal({actualDeep:0}),0);
});
test('invalid amounts are rejected instead of silently becoming zero',()=>{
  for(const value of [-1,NaN,Infinity,'invalid'])assert.throws(()=>companyTotal({actualDeep:value}));
});
test('difference matches displayed whole-yen amounts',()=>{
  assert.deepEqual(comparison(100.5,100),{app:101,company:100,difference:-1});
  assert.equal(comparison(100,null).difference,null);
});
