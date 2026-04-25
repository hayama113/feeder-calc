const VERSIONS = {
  app: 'Web v2.0.0',
  ampacity: '2026.04-A',
  physical: '2026.04-B',
  form: '2026.04-C'
};

const STORAGE = {
  disclaimer: 'feeder_calc_disclaimer_v2',
  history: 'feeder_calc_history_v2',
  saved: 'feeder_calc_saved_v2',
  ui: 'feeder_calc_ui_v2'
};

const BREAKER_SIZES = [10, 15, 20, 30, 40, 50, 60, 75, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600, 800];
const RACK_WIDTHS = [200, 300, 400, 500, 600, 800];
const POWER_FACTOR_OPTIONS = ['0.5','0.55','0.6','0.65','0.7','0.75','0.8','0.85','0.9','0.95','1.0'];
const EFFICIENCY_OPTIONS = [...POWER_FACTOR_OPTIONS];
const TEMP_COEF = {20:1.18,25:1.14,30:1.10,35:1.05,40:1.00,45:0.95,50:0.89};
const METHOD_COEF = {'気中':1.00,'管路':0.95,'埋設':0.90};
const CONDITION_COEF = {'日射なし':1.00,'直射日光あり':0.95};
const PARALLEL_COEF = {1:1.00,2:0.90,3:0.85,4:0.80,5:0.75,6:0.70};
const DROP_LIMIT_PERCENT = 5.0;

