# Pohela Boishakh BD

Offline bilingual (English / বাংলা) Pohela Boishakh guide and celebration planner for Bangladesh — a free, fully offline web app. Counts down to the Bengali New Year (14 April), explains the day's traditions, and helps you plan your celebration: a day plan, a preparation checklist, a Boishakhi food menu, and greeting cards to copy and send.

Factory run **#443** (15:00 slot, 2026-11-25).

## Problem

Pohela Boishakh (14 April) is Bangladesh's biggest cultural festival — Mangal Shobhajatra, panta-ilish, fairs, new clothes — but the knowledge lives scattered across articles and memory. There is no single offline place to learn the traditions, count down to the day, and plan your own celebration in both English and Bangla.

## Features

- **Live countdown** to the next Pohela Boishakh (14 April) with the Bengali year (Gregorian year − 593; 14 April 2026 = 1 Boishakh 1433), ticking every second, plus a "Shubho Noboborsho!" banner on the day itself.
- **Traditions guide** — 10 traditions (Mangal Shobhajatra, Panta-Ilish, Halkhata, Boishakhi Mela, Alpana, new clothes, Boishakhi songs, bhorta, pitha, family visits) with English + Bengali names, search, and category filters.
- **My Plan** — plan your 14 April: add timed items (title, time, place, notes) with validation, sorted by time; delete anytime.
- **Preparation checklist** — 10 default tasks (new clothes, soak rice, buy ilish, alpana colours, mela plan, call elders…) with progress bar, plus your own custom tasks.
- **Food & Menu** — 10 Boishakhi dishes (panta bhat, ilish bhaja, 4 bhortas, chitoi pitha, patishapta, narkel naru, mishti doi) with ingredients; search + kind filter; build and save "My Boishakh menu".
- **Greeting cards** — 8 greetings (শুভ নববর্ষ, এসো হে বৈশাখ…), add your name and a message, live preview, one-tap copy.
- **Bilingual throughout** — EN/বাংলা toggle persisted, Bengali digits in Bengali mode, 390px mobile layout.
- **Your data stays yours** — everything in localStorage; JSON export / strict import / typed-DELETE erase-all. Zero network requests.

## Stack

- Plain HTML + CSS + JavaScript (no build step, no dependencies, no external assets)
- Node.js (tests only) + headless Chromium (smoke tests only)

## Prerequisites

- Any modern browser (Chrome, Firefox, Safari, Edge) — just open `index.html`.
- Node.js 18+ only if you want to run the tests.

## Install & run

```bash
# No install step. Open the app:
open index.html        # macOS
xdg-open index.html    # Linux
# …or serve it:
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Dev commands

```bash
node tests/test.js          # unit tests (logic + data)
node tests/smoke.mjs 1280   # headless-Chrome smoke test, desktop
node tests/smoke.mjs 390    # headless-Chrome smoke test, mobile
```

## Environment

No environment variables, no API keys, no backend. Fully offline.

## Testing

- **Unit:** `node tests/test.js` — **87/87 passed** (data integrity, next-Boishakh dates, countdown math, tradition-of-the-day rotation, filters, plan/greeting validation, greeting text, stats, import validation, Bengali digits).
- **Smoke (headless Chrome, raw CDP, file://):** `node tests/smoke.mjs` — **49/49 passed at 1280px and 49/49 at 390px** (countdown + tradition of the day, filters, plan add/validation, checklist toggle + custom task, menu add/remove, greeting picker + preview, persistence across reload, EN↔BN toggle with Bengali digits, erase flow, no horizontal overflow, 0 console/page errors, 0 failed requests).
- **Hand-verified:** countdown target 2027-04-14 / Bengali year 1434; tradition of the day on 2026-11-25 is Visiting Family (day 329 % 10 = 9); search "মেলা" → 1 tradition, "bhorta" → 4 dishes; plan "Mangal Shobhajatra 07:00, DU Fine Arts" saved and persisted; checklist 1/10 → 1/11 after adding a custom task; greeting "Esho he Boishakh" preview with name "Fahad" and custom message.
- **Repairs:** 1 real app bug (data.js and logic.js both declared top-level `const api` in classic scripts, so logic.js failed to load — renamed to `BoishakhDataApi` / `BoishakhLogicApi`, re-ran 49/49); 1 smoke-harness fix (plan counter returned −1 when localStorage had no key yet — now counts 0).

## Deployment

Static site — any static host works. GitHub Pages: push to `main`, enable Pages (branch `main`, folder `/`).

## Limitations

- Tradition and food notes are general cultural knowledge, not an official source — check local announcements for procession times and fair schedules.
- The countdown counts to local midnight on 14 April; it does not track live event schedules.
- Greeting copy uses the Clipboard API with a manual fallback; very old browsers need manual selection.
- Data lives in one browser's localStorage — no sync across devices.

## Status

Complete MVP, tested, ready to publish. Public repo + GitHub Pages per the user's standing instruction (every finished factory project gets a public repo + live Pages site).
