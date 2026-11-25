// Headless-Chrome smoke test for Pohela Boishakh BD.
// Drives the Playwright-cached headless_shell over CDP with Node's built-in
// WebSocket (no npm deps). Run from the project root:
//   node tests/smoke.mjs [1280|390]
// Exits 0 only if every check passes.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = path.join(process.env.HOME, '.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell');
const PORT = 9232;
const WIDTH = parseInt(process.argv[2] || '1280', 10);
const HEIGHT = WIDTH <= 480 ? 844 : 800;
const URL = 'file://' + path.join(ROOT, 'index.html');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, timeout = 15000, label = 'condition') {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try { if (await fn()) return true; } catch { /* retry */ }
    await sleep(150);
  }
  throw new Error('timeout waiting for ' + label);
}

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  '--remote-debugging-port=' + PORT,
  '--window-size=' + WIDTH + ',' + HEIGHT,
  'about:blank',
], { stdio: 'ignore' });

let ws;
try {
  let targets = null;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      targets = await res.json();
      break;
    } catch { await sleep(250); }
  }
  if (!targets) throw new Error('DevTools endpoint never came up');

  const pageTarget = targets.find((t) => t.type === 'page');
  ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  const consoleErrors = [];
  const failedReqs = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description || '').join(' '));
    }
    if (msg.method === 'Network.loadingFailed') {
      failedReqs.push(msg.params.errorText);
    }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const mid = ++id;
    pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const evalJs = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) throw new Error('page JS error: ' + JSON.stringify(r.result.exceptionDetails));
    return r.result?.result?.value;
  };
  const setVal = async (elId, value) => {
    await evalJs(`document.getElementById("${elId}").value = ${JSON.stringify(value)}`);
    await evalJs(`document.getElementById("${elId}").dispatchEvent(new Event("input", { bubbles: true }))`);
  };
  const getState = () => evalJs('JSON.parse(localStorage.getItem("pohela-boishakh-bd-v1") || "{}")');
  const countPlans = async () => { const s = await getState(); return Array.isArray(s.plan) ? s.plan.length : 0; };
  const clickTab = async (name) => {
    await evalJs(`[...document.querySelectorAll(".tab-btn")].find(b => b.dataset.tab === "${name}").click()`);
    await sleep(250);
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: WIDTH <= 480 });
  await send('Page.navigate', { url: URL });
  await waitFor(async () => (await evalJs('document.readyState')) === 'complete', 15000, 'page load');
  await sleep(500);
  await evalJs('localStorage.clear()');
  await send('Page.navigate', { url: URL });
  await waitFor(async () => (await evalJs('document.readyState')) === 'complete', 15000, 'reload');
  await sleep(500);

  console.log(`smoke @ ${WIDTH}x${HEIGHT}: ${URL}`);
  check('page title', (await evalJs('document.title')).includes('Pohela Boishakh BD'));
  check('app heading rendered', (await evalJs('document.querySelector("h1").textContent')) === 'Pohela Boishakh BD');
  check('6 tabs rendered', (await evalJs('document.querySelectorAll(".tab-btn").length')) === 6);
  check('countdown date line 14 April 2027', (await evalJs('document.getElementById("cd-date").textContent')).includes('14 April 2027'));
  check('countdown days is a number > 100', Number(await evalJs('document.getElementById("cd-days").textContent')) > 100);
  // 2026-11-25 is day 329; 329 % 10 = 9 -> family-visits = Visiting Family.
  check('tradition of the day = Visiting Family', (await evalJs('document.getElementById("trad-day").textContent')).includes('Visiting Family'));
  check('4 home stats', (await evalJs('document.querySelectorAll("#home-stats .stat").length')) === 4);
  check('no console errors on load', consoleErrors.length === 0, consoleErrors.join(' | '));
  check('no failed requests on load', failedReqs.length === 0, failedReqs.join(' | '));

  // ---- Traditions tab: filters ----
  await clickTab('traditions');
  check('traditions show 10 cards', (await evalJs('document.querySelectorAll("#trad-grid .trad-card").length')) === 10);
  check('trad count says 10 / 10', (await evalJs('document.getElementById("trad-count").textContent')).includes('10 / 10'));
  await setVal('trad-search', 'মেলা');
  await sleep(300);
  check('search মেলা -> 1 tradition', (await evalJs('document.querySelectorAll("#trad-grid .trad-card").length')) === 1);
  await setVal('trad-search', '');
  await sleep(300);
  await evalJs('document.getElementById("trad-cat").value = "food"');
  await evalJs('document.getElementById("trad-cat").dispatchEvent(new Event("input", { bubbles: true }))');
  await sleep(300);
  check('category food -> 3 traditions', (await evalJs('document.querySelectorAll("#trad-grid .trad-card").length')) === 3);
  await evalJs('document.getElementById("trad-cat").value = ""');
  await evalJs('document.getElementById("trad-cat").dispatchEvent(new Event("input", { bubbles: true }))');
  await sleep(300);
  check('clear filters -> 10 traditions', (await evalJs('document.querySelectorAll("#trad-grid .trad-card").length')) === 10);

  // ---- Plan tab: validation first ----
  await clickTab('plan');
  check('checklist has 10 items', (await evalJs('document.querySelectorAll("#checklist-list li").length')) === 10);
  check('checklist progress 0 / 10', (await evalJs('document.getElementById("check-progress").textContent')).includes('0 / 10'));
  await evalJs('document.querySelector("#plan-form button[type=submit]").click()');
  await sleep(300);
  check('empty submit shows title error', (await evalJs('document.getElementById("err-title").textContent')).length > 0);
  check('empty submit adds nothing', (await countPlans()) === 0);

  // ---- Add plan 1: Mangal Shobhajatra 07:00 ----
  await setVal('p-title', 'Mangal Shobhajatra');
  await setVal('p-time', '07:00');
  await setVal('p-place', 'DU Fine Arts');
  await evalJs('document.querySelector("#plan-form button[type=submit]").click()');
  await sleep(400);
  check('plan 1 saved', (await countPlans()) === 1);
  check('success message shown', (await evalJs('document.getElementById("plan-success").textContent')).includes('added'));
  check('plan list shows Mangal Shobhajatra', (await evalJs('document.getElementById("plan-list").textContent')).includes('Mangal Shobhajatra'));

  // ---- Checklist: tick one + add custom ----
  await evalJs('document.querySelector("#checklist-list input[type=checkbox]").click()');
  await sleep(300);
  check('checklist progress 1 / 10', (await evalJs('document.getElementById("check-progress").textContent')).includes('1 / 10'));
  await setVal('custom-check-text', 'Buy flowers');
  await evalJs('document.getElementById("custom-check-btn").click()');
  await sleep(300);
  check('custom task added -> 11 items', (await evalJs('document.querySelectorAll("#checklist-list li").length')) === 11);
  check('checklist progress 1 / 11', (await evalJs('document.getElementById("check-progress").textContent')).includes('1 / 11'));

  // ---- Food tab: filters + menu ----
  await clickTab('food');
  check('food shows 10 dishes', (await evalJs('document.querySelectorAll("#food-grid .trad-card").length')) === 10);
  await setVal('food-search', 'bhorta');
  await sleep(300);
  check('search bhorta -> 4 dishes', (await evalJs('document.querySelectorAll("#food-grid .trad-card").length')) === 4);
  await setVal('food-search', '');
  await sleep(300);
  await evalJs('document.getElementById("food-kind").value = "sweet"');
  await evalJs('document.getElementById("food-kind").dispatchEvent(new Event("input", { bubbles: true }))');
  await sleep(300);
  check('kind sweet -> 4 dishes', (await evalJs('document.querySelectorAll("#food-grid .trad-card").length')) === 4);
  await evalJs('document.getElementById("food-kind").value = ""');
  await evalJs('document.getElementById("food-kind").dispatchEvent(new Event("input", { bubbles: true }))');
  await sleep(300);
  await evalJs('document.querySelector("[data-menu-toggle=panta-bhat]").click()');
  await sleep(300);
  check('panta bhat added to menu', (await evalJs('document.querySelectorAll("#menu-list li").length')) === 1);
  check('menu shows Panta Bhat', (await evalJs('document.getElementById("menu-list").textContent')).includes('Panta Bhat'));
  await evalJs('document.querySelector("[data-menu-toggle=ilish-bhaja]").click()');
  await sleep(300);
  check('ilish added -> menu 2', (await evalJs('document.querySelectorAll("#menu-list li").length')) === 2);
  await evalJs('document.querySelector("[data-menu-remove=panta-bhat]").click()');
  await sleep(300);
  check('remove panta -> menu 1', (await evalJs('document.querySelectorAll("#menu-list li").length')) === 1);

  // ---- Greetings tab ----
  await clickTab('greetings');
  check('greeting preview default = Shubho Noboborsho', (await evalJs('document.getElementById("greet-preview").textContent')).includes('শুভ নববর্ষ'));
  await evalJs('document.querySelector("[data-greet=esho-he-boishakh]").click()');
  await sleep(300);
  check('pick Esho he Boishakh -> preview updates', (await evalJs('document.getElementById("greet-preview").textContent')).includes('এসো হে বৈশাখ'));
  await setVal('g-name', 'Fahad');
  await sleep(300);
  check('name Fahad in preview', (await evalJs('document.getElementById("greet-preview").textContent')).includes('Fahad'));
  await setVal('g-message', 'Have a great year!');
  await sleep(300);
  check('custom message in preview', (await evalJs('document.getElementById("greet-preview").textContent')).includes('Have a great year!'));

  // ---- Persistence across reload ----
  await send('Page.navigate', { url: URL });
  await waitFor(async () => (await evalJs('document.readyState')) === 'complete', 15000, 'reload');
  await sleep(500);
  check('1 plan persists across reload', (await countPlans()) === 1);
  check('menu persists across reload', (await evalJs('(JSON.parse(localStorage.getItem("pohela-boishakh-bd-v1") || "{}").menu || []).length')) === 1);

  // ---- Language toggle ----
  await evalJs('document.getElementById("lang-btn").click()');
  await sleep(300);
  check('BN tagline after toggle', (await evalJs('document.querySelector(".tagline").textContent')).includes('বাংলা নববর্ষ'));
  check('BN countdown days use Bengali digits', /[০-৯]/.test(await evalJs('document.getElementById("cd-days").textContent')));
  check('BN plan title shown', (await evalJs('document.getElementById("plan-list").textContent')).includes('Mangal Shobhajatra'));
  await evalJs('document.getElementById("lang-btn").click()');
  await sleep(300);
  check('back to EN tagline', (await evalJs('document.querySelector(".tagline").textContent')).includes('Bengali New Year'));

  // ---- Data tab: erase flow ----
  await clickTab('data');
  check('export button present', (await evalJs('!!document.getElementById("export-btn")')) === true);
  await setVal('erase-input', 'nope');
  await evalJs('document.getElementById("erase-btn").click()');
  await sleep(300);
  check('wrong erase word keeps data', (await countPlans()) === 1);
  await setVal('erase-input', 'DELETE');
  await evalJs('document.getElementById("erase-btn").click()');
  await sleep(300);
  check('DELETE erases all plans', (await countPlans()) === 0);
  check('DELETE erases menu too', (await evalJs('(JSON.parse(localStorage.getItem("pohela-boishakh-bd-v1") || "{}").menu || []).length')) === 0);
  await clickTab('plan');
  check('plan empty again', (await evalJs('document.getElementById("plan-empty").textContent')).includes('No plans yet'));

  // ---- Layout / errors ----
  const overflow = await evalJs('document.documentElement.scrollWidth - document.documentElement.clientWidth');
  check('no horizontal overflow', overflow === 0, 'overflow=' + overflow);
  check('no console errors during whole run', consoleErrors.length === 0, consoleErrors.join(' | '));
  check('no failed requests during whole run', failedReqs.length === 0, failedReqs.join(' | '));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ROOT, 'tests', `smoke-${WIDTH}.png`), Buffer.from(shot.result.data, 'base64'));
  console.log(`screenshot saved: tests/smoke-${WIDTH}.png`);
} catch (e) {
  console.log('  FAIL smoke harness error :: ' + (e && e.message ? e.message : e));
  fail++;
} finally {
  try { if (ws) ws.close(); } catch { /* ignore */ }
  chrome.kill();
}

console.log(`\nsmoke @ ${WIDTH}: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
