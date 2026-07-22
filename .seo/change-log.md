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

## 2026-07-22 — Zaporizhzhia search-demand and page-map consolidation

- Baseline and evidence: current public web-search sample for the seven requested Ukrainian and Russian queries; no GSC, analytics or proprietary keyword-volume provider was available, so numeric volume, difficulty and rankings remain blank
- Research artifact: `.seo/search-demand-zaporizhzhia-2026-07-22.md` separates languages, intent, journey, competitors, content gaps and the keyword-to-page map with source URLs and limitations
- URLs/templates changed: `/ortodontiya.html` metadata, Service `serviceType`, hero copy and treatment-options heading; `.seo/backlog.csv` and `.seo/page-map.csv`
- Architecture decision: consolidated `ортодонт`, `брекети`, `вирівнювання зубів` and `виправлення прикусу` on the existing Ukrainian orthodontics page and removed the proposed duplicate `/brekety-zaporizhzhya/` from the page map
- Russian-language decision: recorded demand separately but did not create mixed-language copy, an isolated Russian page or a second-language site without an architecture decision
- Safety: no new medical outcomes, credentials, reviews, cases, unverified prices or competitor claims were added; GBP, GSC, GA4, merge and deployment were untouched
- Expected effect: clearer alignment between the existing orthodontics page and the overlapping local commercial query cluster, with lower cannibalization risk
- Acceptance tests: page-map validator, HTML metadata/H1/links/JSON-LD scan, sitemap XML parse, JavaScript syntax, `git diff --check` and final diff review
- Commit or pull request: `agent/seo-foundation` draft PR #1
- Review window: 8–12 weeks after deployment and indexation, or sooner when verified Search Console or keyword-provider data becomes available

## 2026-07-22 — Canonical, entity and social-preview hardening

- Baseline: the permanent domain resolves to GitHub Pages; HTTP redirects to HTTPS; the home and price pages return `200`, while the undeployed draft-PR assets `/robots.txt`, `/sitemap.xml` and `/ortodontiya.html` return `404`.
- URLs/templates changed: `/`, `/ortodontiya.html`, `/price.html`, `.seo/backlog.csv`, `.seo/page-map.csv`, `.seo/baseline.md` and `.seo/launch-checklist.md`.
- Change: replaced internal `/index.html` targets with the canonical root, added complete 1200×630 Open Graph image metadata, upgraded large-card previews, added WebSite identity markup, visible/structured breadcrumbs, explicit logo dimensions and a clean Google Maps CID URL.
- Reason: make canonical signals agree, reduce duplicate-homepage hints, improve crawlable hierarchy, stabilize logo layout and make the clinic entity/social previews easier to interpret without adding medical claims.
- Source check: current Google canonical, breadcrumb, LocalBusiness and AI-feature guidance reviewed on 2026-07-22; schema remains limited to visible, confirmed facts.
- Validation: reusable static validator passed for three HTML pages, three unique canonicals, three matching sitemap URLs, JSON-LD parsing, metadata/H1/image-alt checks, fragments and local links; `node --check status.js` and `git diff --check` also passed.
- Commit or pull request: `agent/seo-foundation` draft PR #1; deployment intentionally not performed.
- Review window: response and rich-result checks immediately after an authorized deployment; Search Console observation after indexation.
