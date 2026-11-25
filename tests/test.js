// Pohela Boishakh BD — Node unit tests for js/logic.js + js/data.js.
// Run: node tests/test.js   (from the project root)
// Exits non-zero if any check fails.
'use strict';
const L = require('../js/logic.js');
const D = require('../js/data.js');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); }
}
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// ---- Data integrity ----
check('10 traditions', D.TRADITIONS.length === 10, 'got ' + D.TRADITIONS.length);
check('tradition ids unique', new Set(D.TRADITIONS.map((t) => t.id)).size === 10);
check('every tradition has EN + BN + note + detail', D.TRADITIONS.every((t) => t.en && t.bn && t.note && t.detail));
check('tradition cats all known', D.TRADITIONS.every((t) => ['parade', 'food', 'custom', 'fair', 'music'].includes(t.cat)));
check('10 foods', D.FOODS.length === 10, 'got ' + D.FOODS.length);
check('food ids unique', new Set(D.FOODS.map((f) => f.id)).size === 10);
check('every food has EN + BN + ingredients + note', D.FOODS.every((f) => f.en && f.bn && f.ingredients && f.note));
check('food kinds all known', D.FOODS.every((f) => ['main', 'side', 'sweet', 'drink'].includes(f.kind)));
check('8 greetings', D.GREETINGS.length === 8, 'got ' + D.GREETINGS.length);
check('greeting ids unique', new Set(D.GREETINGS.map((g) => g.id)).size === 8);
check('every greeting has BN + EN + text', D.GREETINGS.every((g) => g.bn && g.en && g.text));
check('10 checklist defaults', D.CHECKLIST_DEFAULTS.length === 10);
check('checklist ids unique', new Set(D.CHECKLIST_DEFAULTS.map((c) => c.id)).size === 10);
check('mangal shobhajatra present', L.traditionById('mangal-shobhajatra').bn === 'মঙ্গল শোভাযাত্রা');
check('panta bhat present', L.foodById('panta-bhat').bn === 'পান্তা ভাত');
check('shubho noboborsho present', L.greetingById('shubho-noboborsho').bn === 'শুভ নববর্ষ');

// ---- Next Boishakh ----
check('next from 2026-11-25 = 2027-04-14 / 1434', eq(L.nextBoishakh('2026-11-25'), { dateStr: '2027-04-14', bengaliYear: 1434, isToday: false }), JSON.stringify(L.nextBoishakh('2026-11-25')));
check('on 2026-04-14 is today, year 1433', eq(L.nextBoishakh('2026-04-14'), { dateStr: '2026-04-14', bengaliYear: 1433, isToday: true }));
check('day before 2026-04-13 -> same year', eq(L.nextBoishakh('2026-04-13'), { dateStr: '2026-04-14', bengaliYear: 1433, isToday: false }));
check('day after 2026-04-15 -> next year', eq(L.nextBoishakh('2026-04-15'), { dateStr: '2027-04-14', bengaliYear: 1434, isToday: false }));
check('on 2027-04-14 is today, year 1434', eq(L.nextBoishakh('2027-04-14'), { dateStr: '2027-04-14', bengaliYear: 1434, isToday: true }));
check('2026-01-01 -> 2026-04-14', L.nextBoishakh('2026-01-01').dateStr === '2026-04-14');

// ---- Countdown (fixed "now", local midnight target) ----
const T = '2027-04-14';
check('countdown 1 day out', eq(L.countdownParts(T, new Date('2027-04-13T00:00:00').getTime()), { days: 1, hours: 0, minutes: 0, seconds: 0, totalMs: 86400000 }), JSON.stringify(L.countdownParts(T, new Date('2027-04-13T00:00:00').getTime())));
check('countdown noon before', eq(L.countdownParts(T, new Date('2027-04-13T12:00:00').getTime()), { days: 0, hours: 12, minutes: 0, seconds: 0, totalMs: 43200000 }));
check('countdown 30s before', eq(L.countdownParts(T, new Date('2027-04-13T23:59:30').getTime()), { days: 0, hours: 0, minutes: 0, seconds: 30, totalMs: 30000 }));
check('countdown past target = zeros', eq(L.countdownParts(T, new Date('2027-04-15T00:00:00').getTime()), { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }));
check('countdown at target = zeros', L.countdownParts(T, new Date('2027-04-14T00:00:00').getTime()).totalMs === 0);