const GROUND_RULES = [
  {groundType:'C種', wireType:'IV', maxBreaker:100, size:'8sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:200, size:'14sq'},
  {groundType:'C種', wireType:'IV', maxBreaker:400, size:'22sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:100, size:'5.5sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:200, size:'8sq'},
  {groundType:'D種', wireType:'IV', maxBreaker:400, size:'14sq'},
  {groundType:'C種', wireType:'CV', maxBreaker:100, size:'8sq'},
  {groundType:'C種', wireType:'CV', maxBreaker:200, size:'14sq'},
  {groundType:'D種', wireType:'CV', maxBreaker:100, size:'5.5sq'},
  {groundType:'D種', wireType:'CV', maxBreaker:200, size:'8sq'}
];

const CABLE_DATA = {
  'CV-1C': {
    3.5:{outerDiameter:7.0,massKgKm:74,resistance:5.20,ampacity:44},
    5.5:{outerDiameter:8.0,massKgKm:105,resistance:3.33,ampacity:58},
    8:{outerDiameter:8.6,massKgKm:130,resistance:2.31,ampacity:72},
    14:{outerDiameter:9.4,massKgKm:195,resistance:1.31,ampacity:100},
    22:{outerDiameter:11.0,massKgKm:280,resistance:0.832,ampacity:130},
    38:{outerDiameter:13.0,massKgKm:445,resistance:0.481,ampacity:190},
    60:{outerDiameter:15.5,massKgKm:655,resistance:0.305,ampacity:255},
    100:{outerDiameter:19.0,massKgKm:1100,resistance:0.183,ampacity:355},
    150:{outerDiameter:22.0,massKgKm:1550,resistance:0.122,ampacity:455},
    200:{outerDiameter:26.0,massKgKm:2050,resistance:0.0915,ampacity:545},
    250:{outerDiameter:28.0,massKgKm:2500,resistance:0.0739,ampacity:620},
    325:{outerDiameter:31.0,massKgKm:3200,resistance:0.0568,ampacity:725}
  },
  'CV-2C': {
    8:{outerDiameter:19.0,massKgKm:260,resistance:2.36,ampacity:66},
    14:{outerDiameter:19.0,massKgKm:375,resistance:1.34,ampacity:91},
    22:{outerDiameter:22.0,massKgKm:550,resistance:0.849,ampacity:120},
    38:{outerDiameter:26.0,massKgKm:865,resistance:0.491,ampacity:165},
    60:{outerDiameter:31.0,massKgKm:1330,resistance:0.311,ampacity:225},
    100:{outerDiameter:38.0,massKgKm:2130,resistance:0.187,ampacity:310},
    150:{outerDiameter:44.0,massKgKm:3030,resistance:0.124,ampacity:400},
    200:{outerDiameter:51.0,massKgKm:4040,resistance:0.0933,ampacity:490},
    250:{outerDiameter:56.0,massKgKm:4930,resistance:0.0754,ampacity:565},
    325:{outerDiameter:61.0,massKgKm:6300,resistance:0.0579,ampacity:670},
    400:{outerDiameter:67.0,massKgKm:8380,resistance:0.0471,ampacity:765},
    500:{outerDiameter:75.0,massKgKm:10470,resistance:0.0376,ampacity:880}
  },
  'CV-3C': {
    8:{outerDiameter:18.5,massKgKm:390,resistance:2.36,ampacity:62},
    14:{outerDiameter:21.0,massKgKm:560,resistance:1.34,ampacity:86},
    22:{outerDiameter:24.0,massKgKm:820,resistance:0.849,ampacity:110},
    38:{outerDiameter:28.0,massKgKm:1300,resistance:0.491,ampacity:155},
    60:{outerDiameter:33.0,massKgKm:1990,resistance:0.311,ampacity:210},
    100:{outerDiameter:41.0,massKgKm:3190,resistance:0.187,ampacity:290},
    150:{outerDiameter:47.0,massKgKm:4540,resistance:0.124,ampacity:380},
    200:{outerDiameter:55.0,massKgKm:6060,resistance:0.0933,ampacity:465},
    250:{outerDiameter:60.0,massKgKm:7420,resistance:0.0754,ampacity:535},
    325:{outerDiameter:66.0,massKgKm:9450,resistance:0.0579,ampacity:635},
    400:{outerDiameter:72.0,massKgKm:12570,resistance:0.0471,ampacity:725},
    500:{outerDiameter:80.0,massKgKm:14720,resistance:0.0376,ampacity:835}
  },
  'CV-4C': {
    14:{outerDiameter:23.0,massKgKm:750,resistance:1.34,ampacity:86},
    22:{outerDiameter:27.0,massKgKm:1100,resistance:0.849,ampacity:110},
    38:{outerDiameter:31.0,massKgKm:1730,resistance:0.491,ampacity:155},
    60:{outerDiameter:37.0,massKgKm:2650,resistance:0.311,ampacity:210},
    100:{outerDiameter:46.0,massKgKm:4250,resistance:0.187,ampacity:290},
    150:{outerDiameter:53.0,massKgKm:6050,resistance:0.124,ampacity:380},
    200:{outerDiameter:62.0,massKgKm:8070,resistance:0.0933,ampacity:465},
    250:{outerDiameter:67.0,massKgKm:9890,resistance:0.0754,ampacity:535},
    325:{outerDiameter:74.0,massKgKm:12590,resistance:0.0579,ampacity:635},
    400:{outerDiameter:80.0,massKgKm:16760,resistance:0.0471,ampacity:725},
    500:{outerDiameter:90.0,massKgKm:20940,resistance:0.0376,ampacity:835}
  }
};

const DOC_SECTIONS = [
  {
    id:'ampacity',
    title:'ケーブルサイズ・ケーブル許容電流一覧表',
    note:'基準条件：周囲温度40℃・1条の参考値です。最終判断は現場条件・法令・仕様を確認してください。',
    buildRows(){
      const rows = [];
      Object.entries(CABLE_DATA).forEach(([type, items]) => {
        Object.entries(items).forEach(([size, info]) => {
          rows.push({ cableType:type, sizeSq:size, ampacity:info.ampacity });
        });
      });
      return {headers:['ケーブル種類','ケーブルサイズ [sq]','許容電流 [A]'], rows};
    }
  },
  {
    id:'physical',
    title:'ケーブル外径・概算質量一覧表',
    note:'外径・概算質量は参考値です。ラック・支持条件の最終判断は別途確認してください。',
    buildRows(){
      const rows = [];
      Object.entries(CABLE_DATA).forEach(([type, items]) => {
        Object.entries(items).forEach(([size, info]) => {
          rows.push({ cableType:type, sizeSq:size, outerDiameter:info.outerDiameter, massKgKm:info.massKgKm });
        });
      });
      return {headers:['ケーブル種類','ケーブルサイズ [sq]','外径 [mm]','概算質量 [kg/km]'], rows};
    }
  }
];

const DEFAULT_UI = {
  calculationType:'power',
  calcMode:'',
  powerSystem:'',
  voltage:'',
  powerFactor:'',
  efficiency:'',
  wiringLength:'',
  existingBreaker:'',
  projectName:'',
  projectRemarks:'',
  loadCount:'',
  cableType:'',
  cableSize:'',
  baseAmpacity:'',
  ampacityMode:'none',
  installationMethod:'',
  layingCondition:'',
  ambientTemperature:'',
  parallelCount:'',
  loads:[],
  lastResult:null,
  compareBaseId:''
};

let state = loadJson(STORAGE.ui, structuredClone(DEFAULT_UI));
let historyItems = loadJson(STORAGE.history, []);
let savedItems = loadJson(STORAGE.saved, []);
let compareIds = [];
let deferredPrompt = null;
let disclaimerStep = 0;

const $ = (id) => document.getElementById(id);
const screens = {
  calc: $('screen-calc'),
  docs: $('screen-docs'),
  saved: $('screen-saved'),
  settings: $('screen-settings')
};
const resultFieldIds = [];

function loadJson(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function persistState(){
  localStorage.setItem(STORAGE.ui, JSON.stringify(state));
  localStorage.setItem(STORAGE.history, JSON.stringify(historyItems));
  localStorage.setItem(STORAGE.saved, JSON.stringify(savedItems));
}

function formatNumber(value, digits=2){
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '-';
  return new Intl.NumberFormat('ja-JP', {maximumFractionDigits:digits, minimumFractionDigits:0}).format(Number(value));
}

function showToast(message){
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function setSelectOptions(el, options, placeholder='選択してください', selected=''){
  const html = [`<option value="">${placeholder}</option>`]
    .concat(options.map(opt => {
      if (typeof opt === 'object') return `<option value="${opt.value}">${opt.label}</option>`;
      return `<option value="${opt}">${opt}</option>`;
    }))
    .join('');
  el.innerHTML = html;
  el.value = selected || '';
}

function getCableSizes(cableType){
  if (!cableType || !CABLE_DATA[cableType]) return [];
  return Object.keys(CABLE_DATA[cableType]).map(Number).sort((a,b) => a-b);
}

function getCableInfo(cableType, size){
  if (!cableType || !size || !CABLE_DATA[cableType]) return null;
  return CABLE_DATA[cableType][size] || null;
}

function createBlankLoad(index){
  return {
    id: crypto.randomUUID(),
    title:`負荷${index + 1}`,
    name:'',
    inputType:'',
    value:'',
    current:''
  };
}

function normalizeLoads(){
  const target = Number(state.loadCount || 0);
  if (!target) {
    state.loads = [];
    return;
  }
  if (state.loads.length < target) {
    while (state.loads.length < target) state.loads.push(createBlankLoad(state.loads.length));
  } else if (state.loads.length > target) {
    state.loads = state.loads.slice(0, target);
  }
  state.loads.forEach((load, i) => load.title = `負荷${i + 1}`);
}

function currentForLoad(load){
  const value = Number(load.value);
  const voltage = Number(state.voltage);
  const pf = Number(state.powerFactor);
  const eff = Number(state.efficiency);
  if (!value || !voltage || !pf || !eff) return '';
  if (load.inputType === 'A') return value;
  if (load.inputType === 'kVA') {
    return isThreePhase() ? (value * 1000) / (Math.sqrt(3) * voltage) : (value * 1000) / voltage;
  }
  if (load.inputType === 'kW') {
    return isThreePhase() ? (value * 1000) / (Math.sqrt(3) * voltage * pf * eff) : (value * 1000) / (voltage * pf * eff);
  }
  return '';
}

function kwForLoad(load){
  const value = Number(load.value);
  const pf = Number(state.powerFactor);
  const eff = Number(state.efficiency);
  if (!value || !pf || !eff) return '';
  if (load.inputType === 'kW') return value;
  if (load.inputType === 'kVA') return value * pf * eff;
  if (load.inputType === 'A') {
    const voltage = Number(state.voltage);
    if (!voltage) return '';
    const kva = isThreePhase() ? (Math.sqrt(3) * voltage * value / 1000) : (voltage * value / 1000);
    return kva * pf * eff;
  }
  return '';
}

function kvaForLoad(load){
  const value = Number(load.value);
  const pf = Number(state.powerFactor);
  const eff = Number(state.efficiency);
  if (!value || !pf || !eff) return '';
  if (load.inputType === 'kVA') return value;
  if (load.inputType === 'kW') return value / (pf * eff);
  if (load.inputType === 'A') {
    const voltage = Number(state.voltage);
    if (!voltage) return '';
    return isThreePhase() ? (Math.sqrt(3) * voltage * value / 1000) : (voltage * value / 1000);
  }
  return '';
}

function isThreePhase(){
  return String(state.powerSystem).startsWith('3φ');
}

function sizingCurrentBase(){
  const required = requiredBreakerFromLoad();
  const existing = Number(state.existingBreaker || 0);
  if (state.calcMode === 'existing') return existing || required;
  return required;
}

function requiredBreakerFromLoad(){
  const totalCurrent = getLoadSummary().totalCurrent;
  if (!totalCurrent) return 0;
  return BREAKER_SIZES.find(v => v >= totalCurrent) || BREAKER_SIZES[BREAKER_SIZES.length - 1];
}

function adoptedBreaker(){
  const required = requiredBreakerFromLoad();
  const existing = Number(state.existingBreaker || 0);
  return state.calcMode === 'existing' ? existing : required;
}

function getCorrectionBreakdown(){
  const temp = Number(state.ambientTemperature || 0);
  const par = Number(state.parallelCount || 0);
  const temperature = TEMP_COEF[temp] ?? null;
  const parallel = PARALLEL_COEF[par] ?? null;
  const method = METHOD_COEF[state.installationMethod] ?? null;
  const condition = CONDITION_COEF[state.layingCondition] ?? null;
  const final = [temperature, parallel, method, condition].every(v => v != null)
    ? temperature * parallel * method * condition
    : null;
  return { temperature, parallel, method, condition, final };
}

function basisAmpacity(){
  const manual = Number(state.baseAmpacity);
  return manual || 0;
}

function correctedAmpacity(){
  const basis = Number(state.baseAmpacity);
  const breakdown = getCorrectionBreakdown();
  if (!basis || !breakdown.final) return 0;
  return basis * breakdown.final;
}

function getLoadSummary(){
  const list = state.loads.map(load => ({
    ...load,
    current: currentForLoad(load),
    kw: kwForLoad(load),
    kva: kvaForLoad(load)
  }));
  return {
    list,
    totalCurrent: list.reduce((s, v) => s + (Number(v.current) || 0), 0),
    totalKW: list.reduce((s, v) => s + (Number(v.kw) || 0), 0),
    totalKVA: list.reduce((s, v) => s + (Number(v.kva) || 0), 0)
  };
}

function calcVoltageDrop(current, resistance, lengthM){
  const voltage = Number(state.voltage);
  if (!current || !resistance || !lengthM || !voltage) return { dropV:0, dropPercent:0 };
  const dropV = isThreePhase() ? (Math.sqrt(3) * current * resistance * lengthM / 1000) : (2 * current * resistance * lengthM / 1000);
  return { dropV, dropPercent:(dropV / voltage) * 100 };
}

function rackWidthFor(outerDiameter, count){
  if (!outerDiameter || !count) return '';
  const occupied = outerDiameter * count * 1.35;
  const width = RACK_WIDTHS.find(v => v >= occupied) || RACK_WIDTHS[RACK_WIDTHS.length - 1];
  return `W${width}`;
}

function suggestedCableSelection(){
  const type = state.cableType;
  const sizes = getCableSizes(type);
  if (!type || !sizes.length) return null;
  const basisCurrent = sizingCurrentBase();
  const length = Number(state.wiringLength);
  const loadSummary = getLoadSummary();
  const breakdown = getCorrectionBreakdown();
  if (!basisCurrent || !length || !breakdown.final) return null;

  const candidates = sizes.map(size => {
    const info = getCableInfo(type, size);
    const baseAmp = state.ampacityMode === 'manual' && Number(state.baseAmpacity) && Number(state.cableSize) === Number(size)
      ? Number(state.baseAmpacity)
      : Number(info?.ampacity || 0);
    const corrected = baseAmp * breakdown.final;
    const drop = calcVoltageDrop(loadSummary.totalCurrent, Number(info?.resistance || 0), length);
    const currentOk = corrected >= basisCurrent;
    const dropOk = drop.dropPercent <= DROP_LIMIT_PERCENT;
    return { size, info, baseAmp, corrected, drop, currentOk, dropOk };
  });

  const valid = candidates.find(c => c.currentOk && c.dropOk);
  return { valid, candidates };
}

function primaryFactor(candidate){
  if (!candidate) return '-';
  const ratioCurrent = candidate.corrected ? sizingCurrentBase() / candidate.corrected : 0;
  const ratioDrop = candidate.drop.dropPercent / DROP_LIMIT_PERCENT;
  if (state.calcMode === 'existing') {
    if (ratioDrop > ratioCurrent) return '電圧降下';
    return '既設開閉器条件';
  }
  return ratioDrop > ratioCurrent ? '電圧降下' : '許容電流';
}

function allSelectionReasons(candidate){
  if (!candidate) return [];
  const reasons = [];
  reasons.push('許容電流');
  if (candidate.drop.dropPercent >= DROP_LIMIT_PERCENT * 0.7) reasons.push('電圧降下');
  if (state.calcMode === 'existing') reasons.push('既設開閉器条件');
  return [...new Set(reasons)];
}

function constructionNotes(totalMass){
  const notes = [];
  const length = Number(state.wiringLength || 0);
  if (totalMass > 100) notes.push('概算総質量が大きいため、支持条件を確認してください。');
  if (totalMass > 300) notes.push('ラック・支持材の耐荷重確認を推奨します。');
  if (length > 100) notes.push('長尺配線のため、施工計画に注意してください。');
  if (!notes.length) notes.push('概算質量は参考値です。最終的な施工計画は現場条件を確認してください。');
  return notes;
}

function rootMemo(result){
  const notes = ['参考値を使用しています。', '最終判断は現場条件・法令・仕様を確認してください。'];
  notes.push(state.calcMode === 'existing' ? '既設条件を優先した計算です。' : '負荷容量から必要最小開閉器を算出しています。');
  notes.push('技術資料タブの基準条件を参照してください。');
  if (state.ampacityMode === 'manual') notes.push('基準許容電流は手動入力値を採用しています。');
  return notes;
}

function missingFields(){
  const missing = [];
  const pushIf = (condition, label, id) => { if (condition) missing.push({label, id}); };

  pushIf(!state.calcMode, '計算方式を選択してください。', 'calcMode');
  pushIf(!state.powerSystem, '電源方式を選択してください。', 'powerSystem');
  pushIf(!state.voltage, '電圧を選択してください。', 'voltage');
  pushIf(!state.powerFactor, '力率を選択してください。', 'powerFactor');
  pushIf(!state.efficiency, '効率を選択してください。', 'efficiency');
  pushIf(!state.wiringLength, '配線長を入力してください。', 'wiringLength');
  if (state.calcMode === 'existing') pushIf(!state.existingBreaker, '既設開閉器を選択してください。', 'existingBreaker');
  pushIf(!state.loadCount, '負荷数を選択してください。', 'loadCount');
  pushIf(!state.cableType, 'ケーブル種類を選択してください。', 'cableType');
  pushIf(!state.cableSize, 'ケーブルサイズを選択してください。', 'cableSize');
  pushIf(!state.baseAmpacity, '基準許容電流を入力してください。', 'baseAmpacity');
  pushIf(!state.installationMethod, '敷設方法を選択してください。', 'installationMethod');
  pushIf(!state.layingCondition, '敷設条件を選択してください。', 'layingCondition');
  pushIf(!state.ambientTemperature, '環境温度を選択してください。', 'ambientTemperature');
  pushIf(!state.parallelCount, '条数を選択してください。', 'parallelCount');

  state.loads.forEach((load, index) => {
    if (!load.name) missing.push({label:`負荷${index + 1}の負荷名称を入力してください。`, id:`load-name-${load.id}`});
    if (!load.inputType) missing.push({label:`負荷${index + 1}の入力方式を選択してください。`, id:`load-type-${load.id}`});
    if (!load.value && load.value !== 0) missing.push({label:`負荷${index + 1}の負荷値を入力してください。`, id:`load-value-${load.id}`});
  });

  return missing;
}

function clearInputErrors(){
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function markMissingFields(list){
  clearInputErrors();
  list.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) el.classList.add('input-error');
  });
}

function updateResultError(message){
  const box = $('resultErrorBox');
  if (!message) {
    box.classList.add('hidden');
    box.innerHTML = '';
    return;
  }
  box.classList.remove('hidden');
  box.innerHTML = message;
}

function calculate(){
  const missing = missingFields();
  if (missing.length) {
    markMissingFields(missing);
    state.lastResult = null;
    $('resultPanel').classList.remove('hidden');
    updateResultError(`未入力項目がある為、計算出来ません。入力して下さい。<br>${missing.map(v => '・' + v.label).join('<br>')}`);
    $('resultBody').classList.add('hidden');
    persistState();
    return;
  }

  const loadSummary = getLoadSummary();
  const breakdown = getCorrectionBreakdown();
  const selected = suggestedCableSelection();
  const candidate = selected?.valid || selected?.candidates.at(-1) || null;
  const baseAmp = Number(state.baseAmpacity);
  const corrected = correctedAmpacity();
  const requiredBreaker = requiredBreakerFromLoad();
  const adopted = adoptedBreaker();
  const breakerMarginPercent = adopted ? ((adopted - loadSummary.totalCurrent) / adopted) * 100 : 0;
  const capacityMarginKW = (state.powerSystem.startsWith('3φ')
    ? (Math.sqrt(3) * Number(state.voltage) * adopted * Number(state.powerFactor) * Number(state.efficiency) / 1000)
    : (Number(state.voltage) * adopted * Number(state.powerFactor) * Number(state.efficiency) / 1000)) - loadSummary.totalKW;
  const drop = candidate ? calcVoltageDrop(loadSummary.totalCurrent, Number(candidate.info?.resistance || 0), Number(state.wiringLength)) : {dropV:0,dropPercent:0};
  const failReasons = [];
  const currentOk = corrected >= sizingCurrentBase();
  const breakerOk = requiredBreaker ? adopted >= requiredBreaker : true;
  const dropOk = drop.dropPercent <= DROP_LIMIT_PERCENT;
  if (!currentOk) failReasons.push(`許容電流不足（必要 ${formatNumber(sizingCurrentBase(),1)}A / 補正後許容 ${formatNumber(corrected,1)}A）`);
  if (!breakerOk) failReasons.push(`開閉器容量不足（必要 ${requiredBreaker}A / 採用 ${adopted}A）`);
  if (!dropOk) failReasons.push(`電圧降下超過（${formatNumber(drop.dropPercent,2)}% / 許容 ${DROP_LIMIT_PERCENT.toFixed(1)}%）`);

  const totalMass = (Number(candidate?.info?.massKgKm || 0) / 1000) * Number(state.wiringLength || 0) * Number(state.parallelCount || 1);
  const result = {
    calculatedAt: new Date().toISOString(),
    mode: state.calcMode,
    totalCurrent: loadSummary.totalCurrent,
    totalKW: loadSummary.totalKW,
    totalKVA: loadSummary.totalKVA,
        requiredBreaker,
    adoptedBreaker: adopted,
    breakerMarginPercent,
    capacityMarginKW,
    voltageDropV: drop.dropV,
    voltageDropPercent: drop.dropPercent,
    baseAmpacity: baseAmp,
    correctedAmpacity: corrected,
    cableType: state.cableType,
    cableSize: candidate?.size || state.cableSize,
    correctionBreakdown: breakdown,
    reasons: allSelectionReasons(candidate),
    mainFactor: primaryFactor(candidate),
    failReasons,
    judgement: failReasons.length ? '否' : '良',
    existingBreaker: state.existingBreaker || '',
    existingBreakerJudge: state.calcMode === 'existing'
      ? (breakerOk ? '適合' : '否')
      : '-',
    cableJudge: currentOk && dropOk ? '適合' : '否',
    rackWidth: candidate?.info?.outerDiameter
      ? rackWidthFor(Number(candidate.info.outerDiameter), Number(state.parallelCount || 1))
      : '-',
    massKgM: candidate?.info?.massKgKm ? Number(candidate.info.massKgKm) / 1000 : 0,
    massTotalKg: totalMass,
    constructionNotes: constructionNotes(totalMass),
    rootMemo: rootMemo(),
    loadDetails: loadSummary.list
  };

  state.lastResult = result;

  historyItems.unshift({
    id: crypto.randomUUID(),
    title: `${state.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'}_${new Date().toLocaleString('sv-SE').replace(/[: ]/g,'_')}`,
    memo: '',
    savedAt: new Date().toISOString(),
    input: structuredClone(state),
    result: structuredClone(result),
    calculationMode: state.calcMode,
    versions: structuredClone(VERSIONS)
  });

  historyItems = historyItems.slice(0, 50);
  persistState();
  $('resultPanel').classList.remove('hidden');
  $('resultBody').classList.remove('hidden');
  updateResultError('');
  renderResult();
  renderSaved();
}

function renderResult(){
  const r = state.lastResult;
  if (!r) return;

  $('resLoadCount').textContent = String(state.loads.length || 0);
  $('resTotalKW').textContent = formatNumber(r.totalKW, 3);
  $('resTotalKVA').textContent = formatNumber(r.totalKVA, 3);
  $('resTotalCurrent').textContent = formatNumber(r.totalCurrent, 2);
  $('resRequiredBreaker').textContent = r.requiredBreaker ? `${r.requiredBreaker}A` : '-';
  $('resAdoptedBreaker').textContent = r.adoptedBreaker ? `${r.adoptedBreaker}A` : '-';
  $('resDropV').textContent = formatNumber(r.voltageDropV, 2);
  $('resDropPct').textContent = formatNumber(r.voltageDropPercent, 2);
  $('resBreakerMargin').textContent = formatNumber(r.breakerMarginPercent, 2);
  $('resCapacityMargin').textContent = formatNumber(r.capacityMarginKW, 2);
  $('resSelectedCable').textContent = `${r.cableType || '-'} ${r.cableSize ? `${r.cableSize}sq` : '-'}`;
  $('resMainFactor').textContent = r.mainFactor || '-';

  const judge = $('resJudgement');
  judge.textContent = r.judgement;
  judge.className = `judgement ${r.judgement === '良' ? 'good' : 'bad'}`;

  $('resExistingBreaker').innerHTML = r.existingBreaker ? `${r.existingBreaker}A` : '-';
  $('resRequiredBreaker2').innerHTML = r.requiredBreaker ? `${r.requiredBreaker}A` : '-';
  $('resExistingBreakerJudge').innerHTML = statusSpan(r.existingBreakerJudge);
  $('resCableJudge').innerHTML = statusSpan(r.cableJudge);

  $('resBaseAmpacity').textContent = formatNumber(r.baseAmpacity, 2);
  $('resFinalCoef').textContent = formatNumber(r.correctionBreakdown.final, 3);
  $('resCorrectedAmpacity').textContent = formatNumber(r.correctedAmpacity, 2);
  $('resAdoptedCable2').textContent = `${r.cableType || '-'} ${r.cableSize ? `${r.cableSize}sq` : '-'}`;
  $('resReasons').textContent = r.reasons.length ? r.reasons.join('、') : '-';

  const failRoot = $('resFailReasons');
  failRoot.innerHTML = '';
  if (!r.failReasons.length) {
    const ok = document.createElement('div');
    ok.className = 'readonly-box compact-box';
    ok.innerHTML = '<strong class="status-ok">不適合項目はありません。</strong>';
    failRoot.appendChild(ok);
  } else {
    r.failReasons.forEach(reason => {
      const div = document.createElement('div');
      div.className = 'fail-item';
      div.textContent = reason;
      failRoot.appendChild(div);
    });
  }

  const loadRoot = $('loadResultList');
  loadRoot.innerHTML = '';
  r.loadDetails.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'load-result-card';
    card.innerHTML = `
      <div class="row">
        <strong>負荷${index + 1}</strong>
        <span class="muted">${escapeHtml(item.name || '-')}</span>
      </div>
      <div class="readonly-grid top-gap">
        <div><span>入力方式</span><strong>${item.inputType || '-'}</strong></div>
        <div><span>負荷値</span><strong>${item.value || '-'} ${item.inputType || ''}</strong></div>
        <div><span>換算電流 [A]</span><strong>${formatNumber(item.current, 2)}</strong></div>
      </div>
    `;
    loadRoot.appendChild(card);
  });

  const noteRoot = $('resConstructionNotes');
  noteRoot.innerHTML = '';
  r.constructionNotes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'readonly-box compact-box';
    div.innerHTML = `<strong class="muted">${escapeHtml(note)}</strong>`;
    noteRoot.appendChild(div);
  });

  const memoRoot = $('resRootMemo');
  memoRoot.innerHTML = '';
  r.rootMemo.forEach(note => {
    const div = document.createElement('div');
    div.className = 'readonly-box compact-box';
    div.innerHTML = `<strong class="muted">${escapeHtml(note)}</strong>`;
    memoRoot.appendChild(div);
  });
}

