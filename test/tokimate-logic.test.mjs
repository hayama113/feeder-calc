import test from 'node:test';
import assert from 'node:assert/strict';
import {
  flexLegalLimitMinutes,isJapanHoliday,defaultAttendanceType,shiftDaySegments,
  classifyFlexMonth,limitStatus,deepMinutes,legalHolidayWorkMinutes
} from '../zangyo36/logic.mjs';

test('TokiMate flex legal limits match calendar-day formula',()=>{
  assert.equal(flexLegalLimitMinutes('2026-01'),10628);
  assert.equal(flexLegalLimitMinutes('2026-04'),10285);
  assert.equal(flexLegalLimitMinutes('2028-02'),9942);
  assert.equal(flexLegalLimitMinutes('2026-02'),9600);
});

test('TokiMate Japanese Monday and substitute holidays are correct for 2026',()=>{
  assert.equal(isJapanHoliday('2026-01-12'),true);
  assert.equal(isJapanHoliday('2026-07-20'),true);
  assert.equal(isJapanHoliday('2026-09-22'),true);
  assert.equal(isJapanHoliday('2026-05-06'),true);
  assert.equal(defaultAttendanceType('2026-01-12'),'特休');
});

test('TokiMate overnight shift splits statutory Sunday at midnight',()=>{
  const sat={date:'2026-09-05',start:'22:00',end:'05:00',breakMinutes:0,nightBreakMinutes:0};
  const seg=shiftDaySegments(sat);
  assert.deepEqual(seg.map(x=>[x.date,x.workMinutes,x.deepMinutes,x.isLegalHoliday]),[
    ['2026-09-05',120,120,false],
    ['2026-09-06',300,300,true]
  ]);
  assert.equal(legalHolidayWorkMinutes(sat),300);
  assert.equal(deepMinutes(sat),420);
});

test('TokiMate Sunday-start overnight counts only Sunday portion as legal holiday',()=>{
  const sun={date:'2026-09-06',start:'22:00',end:'05:00',breakMinutes:0,nightBreakMinutes:0};
  assert.equal(legalHolidayWorkMinutes(sun),120);
  const sep=classifyFlexMonth([sun],'2026-09');
  assert.equal(sep.legalHoliday,120);
  assert.equal(sep.holidayDeep,120);
  assert.equal(sep.deep,300);
});

test('TokiMate month-boundary overnight splits clearing periods',()=>{
  const e={date:'2026-09-30',start:'22:00',end:'05:00',breakMinutes:0,nightBreakMinutes:0};
  assert.equal(classifyFlexMonth([e],'2026-09').actual,120);
  assert.equal(classifyFlexMonth([e],'2026-10').actual,300);
});

test('TokiMate break allocation preserves total work across midnight',()=>{
  const e={date:'2026-09-05',start:'22:00',end:'05:00',breakMinutes:60,nightBreakMinutes:60};
  const seg=shiftDaySegments(e);
  assert.equal(seg.reduce((s,x)=>s+x.workMinutes,0),360);
  assert.equal(seg.reduce((s,x)=>s+x.deepMinutes,0),360);
});

test('TokiMate 36 status surfaces 45h principle warning',()=>{
  const entries=[];
  for(let i=1;i<=22;i++){
    const d=String(i).padStart(2,'0');
    entries.push({date:`2026-09-${d}`,start:'06:00',end:'18:00',breakMinutes:0,nightBreakMinutes:0});
  }
  const st=limitStatus(entries,'2026-09',{agreementStartMonth:4});
  assert.ok(st.current.overtime>45*60);
  assert.ok(st.warnings.some(x=>x.includes('月45時間超')));
});
