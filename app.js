const STORAGE = {
  appState: 'lv-feeder-app-state-v1',
  history: 'lv-feeder-history-v1',
  saved: 'lv-feeder-saved-v1',
  disclaimer: 'lv-feeder-disclaimer-v1'
};

const MASTER = {
  breakers: [15,20,30,40,50,60,75,100,125,150,175,200,225,250,300,400,500,600],
  cableSizes: [2,3.5,5.5,8,14,22,38,60,100,150,200,250,325],
  cableAmpacity: [
    { cableType:'CV', coreType:'2C', sizeSq:5.5, ampacity:41 },
    { cableType:'CV', coreType:'2C', sizeSq:8, ampacity:50 },
    { cableType:'CV', coreType:'2C', sizeSq:14, ampacity:68 },
    { cableType:'CVT', coreType:'3C', sizeSq:14, ampacity:78 },
    { cableType:'CVT', coreType:'3C', sizeSq:22, ampacity:101 },
    { cableType:'CVT', coreType:'3C', sizeSq:38, ampacity:139 },
    { cableType:'CVT', coreType:'3C', sizeSq:60, ampacity:179 },
    { cableType:'CVD', coreType:'2C', sizeSq:5.5, ampacity:41 },
    { cableType:'CVD', coreType:'2C', sizeSq:8, ampacity:50 }
  ],
  impedance: [
    { cableType:'CV', coreType:'2C', sizeSq:5.5, value:7.20 },
    { cableType:'CV', coreType:'2C', sizeSq:8, value:5.10 },
    { cableType:'CV', coreType:'2C', sizeSq:14, value:3.30 },
    { cableType:'CVT', coreType:'3C', sizeSq:14, value:3.15 },
    { cableType:'CVT', coreType:'3C', sizeSq:22, value:2.10 },
    { cableType:'CVT', coreType:'3C', sizeSq:38, value:1.30 },
    { cableType:'CVT', coreType:'3C', sizeSq:60, value:0.82 },
    { cableType:'CVD', coreType:'2C', sizeSq:5.5, value:7.20 }
  ],
  diameters: [
    { cableType:'CV', coreType:'2C', sizeSq:5.5, value:10.5 },
    { cableType:'CV', coreType:'2C', sizeSq:8, value:11.5 },
    { cableType:'CV', coreType:'2C', sizeSq:14, value:13.8 },
    { cableType:'CVT', coreType:'3C', sizeSq:14, value:16.2 },
    { cableType:'CVT', coreType:'3C', sizeSq:22, value:18.8 },
    { cableType:'CVT', coreType:'3C', sizeSq:38, value:22.8 },
    { cableType:'CVT', coreType:'3C', sizeSq:60, value:26.2 },
    { cableType:'CVD', coreType:'2C', sizeSq:5.5, value:10.5 }
  ],
  derating: [
    { installationMethod:'気中敷設', sunlight:'日射なし', temperature:30, multi:false, count:1, spacing:'密着', factor:1.00 },
    { installationMethod:'気中敷設', sunlight:'日射なし', temperature:40, multi:false, count:1, spacing:'密着', factor:1.00 },
    { installationMethod:'気中敷設', sunlight:'日射なし', temperature:40, multi:true, count:2, spacing:'密着', factor:0.82 },
    { installationMethod:'気中敷設', sunlight:'日射なし', temperature:40, multi:true, count:3, spacing:'密着', factor:0.75 },
    { installationMethod:'気中敷設', sunlight:'日射なし', temperature:40, multi:true, count:2, spacing:'離隔あり', factor:0.90 },
    { installationMethod:'管路', sunlight:'日射なし', temperature:40, multi:false, count:1, spacing:'密着', factor:0.90 },
    { installationMethod:'埋設', sunlight:'日射なし', temperature:40, multi:false, count:1, spacing:'密着', factor:0.95 },
    { installationMethod:'気中敷設', sunlight:'直射日光あり', temperature:40, multi:false, count:1, spacing:'密着', factor:0.90 }
  ],
  conduit: [
    { diameterMax:12, count:1, conduit:'E25' },
    { diameterMax:14, count:1, conduit:'E31' },
    { diameterMax:17, count:1, conduit:'E31' },
    { diameterMax:19, count:1, conduit:'E39' },
    { diameterMax:23, count:1, conduit:'E51' },
    { diameterMax:27, count:1, conduit:'E63' },
    { diameterMax:17, count:2, conduit:'E39' },
    { diameterMax:19, count:2, conduit:'E51' },
    { diameterMax:23, count:2, conduit:'E63' },
    { diameterMax:27, count:2, conduit:'E75' }
  ],
  rack: [
    { diameterMax:17, count:1, rack:'W100 × H50' },
    { diameterMax:19, count:1, rack:'W100 × H50' },
    { diameterMax:23, count:1, rack:'W150 × H50' },
    { diameterMax:27, count:1, rack:'W200 × H50' },
    { diameterMax:17, count:2, rack:'W150 × H50' },
    { diameterMax:23, count:2, rack:'W200 × H50' },
    { diameterMax:27, count:2, rack:'W300 × H100' }
  ],
  ground: [
    { groundType:'D種', wireType:'IV', maxBreaker:100, size:'5.5sq' },
    { groundType:'D種', wireType:'IV', maxBreaker:225, size:'8sq' },
    { groundType:'C種', wireType:'IV', maxBreaker:100, size:'8sq' },
    { groundType:'C種', wireType:'IV', maxBreaker:225, size:'14sq' },
    { groundType:'D種', wireType:'CV', maxBreaker:100, size:'5.5sq' },
    { groundType:'C種', wireType:'CV', maxBreaker:100, size:'8sq' }
  ]
};