function statusSpan(text){
  if (text === '適合' || text === '良') return `<span class="status-ok">${text}</span>`;
  if (text === '否') return `<span class="status-ng">${text}</span>`;
  return `<span class="muted">${text || '-'}</span>`;
}

function renderLoadCards(){
  normalizeLoads();
  const root = $('loadCards');
  root.innerHTML = '';
  $('loadPositionLabel').textContent = state.loads.length ? `1 / ${state.loads.length}` : '- / -';

  if (!state.loads.length) {
    root.innerHTML = '<div class="load-card muted">負荷数を選択してください。</div>';
    return;
  }

  state.loads.forEach((load, index) => {
    const card = document.createElement('div');
    card.className = 'load-card';
    card.innerHTML = `
      <div class="row">
        <strong>${load.title}</strong>
        <span class="muted">${index + 1} / ${state.loads.length}</span>
      </div>

      <div class="grid two top-gap">
        <label>
          <span>負荷名称</span>
          <input id="load-name-${load.id}" type="text" value="${escapeHtml(load.name)}" />
        </label>

        <label>
          <span>入力方式</span>
          <select id="load-type-${load.id}"></select>
        </label>

        <label>
          <span>負荷値</span>
          <input id="load-value-${load.id}" type="number" inputmode="decimal" value="${load.value === '' ? '' : escapeHtml(load.value)}" />
        </label>

        <div class="readonly-box compact-box">
          <span>入力方式</span>
          <strong id="load-type-label-${load.id}">${load.inputType || '-'}</strong>
        </div>
      </div>

      <div class="readonly-grid top-gap">
        <div><span>換算電流 [A]</span><strong id="load-current-${load.id}">${formatNumber(currentForLoad(load), 2)}</strong></div>
      </div>
    `;

    root.appendChild(card);

    const nameInput = document.getElementById(`load-name-${load.id}`);
    const typeSelect = document.getElementById(`load-type-${load.id}`);
    const valueInput = document.getElementById(`load-value-${load.id}`);

    setSelectOptions(typeSelect, ['kW','A','kVA'], '選択してください', load.inputType);

    nameInput.addEventListener('input', () => {
      load.name = nameInput.value;
      validateRealtime();
      persistState();
    });

    typeSelect.addEventListener('change', () => {
      load.inputType = typeSelect.value;
      document.getElementById(`load-type-label-${load.id}`).textContent = load.inputType || '-';
      document.getElementById(`load-current-${load.id}`).textContent = formatNumber(currentForLoad(load), 2);
      validateRealtime();
      persistState();
    });

    wireNumericInput(valueInput, () => {
      load.value = valueInput.value;
      document.getElementById(`load-current-${load.id}`).textContent = formatNumber(currentForLoad(load), 2);
      validateRealtime();
      persistState();
    });
  });

  root.addEventListener('scroll', updateLoadPositionLabel, { passive: true });
}