// ---- Dates ----
check('dayOfYear 2026-01-01 = 1', L.dayOfYear('2026-01-01') === 1);
check('dayOfYear 2026-11-25 = 329', L.dayOfYear('2026-11-25') === 329, 'got ' + L.dayOfYear('2026-11-25'));
check('dayOfYear 2026-04-14 = 104', L.dayOfYear('2026-04-14') === 104);
check('valid date 2026-11-25', L.isValidDateStr('2026-11-25'));
check('invalid date 2026-02-30', !L.isValidDateStr('2026-02-30'));
check('invalid date garbage', !L.isValidDateStr('tomorrow'));

// ---- Tradition of the day (deterministic) ----
// 2026-11-25 is day 329; 329 % 10 = 9 -> TRADITIONS[9] = family-visits.
// 2026-04-14 is day 104; 104 % 10 = 4 -> TRADITIONS[4] = alpana.
// 2026-01-01 is day 1; 1 % 10 = 1 -> TRADITIONS[1] = panta-ilish.
check('tradition of day 2026-11-25 = family visits', L.traditionOfTheDay('2026-11-25').id === 'family-visits');
check('tradition of day 2026-04-14 = alpana', L.traditionOfTheDay('2026-04-14').id === 'alpana');
check('tradition of day 2026-01-01 = panta-ilish', L.traditionOfTheDay('2026-01-01').id === 'panta-ilish');

// ---- Filters ----
check('traditions cat food -> 3', L.filterTraditions({ cat: 'food' }).length === 3);
check('traditions cat parade -> 1', L.filterTraditions({ cat: 'parade' }).length === 1);
check('traditions search মেলা -> 1', L.filterTraditions({ query: 'মেলা' }).length === 1);
check('traditions search ilish -> 1', L.filterTraditions({ query: 'ilish' }).length === 1);
check('traditions search xyz -> 0', L.filterTraditions({ query: 'xyz' }).length === 0);
check('traditions empty filter -> 10', L.filterTraditions({}).length === 10);
check('foods kind sweet -> 4', L.filterFoods({ kind: 'sweet' }).length === 4);
check('foods kind main -> 2', L.filterFoods({ kind: 'main' }).length === 2);
check('foods search bhorta -> 4', L.filterFoods({ query: 'bhorta' }).length === 4);
check('foods search ভর্তা -> 4', L.filterFoods({ query: 'ভর্তা' }).length === 4);
check('foods search ilish -> 1', L.filterFoods({ query: 'ilish' }).length === 1);
check('foods empty filter -> 10', L.filterFoods({}).length === 10);

// ---- Time validation ----
check('time 07:00 valid', L.isValidTimeStr('07:00'));
check('time 23:59 valid', L.isValidTimeStr('23:59'));
check('time 24:00 invalid', !L.isValidTimeStr('24:00'));
check('time 7:00 invalid', !L.isValidTimeStr('7:00'));
check('time empty invalid', !L.isValidTimeStr(''));

// ---- Plan validation ----
const goodPlan = { title: 'Mangal Shobhajatra', time: '07:00', place: 'DU Fine Arts', notes: '' };
check('valid plan passes', eq(L.validatePlanItem(goodPlan), {}));
check('plan no time passes', eq(L.validatePlanItem({ title: 'Mela visit', time: '', place: '', notes: '' }), {}));
check('plan empty title rejected', L.validatePlanItem({ ...goodPlan, title: '   ' }).title !== undefined);
check('plan title 81 chars rejected', L.validatePlanItem({ ...goodPlan, title: 'x'.repeat(81) }).title !== undefined);
check('plan bad time rejected', L.validatePlanItem({ ...goodPlan, time: '25:00' }).time !== undefined);
check('plan place 81 chars rejected', L.validatePlanItem({ ...goodPlan, place: 'x'.repeat(81) }).place !== undefined);
check('plan notes 201 chars rejected', L.validatePlanItem({ ...goodPlan, notes: 'x'.repeat(201) }).notes !== undefined);

