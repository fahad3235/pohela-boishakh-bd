// Pohela Boishakh BD — pure logic (no DOM). Node-testable: node tests/test.js
// Browser: window.BoishakhData is loaded first (js/data.js), then this file.
'use strict';
const DATA = (typeof require !== 'undefined')
  ? require('./data.js')
  : (typeof window !== 'undefined' ? window.BoishakhData : null);
const TR = DATA.TRADITIONS;
const FD = DATA.FOODS;
const GR = DATA.GREETINGS;
const CL = DATA.CHECKLIST_DEFAULTS;

// Bengali year = Gregorian year - 593 (14 Apr 2026 = 1 Boishakh 1433).
const BN_YEAR_OFFSET = 593;
const BOISHAKH_MONTH_DAY = '04-14';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function bnDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

function isValidDateStr(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function todayStr(d) {
  const t = d || new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const day = String(t.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}
function dayOfYear(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  return Math.floor((d - start) / 86400000);
}

// Next Pohela Boishakh on/after asOf. Returns { dateStr, bengaliYear, isToday }.
function nextBoishakh(asOf) {
  const today = isValidDateStr(asOf) ? asOf : todayStr();
  const year = Number(today.slice(0, 4));
  const thisYear = year + '-' + BOISHAKH_MONTH_DAY;
  if (today <= thisYear) {
    return { dateStr: thisYear, bengaliYear: year - BN_YEAR_OFFSET, isToday: today === thisYear };
  }
  const nextYear = year + 1;
  return { dateStr: nextYear + '-' + BOISHAKH_MONTH_DAY, bengaliYear: nextYear - BN_YEAR_OFFSET, isToday: false };
}

// Countdown from a fixed "now" (ms epoch) to a date string (local midnight).
// Pure + deterministic for tests. Returns { days, hours, minutes, seconds, totalMs }.
function countdownParts(targetDateStr, nowMs) {
  const target = new Date(targetDateStr + 'T00:00:00').getTime();
  let diff = target - nowMs;
  if (isNaN(target) || diff < 0) diff = 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, totalMs: diff };
}

function traditionById(id) { return TR.find((t) => t.id === id) || null; }
function foodById(id) { return FD.find((f) => f.id === id) || null; }
function greetingById(id) { return GR.find((g) => g.id === id) || null; }

function filterTraditions(opts) {
  const o = opts || {};
  const q = (o.query || '').trim().toLowerCase();
  return TR.filter((t) => {
    if (o.cat && t.cat !== o.cat) return false;
    if (q && t.en.toLowerCase().indexOf(q) === -1 && t.bn.indexOf(q) === -1 && t.id.indexOf(q) === -1) return false;
    return true;
  });
}
function filterFoods(opts) {
  const o = opts || {};
  const q = (o.query || '').trim().toLowerCase();
  return FD.filter((f) => {
    if (o.kind && f.kind !== o.kind) return false;
    if (q && f.en.toLowerCase().indexOf(q) === -1 && f.bn.indexOf(q) === -1 && f.id.indexOf(q) === -1) return false;
    return true;
  });
}

// Deterministic tradition of the day: rotates through the 10 traditions.
function traditionOfTheDay(dateStr) {
  const d = isValidDateStr(dateStr) ? dateStr : todayStr();
  return TR[dayOfYear(d) % TR.length];
}

function isValidTimeStr(s) {
  if (typeof s !== 'string' || !/^\d{2}:\d{2}$/.test(s)) return false;
  const h = Number(s.slice(0, 2));
  const m = Number(s.slice(3, 5));
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function validatePlanItem(p) {
  const errors = {};
  if (!p || typeof p !== 'object') return { _form: 'Invalid plan item.' };
  if (typeof p.title !== 'string' || p.title.trim().length === 0) errors.title = 'Enter a title for the plan.';
  else if (p.title.trim().length > 80) errors.title = 'Title must be 80 characters or less.';
  if (p.time && !isValidTimeStr(p.time)) errors.time = 'Time must be HH:MM (00:00–23:59).';
  if (typeof p.place === 'string' && p.place.length > 80) errors.place = 'Place must be 80 characters or less.';
  if (typeof p.notes === 'string' && p.notes.length > 200) errors.notes = 'Notes must be 200 characters or less.';
  return errors;
}

function validateGreetingForm(f) {
  const errors = {};
  if (!f || typeof f !== 'object') return { _form: 'Invalid greeting.' };
  if (!f.greetingId || !greetingById(f.greetingId)) errors.greetingId = 'Choose a greeting.';
  if (typeof f.name === 'string' && f.name.length > 40) errors.name = 'Name must be 40 characters or less.';
  if (typeof f.message === 'string' && f.message.length > 200) errors.message = 'Message must be 200 characters or less.';
  return errors;
}

// Compose the shareable greeting card text. lang: 'en' | 'bn'.
function buildGreetingText(greetingId, name, message, lang) {
  const g = greetingById(greetingId);
  if (!g) return '';
  const lines = [g.text];
  if (message && message.trim()) lines.push(message.trim());
  const from = (name && name.trim()) ? name.trim() : null;
  if (lang === 'bn') {
    lines.push(from ? ('— ' + from) : '— শুভ নববর্ষ');
  } else {
    lines.push(from ? ('— ' + from) : '— Happy Bengali New Year');
  }
  return lines.join('\n');
}

function computePlanStats(planItems, checklist, menu) {
  const plans = Array.isArray(planItems) ? planItems : [];
  const list = Array.isArray(checklist) ? checklist : [];
  const done = list.filter((c) => c.done).length;
  const menuCount = Array.isArray(menu) ? menu.length : 0;
  return {
    totalPlans: plans.length,
    doneChecklist: done,
    totalChecklist: list.length,
    checklistPct: list.length === 0 ? 0 : Math.round((done / list.length) * 100),
    menuCount
  };
}

function validateImport(obj) {
  const errors = [];
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { errors.push('File must be a JSON object.'); return { ok: false, errors }; }
  if (obj.plan !== undefined) {
    if (!Array.isArray(obj.plan)) errors.push('plan must be a list.');
    else if (obj.plan.length > 200) errors.push('Too many plan items (max 200).');
    else obj.plan.forEach((p, i) => {
      const e = validatePlanItem(p);
      const keys = Object.keys(e);
      if (keys.length > 0) errors.push('Plan ' + (i + 1) + ': ' + keys.map((k) => e[k]).join(' '));
    });
  }
  if (obj.checklist !== undefined) {
    if (!Array.isArray(obj.checklist)) errors.push('checklist must be a list.');
    else if (obj.checklist.length > 100) errors.push('Too many checklist items (max 100).');
    else obj.checklist.forEach((c, i) => {
      if (!c || typeof c !== 'object') { errors.push('Checklist ' + (i + 1) + ': invalid item.'); return; }
      const known = CL.some((d) => d.id === c.id);
      if (!known && (typeof c.text !== 'string' || c.text.trim().length === 0)) errors.push('Checklist ' + (i + 1) + ': custom item needs text.');
      if (c.done !== undefined && typeof c.done !== 'boolean') errors.push('Checklist ' + (i + 1) + ': done must be true/false.');
    });
  }
  if (obj.menu !== undefined) {
    if (!Array.isArray(obj.menu)) errors.push('menu must be a list.');
    else if (obj.menu.length > 50) errors.push('Too many menu dishes (max 50).');
    else obj.menu.forEach((id, i) => {
      if (!foodById(id)) errors.push('Menu ' + (i + 1) + ': unknown dish "' + String(id) + '".');
    });
  }
  return { ok: errors.length === 0, errors };
}

const BoishakhLogicApi = {
  TRADITIONS: TR, FOODS: FD, GREETINGS: GR, CHECKLIST_DEFAULTS: CL,
  BN_YEAR_OFFSET, bnDigits, isValidDateStr, todayStr, dayOfYear,
  nextBoishakh, countdownParts, traditionById, foodById, greetingById,
  filterTraditions, filterFoods, traditionOfTheDay, isValidTimeStr,
  validatePlanItem, validateGreetingForm, buildGreetingText,
  computePlanStats, validateImport
};
if (typeof module !== 'undefined' && module.exports) module.exports = BoishakhLogicApi;
else if (typeof window !== 'undefined') window.BoishakhLogic = BoishakhLogicApi;
