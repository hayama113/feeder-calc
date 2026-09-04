import test from 'node:test';
import assert from 'node:assert/strict';
import {scheduledWorkdays,prescribedMonthlyMinutes} from '../zangyo36/scheduled-hours.mjs';
import {flexLegalLimitMinutes,isJapanHoliday} from '../zangyo36/logic.mjs';

test('September 2026 has 19 prescribed workdays when weekends and Japanese holidays are excluded',()=>{
  const days=scheduledWorkdays('2026-09');
  assert.equal(days.length,19);
  assert.equal(prescribedMonthlyMinutes('2026-09'),152*60);
  for(const holiday of ['2026-09-21','2026-09-22','2026-09-23']){
    assert.equal(isJapanHoliday(holiday),true,`${holiday} should be a Japanese holiday/holiday-by-law`);
    assert.equal(days.includes(holiday),false,`${holiday} must not be a prescribed workday`);
  }
});

test('statutory flex limit remains calendar-day based and is separate from prescribed hours',()=>{
  assert.equal(flexLegalLimitMinutes('2026-09'),171*60+25);
  assert.notEqual(flexLegalLimitMinutes('2026-09'),prescribedMonthlyMinutes('2026-09'));
});
