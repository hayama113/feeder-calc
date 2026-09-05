import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const ui=readFileSync(new URL('../zangyo36/monthly-ui.mjs',import.meta.url),'utf8');
const extras=readFileSync(new URL('../zangyo36/extras.mjs',import.meta.url),'utf8');
const html=readFileSync(new URL('../zangyo36/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../zangyo36/app.js',import.meta.url),'utf8');
const attendance=readFileSync(new URL('../zangyo36/attendance-core.mjs',import.meta.url),'utf8');

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

test('monthly summary orders remaining required hours before overtime',()=>{
  assert.doesNotMatch(html,/左右の矢印で月送り。年月を長押しすると月一覧を表示します。/);
  assert.match(html,/実労働[\s\S]*残労働時間（規定－実労働）[\s\S]*会社規定勤務時間[\s\S]*時間外/);
  assert.match(html,/id="sRemaining"/);
  assert.doesNotMatch(html,/id="sHoliday"/);
  assert.match(app,/sRemaining'\)\.textContent=fmtMinutes\(Math\.max\(0,m\.companyLimit-m\.actual\)\)/);
});

test('clock fields keep native time pickers and add four-digit numeric entry',()=>{
  for(const id of ['detailStart','detailEnd']){
    assert.match(html,new RegExp(`id="${id}" type="time"`));
    assert.match(html,new RegExp(`id="${id}Manual"[^>]*inputmode="numeric"[^>]*maxlength="4"`));
  }
  assert.match(app,/function parseManualTime\(value\)/);
  assert.match(app,/digits\.length!==4/);
  assert.match(app,/h<24&&m<60/);
  assert.match(app,/syncManualTime\('detailStart','detailStartManual'\)/);
  assert.match(app,/applyManualTime\(manualId,timeId\)/);
  assert.match(app,/時刻は4桁で入力してください/);
});

test('monthly rows are colored by work type instead of weekday',()=>{
  assert.match(app,/workTypeColorClass=type=>type==='特休'\?'tm-work-blue':type==='公休'\?'tm-work-red':type==='有休'\?'tm-work-green':'tm-work-black'/);
  assert.match(app,/data-work-type="\$\{type\}" class="\$\{rowClass\}"/);
  assert.match(ui,/tr\.tm-work-blue\{color:#1d4ed8\}/);
  assert.match(ui,/tr\.tm-work-red\{color:#b91c1c\}/);
  assert.match(ui,/tr\.tm-work-green\{color:#15803d\}/);
  assert.match(ui,/tr\.tm-work-black\{color:var\(--text\)\}/);
  assert.doesNotMatch(attendance,/classList\.toggle\('day-sun'/);
  assert.doesNotMatch(attendance,/classList\.toggle\('day-sat'/);
});

test('ordinary workdays stay unset until chosen and clock-ins use work type',()=>{
  assert.match(app,/TYPES=\['出勤','特休','公休','非番','有休','出勤日','忌引き','その他'\]/);
  assert.match(app,/type:'出勤',start:t/);
  assert.match(app,/type==='日勤'\?'出勤':type/);
  assert.match(app,/typeLabel=type\|\|'未入力'/);
  assert.match(app,/<option value="" \$\{type\?'':'selected'\}>未入力<\/option>/);
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
  assert.match(extras,/monthly-ui\.mjs\?v=076m6/);
  assert.match(extras,/APP_VERSION='v0\.7\.6'/);
});