const DOCS = [
  {id:'cable_ampacity',group:'ケーブル・配管',title:'ケーブル許容電流・低減率',summary:'ケーブル種類ごとの許容電流と敷設条件ごとの低減率。',sections:[{heading:'概要',paragraphs:['計算で使用する基準許容電流と低減率の見方を整理します。']},{heading:'注意事項',bullets:['最終判断は内線規定、関係法令、現場条件、機器仕様等を確認してください。']}]},
  {id:'impedance_diameter',group:'ケーブル・配管',title:'インピーダンス・ケーブル外径',summary:'電圧降下計算や配管選定に使う数値。',sections:[{heading:'アプリ内での使いどころ',bullets:['電圧降下計算','配管参考サイズ表示','ラック参考選定案']}]},
  {id:'conduit_size',group:'ケーブル・配管',title:'配管サイズ一覧表',summary:'一般的な電気設計の参考配管サイズ。',sections:[{heading:'注意',paragraphs:['配管サイズは参考表示です。最終的な施工条件で確認してください。']}]},
  {id:'conduit_support_spacing',group:'ケーブル・配管',title:'配管支持間隔',summary:'一般的な配管支持間隔の確認用。',sections:[{heading:'概要',paragraphs:['支持間隔は現場条件・法令・仕様で確認が必要です。']}]},
  {id:'vertical_support',group:'ケーブル・配管',title:'垂直管路内の電線支持間隔',summary:'垂直配管での支持の考え方。',sections:[{heading:'概要',paragraphs:['垂直区間では落下防止と支持条件を十分に確認します。']}]},
  {id:'rack_selection',group:'ラック・支持・耐震',title:'ケーブルラック選定の考え方',summary:'占有幅と余裕率からラック幅の参考を整理。',sections:[{heading:'アプリ内での使いどころ',bullets:['参考ケーブルラック選定案の表示']}]},
  {id:'rack_support',group:'ラック・支持・耐震',title:'ケーブルラック支持間隔',summary:'一般的なラック支持間隔の考え方。',sections:[{heading:'概要',paragraphs:['支持間隔は施工条件と資料を確認してください。']}]},
  {id:'rack_seismic',group:'ラック・支持・耐震',title:'ケーブルラック耐震基準',summary:'耐震上の確認ポイント。',sections:[{heading:'概要',paragraphs:['支持・固定・補強条件は現場条件に応じて判断してください。']}]},
  {id:'ground_standards',group:'基準・解説・数式',title:'接地基準解説',summary:'高圧 / 低圧の接地区分を整理。',sections:[{heading:'高圧の接地区分',bullets:['A種接地','B種接地']},{heading:'低圧の接地区分',bullets:['C種接地','D種接地']},{heading:'注意事項',paragraphs:['本Web版の自動選定は低圧 C種・D種のみです。']}]},
  {id:'ground_resistance',group:'基準・解説・数式',title:'接地抵抗一覧',summary:'接地抵抗の目安一覧。',sections:[{heading:'概要',paragraphs:['接地抵抗の目安は用途と接地種別で確認します。']}]},
  {id:'main_breaker',group:'基準・解説・数式',title:'主幹選定の考え方',summary:'主幹電流、裕度、保護協調の考え方。',sections:[{heading:'概要',paragraphs:['本アプリの主幹選定は補助表示です。始動電流や保護協調は別途確認してください。']}]},
  {id:'voltage_drop_guide',group:'基準・解説・数式',title:'電圧降下の目安',summary:'3% / 5% の見方。',sections:[{heading:'判定目安',bullets:['3%以下：良好','3%超〜5%以下：注意','5%超：要見直し']}]},
  {id:'basic_formulas',group:'基準・解説・数式',title:'基本電気理論・主要計算式',summary:'オームの法則、電力式、電圧降下式。',sections:[{heading:'収録式',bullets:['オームの法則','単相回路の電力','三相回路の電力','電圧降下式','許容電流補正式']},{heading:'アプリ採用式',paragraphs:['単相: ΔV = 2 × I × Z × L / 1000','三相: ΔV = √3 × I × Z × L / 1000']}]},
  {id:'hv_symbols',group:'基準・解説・数式',title:'高圧単線結線図の略記号・機器解説',summary:'DS, LBS, VCB などの略記号解説。',sections:[{heading:'対象例',bullets:['DS / 断路器','LBS / 高圧交流負荷開閉器','VCB / 真空遮断器','PAS / 柱上気中負荷開閉器','CT / VT / ZCT / OCR / DGR']}]},
  {id:'lv_ground_wire',group:'基準・解説・数式',title:'低圧 C種・D種 接地線サイズ選定',summary:'主幹ブレーカーに応じた参考サイズ。',sections:[{heading:'対象',bullets:['C種','D種']},{heading:'注意',paragraphs:['参考表示です。最終判断は関係法令・仕様で確認してください。']}]}
];

