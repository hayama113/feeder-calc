const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('JavaScript sources parse successfully', () => {
  for (const file of ['app.js', 'sw.js']) {
    assert.doesNotThrow(() => new vm.Script(read(file), { filename: file }));
  }
});

test('HTML local assets exist', () => {
  const html = read('index.html');
  const assets = [...html.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)]
    .map(match => match[1])
    .filter(asset => !/^(?:[a-z]+:|\/\/|#)/i.test(asset));

  assert.ok(assets.length > 0, 'No local assets were found in index.html');
  for (const asset of assets) {
    assert.ok(fs.existsSync(path.join(root, asset)), `Missing HTML asset: ${asset}`);
  }
});

test('service worker precache assets exist', () => {
  const source = read('sw.js');
  const assetsBlock = source.match(/const ASSETS = \[([\s\S]*?)\];/);
  assert.ok(assetsBlock, 'ASSETS declaration was not found in sw.js');

  const assets = [...assetsBlock[1].matchAll(/["']\.\/([^"']*)["']/g)]
    .map(match => match[1])
    .filter(Boolean);

  for (const asset of assets) {
    assert.ok(fs.existsSync(path.join(root, asset)), `Missing precache asset: ${asset}`);
  }
});

test('documented version matches the application version', () => {
  const appVersion = read('app.js').match(/const APP_VERSION = ['"]([^'"]+)['"]/);
  assert.ok(appVersion, 'APP_VERSION was not found in app.js');
  assert.match(read('README.md'), new RegExp(`Web v${appVersion[1].replaceAll('.', '\\.')}`));
});
