import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const ui=readFileSync(new URL('../zangyo36/monthly-ui.mjs',import.meta.url),'utf8');
const extras=readFileSync(new URL('../zangyo36/extras.mjs',import.meta.url),'utf8');
const html=readFileSync(new URL('../zangyo36/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../zangyo36/app.js',import.meta.url),'utf8');

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

test('dialog class synchronization cannot retrigger its observer forever',()=>{
  assert.match(ui,/if\(!card\.classList\.contains\('tm-day-modal'\)\)card\.classList\.add\('tm-day-modal'\)/);
  assert.doesNotMatch(ui,/\n\s*card\.classList\.add\('tm-day-modal'\);/);
});

test('monthly form uses non-overlapping mobile columns',()=>{
  assert.match(ui,/@media\(max-width:680px\)[\s\S]*?#dayDetailCard\.tm-day-modal \.formgrid\{grid-template-columns:1fr;gap:12px\}/);
  assert.match(ui,/\.formgrid>div\{min-width:0\}/);
});

test('monthly sheet uses arrow paging and a long-press month picker',()=>{
  assert.match(html,/id="monthlyPrev"/);
  assert.match(html,/id="monthlyPickerButton"/);
  assert.match(html,/id="monthlyNext"/);
  assert.match(ui,/setTimeout\(\(\)=>\{timer=0;openMonthPicker\(\);\},550\)/);
  assert.match(ui,/id="tmMonthPickerPanel"/);
  assert.match(app,/function monthRange\(\)\{let y=2026;return\{start:`\$\{y\}-04`,end:`\$\{y\+10\}-03`/);
  assert.match(app,/for\(let i=0;i<120;i\+\+\)/);
  assert.match(app,/\.min=r\.minDate;\$\('#detailDate'\)\.max=r\.maxDate/);
});

test('rule sections are compact details opened on tap',()=>{
  assert.match(html,/<details class="tm-rule-details"><summary>2〜6か月平均<\/summary>/);
  assert.match(html,/<details class="tm-rule-details"><summary>36協定判定<\/summary>/);
});

test('day editor autosaves and exposes clear instead of save/delete',()=>{
  assert.match(html,/id="dayAutoSaveState"/);
  assert.doesNotMatch(html,/<button type="submit" class="primary">保存<\/button>/);
  assert.match(html,/id="deleteDay"[^>]*>クリア<\/button>/);
  assert.match(app,/function queueDayAutoSave\(\)/);
  assert.match(app,/setTimeout\(\(\)=>\{detailSaveQueue=.*\},300\)/);
  assert.match(app,/detailDate'\)\.onchange=.*detailWorkType'\)\.onchange=queueDayAutoSave/);
  assert.match(app,/勤務内容をクリアしますか/);
});

test('fortune result requests one short vibration with its sound',()=>{
  assert.match(app,/function fortuneFeedback\(f\)\{tone\(f\);try\{navigator\.vibrate\?\.\(35\)\}/);
});

test('monthly UI module is loaded by TokiMate extras',()=>{
  assert.match(extras,/monthly-ui\.mjs\?v=076m3/);
  assert.match(extras,/APP_VERSION='v0\.7\.6'/);
});