// ---- Greeting form validation ----
const goodGreet = { greetingId: 'shubho-noboborsho', name: 'Fahad', message: '' };
check('valid greeting passes', eq(L.validateGreetingForm(goodGreet), {}));
check('greeting no name passes', eq(L.validateGreetingForm({ greetingId: 'esho-he-boishakh', name: '', message: '' }), {}));
check('greeting unknown id rejected', L.validateGreetingForm({ ...goodGreet, greetingId: 'nope' }).greetingId !== undefined);
check('greeting name 41 chars rejected', L.validateGreetingForm({ ...goodGreet, name: 'x'.repeat(41) }).name !== undefined);
check('greeting message 201 chars rejected', L.validateGreetingForm({ ...goodGreet, message: 'x'.repeat(201) }).message !== undefined);

// ---- Greeting text ----
const gt = L.buildGreetingText('shubho-noboborsho', 'Fahad', '', 'en');
check('greeting text starts with শুভ নববর্ষ', gt.indexOf('শুভ নববর্ষ') === 0, gt);
check('greeting text ends with — Fahad', gt.endsWith('— Fahad'), gt);
check('greeting text no name EN signoff', L.buildGreetingText('shubho-noboborsho', '', '', 'en').endsWith('— Happy Bengali New Year'));
check('greeting text no name BN signoff', L.buildGreetingText('shubho-noboborsho', '', '', 'bn').endsWith('— শুভ নববর্ষ'));
check('greeting text includes custom message', L.buildGreetingText('shubho-noboborsho', 'Fahad', 'Have a great year!', 'en').indexOf('Have a great year!') !== -1);
check('greeting text unknown id empty', L.buildGreetingText('nope', 'Fahad', '', 'en') === '');

// ---- Stats ----
const CL = D.CHECKLIST_DEFAULTS.map((c, i) => ({ id: c.id, done: i < 3 }));
const stats = L.computePlanStats([{ title: 'a' }, { title: 'b' }], CL, ['panta-bhat', 'ilish-bhaja']);
check('stats plans 2', stats.totalPlans === 2);
check('stats checklist done 3 of 10', stats.doneChecklist === 3 && stats.totalChecklist === 10);
check('stats checklist pct 30', stats.checklistPct === 30);
check('stats menu 2', stats.menuCount === 2);
check('stats empty', eq(L.computePlanStats([], [], []), { totalPlans: 0, doneChecklist: 0, totalChecklist: 0, checklistPct: 0, menuCount: 0 }));

// ---- Import validation ----
check('import valid ok', L.validateImport({ plan: [goodPlan], checklist: [{ id: 'clothes', done: true }], menu: ['panta-bhat'] }).ok);
check('import empty object ok', L.validateImport({}).ok);
check('import bad plan fails', !L.validateImport({ plan: [{ ...goodPlan, title: '' }] }).ok);
check('import custom checklist without text fails', !L.validateImport({ checklist: [{ id: 'custom-1', done: false }] }).ok);
check('import custom checklist with text ok', L.validateImport({ checklist: [{ id: 'custom-1', text: 'Buy flowers', done: false }] }).ok);
check('import unknown menu dish fails', !L.validateImport({ menu: ['nope-dish'] }).ok);
check('import menu 51 fails', !L.validateImport({ menu: Array(51).fill('panta-bhat') }).ok);
check('import non-object fails', !L.validateImport('nope').ok);

// ---- Bengali digits ----
check('bnDigits 1433', L.bnDigits(1433) === '১৪৩৩');
check('bnDigits 2026', L.bnDigits(2026) === '২০২৬');
check('bnDigits mixed text', L.bnDigits('14 April') === '১৪ April');

console.log('\nunit: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
