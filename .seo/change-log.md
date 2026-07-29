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

## 2026-07-22 — 404 recovery and interaction accessibility

- Before state: no custom GitHub Pages 404; closed mobile navigation remained focusable; the certificate viewer lacked dialog state, keyboard opening and focus return; certificate copy asserted unverified continuing/international education.
- URLs/templates changed: new `/404.html`, all three primary pages, shared JavaScript, validator and `.seo/` controls.
- Change: added a noindex recovery page with canonical navigation and phone actions; added menu `aria-controls`, hidden/inert state, labelled modal semantics, keyboard activation and focus restoration; neutralized the unsupported certificate claim; bumped shared CSS/JavaScript cache keys.
- Page-map decision: future therapy, hygiene and prosthodontics pages are explicitly deferred until distinct first-party evidence and medical review exist; no thin/doorway pages were created.
- Performance evidence: public PageSpeed API returned `429`, so no score was invented; post-deploy lab and available field validation remain blocked.
- Validation: SEO/event tests and JavaScript syntax pass; local mobile browser confirms menu state transitions, zero overflow and a visible 404 call CTA. Python's local server does not emulate GitHub Pages custom-404 routing, so the template was tested directly and hosted routing remains post-deploy verification.
- Commit or pull request: `agent/seo-foundation` draft PR #1; no deployment performed.

## 2026-07-22 — Permanent-domain production launch

- Authorization: the owner explicitly approved GitHub Pages, merge and deployment.
- GitHub state: PR #1 was marked ready and merged to `main`; merge commit `efe5a0b072c03988addfc5c0f163d4eaaf807b2c`.
- Live responses: `/`, `/ortodontiya.html`, `/price.html`, `/robots.txt` and `/sitemap.xml` return `200` on `https://status-dent.zp.ua`.
- Redirects: HTTP and `https://optidigitalagent.github.io/status1/` redirect to the permanent HTTPS apex.
- Canonical/index controls: three self-canonicals match the three sitemap URLs; OAI-SearchBot is allowed; the sitemap directive resolves.
- Structured data: five live JSON-LD blocks across the three indexable pages parse successfully and use the permanent domain.
- Error handling: a nonexistent URL returns HTTP `404`; the custom recovery page includes `noindex,follow` and working phone actions.
- Conversion: crawlable phone actions are live; no unverified form-success behavior or Telegram secret was deployed.
- Remaining dependencies: Search Console/GA4/GBP access, sitemap submission permission, field/lab CWV evidence, medical review, clinic evidence, Telegram relay, GPTBot policy and Russian-language architecture.
- Evidence time: 2026-07-22 11:38 Europe/Kyiv; public HTTP responses and deployed HTML, robots and sitemap.

## 2026-07-28 — Confirmed brand, hours and clinic team

- Evidence: owner-provided brief confirmed the public brand `Status`, Sunday closure, adult and child acceptance, three staff roles and the existing team-photo identities; exact names and image mappings were corroborated in repository history at commit `c0e5ccf`.
- URLs/templates changed: `/`, `/ortodontiya.html`, `/price.html`, `/404.html`, `/sitemap.xml`, shared CSS and current `.seo/` controls; no new page, image, price or external-account change.
- Change: normalized public brand casing, removed Sunday-by-appointment wording, restored three verified team cards, added three matching `Person` employees and postal code to Dentist JSON-LD, added the orthodontist-reference block and team anchor link, clarified the price-page H1 and updated sitemap dates.
- Safety: no experience, education, credentials, awards, licenses, outcomes or new medical claims were added; legacy role text was not reused; GBP, DNS, Search Console, `main` and production were untouched.
- Expected effect: stronger local-entity consistency, clearer team evidence and a more useful orthodontics-to-team path without changing canonical architecture or prices.
- Control-file safeguard: the three future therapy, hygiene and prosthodontics pages remain `defer`; publication is blocked until the required evidence, qualified medical review and separate owner approval are available. This PR creates no new service pages.
- Acceptance tests: static SEO validation, JSON-LD/XML parsing, page-map validation, link/fragment checks, JavaScript syntax, desktop/mobile rendering at 360/768/1440 px, menu interaction, overflow check and `git diff --check`.
- Commit or pull request: `seo/status-facts-and-team`; exact commit SHAs and draft PR URL are recorded in the handoff.

