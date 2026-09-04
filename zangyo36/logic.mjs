export const MIN = 60;
// 労働基準法第37条第4項の一般的な深夜時間：22:00〜翌5:00
const DEEP_NIGHT_START = 22 * MIN;
const DEEP_NIGHT_END_NEXT_DAY = 29 * MIN;

export function parseTimeToMinutes(t) {
  if (!t || !/^\d{2}:\d{2}$/.test(t)) return null;
  const [h, m] = t.split(':').map(Number);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

export function shiftDurationMinutes(start, end, breakMinutes = 0) {
  const s = parseTimeToMinutes(start);
  const e0 = parseTimeToMinutes(end);
  if (s == null || e0 == null) return 0;
  const e = e0 <= s ? e0 + 24 * MIN : e0;
  return Math.max(0, e - s - Math.max(0, Number(breakMinutes) || 0));
}

// 労働基準法34条の休憩基準を、始業〜終業の拘束時間から安全側の初期値として返す。
// 法令上の閾値は「実労働時間」基準なので、実際の休憩が異なる場合はユーザーが修正する。
export function statutoryBreakSuggestionMinutes(start, end) {
  const gross = shiftDurationMinutes(start, end, 0);
  if (gross > 8 * MIN) return 60;
  if (gross > 6 * MIN) return 45;
  return 0;
}

// 社内規定：6時間未満は45分、6時間以上は60分。
// 法定最低休憩とは分離し、勤務入力の自動初期値に使用する。
export function companyBreakSuggestionMinutes(start, end) {
  const s = parseTimeToMinutes(start);
  const e = parseTimeToMinutes(end);
  if (s == null || e == null) return 0;
  const gross = shiftDurationMinutes(start, end, 0);
  return gross >= 6 * MIN ? 60 : 45;
}

// Deep night in Japan: 22:00-05:00. Returns overlap before deducting deep-night break.
export function deepNightOverlapMinutes(start, end) {
  const s = parseTimeToMinutes(start);
  const e0 = parseTimeToMinutes(end);
  if (s == null || e0 == null) return 0;
  const e = e0 <= s ? e0 + 24 * MIN : e0;
  let total = 0;
  // Treat 22:00-翌05:00 as one continuous 7-hour window.
  // d=-1 also covers shifts that begin between 00:00 and 05:00.
  for (let d = -1; d <= 1; d++) {
    const a = d * 1440 + DEEP_NIGHT_START;
    const b = d * 1440 + DEEP_NIGHT_END_NEXT_DAY;
    total += Math.max(0, Math.min(e, b) - Math.max(s, a));
  }
  return total;
}

export function autoClassifyEntry(entry, dailyLegalHours = 8) {
  const work = shiftDurationMinutes(entry.start, entry.end, entry.breakMinutes);
  const deepRaw = deepNightOverlapMinutes(entry.start, entry.end);
  const deep = Math.max(0, Math.min(work, deepRaw - Math.max(0, Number(entry.nightBreakMinutes) || 0)));

  if (entry.isLegalHoliday) {
    return {
      workMinutes: work,
      overtimeMinutes: 0,
      deepOvertimeMinutes: 0,
      legalHolidayMinutes: work,
      legalHolidayDeepMinutes: deep,
      scheduledDeepMinutes: 0,
    };
  }

  const overtime = Math.max(0, work - dailyLegalHours * MIN);
  // Approximation: when overtime and deep-night overlap coexist, deep-night overtime is capped by both.
  // Users can correct this on the Wage/Edit tab.
  const deepOT = Math.min(deep, overtime);
  const scheduledDeep = Math.max(0, deep - deepOT);
  return {
    workMinutes: work,
    overtimeMinutes: overtime,
    deepOvertimeMinutes: deepOT,
    legalHolidayMinutes: 0,
    legalHolidayDeepMinutes: 0,
    scheduledDeepMinutes: scheduledDeep,
  };
}

export function getWeekKey(dateStr, weekStartsMonday = true) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay(); // Sun 0
  const delta = weekStartsMonday ? (day === 0 ? -6 : 1 - day) : -day;
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function classifyEntries(entries, settings) {
  const dailyLegalHours = Number(settings.dailyLegalHours) || 8;
  const weeklyLegalHours = Number(settings.weeklyLegalHours) || 40;
  const weekStartsMonday = settings.weekStartsMonday !== false;

  const classified = entries.map((e) => {
    const auto = autoClassifyEntry(e, dailyLegalHours);
    const o = e.override || {};
    const row = {
      ...e,
      _manualOvertime: o.overtimeMinutes != null,
      calc: {
        ...auto,
        overtimeMinutes: o.overtimeMinutes ?? auto.overtimeMinutes,
        deepOvertimeMinutes: o.deepOvertimeMinutes ?? auto.deepOvertimeMinutes,
        legalHolidayMinutes: o.legalHolidayMinutes ?? auto.legalHolidayMinutes,
        legalHolidayDeepMinutes: o.legalHolidayDeepMinutes ?? auto.legalHolidayDeepMinutes,
        scheduledDeepMinutes: o.scheduledDeepMinutes ?? auto.scheduledDeepMinutes,
        weeklyExtraMinutes: 0,
      },
    };
    return row;
  }).sort((a,b) => a.date.localeCompare(b.date) || String(a.id).localeCompare(String(b.id)));

  // Add weekly statutory overtime (>40h) without double-counting daily >8h.
  // If the user manually overrides overtime, weekly allocation remains an advisory addition.
  const groups = new Map();
  for (const row of classified) {
    if (row.isLegalHoliday) continue;
    const key = getWeekKey(row.date, weekStartsMonday);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  for (const rows of groups.values()) {
    const legalPortion = rows.reduce((sum, r) => {
      const work = r.calc.workMinutes;
      const dailyExcess = Math.max(0, work - dailyLegalHours * MIN);
      return sum + Math.max(0, work - dailyExcess);
    }, 0);
    let extra = Math.max(0, legalPortion - weeklyLegalHours * MIN);
    // Allocate to latest days in the week so monthly totals remain deterministic.
    for (const r of [...rows].reverse()) {
      if (extra <= 0) break;
      // A manual overtime correction is treated as the user's final value for that day.
      if (r._manualOvertime) continue;
      const baseLegalPortion = Math.min(r.calc.workMinutes, dailyLegalHours * MIN);
      const add = Math.min(extra, baseLegalPortion);
      r.calc.weeklyExtraMinutes += add;
      r.calc.overtimeMinutes += add;
      // Conservative approximation: weekly extra may overlap deep night; cap by remaining scheduled deep.
      const deepAdd = Math.min(add, r.calc.scheduledDeepMinutes);
      r.calc.deepOvertimeMinutes += deepAdd;
      r.calc.scheduledDeepMinutes -= deepAdd;
      extra -= add;
    }
  }
  return classified;
}

export function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

export function sumMonth(classified, key) {
  const rows = classified.filter(r => monthKey(r.date) === key);
  const sums = rows.reduce((a, r) => {
    const c = r.calc;
    a.work += c.workMinutes;
    a.ot += c.overtimeMinutes;
    a.deepOT += c.deepOvertimeMinutes;
    a.holiday += c.legalHolidayMinutes;
    a.holidayDeep += c.legalHolidayDeepMinutes;
    a.scheduledDeep += c.scheduledDeepMinutes;
    a.weeklyExtra += c.weeklyExtraMinutes;
    return a;
  }, {work:0, ot:0, deepOT:0, holiday:0, holidayDeep:0, scheduledDeep:0, weeklyExtra:0});
  sums.combined = sums.ot + sums.holiday;
  return sums;
}

export function addMonths(key, delta) {
  const [y,m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

export function agreementPeriodForMonth(key, startMonth = 4) {
  const [y,m] = key.split('-').map(Number);
  const startYear = m >= startMonth ? y : y - 1;
  const months = [];
  for (let i=0;i<12;i++) {
    const d = new Date(startYear, startMonth - 1 + i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }
  return {startYear, months};
}

export function limitStatus(classified, currentMonth, settings) {
  const current = sumMonth(classified, currentMonth);
  const period = agreementPeriodForMonth(currentMonth, Number(settings.agreementStartMonth)||4);
  const monthly = period.months.map(k => ({key:k, ...sumMonth(classified,k)}));
  const annualOT = monthly.reduce((s,m)=>s+m.ot,0);
  const over45Count = monthly.filter(m=>m.ot > 45*MIN).length;
  const currentIndex = period.months.indexOf(currentMonth);
  const averages = [];
  for (let n=2;n<=6;n++) {
    if (currentIndex - (n-1) < 0) continue;
    const span = monthly.slice(currentIndex-(n-1), currentIndex+1);
    const avg = span.reduce((s,m)=>s+m.combined,0)/n;
    averages.push({n, minutes:avg});
  }

  const disaster = !!settings.disasterRestoration;
  let remainingCandidates = [];
  // 100h is strictly less than; use 1 minute safety granularity.
  if (!disaster) remainingCandidates.push({label:'単月100h未満', minutes: Math.max(0, 100*MIN - 1 - current.combined)});
  remainingCandidates.push({label:'年720h', minutes: Math.max(0, 720*MIN - annualOT)});
  // If already 6 months >45, this month cannot newly become a 7th month above 45.
  const priorOver45 = monthly.filter((m,i)=>i!==currentIndex && m.ot>45*MIN).length;
  if (priorOver45 >= 6) remainingCandidates.push({label:'45h超は年6か月まで', minutes: Math.max(0, 45*MIN - current.ot)});

  if (!disaster) {
    for (let n=2;n<=6;n++) {
      if (currentIndex - (n-1) < 0) continue;
      const prior = monthly.slice(currentIndex-(n-1), currentIndex).reduce((s,m)=>s+m.combined,0);
      const maxCurrent = 80*MIN*n - prior;
      remainingCandidates.push({label:`${n}か月平均80h`, minutes: Math.max(0, maxCurrent-current.combined)});
    }
  }
  remainingCandidates = remainingCandidates.filter(x=>Number.isFinite(x.minutes));
  const tightest = remainingCandidates.sort((a,b)=>a.minutes-b.minutes)[0] || {label:'-',minutes:0};

  const breaches = [];
  if (annualOT > 720*MIN) breaches.push('年720時間超');
  if (over45Count > 6) breaches.push('45時間超が年7か月以上');
  if (!disaster && current.combined >= 100*MIN) breaches.push('単月100時間未満を満たさない');
  if (!disaster) averages.filter(a=>a.minutes>80*MIN).forEach(a=>breaches.push(`${a.n}か月平均80時間超`));

  return {current, period, monthly, annualOT, over45Count, averages, tightest, breaches};
}

export function wageEstimate(monthSummary, settings) {
  const baseMonthly = Number(settings.wageBaseMonthly || settings.baseSalary || 0);
  const monthlyHours = Number(settings.avgMonthlyScheduledHours || 160);
  const hourly = monthlyHours > 0 ? baseMonthly / monthlyHours : 0;
  const otH = monthSummary.ot / MIN;
  const deepOTH = monthSummary.deepOT / MIN;
  const holidayH = monthSummary.holiday / MIN;
  const holidayDeepH = monthSummary.holidayDeep / MIN;
  const scheduledDeepH = monthSummary.scheduledDeep / MIN;
  const ot60 = Math.min(otH, 60);
  const otOver = Math.max(0, otH - 60);

  const overtimePay = hourly * (ot60 * 1.25 + otOver * 1.50);
  const deepPremium = hourly * deepOTH * 0.25;
  const holidayPay = hourly * holidayH * 1.35;
  const holidayDeepPremium = hourly * holidayDeepH * 0.25;
  const scheduledDeepPremium = hourly * scheduledDeepH * 0.25;
  const total = overtimePay + deepPremium + holidayPay + holidayDeepPremium + scheduledDeepPremium;
  const premiumOnly = hourly * (ot60 * .25 + otOver * .50 + deepOTH * .25 + holidayH * .35 + holidayDeepH * .25 + scheduledDeepH * .25);
  return {hourly, ot60, otOver, overtimePay, deepPremium, holidayPay, holidayDeepPremium, scheduledDeepPremium, total, premiumOnly};
}

export function fmtMinutes(mins) {
  const sign = mins < 0 ? '-' : '';
  const v = Math.abs(Math.round(mins));
  return `${sign}${Math.floor(v/60)}:${String(v%60).padStart(2,'0')}`;
}