const DEFAULT_STATE = {
  calculationType: 'power',
  powerSystem: '3φ3W',
  voltage: '200V',
  powerFactor: 0.8,
  efficiency: 0.9,
  wiringLength: 30,
  breakerRating: 50,
  projectName: '',
  projectRemarks: '',
  cableType: 'CVT',
  cableSize: 14,
  installationMethod: '気中敷設',
  sunlightCondition: '日射なし',
  ambientTemperature: 40,
  multiCircuit: false,
  circuitCount: 1,
  arrangementSpacing: '密着',
  loads: [{id: crypto.randomUUID(), name:'負荷1', inputType:'kW', value:3.91}],
  lastResult: null
};

let appState = load(STORAGE.appState, structuredClone(DEFAULT_STATE));
let historyItems = load(STORAGE.history, []);
let savedItems = load(STORAGE.saved, []);
let compareIds = [];
let deferredPrompt = null;
let disclaimerStep = 0;

const els = id => document.getElementById(id);

const screens = {
  calc: els('screen-calc'),
  docs: els('screen-docs'),
  saved: els('screen-saved'),
  settings: els('screen-settings')
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function persist() {
  localStorage.setItem(STORAGE.appState, JSON.stringify(appState));
  localStorage.setItem(STORAGE.history, JSON.stringify(historyItems));
  localStorage.setItem(STORAGE.saved, JSON.stringify(savedItems));
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('ja-JP', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  }).format(value);
}

