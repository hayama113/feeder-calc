import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const ui=readFileSync(new URL('../zangyo36/monthly-ui.mjs',import.meta.url),'utf8');
const extras=readFileSync(new URL('../zangyo36/extras.mjs',import.meta.url),'utf8');
const html=readFileSync(new URL('../zangyo36/index.html',import.meta.url),'utf8');

test('monthly mobile table keeps clock-in and clock-out visible',()=>{
  assert.match(html,/<th>出勤<\/th><th>退勤<\/th>/);
  assert.match(ui,/nth-child\(5\)/);
  assert.match(ui,/nth-child\(n\+6\).*display:none/s);
});

test('day detail is presented as an immediate modal dialog',()=>{
  assert.match(ui,/#dayDetailCard\.tm-day-modal\{position:fixed/);
  assert.match(ui,/dayDetailBackdrop/);
  assert.match(ui,/aria-modal/);
  assert.match(ui,/Escape/);
});

test('monthly UI module is loaded by TokiMate extras',()=>{
  assert.match(extras,/monthly-ui\.mjs\?v=077/);
  assert.match(extras,/APP_VERSION='v0\.7\.7'/);
});
