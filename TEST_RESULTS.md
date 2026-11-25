# TEST_RESULTS — Pohela Boishakh BD (factory run #446, 15:00 slot, 2026-11-25)

## Unit tests — `node tests/test.js`
**87 passed, 0 failed** (run 2026-11-25 ~15:10 +06).

Coverage: data integrity (10 traditions / 10 foods / 8 greetings / 10 checklist items, unique ids, known categories/kinds); next-Boishakh dates (2026-11-25 → 2027-04-14/1434; on 2026-04-14 is today/1433; day before/after boundaries; 2027-04-14 is today/1434); countdown math at fixed "now" values (1 day out, noon, 30 s before, past/at target = zeros); dayOfYear (2026-11-25 = 329, 2026-04-14 = 104); tradition of the day (2026-11-25 = family-visits, 2026-04-14 = alpana, 2026-01-01 = panta-ilish); filters (food cat → 3, মেলা → 1, bhorta → 4, ভর্তা → 4, no match → 0); time validation; plan validation (good, empty title, 81-char title, bad time, 81-char place, 201-char notes); greeting validation + text composition (signoffs EN/BN, custom message, unknown id → ''); stats (2 plans, 3/10 checklist, 30%, menu 2; empty → zeros); import validation (valid, empty object, bad plan, custom checklist without/with text, unknown dish, 51 dishes, non-object); Bengali digits (1433 → ১৪৩৩).

## Smoke tests — `node tests/smoke.mjs` (headless_shell-1187, raw CDP, file://)
**49 passed, 0 failed at 1280×800; 49 passed, 0 failed at 390×844** (run 2026-11-25 ~15:12 +06).

Coverage: title/heading/6 tabs; countdown date line "14 April 2027", days > 100; tradition of the day = Visiting Family; 4 home stats; 0 console errors, 0 failed requests on load; traditions 10 cards, search মেলা → 1, cat food → 3, clear → 10; plan empty-submit title error + adds nothing, add "Mangal Shobhajatra 07:00 DU Fine Arts" → saved + success message; checklist 10 items, 0/10 → tick one → 1/10, custom task "Buy flowers" → 11 items, 1/11; food 10 dishes, search bhorta → 4, kind sweet → 4, add panta-bhat + ilish-bhaja → menu 2, remove panta → 1; greetings default preview শুভ নববর্ষ, pick Esho he Boishakh → preview updates, name Fahad + message in preview; persistence across reload (1 plan, 1 menu item); EN→BN toggle (tagline বাংলা নববর্ষ, Bengali digits in countdown), back to EN; erase wrong word keeps data, DELETE erases plans + menu, plan empty again; no horizontal overflow; 0 console/page errors and 0 failed requests over the whole run. Screenshots: tests/smoke-1280.png, tests/smoke-390.png (both visually verified — clean red/cream layout, no overflow).

## Repairs
1. **Real app bug:** data.js and logic.js both declared top-level `const api` in classic scripts, so the second script threw "Identifier 'api' has already been declared" and the app never booted (first smoke run: 4 passed, 18 failed). Fixed by renaming to `BoishakhDataApi` / `BoishakhLogicApi`; re-ran smoke → 48/49.
2. **Smoke-harness fix:** plan counter returned −1 when localStorage had no key yet (state is only written on first mutation). Changed to count 0 when the key is absent; re-ran → 49/49 at both widths.

## Hand-verified (in smoke + unit values)
- Next Boishakh 2027-04-14, Bengali year 1434 (2026 − 593 = 1433 for 14 Apr 2026).
- Tradition of the day 2026-11-25 = Visiting Family (day 329, 329 % 10 = 9).
- No network requests: pure local files, no external assets.