function updateLoadPositionLabel(){
  const root = $('loadCards');
  const children = [...root.children];
  if (!children.length) return;

  let closest = 0;
  let best = Infinity;

  children.forEach((el, index) => {
    const diff = Math.abs(el.getBoundingClientRect().left - root.getBoundingClientRect().left);
    if (diff < best) {
      best = diff;
      closest = index;
    }
  });

  $('loadPositionLabel').textContent = `${closest + 1} / ${children.length}`;
}

function renderDocs(){
  const search = ($('docsSearch').value || '').trim().toLowerCase();
  const root = $('docsContainer');
  root.innerHTML = '';

  DOC_SECTIONS.forEach(section => {
    const payload = section.buildRows();
    const textBlob = JSON.stringify(payload.rows);
    if (search && !(`${section.title} ${section.note} ${textBlob}`.toLowerCase().includes(search))) return;

    const card = document.createElement('div');
    card.className = 'doc-card';
    card.innerHTML = `
      <div class="panel-title">${section.title}</div>
      <div class="field-hint">${section.note}</div>
    `;

    const wrap = document.createElement('div');
    wrap.className = 'docs-table-wrap top-gap';

    const table = document.createElement('table');
    table.className = 'docs-table';

    const headers = payload.headers.map(v => `<th>${v}</th>`).join('');
    const bodyRows = payload.rows.map(row => {
      const values = Object.values(row).map(v => `<td>${v}</td>`).join('');
      return `<tr>${values}</tr>`;
    }).join('');

    table.innerHTML = `<thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody>`;
    wrap.appendChild(table);
    card.appendChild(wrap);
    root.appendChild(card);
  });
}

