// Pohela Boishakh BD — UI glue. Depends on window.BoishakhData + window.BoishakhLogic.
// State: localStorage key "pohela-boishakh-bd-v1" =>
// { plan: [], checklist: [{id, text?, done}], menu: [], lang: 'en'|'bn',
//   greetingId, greetingName, greetingMessage }
'use strict';
(function () {
  var L = window.BoishakhLogic;
  var D = window.BoishakhData;
  var KEY = 'pohela-boishakh-bd-v1';
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MONTH_NAMES_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

  var STR = {
    en: {
      tagline: 'Bengali New Year guide & celebration planner — offline, free, yours.',
      tabHome: 'Home', tabTraditions: 'Traditions', tabPlan: 'My Plan', tabFood: 'Food & Menu', tabGreetings: 'Greetings', tabData: 'Data',
      countdownTitle: 'Countdown to Pohela Boishakh',
      cdDays: 'days', cdHours: 'hours', cdMins: 'mins', cdSecs: 'secs',
      tradOfDay: 'Tradition of the day',
      tradSearchPh: 'Search traditions… (try মেলা or mela)',
      allCats: 'All categories', catParade: 'Procession', catFood: 'Food', catCustom: 'Custom', catFair: 'Fair', catMusic: 'Music',
      planTitle: 'Plan your Boishakh day', planHint: 'Add what you will do on 14 April. Plans stay in your browser — nothing is uploaded.',
      fTitle: 'Title', titlePh: 'e.g. Mangal Shobhajatra', fTime: 'Time (optional)', fPlace: 'Place (optional)',
      placePh: 'e.g. Ramna Park, Dhaka', fNotes: 'Notes (optional)', notesPh: 'e.g. Meet friends at 7 am',
      addPlanBtn: 'Add to my plan', myDay: 'My Boishakh day', checkTitle: 'Preparation checklist',
      customCheckPh: 'Add your own task…', addTaskBtn: 'Add task',
      foodSearchPh: 'Search dishes… (try ভর্তা or bhorta)',
      allKinds: 'All kinds', kindMain: 'Main', kindSide: 'Side', kindSweet: 'Sweet', myMenu: 'My Boishakh menu',
      greetTitle: 'Make a greeting card', greetHint: 'Pick a greeting, add your name and a message, then copy the card text to send anywhere.',
      fName: 'Your name (optional)', namePh: 'e.g. Fahad', fMessage: 'Message (optional)', messagePh: 'e.g. Have a wonderful new year!',
      previewTitle: 'Card preview', copyBtn: 'Copy card text',
      dataTitle: 'Your data', dataHint: 'Plans, checklist and menu live only in this browser (localStorage). Export a backup before clearing browser data.',
      exportBtn: 'Export JSON', importBtn: 'Import JSON',
      eraseTitle: 'Erase everything', eraseHint: 'Type DELETE to erase all plans, checklist progress and menu. This cannot be undone.',
      erasePh: 'Type DELETE', eraseBtn: 'Erase all',
      aboutTitle: 'About this guide',
      aboutText: 'A beginner’s guide to Pohela Boishakh — the first day of the Bengali calendar year (14 April) and a public holiday in Bangladesh. Dates and customs are general cultural knowledge, not an official source; check local announcements for procession times and fair schedules.',
      footer: 'Pohela Boishakh BD — offline personal tool. A cultural guide and celebration planner, not an official source. Bengali year = Gregorian year − 593.',
      statPlans: 'Plans', statChecklist: 'Checklist done', statMenu: 'Menu dishes', statDays: 'Days to go',
      todayBanner: 'Shubho Noboborsho! Today is Pohela Boishakh.',
      cdDateLine: '14 April {year} · 1 Boishakh {by}',
      emptyPlan: 'No plans yet — add your first plan above.',
      emptyMenu: 'No dishes in your menu yet — add dishes from the guide above.',
      emptyTrad: 'No traditions match those filters.',
      emptyFood: 'No dishes match those filters.',
      planSaved: 'Plan added.',
      copied: 'Card text copied.',
      copyFailed: 'Copy did not work in this browser — select the preview text manually.',
      importOk: 'Import complete.',
      importBad: 'Import failed: ',
      erased: 'Everything erased.',
      addToMenu: 'Add to menu', inMenu: 'In menu ✓', removeFromMenu: 'Remove',
      deleteBtn: 'Delete',
      catLabel: { parade: 'Procession', food: 'Food', custom: 'Custom', fair: 'Fair', music: 'Music' },
      kindLabel: { main: 'Main', side: 'Side', sweet: 'Sweet', drink: 'Drink' }
    },
    bn: {
      tagline: 'বাংলা নববর্ষের গাইড ও উদযাপন পরিকল্পনা — অফলাইন, ফ্রি, আপনার।',
      tabHome: 'হোম', tabTraditions: 'ঐতিহ্য', tabPlan: 'আমার পরিকল্পনা', tabFood: 'খাবার ও মেনু', tabGreetings: 'শুভেচ্ছা', tabData: 'ডেটা',
      countdownTitle: 'পহেলা বৈশাখের কাউন্টডাউন',
      cdDays: 'দিন', cdHours: 'ঘণ্টা', cdMins: 'মিনিট', cdSecs: 'সেকেন্ড',
      tradOfDay: 'আজকের ঐতিহ্য',
      tradSearchPh: 'ঐতিহ্য খুঁজুন… (মেলা বা mela লিখে দেখুন)',
      allCats: 'সব বিভাগ', catParade: 'শোভাযাত্রা', catFood: 'খাবার', catCustom: 'প্রথা', catFair: 'মেলা', catMusic: 'গান',
      planTitle: 'বৈশাখের দিনের পরিকল্পনা', planHint: '১৪ এপ্রিল আপনি কী করবেন তা যোগ করুন। পরিকল্পনা আপনার ব্রাউজারেই থাকে — কিছুই আপলোড হয় না।',
      fTitle: 'শিরোনাম', titlePh: 'যেমন: মঙ্গল শোভাযাত্রা', fTime: 'সময় (ঐচ্ছিক)', fPlace: 'স্থান (ঐচ্ছিক)',
      placePh: 'যেমন: রমনা পার্ক, ঢাকা', fNotes: 'নোট (ঐচ্ছিক)', notesPh: 'যেমন: সকাল ৭টায় বন্ধুদের সাথে দেখা',
      addPlanBtn: 'পরিকল্পনায় যোগ করুন', myDay: 'আমার বৈশাখের দিন', checkTitle: 'প্রস্তুতির চেকলিস্ট',
      customCheckPh: 'নিজের কাজ যোগ করুন…', addTaskBtn: 'কাজ যোগ করুন',
      foodSearchPh: 'খাবার খুঁজুন… (ভর্তা বা bhorta লিখে দেখুন)',
      allKinds: 'সব ধরন', kindMain: 'প্রধান', kindSide: 'সাইড', kindSweet: 'মিষ্টি', myMenu: 'আমার বৈশাখের মেনু',
      greetTitle: 'শুভেচ্ছা কার্ড বানান', greetHint: 'একটি শুভেচ্ছা বেছে নিন, নাম ও বার্তা যোগ করুন, তারপর কার্ডের লেখা কপি করে যেকোনো জায়গায় পাঠান।',
      fName: 'আপনার নাম (ঐচ্ছিক)', namePh: 'যেমন: ফাহাদ', fMessage: 'বার্তা (ঐচ্ছিক)', messagePh: 'যেমন: নতুন বছর শুভ হোক!',
      previewTitle: 'কার্ডের প্রিভিউ', copyBtn: 'কার্ডের লেখা কপি করুন',
      dataTitle: 'আপনার ডেটা', dataHint: 'পরিকল্পনা, চেকলিস্ট ও মেনু শুধু এই ব্রাউজারেই থাকে (localStorage)। ব্রাউজারের ডেটা মোছার আগে ব্যাকআপ নিন।',
      exportBtn: 'এক্সপোর্ট JSON', importBtn: 'ইমপোর্ট JSON',
      eraseTitle: 'সব মুছে ফেলুন', eraseHint: 'সব পরিকল্পনা, চেকলিস্ট ও মেনু মুছতে DELETE লিখুন। এটি ফেরানো যাবে না।',
      erasePh: 'DELETE লিখুন', eraseBtn: 'সব মুছে ফেলুন',
      aboutTitle: 'এই গাইড সম্পর্কে',
      aboutText: 'পহেলা বৈশাখের একটি সহজ গাইড — বাংলা বর্ষপঞ্জির প্রথম দিন (১৪ এপ্রিল) এবং বাংলাদেশের সরকারি ছুটির দিন। তারিখ ও প্রথা সাধারণ সাংস্কৃতিক জ্ঞান, সরকারি উৎস নয়; শোভাযাত্রার সময় ও মেলার সূচির জন্য স্থানীয় ঘোষণা দেখুন।',
      footer: 'পহেলা বৈশাখ বিডি — অফলাইন ব্যক্তিগত টুল। একটি সাংস্কৃতিক গাইড ও উদযাপন পরিকল্পনা, সরকারি উৎস নয়। বাংলা সাল = ইংরেজি সাল − ৫৯৩।',
      statPlans: 'পরিকল্পনা', statChecklist: 'চেকলিস্ট সম্পন্ন', statMenu: 'মেনুর পদ', statDays: 'দিন বাকি',
      todayBanner: 'শুভ নববর্ষ! আজ পহেলা বৈশাখ।',
      cdDateLine: '১৪ এপ্রিল {year} · ১ বৈশাখ {by}',
      emptyPlan: 'এখনো কোনো পরিকল্পনা নেই — উপরে প্রথম পরিকল্পনা যোগ করুন।',
      emptyMenu: 'মেনুতে এখনো কোনো পদ নেই — উপরের গাইড থেকে পদ যোগ করুন।',
      emptyTrad: 'এই ফিল্টারে কোনো ঐতিহ্য মেলেনি।',
      emptyFood: 'এই ফিল্টারে কোনো পদ মেলেনি।',
      planSaved: 'পরিকল্পনা যোগ হয়েছে।',
      copied: 'কার্ডের লেখা কপি হয়েছে।',
      copyFailed: 'এই ব্রাউজারে কপি হয়নি — প্রিভিউর লেখা নিজে সিলেক্ট করে কপি করুন।',
      importOk: 'ইমপোর্ট সম্পন্ন হয়েছে।',
      importBad: 'ইমপোর্ট ব্যর্থ: ',
      erased: 'সব মুছে ফেলা হয়েছে।',
      addToMenu: 'মেনুতে যোগ করুন', inMenu: 'মেনুতে আছে ✓', removeFromMenu: 'সরান',
      deleteBtn: 'মুছুন',
      catLabel: { parade: 'শোভাযাত্রা', food: 'খাবার', custom: 'প্রথা', fair: 'মেলা', music: 'গান' },
      kindLabel: { main: 'প্রধান', side: 'সাইড', sweet: 'মিষ্টি', drink: 'পানীয়' }
    }
  };

  function defaultState() {
    return {
      plan: [],
      checklist: D.CHECKLIST_DEFAULTS.map((c) => ({ id: c.id, done: false })),
      menu: [],
      lang: 'en',
      greetingId: 'shubho-noboborsho',
      greetingName: '',
      greetingMessage: ''
    };
  }
  function loadState() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var s = JSON.parse(raw);
      var d = defaultState();
      if (Array.isArray(s.plan)) d.plan = s.plan;
      if (Array.isArray(s.checklist) && s.checklist.length > 0) d.checklist = s.checklist;
      if (Array.isArray(s.menu)) d.menu = s.menu;
      if (s.lang === 'en' || s.lang === 'bn') d.lang = s.lang;
      if (typeof s.greetingId === 'string' && L.greetingById(s.greetingId)) d.greetingId = s.greetingId;
      if (typeof s.greetingName === 'string') d.greetingName = s.greetingName;
      if (typeof s.greetingMessage === 'string') d.greetingMessage = s.greetingMessage;
      return d;
    } catch (e) { return defaultState(); }
  }
  var state = loadState();
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function t(key) { return STR[state.lang][key]; }
  function fmt(n) { return state.lang === 'bn' ? L.bnDigits(n) : String(n); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- Countdown ----------
  var next = L.nextBoishakh();
  function tickCountdown() {
    next = L.nextBoishakh();
    var parts = L.countdownParts(next.dateStr, Date.now());
    document.getElementById('cd-days').textContent = fmt(parts.days);
    document.getElementById('cd-hours').textContent = fmt(parts.hours);
    document.getElementById('cd-mins').textContent = fmt(parts.minutes);
    document.getElementById('cd-secs').textContent = fmt(parts.seconds);
    var year = Number(next.dateStr.slice(0, 4));
    var line;
    if (state.lang === 'bn') {
      line = L.bnDigits(14) + ' ' + MONTH_NAMES_BN[3] + ' ' + L.bnDigits(year) + ' · ' + L.bnDigits(1) + ' ' + 'বৈশাখ' + ' ' + L.bnDigits(next.bengaliYear);
    } else {
      line = '14 April ' + year + ' · 1 Boishakh ' + next.bengaliYear;
    }
    document.getElementById('cd-date').textContent = line;
    var banner = document.getElementById('today-banner');
    if (next.isToday) { banner.hidden = false; banner.textContent = t('todayBanner'); }
    else { banner.hidden = true; banner.textContent = ''; }
    renderStats(parts.days);
  }

  // ---------- Home ----------
  function renderStats(daysLeft) {
    var stats = L.computePlanStats(state.plan, state.checklist, state.menu);
    var el = document.getElementById('home-stats');
    el.innerHTML =
      '<div class="stat"><div class="num">' + fmt(daysLeft) + '</div><div class="lbl">' + esc(t('statDays')) + '</div></div>' +
      '<div class="stat"><div class="num">' + fmt(stats.totalPlans) + '</div><div class="lbl">' + esc(t('statPlans')) + '</div></div>' +
      '<div class="stat"><div class="num">' + fmt(stats.doneChecklist) + '/' + fmt(stats.totalChecklist) + '</div><div class="lbl">' + esc(t('statChecklist')) + '</div></div>' +
      '<div class="stat"><div class="num">' + fmt(stats.menuCount) + '</div><div class="lbl">' + esc(t('statMenu')) + '</div></div>';
  }
  function renderTradOfDay() {
    var tr = L.traditionOfTheDay();
    var name = state.lang === 'bn' ? tr.bn : tr.en;
    var detail = state.lang === 'bn' ? tr.detail : tr.detail;
    document.getElementById('trad-day').innerHTML =
      '<h3>' + esc(name) + '</h3><p class="meta">' + esc(state.lang === 'bn' ? tr.en : tr.bn) + '</p>' +
      '<p>' + esc(tr.note) + '</p><p class="meta">' + esc(detail) + '</p>';
  }

  // ---------- Traditions ----------
  function tradCard(tr) {
    var name = state.lang === 'bn' ? tr.bn : tr.en;
    var other = state.lang === 'bn' ? tr.en : tr.bn;
    return '<article class="trad-card"><h3>' + esc(name) + '</h3>' +
      '<div class="bn">' + esc(other) + '</div>' +
      '<span class="badge">' + esc(t('catLabel')[tr.cat]) + '</span>' +
      '<p class="note">' + esc(tr.note) + '</p>' +
      '<p class="detail">' + esc(tr.detail) + '</p></article>';
  }
  function renderTraditions() {
    var q = document.getElementById('trad-search').value;
    var cat = document.getElementById('trad-cat').value;
    var list = L.filterTraditions({ query: q, cat: cat });
    document.getElementById('trad-grid').innerHTML = list.map(tradCard).join('');
    document.getElementById('trad-count').textContent = fmt(list.length) + ' / ' + fmt(D.TRADITIONS.length);
    document.getElementById('trad-empty').hidden = list.length !== 0;
    document.getElementById('trad-empty').textContent = t('emptyTrad');
  }

  // ---------- Plan ----------
  function sortedPlan() {
    return state.plan.slice().sort(function (a, b) {
      var ta = a.time || '99:99', tb = b.time || '99:99';
      if (ta !== tb) return ta < tb ? -1 : 1;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
  }
  function renderPlan() {
    var list = sortedPlan();
    var el = document.getElementById('plan-list');
    el.innerHTML = list.map(function (p) {
      var time = p.time ? '<span class="time">' + esc(fmt(p.time)) + '</span> ' : '';
      var place = p.place ? ' · ' + esc(p.place) : '';
      var notes = p.notes ? '<div class="meta">' + esc(p.notes) + '</div>' : '';
      return '<li><div class="plan-row"><div><div>' + time + '<strong>' + esc(p.title) + '</strong>' + place + '</div>' + notes + '</div>' +
        '<button class="delete-btn" type="button" data-delete-plan="' + esc(p.id) + '">' + esc(t('deleteBtn')) + '</button></div></li>';
    }).join('');
    document.getElementById('plan-empty').textContent = list.length === 0 ? t('emptyPlan') : '';
    el.querySelectorAll('[data-delete-plan]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.plan = state.plan.filter(function (p) { return p.id !== btn.getAttribute('data-delete-plan'); });
        save(); renderPlan(); tickCountdown();
      });
    });
  }
  function checklistItemText(c) {
    if (c.text) return c.text;
    var d = D.CHECKLIST_DEFAULTS.find(function (x) { return x.id === c.id; });
    if (!d) return c.id;
    return state.lang === 'bn' ? d.bn : d.en;
  }
  function renderChecklist() {
    var stats = L.computePlanStats(state.plan, state.checklist, state.menu);
    document.getElementById('check-progress').textContent = fmt(stats.doneChecklist) + ' / ' + fmt(stats.totalChecklist) + ' · ' + fmt(stats.checklistPct) + '%';
    document.getElementById('check-bar').style.width = stats.checklistPct + '%';
    var el = document.getElementById('checklist-list');
    el.innerHTML = state.checklist.map(function (c, i) {
      return '<li class="' + (c.done ? 'done' : '') + '"><input type="checkbox" data-check="' + i + '"' + (c.done ? ' checked' : '') + ' aria-label="' + esc(checklistItemText(c)) + '"><span>' + esc(checklistItemText(c)) + '</span></li>';
    }).join('');
    el.querySelectorAll('[data-check]').forEach(function (box) {
      box.addEventListener('change', function () {
        state.checklist[Number(box.getAttribute('data-check'))].done = box.checked;
        save(); renderChecklist(); tickCountdown();
      });
    });
  }

  // ---------- Food ----------
  function foodCard(f) {
    var name = state.lang === 'bn' ? f.bn : f.en;
    var other = state.lang === 'bn' ? f.en : f.bn;
    var inMenu = state.menu.indexOf(f.id) !== -1;
    return '<article class="trad-card"><h3>' + esc(name) + '</h3>' +
      '<div class="bn">' + esc(other) + '</div>' +
      '<span class="badge">' + esc(t('kindLabel')[f.kind]) + '</span>' +
      '<p class="note">' + esc(f.note) + '</p>' +
      '<p class="detail">' + esc(f.ingredients) + '</p>' +
      '<button class="btn" type="button" data-menu-toggle="' + esc(f.id) + '">' + esc(inMenu ? t('inMenu') : t('addToMenu')) + '</button></article>';
  }
  function renderFood() {
    var q = document.getElementById('food-search').value;
    var kind = document.getElementById('food-kind').value;
    var list = L.filterFoods({ query: q, kind: kind });
    document.getElementById('food-grid').innerHTML = list.map(foodCard).join('');
    document.getElementById('food-count').textContent = fmt(list.length) + ' / ' + fmt(D.FOODS.length);
    document.getElementById('food-empty').hidden = list.length !== 0;
    document.getElementById('food-empty').textContent = t('emptyFood');
    document.getElementById('food-grid').querySelectorAll('[data-menu-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-menu-toggle');
        var i = state.menu.indexOf(id);
        if (i === -1) state.menu.push(id); else state.menu.splice(i, 1);
        save(); renderFood(); renderMenu(); tickCountdown();
      });
    });
  }
  function renderMenu() {
    var el = document.getElementById('menu-list');
    el.innerHTML = state.menu.map(function (id) {
      var f = L.foodById(id);
      if (!f) return '';
      var name = state.lang === 'bn' ? f.bn : f.en;
      return '<li><div class="plan-row"><div><strong>' + esc(name) + '</strong><div class="meta">' + esc(t('kindLabel')[f.kind]) + '</div></div>' +
        '<button class="delete-btn" type="button" data-menu-remove="' + esc(id) + '">' + esc(t('removeFromMenu')) + '</button></div></li>';
    }).join('');
    document.getElementById('menu-empty').textContent = state.menu.length === 0 ? t('emptyMenu') : '';
    el.querySelectorAll('[data-menu-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.menu = state.menu.filter(function (id) { return id !== btn.getAttribute('data-menu-remove'); });
        save(); renderFood(); renderMenu(); tickCountdown();
      });
    });
  }

  // ---------- Greetings ----------
  function renderGreetPicker() {
    var el = document.getElementById('greet-list');
    el.innerHTML = D.GREETINGS.map(function (g) {
      var label = state.lang === 'bn' ? g.bn : (g.bn + ' — ' + g.en);
      return '<button class="greet-opt' + (state.greetingId === g.id ? ' selected' : '') + '" type="button" data-greet="' + esc(g.id) + '" role="radio" aria-checked="' + (state.greetingId === g.id) + '">' + esc(label) + '</button>';
    }).join('');
    el.querySelectorAll('[data-greet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.greetingId = btn.getAttribute('data-greet');
        save(); renderGreetPicker(); renderGreetPreview();
      });
    });
  }
  function renderGreetPreview() {
    var text = L.buildGreetingText(state.greetingId, state.greetingName, state.greetingMessage, state.lang);
    var g = L.greetingById(state.greetingId);
    var lines = text.split('\n');
    var html = lines.map(function (ln, i) {
      return '<div class="' + (i === 0 ? 'greet-bn' : '') + '">' + esc(ln) + '</div>';
    }).join('');
    document.getElementById('greet-preview').innerHTML = html;
    return text;
  }

  // ---------- i18n ----------
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (STR[state.lang][key] !== undefined && typeof STR[state.lang][key] === 'string') el.textContent = STR[state.lang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (STR[state.lang][key] !== undefined) el.setAttribute('placeholder', STR[state.lang][key]);
    });
    document.getElementById('lang-btn').textContent = state.lang === 'bn' ? 'English' : 'বাংলা';
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
  }
  function renderAll() {
    applyI18n();
    tickCountdown();
    renderTradOfDay();
    renderTraditions();
    renderPlan();
    renderChecklist();
    renderFood();
    renderMenu();
    renderGreetPicker();
    renderGreetPreview();
  }

  // ---------- Events ----------
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
    });
  });
  document.getElementById('lang-btn').addEventListener('click', function () {
    state.lang = state.lang === 'bn' ? 'en' : 'bn';
    save(); renderAll();
  });
  document.getElementById('trad-search').addEventListener('input', renderTraditions);
  document.getElementById('trad-cat').addEventListener('input', renderTraditions);
  document.getElementById('food-search').addEventListener('input', renderFood);
  document.getElementById('food-kind').addEventListener('input', renderFood);

  document.getElementById('plan-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var item = {
      id: 'plan-' + Date.now().toString(36),
      title: document.getElementById('p-title').value.trim(),
      time: document.getElementById('p-time').value,
      place: document.getElementById('p-place').value.trim(),
      notes: document.getElementById('p-notes').value.trim(),
      createdAt: Date.now()
    };
    var errors = L.validatePlanItem(item);
    ['title', 'time', 'place', 'notes'].forEach(function (k) {
      document.getElementById('err-' + k).textContent = errors[k] || '';
    });
    if (Object.keys(errors).length > 0) return;
    state.plan.push(item);
    save();
    document.getElementById('plan-form').reset();
    document.getElementById('plan-success').textContent = t('planSaved');
    renderPlan(); tickCountdown();
  });
  document.getElementById('custom-check-btn').addEventListener('click', function () {
    var input = document.getElementById('custom-check-text');
    var text = input.value.trim();
    if (!text) return;
    state.checklist.push({ id: 'custom-' + Date.now().toString(36), text: text, done: false });
    save(); input.value = '';
    renderChecklist(); tickCountdown();
  });
  document.getElementById('g-name').addEventListener('input', function (e) {
    state.greetingName = e.target.value; save(); renderGreetPreview();
  });
  document.getElementById('g-message').addEventListener('input', function (e) {
    state.greetingMessage = e.target.value; save(); renderGreetPreview();
  });
  document.getElementById('copy-btn').addEventListener('click', function () {
    var text = renderGreetPreview();
    var status = document.getElementById('copy-status');
    function done(ok) { status.textContent = ok ? t('copied') : t('copyFailed'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { done(document.execCommand('copy')); } catch (err) { done(false); }
      document.body.removeChild(ta);
    }
  });
  document.getElementById('export-btn').addEventListener('click', function () {
    var payload = { app: 'pohela-boishakh-bd', v: 1, plan: state.plan, checklist: state.checklist, menu: state.menu };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pohela-boishakh-bd-export.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  document.getElementById('import-file').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    var status = document.getElementById('import-status');
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(reader.result);
        var res = L.validateImport(obj);
        if (!res.ok) { status.textContent = t('importBad') + res.errors.join(' '); return; }
        if (Array.isArray(obj.plan)) state.plan = obj.plan;
        if (Array.isArray(obj.checklist)) state.checklist = obj.checklist;
        if (Array.isArray(obj.menu)) state.menu = obj.menu;
        save(); renderAll();
        status.textContent = t('importOk');
      } catch (err) {
        status.textContent = t('importBad') + 'Invalid JSON.';
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  document.getElementById('erase-btn').addEventListener('click', function () {
    var input = document.getElementById('erase-input');
    if (input.value.trim() !== 'DELETE') return;
    var lang = state.lang;
    state = defaultState();
    state.lang = lang;
    save(); input.value = '';
    renderAll();
    document.getElementById('import-status').textContent = t('erased');
  });

  // Restore greeting form values
  document.getElementById('g-name').value = state.greetingName;
  document.getElementById('g-message').value = state.greetingMessage;

  renderAll();
  setInterval(tickCountdown, 1000);
})();
