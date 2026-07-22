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

## 2026-07-22 — YMYL evidence and citation-readiness safeguard

- Before state: the draft loaded treatment-case images from a foreign `bella-dent` asset path, displayed testimonials without provenance, and used unsupported experience, pain, equipment, protocol and doctor-credential claims.
- URLs/templates changed: `/`, `/ortodontiya.html`, `/price.html`, shared JavaScript and `.seo/` evidence controls.
- Change: removed foreign treatment cases, unverified testimonials and unverified doctor/team claims; replaced absolute promotional claims with confirmed address, phone, hours and price-list facts; removed the stale price-dispute note after the owner-confirmed 17,000 UAH price; added `.seo/evidence-register.csv`.
- Reason: prevent unsupported YMYL assertions from becoming public or machine-readable, improve entity/citation consistency and preserve a precise restoration path when STATUS-owned evidence arrives.
- AI/AEO note: no special AI schema or `llms.txt` was added. Current Google guidance says ordinary crawl/index/content fundamentals apply, and OpenAI documents OAI-SearchBot separately from GPTBot training controls.
- Validation: the static validator now fails on foreign clinic assets, unverified case/review sections and the removed absolute claims; JSON-LD, local links, fragments, metadata, sitemap and JavaScript syntax pass. Local browser checks at 1440×900 and 390×844 found no horizontal overflow, broken images or console errors; all H1s and phone links remained visible.
- Commit or pull request: `agent/seo-foundation` draft PR #1; no external profile, deployment or medical publication action performed.
- Restoration dependency: STATUS-owned cases with treatment ownership and patient consent; source URLs for eligible reviews; clinic-approved biographies/credentials; qualified medical review.

## 2026-07-22 — Local entity and AI-discovery control baseline

- Public evidence: sampled Misto, Medinfo, Top20 and Pokupon listings plus direct DNS/HTTP responses; address and phones corroborate, while Sunday hours and a legacy `s-status.com` citation conflict with the desired permanent-domain entity.
- Artifacts changed: `.seo/local-audit-2026-07-22.md`, `.seo/ai-discovery-baseline.md`, backlog, page map, baseline and evidence register.
- Decision: retain one homepage for the one confirmed Zaporizhzhia location and one consolidated orthodontics page; do not create doorway locations or a separate Russian page without an architecture/content decision.
- AI controls: retain explicit OAI-SearchBot access in the draft, leave GPTBot unchanged pending clinic policy, document ChatGPT referral segmentation and reject special AI schema/`llms.txt` claims.
- External-action boundary: no GBP, directory, GSC, analytics, sitemap-submission or AI-account changes were made.
- Validation: source URLs and discrepancies recorded with retrieval date; NAP values compared against the website and claim registry.
- Commit or pull request: `agent/seo-foundation` draft PR #1.

## 2026-07-22 — Phone-conversion and measurement preparation

- Before state: phone links worked, but mobile users had no persistent call action and no approved event contract existed; analytics, telephony and CRM access were absent.
- URLs/templates changed: all three pages, shared CSS/JavaScript, validator, backlog, page map, baseline and measurement plan.
- Change: added one mobile sticky call CTA per page and a privacy-safe `status_conversion_intent` event dictionary for phone, directions and Instagram clicks. Rebuilt the measurement plan around qualified calls, leading indicators, segments, windows, alerts and decision rules.
- Privacy boundary: the source does not load analytics, create cookies or transmit data. It pushes only to an already-approved `window.dataLayer` and excludes user-entered or medical data.
- Attribution boundary: a phone click is an intent event, not a connected or qualified call; form success remains server-confirmed only.
- Validation: pure event-contract tests passed for phone, directions and Instagram payloads; JavaScript syntax and the full SEO validator passed. Local browser checks at 390×844 confirmed the fixed call bar on all three pages with no horizontal overflow, broken images or console warnings/errors.
- Commit or pull request: `agent/seo-foundation` draft PR #1; GA4/GSC/GBP and external accounts untouched.
