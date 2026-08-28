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

function rackTestApi() {
  const storage = new Map();
  const context = {
    console, structuredClone, crypto: require('node:crypto').webcrypto,
    Intl, Date, Math, Number, String, Object, Array, Set, Map, JSON,
    Blob: global.Blob, URL: global.URL, setTimeout, clearTimeout,
    document: {
      getElementById() { return null; },
      querySelectorAll() { return []; },
      addEventListener() {},
      createElement() { return {}; },
      documentElement: { style: { setProperty() {} } }
    },
    localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, value); },
      removeItem(key) { storage.delete(key); }
    },
    window: { addEventListener() {}, innerWidth: 1000, scrollX: 0, scrollY: 0, print() {} },
    navigator: {}, confirm() { return true; }
  };
  const expose = `
    globalThis.__rackTestApi = {
      products: finishes => finishes.flatMap(finish => rackCandidates(finish)),
      pick: ({finish='P', width, cableMass=0, coverMass=0, limit=80, direction='horizontal', maxDiameter=20, cover=false}) => {
        const candidates = rackCandidates(finish)
          .filter(item => item.width >= width && (direction === 'eps' ? item.type === 'QR' : true) && (!cover || item.height >= maxDiameter))
          .map(item => ({...item, utilization:(cableMass + item.massKgM + coverMass) / item.allowableKgM * 100}));
        return candidates.find(item => direction !== 'horizontal' || (item.allowableKgM && item.utilization <= limit));
      }
    };
  `;
  vm.createContext(context);
  vm.runInContext(`${read('app.js')}\n${expose}`, context);
  return context.__rackTestApi;
}

test('SR and QR manufacturer reference arrays are complete', () => {
  const products = rackTestApi().products(['P', 'Z', 'SD', 'S']);
  assert.equal(products.length, 64);
  assert.ok(products.every(item => Number.isFinite(item.massKgM) && item.massKgM > 0));
  assert.equal(products.filter(item => !item.allowableKgM).length, 1);
  assert.equal(products.find(item => !item.allowableKgM).code, 'S-QR120');
});

test('rack selection covers width, load, finish and EPS boundaries', () => {
  const { pick } = rackTestApi();
  assert.equal(pick({ width: 90, cableMass: 5 }).code, 'SR20');
  assert.equal(pick({ width: 200.1, cableMass: 5 }).code, 'SR30');
  assert.equal(pick({ width: 180, cableMass: 100 }).code, 'QR20');
  assert.equal(pick({ width: 180, cableMass: 90, limit: 80 }).code, 'QR20');
  assert.equal(pick({ width: 180, cableMass: 90, limit: 100 }).code, 'SR20');
  assert.equal(pick({ width: 180, cableMass: 5, direction: 'eps' }).code, 'QR20');
  assert.equal(pick({ finish: 'SD', width: 550, cableMass: 5 }).code, 'SD-SR60');
  assert.equal(pick({ finish: 'S', width: 1100, cableMass: 5 }), undefined);
});
