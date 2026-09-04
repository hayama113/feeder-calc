import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

const VERSION='074';
const DISPLAY='v0.7.4';

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
  assert.match(app,/logic\.mjs\?v=074/);
  assert.match(app,/sw\.js\?v=074/);
  assert.match(attendance,/logic\.mjs\?v=074/);
  assert.match(nav,/app\.js\?v=074/);
  assert.match(extras,/APP_VERSION='v0\.7\.4'/);
  assert.match(extras,/attendance-core\.mjs\?v=074/);
  assert.match(extras,/salary-basis\.mjs\?v=074/);
});

test('TokiMate PWA precache uses current release URLs',()=>{
  const sw=read('zangyo36/sw.js');
  assert.match(sw,/CACHE_NAME='zangyo36-v0\.7\.4'/);
  for(const asset of ['app.js','logic.mjs','extras.mjs','navigation.js','attendance-core.mjs','salary-basis.mjs']){
    assert.match(sw,new RegExp(`${asset.replace('.','\\.')}\\?v=${VERSION}`));
  }
  assert.doesNotMatch(sw,/\?v=073|\?v=072|\?v=071|\?v=070|\?v=064|\?v=061/);
});

test('TokiMate monthly/payroll anchors required by the core exist',()=>{
  const html=read('zangyo36/index.html');
  for(const id of ['monthlyMonth','dailyRows','avgList','statusSummary','wageMonth','hourly','wageTotal','baseSalary','wageBaseMonthly','avgMonthlyScheduledHours']){
    assert.match(html,new RegExp(`id=["']${id}["']`),`missing #${id}`);
  }
});
