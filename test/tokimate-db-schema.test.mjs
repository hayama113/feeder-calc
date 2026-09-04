import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const nav=fs.readFileSync(path.join(root,'zangyo36/navigation.js'),'utf8');

test('TokiMate repairs malformed IndexedDB v2 before app modules run',()=>{
  assert.match(nav,/DB_VERSION=3/);
  assert.match(nav,/IDBFactory\?\.prototype/);
  assert.match(nav,/nativeOpen\.call\(this,name,DB_VERSION\)/);
  assert.match(nav,/upgradeneeded/);
  for(const store of ['entries','settings','payslips','extras'])assert.match(nav,new RegExp(`["']${store}["']`));
});

test('TokiMate core readiness requires rendered monthly rows',()=>{
  assert.match(nav,/#dailyRows tr/);
  assert.match(nav,/recover=\$\{Date\.now\(\)\}/);
});