function buildSaveCard(item, isHistory){
  const card = document.createElement('div');
  card.className = 'saved-card';
  const selected = compareIds.includes(item.id);

  card.innerHTML = `
    <div class="row">
      <strong>${escapeHtml(item.title || '無題')}</strong>
      <span class="muted">${new Date(item.savedAt).toLocaleString('ja-JP')}</span>
    </div>

    ${item.memo ? `<div class="muted top-gap">${escapeHtml(item.memo)}</div>` : ''}

    <div class="readonly-grid top-gap">
      <div><span>計算方式</span><strong>${item.calculationMode === 'existing' ? '既設開閉器指定' : '自動選定'}</strong></div>
      <div><span>採用ケーブル</span><strong>${item.result?.cableType || '-'} ${item.result?.cableSize ? `${item.result.cableSize}sq` : '-'}</strong></div>
      <div><span>合計電流 [A]</span><strong>${formatNumber(item.result?.totalCurrent, 2)}</strong></div>
      <div><span>電圧降下 [%]</span><strong>${formatNumber(item.result?.voltageDropPercent, 2)}</strong></div>
      <div><span>判定</span><strong>${item.result?.judgement || '-'}</strong></div>
      <div><span>データ版</span><strong>${item.versions?.ampacity || VERSIONS.ampacity}</strong></div>
    </div>

    <div class="inline-actions">
      <button class="ghost small js-open">この案を開く</button>
      ${!isHistory ? `<button class="ghost small js-compare">${selected ? '比較から外す' : '比較に追加'}</button>` : ''}
      ${!isHistory ? '<button class="ghost small js-rename">名前変更</button>' : ''}
      <button class="ghost small js-delete">削除</button>
    </div>
  `;

  card.querySelector('.js-open').onclick = () => openSavedItem(item);

  card.querySelector('.js-delete').onclick = () => {
    if (isHistory) {
      historyItems = historyItems.filter(v => v.id !== item.id);
    } else {
      savedItems = savedItems.filter(v => v.id !== item.id);
      compareIds = compareIds.filter(id => id !== item.id);
    }
    persistState();
    renderSaved();
  };

  if (!isHistory) {
    card.querySelector('.js-compare').onclick = () => {
      if (compareIds.includes(item.id)) {
        compareIds = compareIds.filter(id => id !== item.id);
      } else if (compareIds.length < 3) {
        compareIds.push(item.id);
      } else {
        return showToast('比較は最大3件です。');
      }

      if (!state.compareBaseId && compareIds.length) state.compareBaseId = compareIds[0];
      persistState();
      renderSaved();
    };

    card.querySelector('.js-rename').onclick = () => {
      const next = prompt('保存名を入力してください。', item.title || '');
      if (next && next.trim()) {
        item.title = next.trim();
        persistState();
        renderSaved();
      }
    };
  }

  return card;
}

