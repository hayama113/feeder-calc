import test from 'node:test';
import assert from 'node:assert/strict';
import {wageEstimate} from '../zangyo36/logic.mjs';
import {payrollAmounts} from '../zangyo36/payroll-review.mjs';

test('TokiMate payroll uses wage basis monthly amount instead of base salary when configured',()=>{
  const summary={overtime:10*60,deep:2*60,legalHoliday:3*60,holidayDeep:1*60};
  const settings={baseSalary:300000,wageBaseMonthly:320000,avgMonthlyScheduledHours:160};
  const w=wageEstimate(summary,settings);
  assert.equal(w.hourly,2000);
  assert.equal(w.total,34600);
  assert.equal(w.premiumOnly,8600);
});

test('TokiMate payroll splits monthly overtime over 60 hours at 150 percent',()=>{
  const summary={overtime:65*60,deep:0,legalHoliday:0,holidayDeep:0};
  const a=payrollAmounts(summary,{wageBaseMonthly:160000,avgMonthlyScheduledHours:160});
  assert.equal(a.hourly,1000);
  assert.equal(a.ot60,60);
  assert.equal(a.otOver,5);
  assert.equal(a.ot60Amount,75000);
  assert.equal(a.otOverAmount,7500);
  assert.equal(a.appTotal,82500);
});

test('TokiMate statutory holiday deep work reaches 160 percent in total',()=>{
  const summary={overtime:0,deep:0,legalHoliday:2*60,holidayDeep:2*60};
  const a=payrollAmounts(summary,{wageBaseMonthly:160000,avgMonthlyScheduledHours:160});
  assert.equal(a.holidayAmount,2700);
  assert.equal(a.holidayDeepAmount,500);
  assert.equal(a.appTotal,3200);
});