## 2026-07-28 — Embed-safe map and owner-approved case gallery

- Baseline and evidence: production `main` at `28f51d43f3f26e3bb2e943428a0f2a70936c6653`; the homepage map used a normal `ll/mapclient/cid` Maps document URL that browsers block in an iframe; the supplied `status_cases_manifest.json` contains 13 case groups and 26 owner-approved `qofhq8xa` Cloudinary image URLs.
- URLs/templates changed: homepage `/`, shared CSS/JavaScript, static SEO validation and current `.seo/` controls; canonical URL architecture is unchanged and no new indexable page is created.
- Change: replaced the blocked map source with Google's final exact-coordinate `/maps/embed` response while preserving lazy loading, fullscreen permission, strict-origin referrer policy and the CID directions fallback. Added two grouped case ribbons, neutral `До` / `Проміжний етап` / `Після` labels, lazy images, keyboard/fullscreen modal behavior, focus return, reduced-motion support and pause on hover/focus/touch.
- Evidence boundary: the owner-approved asset manifest establishes the allowed display URLs, not clinical provenance. The section includes the required individual-result/visualization disclosure and does not name treatment, doctor, duration, diagnosis, guarantee or clinical outcome. Treatment ownership and patient consent remain unresolved before any real-patient-outcome attribution.
- SEO and safety: no Review, AggregateRating or MedicalCase schema is added; canonical and sitemap URL inventory remain unchanged; only the homepage `lastmod` is eligible for the substantive change and already carries the actual 2026-07-28 date.
- Expected effect: restore a useful proof-oriented browsing section and working directions experience without creating a duplicate landing page or unsupported medical claim.
- Acceptance tests: 13 unique case IDs, manifest URL and image decode checks, no bella-dent URL, rendered iframe/header checks, keyboard/modal/focus tests, reduced-motion and pause checks, one H1, canonical/sitemap/JSON-LD/link/fragment/conversion checks, JavaScript syntax, mobile/desktop overflow QA, performance smoke check and `git diff --check`.
- Validation result: all 26 manifest URLs returned `200 image/jpeg` and non-empty bodies; browser decoding passed for all 26. The final Google `/maps/embed` URL returned `200` without `X-Frame-Options`, rendered the coordinate pin on localhost at 360/768/1440 px and the CID fallback link returned `200` as a normal top-level destination.
- Render/accessibility result: Playwright found 13 original interactive case cards, no page errors and no horizontal overflow (`scrollWidth` exactly 360/768/1440); Enter opened the modal, Escape/close worked and focus returned; hover/focus/touch pause and reduced motion passed. Lighthouse no longer reports the case cards in ARIA-role or accessible-name failures; the remaining accessibility findings are pre-existing contrast, heading-order and target-size issues outside this batch.
- Performance evidence: before scrolling, Chrome requested `0/26` case images at all three tested viewport widths; all images loaded and decoded on demand. Local mobile Lighthouse lab output was performance 87, accessibility 91, FCP 1.8 s, LCP 2.6 s, TBT 380 ms, CLS 0.001 and 0 case-image requests; total initial page weight was 5,578 KiB from the broader existing page. Treat these as local lab diagnostics, not field data. Lighthouse wrote valid reports but its Windows CLI exited non-zero during temporary Chrome-profile cleanup (`EPERM`) after the audits completed.
- Commit or pull request: implementation commit `e96d3fd3b00be10f8a51e370b231cb30530f467a` on `fix/maps-and-cases`; [draft PR #4](https://github.com/optidigitalagent/status1/pull/4); merge and deployment intentionally not performed.
- Observation window: visual/performance regression review in the draft PR; directions and case engagement only after an authorized deployment and approved measurement connection.

## 2026-07-28 — Case evidence clarification and modal focus containment

- Baseline and evidence: the 13 owner-approved case groups retained their 26 exact `qofhq8xa` manifest URLs, but clinical provenance, treatment ownership and patient consent remain unverified; the modal supported keyboard opening, Escape and focus return but did not contain Tab navigation.
- URLs/templates changed: homepage `/`, shared JavaScript and the minimum matching `.seo/` controls; no map, image URL, case group, canonical, sitemap or structured-data change.
- Change: labelled the section `Демонстраційна візуалізація`, replaced the disclosure with `Демонстраційні візуалізації. Зображення не підтверджені як результати лікування конкретних пацієнтів і не гарантують аналогічного результату.`, added explicit accessible names to all 13 case cards and contained Tab/Shift+Tab inside the open case modal with one stable guarded listener.
- Evidence boundary: the gallery is not presented as proof of treatment results for specific patients. No clinical provenance, treatment ownership, patient consent, treatment, diagnosis, duration, guarantee or doctor attribution is asserted.
- Expected effect: clearer YMYL evidence boundaries and complete keyboard containment without changing the gallery inventory or search architecture.
- Acceptance tests: 13 case IDs and accessible names, 26 exact manifest URLs, map/fallback preservation, Enter/Space/Escape/Tab/Shift+Tab/focus-return behavior, reduced motion, pause behavior, deferred case requests, 360/768/1440 visual and overflow QA, H1/JSON-LD/canonical/sitemap checks, JavaScript syntax, conversion tests, SEO validation and `git diff --check`.
- Commit or pull request: `fix/maps-and-cases` draft PR #4; merge and deployment intentionally not performed.

## 2026-07-29 — Grouped case-gallery visual restoration

- Scope: visual-only follow-up on the merged 13-case gallery; no service, doctor, price, contact, map, canonical, sitemap, JSON-LD or Cloudinary URL change.
- Change: restored flex-sized case cards with touching 400×280 desktop panels and 280×200 mobile panels, 16 px between separate cards, `object-fit: cover` previews and proportional two-/three-panel widths for the ready case-03/04/05 collages.
- Modal: kept full uncropped `object-fit: contain` images in one desktop row, stacked full-width images on mobile, scroll locking, keyboard/focus behavior and a fixed mobile close control; reset modal scroll position on every open.
- Evidence boundary: retained all 13 IDs, 26 approved `qofhq8xa` URLs, neutral labels, disclosure, deferred loading and the demonstration-visualization label; no clinical attribution or unsupported schema was added.
- Cache keys: `status.css?v=14`, `status.js?v=12`; `conversion-tracking.js?v=1` unchanged.
- Validation: SEO, JavaScript syntax, conversion tracking, JSON-LD, sitemap, link/fragment and diff checks passed; Playwright passed at 360×900, 768×1000 and 1440×1000 with zero page overflow, vertical and horizontal touch movement, 0/26 pre-section requests and 26/26 requested and decoded after gallery traversal.
- Commit or pull request: implementation commit `662e569ae93fa53de94e72479072c84d8aeffe81` on `fix/case-gallery-original-layout`; [draft PR #5](https://github.com/optidigitalagent/status1/pull/5); merge and deployment intentionally not performed.

## 2026-07-29 — Approved 28-asset Status gallery replacement

- Baseline and evidence: the user-supplied `status-cases-upload-manifest.json` contains 13 case groups and 28 PNG assets for Cloudinary `qofhq8xa`; all 28 local files were present and decoded before upload. The signed upload result matched every manifest public ID, and all 28 website URLs independently returned HTTP `200` and decoded as images.
- URLs/templates changed: homepage `/`, static SEO validation and the minimum matching backlog and evidence-register controls; no canonical, sitemap, map, contact, price, doctor, service, JSON-LD or conversion change.
- Change: replaced the prior 26 gallery URLs with the exact 28 `status/cases/case-XX/<phase>` assets. `case-03`, `case-04` and `case-05` now use ordinary separate before/after panels with no `data-composite`; only `case-02` and `case-06` contain a separate intermediate panel.
- Layout and evidence boundary: preserved the PR #5 ribbon/card dimensions, one-row desktop/tablet modal, vertical mobile modal, keyboard/focus behavior, neutral labels, demonstration label and exact unverified-provenance disclosure. No diagnosis, procedure, doctor attribution, guarantee, Review, AggregateRating or MedicalCase data was added.
- Validation: the SEO validator, JavaScript syntax, conversion-event contract and diff checks passed. Headless Chrome passed at 360×900, 768×1000 and 1440×1000 with 13 cards, 28/28 requested and decoded images after gallery traversal, 0 case requests before the section, no page/modal horizontal overflow, separate pairs for `case-03/04/05`, intermediate panels only for `case-02/06`, a vertical mobile modal, one-row tablet/desktop modal, contained Tab navigation, Escape close and focus return.
- Commit or pull request: `agent/cloudinary-case-assets`; Draft PR, merge and deployment intentionally remain separate steps.

## 2026-07-29 — Google Sheets price-feed implementation draft

- Baseline and evidence: current `origin/main` was `4c6ad156f2e0e9489372b57968b2d3679e89a214`; all prior PRs #1–#6 were merged and no PR was open. A read-only connected-Sheets check confirmed the workbook `Status — прайс для сайта`, the `Інструкція` tab plus seven allowlisted category tabs, exact A:C headers and the confirmed `17 000 грн` orthodontic source value.
- URLs/templates changed: `/price.html`, new `/price-loader.js`, new Apps Script source and setup documentation, price-feed tests, the shared static validator and the minimum matching `.seo/` controls. No CSS, sitemap, robots, title, description, canonical, JSON-LD, navigation, footer, contact or other-page change was made.
- Change: added the requested `Google Sheets → Apps Script Web App → JSON → price-loader.js → price.html` architecture. The loader requires schema version 1 and all seven fixed categories, rejects unknown/missing/oversized/markup-like data, builds rows only with `createElement`, `textContent`, `append` and `replaceChildren`, uses a 7-second abort timeout and no-store cache busting, and replaces no visible row until the full payload and DOM targets pass.
- Fallback and price integrity: the complete current HTML price remains immediately visible and unchanged on HTTP, timeout, network, JSON, schema, category, service or endpoint failure. The separate orthodontic note no longer duplicates the numeric price, so a future Sheet change cannot leave a stale second value; the confirmed static `17 000 грн` source row remains.
- Apps Script boundary: `Code.gs` reads only the seven allowlisted tabs, ignores empty/incomplete rows, preserves row order and existing IDs, assigns a UUID-based stable ID to a completed new row, validates headers, protects headers and column A, and hides column A without deleting data. The live Web App was not created or deployed and the existing Sheet was not edited.
- Automated validation: 19 Node tests passed across loader and Apps Script mocks, covering valid loading, all categories, names, prices, add/delete/reorder, empty and incomplete rows, empty categories, invalid value types, unknown/missing categories, malformed JSON, schema mismatch, HTTP/network/timeout failure, missing endpoint, long values, safe XSS text construction, static fallback preservation, allowlisted output, stable ID creation and setup protection. JavaScript and Apps Script syntax, conversion-event contract, SEO/HTML/JSON-LD/canonical/H1/link/fragment/local-resource checks and `git diff --check` passed.
- Render validation: local headless Chromium returned HTTP 200 at 360×1000, 768×1000 and 1440×1000. Page `scrollWidth` equalled viewport width at all sizes; fallback counts were 2/3/3/4/9/3/2, all seven quick anchors resolved, one H1 and one loader were present, phones/address/Instagram remained visible, and no page error occurred. A 300-character dynamic name and an empty category also produced no horizontal overflow.
- Blocker: the owner must paste `Code.gs` into the bound Apps Script project, run `setupStatusPriceSheet`, deploy an anonymous `/exec` Web App, verify the JSON, and replace the single `PRICE_API_URL` placeholder. Merge and GitHub Pages deployment remain separate unauthorized actions.
- Commit or pull request: implementation commit `03df563e8c721975b5703e3da024afc58a5aa620` on `feat/google-sheets-price`; [draft PR #7](https://github.com/optidigitalagent/status1/pull/7). Merge and deployment intentionally not performed.