function renderSaved(){
  const historyRoot = $('historyList');
  historyRoot.innerHTML = '';

  if (!historyItems.length) {
    historyRoot.innerHTML = '<div class="panel muted">履歴はまだありません。</div>';
  } else {
    historyItems.forEach(item => historyRoot.appendChild(buildSaveCard(item, true)));
  }

  const query = ($('savedSearch').value || '').trim().toLowerCase();
  const list = savedItems.filter(item => !query || `${item.title || ''} ${item.memo || ''}`.toLowerCase().includes(query));

  const savedRoot = $('savedList');
  savedRoot.innerHTML = '';

  if (!list.length) {
    savedRoot.innerHTML = '<div class="panel muted">保存済みデータはまだありません。</div>';
  } else {
    list.forEach(item => savedRoot.appendChild(buildSaveCard(item, false)));
  }

  renderCompare();
}

function renderCompare(){
  const baseSelect = $('compareBaseSelect');
  const compareItems = compareIds.map(id => savedItems.find(v => v.id === id)).filter(Boolean);

  $('compareTargetCount').textContent = `${compareItems.length}件`;

  setSelectOptions(
    baseSelect,
    compareItems.map(item => ({ value: item.id, label: item.title || '無題' })),
    '選択してください',
    state.compareBaseId || ''
  );

  baseSelect.onchange = () => {
    state.compareBaseId = baseSelect.value;
    persistState();
    renderCompare();
  };

  const root = $('compareView');
  root.innerHTML = '';

  if (compareItems.length < 2) {
    root.innerHTML = '<div class="panel muted">比較対象を2件以上選択してください。</div>';
    return;
  }

  const baseItem = compareItems.find(v => v.id === state.compareBaseId) || compareItems[0];
  if (!state.compareBaseId) state.compareBaseId = baseItem.id;

  compareItems.filter(item => item.id !== baseItem.id).forEach(item => {
    const card = document.createElement('div');
    card.className = 'compare-card';

    const rows = [
      ['合計電流 [A]', baseItem.result.totalCurrent, item.result.totalCurrent, item.result.totalCurrent - baseItem.result.totalCurrent],
      ['電圧降下 [%]', baseItem.result.voltageDropPercent, item.result.voltageDropPercent, item.result.voltageDropPercent - baseItem.result.voltageDropPercent],
      ['開閉器裕度 [%]', baseItem.result.breakerMarginPercent, item.result.breakerMarginPercent, item.result.breakerMarginPercent - baseItem.result.breakerMarginPercent],
      ['容量裕度 [kW]', baseItem.result.capacityMarginKW, item.result.capacityMarginKW, item.result.capacityMarginKW - baseItem.result.capacityMarginKW]
    ];

    const bodyRows = rows.map(([label, base, target, diff]) => {
      const trend = diff > 0 ? '大きい' : diff < 0 ? '小さい' : '同じ';
      return `
        <tr class="${diff !== 0 ? 'diff' : ''}">
          <td>${label}</td>
          <td>${formatNumber(base, 2)}</td>
          <td>${formatNumber(target, 2)}</td>
          <td>${diff > 0 ? '+' : ''}${formatNumber(diff, 2)}</td>
          <td>${trend}</td>
        </tr>
      `;
    }).join('');

    card.innerHTML = `
      <div class="panel-title">基準案：${escapeHtml(baseItem.title || '無題')} ／ 比較案：${escapeHtml(item.title || '無題')}</div>
      <div class="compare-table">
        <table>
          <thead>
            <tr><th>項目</th><th>基準案</th><th>比較案</th><th>差分</th><th>大小</th></tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `;

    root.appendChild(card);
  });
}

function openSavedItem(item){
  state = structuredClone(item.input);
  state.lastResult = structuredClone(item.result);
  persistState();
  renderAll();
  switchScreen('calc');
  $('resultPanel').classList.remove('hidden');
  $('resultBody').classList.remove('hidden');
  updateResultError('');
  renderResult();
  showToast('計算画面へ読み込みました。');
}

function switchSavedTab(tab){
  document.querySelectorAll('.saved-seg').forEach(btn => btn.classList.toggle('active', btn.dataset.savedTab === tab));
  document.querySelectorAll('.saved-subview').forEach(el => el.classList.remove('active'));
  $(`saved-subview-${tab}`).classList.add('active');
}

function switchScreen(screen){
  Object.entries(screens).forEach(([key, el]) => el.classList.toggle('active', key === screen));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screen));
}

function renderAmpacitySection(){
  const corrected = correctedAmpacity();
  const breakdown = getCorrectionBreakdown();

  $('correctedAmpacityValue').textContent = corrected ? formatNumber(corrected, 2) : '-';
  $('coefTemperature').textContent = breakdown.temperature ? formatNumber(breakdown.temperature, 3) : '-';
  $('coefParallel').textContent = breakdown.parallel ? formatNumber(breakdown.parallel, 3) : '-';
  $('coefMethod').textContent = breakdown.method ? formatNumber(breakdown.method, 3) : '-';
  $('coefCondition').textContent = breakdown.condition ? formatNumber(breakdown.condition, 3) : '-';
  $('coefFinal').textContent = breakdown.final ? formatNumber(breakdown.final, 3) : '-';

  const info = getCableInfo(state.cableType, Number(state.cableSize));
  const massPerM = info?.massKgKm ? Number(info.massKgKm) / 1000 : 0;
  $('massPerMeter').textContent = massPerM ? formatNumber(massPerM, 3) : '-';

  const totalMass = massPerM && state.wiringLength
    ? massPerM * Number(state.wiringLength) * Number(state.parallelCount || 1)
    : 0;
  $('massTotal').textContent = totalMass ? formatNumber(totalMass, 2) : '-';

  $('rackWidthValue').textContent = info?.outerDiameter
    ? rackWidthFor(Number(info.outerDiameter), Number(state.parallelCount || 1))
    : '-';

  const badge = $('ampacityModeBadge');
  badge.className = 'mode-badge';

  if (state.ampacityMode === 'auto') {
    badge.textContent = '自動';
  } else if (state.ampacityMode === 'manual') {
    badge.textContent = '手動';
    badge.classList.add('manual');
  } else {
    badge.textContent = '未設定';
    badge.classList.add('none');
  }
}