function showToast(message) {
  const toast = els('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function isThreePhase(system) {
  return system.startsWith('3φ');
}

function coreTypeFromCalcType(type) {
  return type === 'power' ? '3C' : '2C';
}

function getAmpacity(cableType, calcType, sizeSq) {
  return MASTER.cableAmpacity.find(v =>
    v.cableType === cableType &&
    v.coreType === coreTypeFromCalcType(calcType) &&
    Number(v.sizeSq) === Number(sizeSq)
  );
}

function getImpedance(cableType, calcType, sizeSq) {
  return MASTER.impedance.find(v =>
    v.cableType === cableType &&
    v.coreType === coreTypeFromCalcType(calcType) &&
    Number(v.sizeSq) === Number(sizeSq)
  );
}

function getDiameter(cableType, calcType, sizeSq) {
  return MASTER.diameters.find(v =>
    v.cableType === cableType &&
    v.coreType === coreTypeFromCalcType(calcType) &&
    Number(v.sizeSq) === Number(sizeSq)
  );
}

function getDerating(state) {
  return MASTER.derating.find(v =>
    v.installationMethod === state.installationMethod &&
    v.sunlight === state.sunlightCondition &&
    Number(v.temperature) === Number(state.ambientTemperature) &&
    v.multi === Boolean(state.multiCircuit) &&
    Number(v.count) === Number(state.circuitCount) &&
    v.spacing === state.arrangementSpacing
  ) || MASTER.derating.find(v =>
    v.installationMethod === state.installationMethod &&
    v.sunlight === state.sunlightCondition &&
    Number(v.temperature) === Number(state.ambientTemperature) &&
    !v.multi &&
    Number(v.count) === 1
  );
}

function getConduit(diameter, count) {
  return MASTER.conduit.find(v => diameter <= v.diameterMax && count <= v.count)?.conduit ||
         MASTER.conduit.find(v => diameter <= v.diameterMax)?.conduit ||
         '要確認';
}

function getRack(diameter, count) {
  return MASTER.rack.find(v => diameter <= v.diameterMax && count <= v.count)?.rack ||
         MASTER.rack.find(v => diameter <= v.diameterMax)?.rack ||
         '要確認';
}

function convertLoad(load, state) {
  const voltage = parseFloat(state.voltage);
  const pf = Number(state.powerFactor);
  const eff = Number(state.efficiency);
  const value = Number(load.value);
  let current = 0;
  let kw = 0;
  let kva = 0;

  if (load.inputType === 'kW') {
    kw = value;
    current = isThreePhase(state.powerSystem)
      ? (kw * 1000) / (Math.sqrt(3) * voltage * pf * eff)
      : (kw * 1000) / (voltage * pf * eff);
    kva = kw / Math.max(pf * eff, 0.0001);
  } else if (load.inputType === 'kVA') {
    kva = value;
    current = isThreePhase(state.powerSystem)
      ? (kva * 1000) / (Math.sqrt(3) * voltage)
      : (kva * 1000) / voltage;
    kw = kva * pf * eff;
  } else {
    current = value;
    kva = isThreePhase(state.powerSystem)
      ? Math.sqrt(3) * voltage * current / 1000
      : voltage * current / 1000;
    kw = kva * pf * eff;
  }

  return { ...load, kw, kva, current };
}

function calcVoltageDrop(current, impedance, lengthM, voltage, system) {
  const dropV = isThreePhase(system)
    ? Math.sqrt(3) * current * impedance * lengthM / 1000
    : 2 * current * impedance * lengthM / 1000;

  return {
    dropV,
    dropPercent: (dropV / voltage) * 100
  };
}

function nextBreaker(current) {
  return MASTER.breakers.find(v => v >= current) || MASTER.breakers[MASTER.breakers.length - 1];
}

function judgement(totalCurrent, correctedAmpacity, dropPercent, breakerRating) {
  return totalCurrent <= correctedAmpacity &&
         totalCurrent <= breakerRating &&
         dropPercent <= 5
    ? '良'
    : '否';
}

function buildNotes(result) {
  const notes = [
    '参考配管サイズは一般的な電気設計の参考値です。',
    '参考ケーブルラック選定案は参考表示です。',
    '接地線サイズ選定は低圧 C種・D種のみ対象です。'
  ];

  if (result.totalCurrent > result.correctedAmpacity) notes.push('許容電流を超過しています。');
  if (result.totalCurrent > result.breakerRating) notes.push('主幹ブレーカー容量を超過しています。');
  if (result.dropPercent > 5) notes.push('電圧降下が大きいため、配線条件の見直しが必要です。');

  return notes;
}

function calculate() {
  const amp = getAmpacity(appState.cableType, appState.calculationType, appState.cableSize);
  const der = getDerating(appState);
  const imp = getImpedance(appState.cableType, appState.calculationType, appState.cableSize);
  const dia = getDiameter(appState.cableType, appState.calculationType, appState.cableSize);

  if (!amp || !der || !imp || !dia) {
    showToast('必要なマスタが見つかりません。');
    return;
  }

  const converted = appState.loads.map(load => convertLoad(load, appState));
  const totalKW = converted.reduce((s, v) => s + v.kw, 0);
  const totalKVA = converted.reduce((s, v) => s + v.kva, 0);
  const totalCurrent = converted.reduce((s, v) => s + v.current, 0);
  const correctedAmpacity = amp.ampacity * der.factor;
  const voltage = parseFloat(appState.voltage);
  const vd = calcVoltageDrop(
    totalCurrent,
    imp.value,
    Number(appState.wiringLength),
    voltage,
    appState.powerSystem
  );

  const breakerRating = Number(appState.breakerRating);

  const breakerMarginPercent =
    ((breakerRating - totalCurrent) / breakerRating) * 100;

  const capacityMarginKW =
    (isThreePhase(appState.powerSystem)
      ? (Math.sqrt(3) * voltage * breakerRating * Number(appState.powerFactor) * Number(appState.efficiency) / 1000)
      : (voltage * breakerRating * Number(appState.powerFactor) * Number(appState.efficiency) / 1000)
    ) - totalKW;

  const result = {
    calculationType: appState.calculationType,
    loadCount: converted.length,
    convertedLoads: converted,
    totalKW,
    totalKVA,
    totalCurrent,
    baseAmpacity: amp.ampacity,
    deratingFactor: der.factor,
    correctedAmpacity,
    impedance: imp.value,
    cableDiameter: dia.value,
    dropV: vd.dropV,
    dropPercent: vd.dropPercent,
    breakerMarginPercent,
    capacityMarginKW,
    recommendedBreaker: nextBreaker(totalCurrent),
    recommendedCableSize: appState.cableSize,
    conduit: getConduit(dia.value, 1),
    rack: getRack(dia.value, 1),
    judgement: judgement(totalCurrent, correctedAmpacity, vd.dropPercent, breakerRating),
    notes: [],
    breakerRating
  };

  result.notes = buildNotes(result);
  appState.lastResult = result;
  persist();
  renderAutoValues();
  renderResult();

  historyItems.unshift({
    id: crypto.randomUUID(),
    title: appState.calculationType === 'power'
      ? '低圧動力幹線計算'
      : '低圧電灯幹線計算',
    savedAt: new Date().toISOString(),
    input: structuredClone(appState),
    result
  });

  historyItems = historyItems.slice(0, 50);
  persist();
  renderSaved();
  showToast('計算して履歴に保存しました。');
}

function renderAutoValues() {
  const result = appState.lastResult;
  els('baseAmpacityText').textContent = result ? formatNumber(result.baseAmpacity) : '-';
  els('deratingFactorText').textContent = result ? formatNumber(result.deratingFactor, 3) : '-';
  els('correctedAmpacityText').textContent = result ? formatNumber(result.correctedAmpacity) : '-';
  els('impedanceText').textContent = result ? formatNumber(result.impedance, 3) : '-';
  els('diameterText').textContent = result ? formatNumber(result.cableDiameter, 1) : '-';
}

function renderResult() {
  const r = appState.lastResult;
  if (!r) return;

  els('resLoadCount').textContent = formatNumber(r.loadCount, 0);
  els('resTotalKW').textContent = formatNumber(r.totalKW, 3);
  els('resTotalKVA').textContent = formatNumber(r.totalKVA, 3);
  els('resTotalCurrent').textContent = formatNumber(r.totalCurrent, 2);
  els('resDropV').textContent = formatNumber(r.dropV, 2);
  els('resDropPct').textContent = formatNumber(r.dropPercent, 2);
  els('resBreakerMargin').textContent = formatNumber(r.breakerMarginPercent, 1);
  els('resCapacityMargin').textContent = formatNumber(r.capacityMarginKW, 2);
  els('resRecommendedBreaker').textContent = `${r.recommendedBreaker}A`;
  els('resRecommendedCable').textContent = `${r.recommendedCableSize}sq`;
  els('resConduit').textContent = r.conduit;
  els('resRack').textContent = r.rack;

  const j = els('resJudgement');
  j.textContent = r.judgement;
  j.className = 'judgement ' + (r.judgement === '良' ? 'good' : 'bad');

  const notes = els('resNotes');
  notes.innerHTML = '';
  r.notes.forEach(n => {
    const li = document.createElement('li');
    li.textContent = n;
    notes.appendChild(li);
  });
}

function defaultSaveTitle() {
  const prefix = appState.calculationType === 'power'
    ? '低圧動力幹線計算'
    : '低圧電灯幹線計算';

  const d = new Date();
  const pad = n => String(n).padStart(2, '0');

  return `${prefix}_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function openSaveDialog() {
  if (!appState.lastResult) {
    showToast('先に計算してください。');
    return;
  }

  els('saveTitleInput').value = defaultSaveTitle();
  els('saveMemoInput').value = '';
  els('saveDialog').showModal();
}

function confirmSave() {
  const title = els('saveTitleInput').value.trim();
  const memo = els('saveMemoInput').value.trim();

  if (!title) {
    showToast('保存名を入力してください。');
    return;
  }

  savedItems.unshift({
    id: crypto.randomUUID(),
    title,
    memo,
    savedAt: new Date().toISOString(),
    input: structuredClone(appState),
    result: structuredClone(appState.lastResult)
  });

  persist();
  renderSaved();
  els('saveDialog').close();
  showToast('保存しました。');
}

function openDocument(doc) {
  els('docsDialogTitle').textContent = doc.title;
  const body = els('docsDialogBody');
  body.innerHTML = `<p class="muted">${doc.summary}</p>`;

  doc.sections.forEach(section => {
    const wrap = document.createElement('section');
    wrap.className = 'docs-section';
    wrap.innerHTML = `<h4>${section.heading}</h4>`;

    if (section.paragraphs) {
      section.paragraphs.forEach(p => {
        const el = document.createElement('p');
        el.textContent = p;
        wrap.appendChild(el);
      });
    }

    if (section.bullets && section.bullets.length) {
      const ul = document.createElement('ul');
      section.bullets.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    }

    body.appendChild(wrap);
  });

  els('docsDialog').showModal();
}

function renderDocs() {
  const search = els('docsSearch').value.trim().toLowerCase();
  const groups = {};

  DOCS
    .filter(doc => !search || `${doc.title} ${doc.summary} ${JSON.stringify(doc.sections)}`.toLowerCase().includes(search))
    .forEach(doc => {
      groups[doc.group] ||= [];
      groups[doc.group].push(doc);
    });

  const root = els('docsGroups');
  root.innerHTML = '';

  Object.entries(groups).forEach(([group, docs]) => {
    const section = document.createElement('div');
    section.className = 'doc-group';

    const title = document.createElement('div');
    title.className = 'doc-group-title';
    title.textContent = group;
    section.appendChild(title);

    docs.forEach(doc => {
      const card = document.createElement('button');
      card.className = 'doc-card';
      card.innerHTML = `
        <div class="doc-meta">
          <strong>${doc.title}</strong>
          <span class="badge">資料</span>
        </div>
        <div class="doc-summary">${doc.summary}</div>
      `;
      card.addEventListener('click', () => openDocument(doc));
      section.appendChild(card);
    });

    root.appendChild(section);
  });
}
function renderSaved() {
  const historyRoot = els('historyList');
  historyRoot.innerHTML = '';

  if (!historyItems.length) {
    historyRoot.innerHTML = '<div class="panel muted">履歴はまだありません。</div>';
  } else {
    historyItems.forEach(item => historyRoot.appendChild(buildSavedCard(item, true)));
  }

  const q = els('savedSearch').value.trim().toLowerCase();
  const filtered = savedItems.filter(item =>
    !q ||
    item.title.toLowerCase().includes(q) ||
    (item.memo || '').toLowerCase().includes(q)
  );

  const savedRoot = els('savedList');
  savedRoot.innerHTML = '';

  if (!filtered.length) {
    savedRoot.innerHTML = '<div class="panel muted">保存済みデータはまだありません。</div>';
  } else {
    filtered.forEach(item => savedRoot.appendChild(buildSavedCard(item, false)));
  }

  renderCompare();
}

function buildSavedCard(item, isHistory) {
  const card = document.createElement('div');
  card.className = 'saved-card';
  const selected = compareIds.includes(item.id);
  const result = item.result;

  card.innerHTML = `
    <div class="row">
      <strong>${item.title}</strong>
      <span class="muted">${new Date(item.savedAt).toLocaleString('ja-JP')}</span>
    </div>
    ${item.memo ? `<div class="muted" style="margin-top:6px;">${item.memo}</div>` : ''}
    <div class="grid two" style="margin-top:10px;">
      <div class="readonly-row"><span>電圧</span><strong>${item.input.voltage}</strong></div>
      <div class="readonly-row"><span>主幹</span><strong>${item.input.breakerRating}A</strong></div>
      <div class="readonly-row"><span>合計電流</span><strong>${formatNumber(result.totalCurrent, 2)}A</strong></div>
      <div class="readonly-row"><span>電圧降下</span><strong>${formatNumber(result.dropPercent, 2)}%</strong></div>
    </div>
    <div class="inline-actions">
      <button class="ghost small js-open">この案を開く</button>
      ${!isHistory ? `<button class="ghost small js-compare">${selected ? '比較から外す' : '比較に追加'}</button>` : ''}
      ${!isHistory ? '<button class="ghost small js-rename">名前を変更</button>' : ''}
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
    persist();
    renderSaved();
  };

  if (!isHistory) {
    card.querySelector('.js-compare').onclick = () => {
      if (compareIds.includes(item.id)) {
        compareIds = compareIds.filter(id => id !== item.id);
      } else if (compareIds.length < 3) {
        compareIds.push(item.id);
      } else {
        showToast('比較は最大3件です。');
      }
      renderSaved();
    };

    card.querySelector('.js-rename').onclick = () => {
      const next = prompt('保存名を入力してください。', item.title);
      if (next && next.trim()) {
        item.title = next.trim();
        persist();
        renderSaved();
      }
    };
  }

  return card;
}
function openSavedItem(item) {
  appState = structuredClone(item.input);
  appState.lastResult = structuredClone(item.result);
  persist();
  syncFormFromState();
  renderAutoValues();
  renderResult();
  switchScreen('calc');
  showToast('計算画面へ読み込みました。');
}

