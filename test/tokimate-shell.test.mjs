import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

const VERSION='076';
const DISPLAY='v0.7.6';

test('TokiMate static shell loads one coherent release',()=>{
  const html=read('zangyo36/index.html');
  assert.match(html,/\<title\>TokiMate Pro\<\/title\>/);
  assert.match(html,new RegExp(DISPLAY.replaceAll('.','\\.')));
  for(const asset of ['navigation.js','app.js','fortune-effects.mjs','extras.mjs']){
    assert.match(html,new RegExp(`\\./${asset.replace('.','\\.')}\\?v=${VERSION}`));
  }
  assert.doesNotMatch(html,/RecoLife/);
  assert.doesNotMatch(html,/\?v=064/);
});

test('TokiMate core modules do not pin stale cache versions',()=>{
  const app=read('zangyo36/app.js');
  const extras=read('zangyo36/extras.mjs');
  const attendance=read('zangyo36/attendance-core.mjs');
  const nav=read('zangyo36/navigation.js');
  assert.match(app,/logic\.mjs\?v=076/);
  assert.match(app,/sw\.js\?v=076/);
  assert.match(attendance,/logic\.mjs\?v=076/);
  assert.match(nav,/app\.js\?v=076b3/);
  assert.match(extras,/APP_VERSION='v0\.7\.6'/);
  assert.match(extras,/attendance-core\.mjs\?v=076c1/);
  assert.match(extras,/salary-basis\.mjs\?v=076/);
  assert.match(extras,/payroll-review\.mjs\?v=076c1/);
  assert.match(extras,/scheduled-hours\.mjs\?v=076c1/);
});

test('TokiMate PWA precache uses current release URLs',()=>{
  const sw=read('zangyo36/sw.js');
  assert.match(sw,/CACHE_NAME='zangyo36-v0\.7\.6-manual-time3'/);
  for(const asset of ['navigation.js','salary-basis.mjs']){
    assert.match(sw,new RegExp(`${asset.replace('.','\\.')}\\?v=${VERSION}`));
  }
  assert.match(sw,/app\.js\?v=076b3/);
  for(const asset of ['logic.mjs','attendance-core.mjs','payroll-review.mjs','scheduled-hours.mjs'])assert.match(sw,new RegExp(`${asset.replace('.','\\.')}\\?v=076c1`));
  assert.match(sw,/extras\.mjs\?v=076m5/);
  assert.match(sw,/monthly-ui\.mjs\?v=076m5/);
  assert.doesNotMatch(sw,/\?v=074|\?v=073|\?v=072|\?v=071|\?v=070|\?v=064|\?v=061/);
});

test('TokiMate monthly/payroll anchors required by the core exist',()=>{
  const html=read('zangyo36/index.html');
  for(const id of ['monthlyMonth','dailyRows','avgList','statusSummary','wageMonth','hourly','wageTotal','baseSalary','wageBaseMonthly','avgMonthlyScheduledHours']){
    assert.match(html,new RegExp(`id=["']${id}["']`),`missing #${id}`);
  }
});


test('TokiMate app.js parses as an ES module',()=>{
  const app=read('zangyo36/app.js');
  const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:app,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr||result.stdout||'app.js parse failed');
});