function applySettingsValues(){
  $('verAmpacity').textContent = VERSIONS.ampacity;
  $('verPhysical').textContent = VERSIONS.physical;
  $('verForm').textContent = VERSIONS.form;
}

function renderAll(){
  setSelectOptions($('calcMode'), [{value:'auto',label:'自動選定'},{value:'existing',label:'既設開閉器指定'}], '選択してください', state.calcMode);
  setSelectOptions($('powerSystem'), ['1φ2W','1φ3W','3φ3W','3φ4W'], '選択してください', state.powerSystem);
  setSelectOptions($('voltage'), ['100','200','400'], '選択してください', state.voltage);
  setSelectOptions($('powerFactor'), POWER_FACTOR_OPTIONS, '選択してください', state.powerFactor);
  setSelectOptions($('efficiency'), EFFICIENCY_OPTIONS, '選択してください', state.efficiency);
  setSelectOptions($('existingBreaker'), BREAKER_SIZES.map(v => ({value:String(v), label:`${v}A`})), '選択してください', state.existingBreaker);
  setSelectOptions($('loadCount'), [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(v => ({value:String(v), label:`${v}`})), '選択してください', state.loadCount);
  setSelectOptions($('cableType'), ['CV-1C','CV-2C','CV-3C','CV-4C'], '選択してください', state.cableType);
  setSelectOptions($('cableSize'), getCableSizes(state.cableType).map(v => ({value:String(v), label:`${v}sq`})), '選択してください', state.cableSize);
  setSelectOptions($('installationMethod'), ['気中','管路','埋設'], '選択してください', state.installationMethod);
  setSelectOptions($('layingCondition'), ['日射なし','直射日光あり'], '選択してください', state.layingCondition);
  setSelectOptions($('ambientTemperature'), [20,25,30,35,40,45,50].map(v => ({value:String(v), label:`${v}℃`})), '選択してください', state.ambientTemperature);
  setSelectOptions($('parallelCount'), [1,2,3,4,5,6].map(v => ({value:String(v), label:`${v}`})), '選択してください', state.parallelCount);

  $('wiringLength').value = state.wiringLength || '';
  $('projectName').value = state.projectName || '';
  $('projectRemarks').value = state.projectRemarks || '';
  $('baseAmpacity').value = state.baseAmpacity || '';

  $('calcModeHint').textContent = state.calcMode === 'existing'
    ? '既設開閉器サイズを基準に幹線サイズを選定します。'
    : '合計負荷容量から必要最小開閉器を算出し、幹線サイズを選定します。';

  renderLoadCards();
  renderAmpacitySection();
  renderDocs();
  renderSaved();

  if (state.lastResult) {
    $('resultPanel').classList.remove('hidden');
    $('resultBody').classList.remove('hidden');
    updateResultError('');
    renderResult();
  }
}

function wireNumericInput(input, onChange){
  input.addEventListener('focus', () => {
    if (input.value !== '') {
      input.value = '';
      onChange();
    }
  });
  input.addEventListener('input', onChange);
}

function bindEvents(){
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => switchScreen(btn.dataset.screen)));

  document.querySelectorAll('.seg').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.seg').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    state.calculationType = btn.dataset.calcType;
    persistState();
  }));

  $('calcMode').addEventListener('change', () => {
    state.calcMode = $('calcMode').value;
    persistState();
    renderAll();
  });

  $('powerSystem').addEventListener('change', () => {
    state.powerSystem = $('powerSystem').value;
    persistState();
    validateRealtime();
  });

  $('voltage').addEventListener('change', () => {
    state.voltage = $('voltage').value;
    persistState();
    renderLoadCards();
    validateRealtime();
  });

  $('powerFactor').addEventListener('change', () => {
    state.powerFactor = $('powerFactor').value;
    persistState();
    renderLoadCards();
    validateRealtime();
  });

  $('efficiency').addEventListener('change', () => {
    state.efficiency = $('efficiency').value;
    persistState();
    renderLoadCards();
    validateRealtime();
  });

  $('existingBreaker').addEventListener('change', () => {
    state.existingBreaker = $('existingBreaker').value;
    persistState();
    validateRealtime();
  });

  $('loadCount').addEventListener('change', () => {
    state.loadCount = $('loadCount').value;
    normalizeLoads();
    persistState();
    renderLoadCards();
    validateRealtime();
  });

  $('cableType').addEventListener('change', () => {
    const prevSize = state.cableSize;
    state.cableType = $('cableType').value;
    const sizes = getCableSizes(state.cableType).map(String);

    if (!sizes.includes(String(prevSize))) {
      state.cableSize = '';
      state.baseAmpacity = '';
      state.ampacityMode = 'none';
      showToast('選択可能なケーブルサイズが変わりました。');
    }

    persistState();
    renderAll();
  });

  $('cableSize').addEventListener('change', () => {
    state.cableSize = $('cableSize').value;
    const info = getCableInfo(state.cableType, Number(state.cableSize));
    state.baseAmpacity = info?.ampacity ? String(info.ampacity) : '';
    state.ampacityMode = info?.ampacity ? 'auto' : 'none';
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  wireNumericInput($('baseAmpacity'), () => {
    state.baseAmpacity = $('baseAmpacity').value;
    state.ampacityMode = $('baseAmpacity').value ? 'manual' : 'none';
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  $('installationMethod').addEventListener('change', () => {
    state.installationMethod = $('installationMethod').value;
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  $('layingCondition').addEventListener('change', () => {
    state.layingCondition = $('layingCondition').value;
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  $('ambientTemperature').addEventListener('change', () => {
    state.ambientTemperature = $('ambientTemperature').value;
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  $('parallelCount').addEventListener('change', () => {
    state.parallelCount = $('parallelCount').value;
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  $('projectName').addEventListener('input', () => {
    state.projectName = $('projectName').value;
    persistState();
  });

  $('projectRemarks').addEventListener('input', () => {
    state.projectRemarks = $('projectRemarks').value;
    persistState();
  });

  wireNumericInput($('wiringLength'), () => {
    state.wiringLength = $('wiringLength').value;
    persistState();
    renderAmpacitySection();
    validateRealtime();
  });

  $('calculateBtn').addEventListener('click', calculate);

  $('toggleResultBtn').addEventListener('click', () => {
    const body = $('resultBody');
    body.classList.toggle('hidden');
    $('toggleResultBtn').textContent = body.classList.contains('hidden') ? '展開する' : '折りたたむ';
  });

  $('saveResultTopBtn').addEventListener('click', openSaveDialog);
  $('saveResultBottomBtn').addEventListener('click', openSaveDialog);

  $('confirmSaveBtn').addEventListener('click', (e) => {
    e.preventDefault();
    confirmSave();
  });

  $('csvBtn').addEventListener('click', downloadCsv);
  $('pdfBtn').addEventListener('click', printPdf);

  $('groundWireBtn').addEventListener('click', () => $('groundDialog').showModal());
  $('closeGroundDialog').addEventListener('click', () => $('groundDialog').close());
  $('groundType').addEventListener('change', updateGroundResult);
  $('groundWireType').addEventListener('change', updateGroundResult);

  $('docsSearch').addEventListener('input', renderDocs);
  $('openDocsFromCalc').addEventListener('click', () => switchScreen('docs'));
  $('returnCalcFromDocs').addEventListener('click', () => switchScreen('calc'));

  $('savedSearch').addEventListener('input', renderSaved);

  $('clearHistoryBtn').addEventListener('click', () => {
    if (!confirm('履歴をすべて削除しますか？')) return;
    historyItems = [];
    persistState();
    renderSaved();
  });

  $('resetDisclaimerBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE.disclaimer);
    showToast('次回起動時に免責を再表示します。');
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $('installBtn').hidden = false;
  });

  $('installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt = null;
    $('installBtn').hidden = true;
  });
}

function validateRealtime(){
  const missing = missingFields();
  markMissingFields(missing);
}

function openSaveDialog(){
  if (!state.lastResult) return showToast('先に計算してください。');

  $('saveTitleInput').value =
    state.projectName ||
    `${state.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'}_${new Date().toLocaleString('sv-SE').replace(/[: ]/g,'_')}`;

  $('saveMemoInput').value = state.projectRemarks || '';
  $('saveDialog').showModal();
}

function confirmSave(){
  const title = $('saveTitleInput').value.trim();
  if (!title) return showToast('保存名を入力してください。');

  const item = {
    id: crypto.randomUUID(),
    title,
    memo: $('saveMemoInput').value.trim(),
    savedAt: new Date().toISOString(),
    input: structuredClone(state),
    result: structuredClone(state.lastResult),
    calculationMode: state.calcMode,
    versions: structuredClone(VERSIONS)
  };

  savedItems.unshift(item);
  persistState();
  renderSaved();
  $('saveDialog').close();
  showToast('保存しました。');
}

function downloadCsv(){
  if (!state.lastResult) return showToast('先に計算してください。');

  const r = state.lastResult;
  const rows = [
    ['項目','値'],
    ['工事件名', state.projectName || ''],
    ['備考', state.projectRemarks || ''],
    ['計算種別', state.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'],
    ['計算方式', state.calcMode === 'existing' ? '既設開閉器指定' : '自動選定'],
    ['電源方式', state.powerSystem],
    ['電圧[V]', state.voltage],
    ['力率', state.powerFactor],
    ['効率', state.efficiency],
    ['配線長[m]', state.wiringLength],
    ['既設開閉器[A]', state.existingBreaker || ''],
    ['ケーブル種類', state.cableType],
    ['ケーブルサイズ[sq]', state.cableSize],
    ['基準許容電流[A]', state.baseAmpacity],
    ['条件反映後許容電流[A]', r.correctedAmpacity],
    ['温度補正係数', r.correctionBreakdown.temperature],
    ['条数補正係数', r.correctionBreakdown.parallel],
    ['敷設方法補正係数', r.correctionBreakdown.method],
    ['敷設条件補正係数', r.correctionBreakdown.condition],
    ['最終補正係数', r.correctionBreakdown.final],
    ['必要最小開閉器[A]', r.requiredBreaker],
    ['採用開閉器[A]', r.adoptedBreaker],
    ['採用ケーブルサイズ', `${r.cableType} ${r.cableSize}sq`],
    ['合計容量[kW]', r.totalKW],
    ['合計容量[kVA]', r.totalKVA],
    ['合計電流[A]', r.totalCurrent],
    ['電圧降下[V]', r.voltageDropV],
    ['電圧降下[%]', r.voltageDropPercent],
    ['開閉器裕度[%]', r.breakerMarginPercent],
    ['容量裕度[kW]', r.capacityMarginKW],
    ['概算質量[kg/m]', r.massKgM],
    ['概算総質量[kg]', r.massTotalKg],
    ['参考ラック幅', r.rackWidth],
    ['良否判定', r.judgement],
    ['選定主因', r.mainFactor],
    ['選定根拠', r.reasons.join('、')],
    ['許容電流データ版', VERSIONS.ampacity],
    ['外径・質量データ版', VERSIONS.physical],
    ['帳票様式版', VERSIONS.form],
    [],
    ['負荷No','負荷名称','入力方式','負荷値','換算電流[A]','換算容量[kW]','換算容量[kVA]']
  ];

  r.loadDetails.forEach((load, index) => {
    rows.push([index + 1, load.name, load.inputType, load.value, load.current, load.kw, load.kva]);
  });

  const csv = rows
    .map(row => row.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.projectName || 'feeder_calc'}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function printPdf(){
  if (!state.lastResult) return showToast('先に計算してください。');
  if (!confirm('本帳票は参考資料です。最終判断は利用者責任で行ってください。続行しますか？')) return;
  window.print();
}

function updateGroundResult(){
  const groundType = $('groundType').value;
  const wireType = $('groundWireType').value;
  const breaker = Number(state.lastResult?.adoptedBreaker || state.existingBreaker || 0);

  const rule =
    GROUND_RULES.find(v => v.groundType === groundType && v.wireType === wireType && breaker <= v.maxBreaker) ||
    GROUND_RULES.find(v => v.groundType === groundType && v.wireType === wireType);

  $('groundResult').textContent = rule
    ? `採用開閉器 ${breaker}A の参考接地線サイズ：${rule.size}`
    : '条件に合う参考サイズがありません。';
}

function runDisclaimer(){
  if (localStorage.getItem(STORAGE.disclaimer) === 'accepted') return;

  disclaimerStep = 1;
  $('disclaimerTitle').textContent = '免責事項';
  $('disclaimerBody').textContent = '本Webアプリおよび帳票出力内容は参考資料です。';
  $('disclaimerDialog').showModal();

  $('disclaimerNextBtn').onclick = () => {
    if (disclaimerStep === 1) {
      disclaimerStep = 2;
      $('disclaimerTitle').textContent = '重要な確認';
      $('disclaimerBody').textContent = '最終判断は利用者責任で行ってください。法令、現場条件、機器仕様等を確認してください。';
    } else {
      localStorage.setItem(STORAGE.disclaimer, 'accepted');
      $('disclaimerDialog').close();
    }
  };
}

function registerSW(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function escapeHtml(value){
  return String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;');
}

function init(){
  bindEvents();
  applySettingsValues();
  renderAll();
  switchScreen('calc');
  switchSavedTab('history');
  runDisclaimer();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
