(() => {
  'use strict';

  const APP_VERSION = 'v3.1.1-final-20260630';
  const STORAGE_KEY = 'feederCalcV311Final.saved';
  const DRAFT_KEY = 'feederCalcV311Final.draft';
  const MAX_SAVED = 10;

  const breakerSizes = [15,20,30,40,50,60,75,100,125,150,175,200,225,250,300,350,400,500,600,630,700,800];
  const cableSizes = [3.5,5.5,8,14,22,38,60,100,150,200,250,325];
  const baseAmpacity = {
    3.5: 34, 5.5: 44, 8: 61, 14: 88, 22: 115, 38: 162, 60: 217,
    100: 298, 150: 395, 200: 469, 250: 556, 325: 650
  };
  const cableTypes = {
    'CVT': { label: 'CVT', cores: 3, ampFactor: 1.00, diaFactor: 1.00, kgFactor: 1.00, sizes: cableSizes.filter(s => s >= 5.5) },
    'CVD': { label: 'CVD', cores: 2, ampFactor: 0.78, diaFactor: 0.82, kgFactor: 0.72, sizes: cableSizes.filter(s => s >= 5.5 && s <= 200) },
    'CVQ': { label: 'CVQ', cores: 4, ampFactor: 0.90, diaFactor: 1.16, kgFactor: 1.25, sizes: cableSizes.filter(s => s >= 5.5 && s <= 200) },
    'CV-1C': { label: 'CV-1C', cores: 1, ampFactor: 1.16, diaFactor: 0.48, kgFactor: 0.36, sizes: cableSizes },
    'CV-2C': { label: 'CV-2C', cores: 2, ampFactor: 0.78, diaFactor: 0.72, kgFactor: 0.62, sizes: cableSizes }
  };
  const pipeSizes = [
    { name: 'G16', id: 16, inner: 16.4 }, { name: 'G22', id: 22, inner: 21.9 },
    { name: 'G28', id: 28, inner: 28.3 }, { name: 'G36', id: 36, inner: 36.9 },
    { name: 'G42', id: 42, inner: 42.8 }, { name: 'G54', id: 54, inner: 54.0 },
    { name: 'G70', id: 70, inner: 69.6 }, { name: 'G82', id: 82, inner: 82.3 },
    { name: 'G92', id: 92, inner: 92.0 }, { name: 'G104', id: 104, inner: 104.0 }
  ];
  const rackWidths = [150, 200, 300, 400, 500, 600, 700, 800, 900];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const n = (id, fallback = 0) => {
    const v = parseFloat($(id).value);
    return Number.isFinite(v) ? v : fallback;
  };
  const fmt = (value, digits = 1) => Number.isFinite(value) ? value.toLocaleString('ja-JP', { maximumFractionDigits: digits }) : '-';
  const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  };

  function init() {
    $('#createdAt').value = nowLocal();
    populateSelects();
    bindEvents();
    restoreDraft();
    if (!$('#loadBody').children.length) addLoadRow();
    calculateAndRender();
    registerServiceWorker();
  }

  function populateSelects() {
    const existingBreaker = $('#existingBreaker');
    breakerSizes.forEach(v => existingBreaker.append(new Option(`${v}A`, String(v))));
    const typeSelect = $('#existingCableType');
    Object.keys(cableTypes).forEach(k => typeSelect.append(new Option(cableTypes[k].label, k)));
    typeSelect.value = 'CVT';
    fillCableSizeSelect();
    typeSelect.addEventListener('change', fillCableSizeSelect);
    const pipeSelect = $('#pipeSizeSelect');
    pipeSizes.forEach(p => pipeSelect.append(new Option(`${p.name}（内径${p.inner}mm）`, p.name)));
  }

  function fillCableSizeSelect() {
    const sel = $('#existingCableSize');
    const type = $('#existingCableType').value || 'CVT';
    sel.innerHTML = '<option value="">未指定</option>';
    cableTypes[type].sizes.forEach(s => sel.append(new Option(`${s} sq`, String(s))));
  }

  function bindEvents() {
    $$('.tab-button').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
    $('#addLoadBtn').addEventListener('click', () => { addLoadRow(); autosaveDraft(); });
    $('#sampleLoadBtn').addEventListener('click', sampleLoads);
    $('#calcBtn').addEventListener('click', calculateAndRender);
    $('#saveBtn').addEventListener('click', saveCurrent);
    $('#loadSavedBtn').addEventListener('click', openSavedDialog);
    $('#csvBtn').addEventListener('click', exportCsv);
    $('#excelBtn').addEventListener('click', exportExcelHtml);
    $('#pdfBtn').addEventListener('click', () => { calculateAndRender(); window.print(); });
    $('#clearBtn').addEventListener('click', clearForm);
    $('#fcCurrentBtn').addEventListener('click', freeCurrentCalc);
    $('#fcVdBtn').addEventListener('click', freeVoltageDropCalc);
    $('#fcPipeBtn').addEventListener('click', freePipeCalc);
    document.addEventListener('input', event => {
      if (event.target.closest('#calcView')) {
        $('#saveState').textContent = '未保存変更あり';
        autosaveDraft();
      }
    });
    $('#phaseType').addEventListener('change', syncPhaseDefaults);
  }

  function switchView(viewId) {
    $$('.tab-button').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === viewId));
  }

  function syncPhaseDefaults() {
    const phase = $('#phaseType').value;
    if (phase === '3p3w') { $('#voltage').value ||= 200; $('#phaseVoltage').value ||= ''; }
    if (phase === '3p4w') { $('#voltage').value ||= 400; $('#phaseVoltage').value ||= 230; }
    if (phase === '1p3w') { $('#voltage').value ||= 200; $('#phaseVoltage').value ||= 100; }
    if (phase === '1p2w') { $('#voltage').value ||= 100; $('#phaseVoltage').value ||= 100; }
  }

  function addLoadRow(data = {}) {
    const tpl = $('#loadRowTemplate').content.cloneNode(true);
    const row = tpl.querySelector('tr');
    $('.load-name', row).value = data.name || '';
    $('.load-capacity', row).value = data.capacity ?? '';
    $('.load-unit', row).value = data.unit || 'kW';
    $('.load-qty', row).value = data.qty || 1;
    $('.load-demand', row).value = data.demand ?? 100;
    $('.load-note', row).value = data.note || '';
    $('.row-delete', row).addEventListener('click', () => {
      row.remove();
      if (!$('#loadBody').children.length) addLoadRow();
      autosaveDraft();
    });
    $('#loadBody').append(row);
  }

  function sampleLoads() {
    $('#loadBody').innerHTML = '';
    addLoadRow({ name: '動力負荷A', capacity: 15, unit: 'kW', qty: 1, demand: 100, note: 'サンプル' });
    addLoadRow({ name: '動力負荷B', capacity: 7.5, unit: 'kW', qty: 2, demand: 80, note: 'サンプル' });
    calculateAndRender();
  }

  function getLoads() {
    return $$('#loadBody tr').map(row => ({
      name: $('.load-name', row).value.trim(),
      capacity: parseFloat($('.load-capacity', row).value) || 0,
      unit: $('.load-unit', row).value,
      qty: parseFloat($('.load-qty', row).value) || 0,
      demand: parseFloat($('.load-demand', row).value) || 0,
      note: $('.load-note', row).value.trim()
    })).filter(x => x.capacity > 0 && x.qty > 0);
  }

  function getFormData() {
    return {
      projectName: $('#projectName').value,
      author: $('#author').value,
      client: $('#client').value,
      drawingNo: $('#drawingNo').value,
      workType: $('#workType').value,
      createdAt: $('#createdAt').value,
      remarks: $('#remarks').value,
      calcType: $('#calcType').value,
      phaseType: $('#phaseType').value,
      voltage: n('#voltage'),
      phaseVoltage: n('#phaseVoltage'),
      powerFactor: n('#powerFactor', 0.85),
      efficiency: n('#efficiency', 0.9),
      demandFactor: n('#demandFactor', 100),
      marginFactor: n('#marginFactor', 125),
      lengthM: n('#lengthM'),
      vdLimit: n('#vdLimit', 5),
      ambientTemp: n('#ambientTemp', 40),
      installMethod: $('#installMethod').value,
      existingBreaker: $('#existingBreaker').value ? n('#existingBreaker') : null,
      existingCableType: $('#existingCableType').value,
      existingCableSize: $('#existingCableSize').value ? n('#existingCableSize') : null,
      parallelRuns: Math.max(1, Math.round(n('#parallelRuns', 1))),
      loads: getLoads()
    };
  }

  function setFormData(data) {
    ['projectName','author','client','drawingNo','workType','createdAt','remarks','calcType','phaseType','installMethod','existingCableType'].forEach(id => {
      if (data[id] !== undefined) $('#' + id).value = data[id];
    });
    ['voltage','phaseVoltage','powerFactor','efficiency','demandFactor','marginFactor','lengthM','vdLimit','ambientTemp','parallelRuns'].forEach(id => {
      if (data[id] !== undefined && data[id] !== null) $('#' + id).value = data[id];
    });
    fillCableSizeSelect();
    $('#existingBreaker').value = data.existingBreaker ?? '';
    $('#existingCableSize').value = data.existingCableSize ?? '';
    $('#loadBody').innerHTML = '';
    (data.loads || []).forEach(addLoadRow);
    if (!$('#loadBody').children.length) addLoadRow();
    calculateAndRender();
  }

  function calculateAndRender() {
    const data = getFormData();
    const result = calculate(data);
    renderSummary(result);
    renderResultPages(result);
    autosaveDraft();
    return result;
  }

  function calculate(data) {
    const loadSummary = summarizeLoads(data);
    const demandCurrent = loadSummary.currentA * data.demandFactor / 100;
    const minBreaker = nextBreaker(demandCurrent);
    const recommendedBreaker = nextBreaker(demandCurrent * data.marginFactor / 100);
    const minCable = selectCable(data, demandCurrent, minBreaker);
    const recommendedCable = selectCable(data, recommendedBreaker, recommendedBreaker);
    const existing = data.existingBreaker || data.existingCableSize ? evaluateExisting(data, demandCurrent) : null;
    return { data, loadSummary, demandCurrent, minBreaker, recommendedBreaker, minCable, recommendedCable, existing };
  }

  function summarizeLoads(data) {
    const pf = clamp(data.powerFactor, 0.1, 1);
    const eff = clamp(data.efficiency, 0.1, 1);
    const isThree = data.phaseType.startsWith('3p');
    const voltage = data.voltage || 1;
    let totalKw = 0;
    let totalKva = 0;
    let currentA = 0;
    const rows = data.loads.map(load => {
      const demandRatio = load.demand / 100;
      const raw = load.capacity * load.qty * demandRatio;
      const kva = load.unit === 'kVA' ? raw : raw / (pf * eff);
      const kw = load.unit === 'kW' ? raw : raw * pf;
      const amp = isThree ? kva * 1000 / (Math.sqrt(3) * voltage) : kva * 1000 / voltage;
      totalKw += kw;
      totalKva += kva;
      currentA += amp;
      return { ...load, kw, kva, amp };
    });
    return { rows, totalKw, totalKva, currentA };
  }

  function nextBreaker(current) {
    return breakerSizes.find(v => v >= current) || breakerSizes[breakerSizes.length - 1];
  }

  function selectCable(data, requiredCurrent, breakerReference) {
    const type = preferredCableType(data);
    const typeDef = cableTypes[type];
    const runs = Math.max(1, data.parallelRuns || 1);
    for (const size of typeDef.sizes) {
      const prop = cableProp(type, size, runs);
      const ampOk = prop.correctedAmpacity >= Math.max(requiredCurrent, breakerReference || 0);
      const vd = voltageDrop(data, requiredCurrent, size);
      const vdOk = vd.percent <= data.vdLimit;
      if (ampOk && vdOk) {
        return buildCableResult(data, type, size, runs, requiredCurrent, breakerReference, vd, true);
      }
    }
    const last = typeDef.sizes[typeDef.sizes.length - 1];
    return buildCableResult(data, type, last, runs, requiredCurrent, breakerReference, voltageDrop(data, requiredCurrent, last), false);
  }

  function preferredCableType(data) {
    if (data.existingCableType) return data.existingCableType;
    if (data.phaseType === '3p4w') return 'CVQ';
    if (data.phaseType === '1p3w') return 'CVD';
    return 'CVT';
  }

  function evaluateExisting(data, demandCurrent) {
    const type = data.existingCableType || preferredCableType(data);
    const size = data.existingCableSize || cableTypes[type].sizes[0];
    const runs = Math.max(1, data.parallelRuns || 1);
    const vd = voltageDrop(data, demandCurrent, size);
    const breaker = data.existingBreaker || null;
    const cable = buildCableResult(data, type, size, runs, demandCurrent, breaker || demandCurrent, vd, true);
    const breakerOk = breaker ? breaker >= demandCurrent : null;
    const cableOk = cable.correctedAmpacity >= (breaker || demandCurrent) && vd.percent <= data.vdLimit;
    const marginA = breaker ? breaker - demandCurrent : null;
    return { breaker, breakerOk, cable, cableOk, marginA };
  }

  function cableProp(type, size, runs = 1) {
    const def = cableTypes[type];
    const dia = cableDiameter(size) * def.diaFactor;
    const kg = cableWeight(size) * def.kgFactor;
    const amp = (baseAmpacity[size] || 0) * def.ampFactor * runs;
    return { dia, kg, baseAmpacity: amp, correctedAmpacity: amp };
  }

  function buildCableResult(data, type, size, runs, requiredCurrent, breakerReference, vd, selected) {
    const prop = cableProp(type, size, runs);
    const tempFactor = temperatureFactor(data.ambientTemp);
    const instFactor = installFactor(data.installMethod);
    const correctedAmpacity = prop.baseAmpacity * tempFactor * instFactor;
    const totalWeight = prop.kg * (data.lengthM || 0) * runs;
    const pipe = selectPipe(prop.dia, conductorCount(data.phaseType, type) * runs);
    const rack = selectRack(prop.dia, conductorCount(data.phaseType, type) * runs);
    return {
      type, size, runs,
      diameter: prop.dia,
      weightKgM: prop.kg,
      totalWeight,
      baseAmpacity: prop.baseAmpacity,
      tempFactor,
      instFactor,
      correctedAmpacity,
      requiredCurrent,
      breakerReference,
      voltageDrop: vd,
      pipe,
      rack,
      selected,
      ampOk: correctedAmpacity >= Math.max(requiredCurrent, breakerReference || 0),
      vdOk: vd.percent <= data.vdLimit
    };
  }

  function conductorCount(phaseType, cableType) {
    if (cableType === 'CVT' || cableType === 'CVQ' || cableType === 'CVD' || cableType === 'CV-2C') return 1;
    if (phaseType === '3p4w') return 4;
    if (phaseType === '3p3w') return 3;
    if (phaseType === '1p3w') return 3;
    return 2;
  }

  function cableDiameter(size) {
    return 8 + Math.sqrt(size) * 2.15;
  }

  function cableWeight(size) {
    return 0.09 + size * 0.018;
  }

  function temperatureFactor(temp) {
    if (temp <= 30) return 1.00;
    if (temp <= 35) return 0.94;
    if (temp <= 40) return 0.87;
    if (temp <= 45) return 0.79;
    if (temp <= 50) return 0.71;
    return 0.65;
  }

  function installFactor(method) {
    return { air: 1.00, conduit: 0.90, buried: 0.85 }[method] || 1.00;
  }

  function voltageDrop(data, current, size) {
    const L = data.lengthM || 0;
    const V = data.voltage || 1;
    const pf = clamp(data.powerFactor, 0.1, 1);
    const sin = Math.sqrt(Math.max(0, 1 - pf * pf));
    const r = 0.0225 / size; // ohm/m, copper conductor rough value including temperature margin
    const x = 0.00008; // ohm/m, rough reactance
    const isThree = data.phaseType.startsWith('3p');
    const drop = isThree ? Math.sqrt(3) * current * L * (r * pf + x * sin) : 2 * current * L * r;
    const percent = drop / V * 100;
    return { drop, percent };
  }

  function selectPipe(dia, count) {
    const cableArea = Math.PI * Math.pow(dia / 2, 2) * count;
    for (const p of pipeSizes) {
      const pipeArea = Math.PI * Math.pow(p.inner / 2, 2);
      const occ = cableArea / pipeArea * 100;
      if (occ <= 48) return { ...p, occupancy: occ, judge: occ <= 32 ? '良' : '要確認' };
    }
    const p = pipeSizes[pipeSizes.length - 1];
    const pipeArea = Math.PI * Math.pow(p.inner / 2, 2);
    return { ...p, occupancy: cableArea / pipeArea * 100, judge: '否' };
  }

  function selectRack(dia, count) {
    const required = dia * count * 1.25;
    const width = rackWidths.find(w => w >= required) || rackWidths[rackWidths.length - 1];
    return { width, required, judge: width >= required ? '良' : '否' };
  }

  function renderSummary(result) {
    const { loadSummary, demandCurrent, recommendedBreaker, minBreaker } = result;
    $('#summaryCards').innerHTML = [
      card('需要後電流', `${fmt(demandCurrent)} A`),
      card('換算容量', `${fmt(loadSummary.totalKw)} kW / ${fmt(loadSummary.totalKva)} kVA`),
      card('推奨主幹', `${recommendedBreaker} A`),
      card('最小主幹', `${minBreaker} A`)
    ].join('');
  }

  function card(label, value) {
    return `<article class="card"><b>${escapeHtml(label)}</b><strong>${escapeHtml(value)}</strong></article>`;
  }

  function renderResultPages(result) {
    const tabs = [];
    const pages = [];
    const add = (key, title, html) => {
      tabs.push(`<button class="result-tab ${tabs.length === 0 ? 'active' : ''}" data-result="${key}" type="button">${title}</button>`);
      pages.push(`<section class="result-page ${pages.length === 0 ? 'active' : ''}" id="${key}"><h3>${title}</h3>${html}</section>`);
    };
    if (result.existing) add('existingPage', '既設選定結果', renderExisting(result));
    add('recommendedPage', '推奨選定結果', renderSelection(result, 'recommended'));
    if (result.minBreaker !== result.recommendedBreaker || result.minCable.size !== result.recommendedCable.size) {
      add('minimumPage', '最小選定結果', renderSelection(result, 'minimum'));
    }
    $('#resultTabs').innerHTML = tabs.join('');
    $('#resultPages').innerHTML = pages.join('');
    $$('.result-tab').forEach(btn => btn.addEventListener('click', () => {
      $$('.result-tab').forEach(b => b.classList.toggle('active', b === btn));
      $$('.result-page').forEach(p => p.classList.toggle('active', p.id === btn.dataset.result));
    }));
  }

  function renderExisting(result) {
    const ex = result.existing;
    const breakerText = ex.breaker ? `${ex.breaker} A` : '未指定';
    const breakerJudge = ex.breakerOk === null ? '要確認' : ex.breakerOk ? '良' : '否';
    return `
      <div class="result-grid">
        ${resultBox('主幹確認', [
          ['既設主幹', breakerText], ['需要後電流', `${fmt(result.demandCurrent)} A`],
          ['主幹裕度', ex.marginA === null ? '-' : `${fmt(ex.marginA)} A`], ['良否', badge(breakerJudge)]
        ])}
        ${renderCableBox('既設ケーブル確認', ex.cable)}
      </div>
      <p class="notice">既設指定時は、既設主幹容量に見合うケーブルサイズ・電圧降下・配管占有率を確認する。既設容量が需要後電流を下回る場合は否判定。</p>`;
  }

  function renderSelection(result, mode) {
    const breaker = mode === 'recommended' ? result.recommendedBreaker : result.minBreaker;
    const cable = mode === 'recommended' ? result.recommendedCable : result.minCable;
    const marginA = breaker - result.demandCurrent;
    const marginKw = result.loadSummary.totalKw ? result.loadSummary.totalKw * marginA / result.demandCurrent : 0;
    return `
      <div class="result-grid">
        ${resultBox('開閉器', [
          ['選定主幹', `${breaker} A`], ['需要後電流', `${fmt(result.demandCurrent)} A`],
          ['裕度', `${fmt(marginA)} A`], ['裕度換算', `${fmt(marginKw)} kW`], ['良否', badge(marginA >= 0 ? '良' : '否')]
        ])}
        ${renderCableBox('ケーブル・配管・ラック', cable)}
      </div>
      <div class="table-wrap" style="margin-top:12px">${renderLoadSummaryTable(result.loadSummary.rows)}</div>`;
  }

  function renderCableBox(title, cable) {
    const cableName = `${cable.type} ${cable.size}sq${cable.runs > 1 ? ` × ${cable.runs}並列` : ''}`;
    return resultBox(title, [
      ['選定ケーブル', cableName], ['補正後許容電流', `${fmt(cable.correctedAmpacity)} A`],
      ['温度補正', fmt(cable.tempFactor, 2)], ['敷設補正', fmt(cable.instFactor, 2)],
      ['電圧降下', `${fmt(cable.voltageDrop.drop, 2)} V / ${fmt(cable.voltageDrop.percent, 2)} %`],
      ['概算質量', `${fmt(cable.weightKgM, 2)} kg/m / 総 ${fmt(cable.totalWeight, 1)} kg`],
      ['参考配管', `${cable.pipe.name} / 占有率 ${fmt(cable.pipe.occupancy, 1)}%（${cable.pipe.judge}）`],
      ['参考ラック幅', `SR W${cable.rack.width} / 必要 ${fmt(cable.rack.required, 0)}mm（${cable.rack.judge}）`],
      ['良否', badge(cable.ampOk && cable.vdOk ? '良' : '否')]
    ]);
  }

  function resultBox(title, pairs) {
    return `<article class="result-box"><h4>${escapeHtml(title)}</h4><div class="kv">${pairs.map(([k,v]) => `<span>${escapeHtml(k)}</span><strong>${v}</strong>`).join('')}</div></article>`;
  }

  function badge(text) {
    const cls = text === '良' ? 'ok' : text === '否' ? 'ng' : 'warn';
    return `<span class="badge ${cls}">${text}</span>`;
  }

  function renderLoadSummaryTable(rows) {
    const body = rows.map(r => `<tr><td>${escapeHtml(r.name || '-')}</td><td>${fmt(r.kw)} kW</td><td>${fmt(r.kva)} kVA</td><td>${fmt(r.amp)} A</td><td>${escapeHtml(r.note || '')}</td></tr>`).join('');
    return `<table><thead><tr><th>負荷</th><th>換算kW</th><th>換算kVA</th><th>換算電流</th><th>備考</th></tr></thead><tbody>${body || '<tr><td colspan="5">負荷未入力</td></tr>'}</tbody></table>`;
  }

  function saveCurrent() {
    const saved = readSaved();
    const data = getFormData();
    const item = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), savedAt: new Date().toISOString(), data };
    saved.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, MAX_SAVED)));
    $('#saveState').textContent = '保存済み';
  }

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }

  function openSavedDialog() {
    const list = readSaved();
    $('#savedList').innerHTML = list.length ? list.map(item => {
      const title = item.data.projectName || '(無題)';
      const dt = new Date(item.savedAt).toLocaleString('ja-JP');
      return `<div class="saved-item"><strong>${escapeHtml(title)}</strong><small>${dt}</small><div><button type="button" data-load-id="${item.id}">読込</button><button type="button" class="danger" data-delete-id="${item.id}">削除</button></div></div>`;
    }).join('') : '<p>保存データはありません。</p>';
    $$('[data-load-id]').forEach(btn => btn.addEventListener('click', () => {
      const item = readSaved().find(x => x.id === btn.dataset.loadId);
      if (item) setFormData(item.data);
      $('#savedDialog').close();
    }));
    $$('[data-delete-id]').forEach(btn => btn.addEventListener('click', () => {
      const next = readSaved().filter(x => x.id !== btn.dataset.deleteId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      openSavedDialog();
    }));
    $('#savedDialog').showModal();
  }

  function autosaveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(getFormData())); } catch { /* noop */ }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setFormData(JSON.parse(raw));
    } catch { /* noop */ }
  }

  function clearForm() {
    if (!confirm('入力内容をクリアします。')) return;
    localStorage.removeItem(DRAFT_KEY);
    location.reload();
  }

  function exportCsv() {
    const result = calculateAndRender();
    const rows = buildExportRows(result);
    const csv = rows.map(row => row.map(csvCell).join(',')).join('\n');
    downloadBlob(csv, fileBase(result) + '.csv', 'text/csv;charset=utf-8');
  }

  function exportExcelHtml() {
    const result = calculateAndRender();
    const rows = buildExportRows(result);
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table border="1">${rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(String(c))}</td>`).join('')}</tr>`).join('')}</table><p>本計算書は施工検討用の参考資料です。最終判断は設計図書・規程・メーカー資料・協議結果を優先してください。</p></body></html>`;
    downloadBlob(html, fileBase(result) + '.xls', 'application/vnd.ms-excel;charset=utf-8');
  }

  function buildExportRows(result) {
    const d = result.data;
    const rows = [
      ['低圧幹線計算書', APP_VERSION],
      ['工事件名', d.projectName], ['作成者', d.author], ['提出先', d.client], ['図番', d.drawingNo], ['工事種別', d.workType], ['作成日時', d.createdAt],
      ['計算種別', $('#calcType option:checked').textContent], ['電源方式', d.phaseType], ['電圧', d.voltage], ['配線長m', d.lengthM],
      ['需要後電流A', fmt(result.demandCurrent)], ['推奨主幹A', result.recommendedBreaker], ['最小主幹A', result.minBreaker],
      ['推奨ケーブル', `${result.recommendedCable.type} ${result.recommendedCable.size}sq`], ['最小ケーブル', `${result.minCable.type} ${result.minCable.size}sq`],
      [], ['負荷名称','容量','単位','台数','需要率%','換算kW','換算kVA','換算電流A','備考']
    ];
    result.loadSummary.rows.forEach(r => rows.push([r.name, r.capacity, r.unit, r.qty, r.demand, fmt(r.kw), fmt(r.kva), fmt(r.amp), r.note]));
    rows.push([], ['免責', '本計算書は施工検討用の参考資料です。最終判断は設計図書・規程・メーカー資料・協議結果を優先してください。']);
    return rows;
  }

  function fileBase(result) {
    const name = (result.data.projectName || '低圧幹線計算').replace(/[\\/:*?"<>|]/g, '_');
    return `${name}_${new Date().toISOString().slice(0,10)}`;
  }

  function csvCell(v) {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function freeCurrentCalc() {
    const phase = $('#fcPhase').value;
    const cap = parseFloat($('#fcCapacity').value);
    const volt = parseFloat($('#fcVoltage').value);
    const pf = parseFloat($('#fcPf').value) || 1;
    if (!cap || !volt) { $('#fcCurrentOut').textContent = '容量と電圧を入力。'; return; }
    const amp = phase === '3p' ? cap * 1000 / (Math.sqrt(3) * volt * pf) : cap * 1000 / (volt * pf);
    $('#fcCurrentOut').textContent = `${fmt(amp, 2)} A`;
  }

  function freeVoltageDropCalc() {
    const current = parseFloat($('#vdCurrent').value);
    const length = parseFloat($('#vdLength').value);
    const size = parseFloat($('#vdSize').value);
    const voltage = parseFloat($('#vdVoltage').value);
    const phase = $('#vdPhase').value;
    if (!current || !length || !size || !voltage) { $('#fcVdOut').textContent = '電流・配線長・サイズ・電圧を入力。'; return; }
    const r = 0.0225 / size;
    const drop = phase === '3p' ? Math.sqrt(3) * current * length * r : 2 * current * length * r;
    $('#fcVdOut').textContent = `${fmt(drop, 2)} V / ${fmt(drop / voltage * 100, 2)} %`;
  }

  function freePipeCalc() {
    const dia = parseFloat($('#pipeCableDia').value);
    const count = parseFloat($('#pipeCableCount').value);
    const pipe = pipeSizes.find(p => p.name === $('#pipeSizeSelect').value);
    if (!dia || !count || !pipe) { $('#fcPipeOut').textContent = '外径・本数・配管を入力。'; return; }
    const cableArea = Math.PI * Math.pow(dia / 2, 2) * count;
    const pipeArea = Math.PI * Math.pow(pipe.inner / 2, 2);
    const occ = cableArea / pipeArea * 100;
    const judge = occ <= 32 ? '良' : occ <= 48 ? '要確認' : '否';
    $('#fcPipeOut').textContent = `占有率 ${fmt(occ, 1)} % / ${judge}`;
  }

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  init();
})();