function renderCompare() {
  const root = els('compareView');
  root.innerHTML = '';

  const items = compareIds
    .map(id => savedItems.find(v => v.id === id))
    .filter(Boolean);

  if (items.length < 2) {
    root.innerHTML = '<div class="panel muted">比較対象を2件以上選択してください。</div>';
    return;
  }

  const sections = [
    {
      title: '基本条件',
      rows: [
        ['電源方式', items.map(v => v.input.powerSystem)],
        ['電圧', items.map(v => v.input.voltage)],
        ['主幹ブレーカー', items.map(v => `${v.input.breakerRating}A`)]
      ]
    },
    {
      title: 'ケーブル関係',
      rows: [
        ['ケーブル種類', items.map(v => v.input.cableType)],
        ['ケーブルサイズ', items.map(v => `${v.input.cableSize}sq`)],
        ['参考配管サイズ', items.map(v => v.result.conduit)]
      ]
    },
    {
      title: '判定結果',
      rows: [
        ['合計電流', items.map(v => `${formatNumber(v.result.totalCurrent, 2)}A`)],
        ['電圧降下', items.map(v => `${formatNumber(v.result.dropPercent, 2)}%`)],
        ['良否判定', items.map(v => v.result.judgement)]
      ]
    }
  ];

  sections.forEach(section => {
    const panel = document.createElement('div');
    panel.className = 'compare-card';
    panel.innerHTML = `<div class="panel-title">${section.title}</div>`;

    const tableWrap = document.createElement('div');
    tableWrap.className = 'compare-table';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>項目</th>${items.map(v => `<th>${v.title}</th>`).join('')}</tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    section.rows.forEach(([title, values]) => {
      const different = values.some(v => v !== values[0]);
      const tr = document.createElement('tr');
      if (different) tr.classList.add('diff');
      tr.innerHTML = `<td>${title}</td>${values.map(v => `<td>${v}</td>`).join('')}`;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    panel.appendChild(tableWrap);
    root.appendChild(panel);
  });
}

function buildCSV() {
  const r = appState.lastResult;
  if (!r) return null;

  const rows = [
    ['項目', '値'],
    ['計算種別', appState.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算'],
    ['電源方式', appState.powerSystem],
    ['電圧', appState.voltage],
    ['力率', appState.powerFactor],
    ['効率', appState.efficiency],
    ['配線長[m]', appState.wiringLength],
    ['主幹ブレーカー[A]', appState.breakerRating],
    ['ケーブル種類', appState.cableType],
    ['ケーブルサイズ[sq]', appState.cableSize],
    ['合計負荷件数', r.loadCount],
    ['合計容量[kW]', r.totalKW],
    ['合計容量[kVA]', r.totalKVA],
    ['合計電流[A]', r.totalCurrent],
    ['電圧降下[V]', r.dropV],
    ['電圧降下[%]', r.dropPercent],
    ['主幹裕度[%]', r.breakerMarginPercent],
    ['容量裕度[kW]', r.capacityMarginKW],
    ['推奨主幹ブレーカー', r.recommendedBreaker],
    ['推奨ケーブルサイズ', r.recommendedCableSize],
    ['参考配管サイズ', r.conduit],
    ['参考ラック選定案', r.rack],
    ['良否判定', r.judgement]
  ];

  return rows
    .map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(','))
    .join('\n');
}

function downloadCSV() {
  const csv = buildCSV();

  if (!csv) {
    showToast('先に計算してください。');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const prefix = appState.calculationType === 'power' ? '低圧動力幹線計算' : '低圧電灯幹線計算';

  a.href = url;
  a.download = `${prefix}_${Date.now()}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

function printPDF() {
  if (!appState.lastResult) {
    showToast('先に計算してください。');
    return;
  }

  if (!confirm('本帳票は参考資料です。最終判断は利用者責任で行ってください。続行しますか？')) {
    return;
  }

  window.print();
}

function updateGroundWireResult() {
  const type = els('groundType').value;
  const wire = els('groundWireType').value;
  const breaker = Number(appState.breakerRating);

  const row =
    MASTER.ground.find(v => v.groundType === type && v.wireType === wire && breaker <= v.maxBreaker) ||
    MASTER.ground.find(v => v.groundType === type && v.wireType === wire);

  els('groundResult').textContent = row
    ? `主幹 ${breaker}A の参考接地線サイズ: ${row.size}`
    : '条件に合う参考サイズがありません。';
}

function switchScreen(screen) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === screen);
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screen);
  });
}

function switchSavedTab(tab) {
  document.querySelectorAll('.saved-seg').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.savedTab === tab);
  });

  document.querySelectorAll('.saved-subview').forEach(el => {
    el.classList.remove('active');
  });

  els(`saved-subview-${tab}`).classList.add('active');
}

function syncFormFromState() {
  document.querySelectorAll('.seg').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.calcType === appState.calculationType);
  });

  populatePowerSystemOptions();
  populateVoltageOptions();

  els('powerFactor').value = appState.powerFactor;
  els('efficiency').value = appState.efficiency;
  els('wiringLength').value = appState.wiringLength;
  els('breakerRating').value = appState.breakerRating;
  els('projectName').value = appState.projectName || '';
  els('projectRemarks').value = appState.projectRemarks || '';

  populateCableOptions();

  els('installationMethod').value = appState.installationMethod;
  els('sunlightCondition').value = appState.sunlightCondition;
  els('ambientTemperature').value = String(appState.ambientTemperature);
  els('multiCircuit').value = appState.multiCircuit ? 'true' : 'false';
  els('circuitCount').value = String(appState.circuitCount);
  els('arrangementSpacing').value = appState.arrangementSpacing;

  renderLoadList();
}

function captureFormToState() {
  appState.powerFactor = Number(els('powerFactor').value || 0);
  appState.efficiency = Number(els('efficiency').value || 0);
  appState.wiringLength = Number(els('wiringLength').value || 0);
  appState.breakerRating = Number(els('breakerRating').value || 0);
  appState.projectName = els('projectName').value || '';
  appState.projectRemarks = els('projectRemarks').value || '';
  appState.installationMethod = els('installationMethod').value;
  appState.sunlightCondition = els('sunlightCondition').value;
  appState.ambientTemperature = Number(els('ambientTemperature').value);
  appState.multiCircuit = els('multiCircuit').value === 'true';
  appState.circuitCount = Number(els('circuitCount').value);
  appState.arrangementSpacing = els('arrangementSpacing').value;

  persist();
}

function populatePowerSystemOptions() {
  const options = appState.calculationType === 'power'
    ? ['3φ3W', '3φ4W']
    : ['1φ2W', '1φ3W'];

  const select = els('powerSystem');
  select.innerHTML = options.map(v => `<option value="${v}">${v}</option>`).join('');

  if (!options.includes(appState.powerSystem)) appState.powerSystem = options[0];

  select.value = appState.powerSystem;
  select.onchange = () => {
    appState.powerSystem = select.value;
    persist();
  };
}

function populateVoltageOptions() {
  const options = appState.calculationType === 'power'
    ? ['200V', '400V']
    : ['100V', '200V'];

  const select = els('voltage');
  select.innerHTML = options.map(v => `<option value="${v}">${v}</option>`).join('');

  if (!options.includes(appState.voltage)) appState.voltage = options[0];

  select.value = appState.voltage;
  select.onchange = () => {
    appState.voltage = select.value;
    persist();
  };
}

function populateCableOptions() {
  const selectType = els('cableType');
  const types = appState.calculationType === 'power'
    ? ['CVT', 'CV', 'CVD']
    : ['CV', 'CVD', 'CVT'];

  selectType.innerHTML = types.map(v => `<option value="${v}">${v}</option>`).join('');

  if (!types.includes(appState.cableType)) appState.cableType = types[0];

  selectType.value = appState.cableType;
  selectType.onchange = () => {
    appState.cableType = selectType.value;
    populateCableSizeOptions();
    persist();
  };

  populateCableSizeOptions();
}

function populateCableSizeOptions() {
  const selectSize = els('cableSize');
  const coreType = appState.calculationType === 'power' ? '3C' : '2C';

  const available = MASTER.cableAmpacity
    .filter(v => v.cableType === appState.cableType && v.coreType === coreType)
    .map(v => Number(v.sizeSq));

  const sizes = available.length ? available : MASTER.cableSizes;
  selectSize.innerHTML = sizes.map(v => `<option value="${v}">${v}sq</option>`).join('');

  if (!sizes.includes(Number(appState.cableSize))) appState.cableSize = sizes[0];

  selectSize.value = String(appState.cableSize);
  selectSize.onchange = () => {
    appState.cableSize = Number(selectSize.value);
    persist();
  };
}

function renderLoadList() {
  const root = els('loadList');
  root.innerHTML = '';

  appState.loads.forEach((load, idx) => {
    const card = document.createElement('div');
    card.className = 'load-card';

    card.innerHTML = `
      <div class="grid two">
        <label><span>負荷名称</span><input type="text" data-key="name" value="${load.name || ''}" /></label>
        <label><span>入力方式</span>
          <select data-key="inputType">
            <option ${load.inputType === 'kW' ? 'selected' : ''}>kW</option>
            <option ${load.inputType === 'A' ? 'selected' : ''}>A</option>
            <option ${load.inputType === 'kVA' ? 'selected' : ''}>kVA</option>
          </select>
        </label>
        <label><span>負荷値</span><input type="number" step="0.01" data-key="value" value="${load.value}" /></label>
        <div class="row" style="align-self:end;">
          <span class="muted">No.${idx + 1}</span>
          <button class="ghost small js-remove">削除</button>
        </div>
      </div>
    `;

    card.querySelectorAll('input,select').forEach(input => {
      input.addEventListener('input', () => {
        const key = input.dataset.key;
        if (key === 'value') {
          load[key] = Number(input.value);
        } else {
          load[key] = input.value;
        }
        persist();
      });
    });

    card.querySelector('.js-remove').onclick = () => {
      if (appState.loads.length === 1) {
        showToast('負荷は1件以上必要です。');
        return;
      }
      appState.loads = appState.loads.filter(v => v.id !== load.id);
      persist();
      renderLoadList();
    };

    root.appendChild(card);
  });
}

function initStaticOptions() {
  els('installationMethod').innerHTML = ['気中敷設', '埋設', '管路'].map(v => `<option>${v}</option>`).join('');
  els('sunlightCondition').innerHTML = ['日射なし', '直射日光あり'].map(v => `<option>${v}</option>`).join('');
  els('ambientTemperature').innerHTML = [30, 40, 45].map(v => `<option value="${v}">${v}</option>`).join('');
  els('multiCircuit').innerHTML = `<option value="false">なし</option><option value="true">あり</option>`;
  els('circuitCount').innerHTML = [1, 2, 3, 4, 5, 6].map(v => `<option value="${v}">${v}</option>`).join('');
  els('arrangementSpacing').innerHTML = ['密着', '離隔あり'].map(v => `<option>${v}</option>`).join('');

  [
    'powerFactor',
    'efficiency',
    'wiringLength',
    'breakerRating',
    'projectName',
    'projectRemarks',
    'installationMethod',
    'sunlightCondition',
    'ambientTemperature',
    'multiCircuit',
    'circuitCount',
    'arrangementSpacing'
  ].forEach(id => {
    els(id).addEventListener('change', captureFormToState);
    els(id).addEventListener('input', captureFormToState);
  });
}

function runDisclaimerFlow() {
  if (localStorage.getItem(STORAGE.disclaimer) === 'accepted') return;

  disclaimerStep = 1;
  els('disclaimerTitle').textContent = '免責事項';
  els('disclaimerBody').textContent = '本Webアプリおよび帳票出力内容は参考資料です。';
  els('disclaimerDialog').showModal();
}

function nextDisclaimer() {
  if (disclaimerStep === 1) {
    disclaimerStep = 2;
    els('disclaimerTitle').textContent = '重要な確認';
    els('disclaimerBody').textContent = '最終判断は利用者責任で行ってください。内線規定、関係法令、現場条件、機器仕様等を確認してください。';
  } else {
    localStorage.setItem(STORAGE.disclaimer, 'accepted');
    els('disclaimerDialog').close();
  }
}

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    els('installBtn').hidden = false;
  });

  els('installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt = null;
    els('installBtn').hidden = true;
  });
}

function setupEvents() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => switchScreen(btn.dataset.screen);
  });

  document.querySelectorAll('.seg').forEach(btn => {
    btn.onclick = () => {
      appState.calculationType = btn.dataset.calcType;
      appState.lastResult = null;

      if (appState.calculationType === 'power') {
        appState.powerSystem = '3φ3W';
        appState.voltage = '200V';
        appState.powerFactor = 0.8;
        appState.efficiency = 0.9;
        appState.cableType = 'CVT';
        appState.cableSize = 14;
        appState.loads = [{ id: crypto.randomUUID(), name: '負荷1', inputType: 'kW', value: 3.91 }];
      } else {
        appState.powerSystem = '1φ2W';
        appState.voltage = '100V';
        appState.powerFactor = 1;
        appState.efficiency = 1;
        appState.cableType = 'CV';
        appState.cableSize = 5.5;
        appState.loads = [{ id: crypto.randomUUID(), name: '照明', inputType: 'kW', value: 1.2 }];
      }

      persist();
      syncFormFromState();
      renderAutoValues();
      renderResult();
    };
  });

  document.querySelectorAll('.saved-seg').forEach(btn => {
    btn.onclick = () => switchSavedTab(btn.dataset.savedTab);
  });

  els('addLoadBtn').onclick = () => {
    if (appState.loads.length >= 20) {
      showToast('負荷は最大20件です。');
      return;
    }

    appState.loads.push({
      id: crypto.randomUUID(),
      name: `負荷${appState.loads.length + 1}`,
      inputType: 'kW',
      value: 0
    });

    persist();
    renderLoadList();
  };

  els('calculateBtn').onclick = calculate;
  els('saveResultTopBtn').onclick = openSaveDialog;
  els('saveResultBottomBtn').onclick = openSaveDialog;

  els('confirmSaveBtn').onclick = (e) => {
    e.preventDefault();
    confirmSave();
  };

  els('closeDocsDialog').onclick = () => els('docsDialog').close();
  els('docsSearch').addEventListener('input', renderDocs);
  els('openDocsFromCalc').onclick = () => switchScreen('docs');

  els('clearHistoryBtn').onclick = () => {
    if (!confirm('履歴をすべて削除しますか？')) return;
    historyItems = [];
    persist();
    renderSaved();
  };

  els('savedSearch').addEventListener('input', renderSaved);

  els('csvBtn').onclick = downloadCSV;
  els('pdfBtn').onclick = printPDF;

  els('groundWireBtn').onclick = () => {
    updateGroundWireResult();
    els('groundDialog').showModal();
  };

  els('closeGroundDialog').onclick = () => els('groundDialog').close();
  els('groundType').onchange = updateGroundWireResult;
  els('groundWireType').onchange = updateGroundWireResult;

  els('resetDisclaimerBtn').onclick = () => {
    localStorage.removeItem(STORAGE.disclaimer);
    showToast('次回起動時に免責を再表示します。');
  };

  els('disclaimerNextBtn').onclick = nextDisclaimer;
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function init() {
  initStaticOptions();
  setupInstallPrompt();
  setupEvents();
  syncFormFromState();
  renderAutoValues();

  if (appState.lastResult) {
    renderResult();
  }

  renderDocs();
  renderSaved();
  switchScreen('calc');
  switchSavedTab('history');
  runDisclaimerFlow();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
