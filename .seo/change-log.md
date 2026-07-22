# SEO change log

Record one entry per implementation batch.

## 2026-07-22 — Initial orthodontics SEO foundation

- Baseline and evidence: two original HTML pages, no dedicated orthodontics page, no robots.txt or JSON-LD; live Zaporizhzhia SERP sample showed dedicated service pages among competitors
- URLs/templates changed: `/`, `/price.html`, new `/ortodontiya.html`, `/robots.txt`, `/sitemap.xml`, shared CSS and `.seo/` controls
- Expected effect: clearer clinic entity, stronger orthodontic relevance, better crawl and AI-search extractability
- Risks and dependencies: final medical and price review; live DNS/HTTPS verification; no real form endpoint yet
- Acceptance tests: static scan, local-link resolution, JSON-LD parsing, JS syntax and page-map validation
- Validation result: static checks passed; live canonical, redirects and sitemap responses remain pending until deployment
- Commit or pull request: `agent/seo-foundation` draft PR
- Observation window: begins after merge, Search Console verification and indexation

## 2026-07-22 — Owner fact confirmation

- Confirmed permanent domain: `status-dent.zp.ua`
- Confirmed price: metal ligature braces, one jaw — 17,000 UAH
- Confirmed local entity: Google Maps CID `11625904097192140703`, coordinates 47.827689, 35.161495
- Conversion plan: forms will later deliver to Telegram through a secure server-side endpoint; no destination exists yet
- Implementation: added `hasMap`, `GeoCoordinates`, exact map embed/link and updated project controls

## 2026-07-22 — ChatGPT Project handoff

- Added `.seo/CHATGPT_PROJECT_START.md` with the complete client brief, confirmed facts, current PR state, blockers and continuation prompt
- Purpose: start the dedicated `SEO — STATUS` ChatGPT Project without repeating discovery or mixing another client's context
- Added root `AGENTS.md` so Codex automatically loads durable STATUS SEO guidance without a long first prompt

## 2026-07-22 — Honest booking fallback before relay integration

- Before state: the home and price forms displayed a successful-submission message entirely in browser JavaScript, although no delivery endpoint existed
- URLs/templates changed: `/`, `/price.html`, shared JavaScript and CSS
- Change: replaced the non-functional forms with explicit telephone booking actions and removed the client-only false-success handler
- Reason: prevent lost leads and avoid claiming delivery that no server confirmed while the secure Telegram relay remains blocked
- Expected effect: an honest, immediately usable primary conversion path; server-backed online forms remain a separate blocked task
- Acceptance tests: both pages expose the two confirmed `tel:` links; no local form IDs or success copy remain; JavaScript syntax and static HTML checks pass
- Commit or pull request: `agent/seo-foundation` draft PR #1
