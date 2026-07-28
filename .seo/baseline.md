# Status SEO baseline

Baseline date: 2026-07-19; network re-check: 2026-07-22 (Asia/Hebron)
Market: Zaporizhzhia, Ukraine
Primary language: Ukrainian
Deployment observed: custom-domain GitHub Pages production with PR #1 and PR #2 merged on 2026-07-22
Implementation state: the verified SEO foundation is live; `seo/status-facts-and-team` is a separate undeployed review branch

## Business facts used

- Public name: Status
- Category: dental clinic
- Address: вул. Поштова, 161/36, Запоріжжя
- Phones: +38 (098) 318-12-62, +38 (061) 787-55-11
- Hours: Monday–Saturday 09:00–19:00; Sunday closed (owner-confirmed 2026-07-28)
- Confirmed orthodontists: Овсій Олена Михайлівна and Андрій Володимирович Лебедєв
- Confirmed dentist/assistant: Щупак Світлана Петрівна
- Confirmed orthodontic offer is limited to the current published price list.
- Confirmed 2026-07-22: metal ligature braces cost 17,000 UAH per jaw.
- Confirmed 2026-07-22: Google Maps place CID `11625904097192140703`, coordinates 47.827689, 35.161495.

## Source and rendered-site baseline

- Existing indexable HTML pages before work: `index.html`, `price.html`
- Dedicated orthodontics page before work: none
- Canonical links before work: absent; configured in the implementation batch for `status-dent.zp.ua`
- XML sitemap before work: absent; configured in the implementation batch for `status-dent.zp.ua`
- robots.txt: absent before work
- JSON-LD blocks: absent before work
- Main-page H1 count: 1
- Main-page images: 46; missing alt attributes: 0
- Price-page H1 count: 1
- Broken local links found by the static scanner: 0
- Form submission endpoint: not present; on 2026-07-22 the non-functional forms and client-only success message were removed and replaced with confirmed telephone booking actions until a secure relay is available

## Public response baseline — 2026-07-22

- DNS A records resolve `status-dent.zp.ua` to GitHub Pages (`185.199.108.153`–`185.199.111.153`).
- `http://status-dent.zp.ua/` returns `301` to `https://status-dent.zp.ua/`.
- `https://status-dent.zp.ua/` and `/price.html` return `200`.
- The legacy project URL redirects to the permanent domain.
- `/robots.txt`, `/sitemap.xml` and `/ortodontiya.html` return `200` on production; a nonexistent URL returns the custom `404` response.
- Homepage internal links, page-specific self-canonicals, 1200×630 social-preview metadata, WebSite entity markup and visible/structured breadcrumbs were verified after deployment; see `.seo/post-deploy-2026-07-22.md`.

## Evidence-safety baseline — 2026-07-22

- The draft contained treatment-case images loaded from a `bella-dent` Cloudinary path, with no Status ownership or patient-consent evidence.
- Three visible testimonials had no source URL or provenance record.
- The home page contained unsupported claims about 15+ years of practice, zero pain, equipment, protocols and team experience.
- The orthodontics page published a named doctor role before credentials and medical review were supplied.
- These elements were removed or replaced with confirmed contact, price-list and location facts. `.seo/evidence-register.csv` now records claim-level source and verification state.

## Local and AI-discovery baseline — 2026-07-22

- Public citation samples corroborate the address and both phone numbers.
- Misto lists Sunday as closed, and the owner confirmed Sunday closure for the website on 2026-07-28; this branch does not change Google Business Profile.
- A historic Pokupon listing references `www.s-status.com`; correction requires platform ownership/permission and must not revive expired offers.
- No evidence supports a second location or doorway-style city pages; the homepage remains the sole Zaporizhzhia location target.
- Draft `robots.txt` explicitly allows OAI-SearchBot. GPTBot inherits the wildcard rule, and the separate training preference is undecided.
- Production `robots.txt` returns `200` and explicitly allows OAI-SearchBot; GPTBot preference remains a separate undecided policy item.

## Conversion measurement readiness — 2026-07-22

- Confirmed phone links were already present across the three pages; no analytics library or verified call outcome source was available.
- The draft now includes one persistent mobile phone CTA per page and a single privacy-safe intent-event contract for phone, directions and Instagram clicks.
- The source dispatches a local custom event and pushes to `window.dataLayer` only if an approved analytics implementation creates it; the draft itself transmits nothing and stores no PII.
- Connected/qualified calls, GBP actions, analytics outcomes and form delivery remain unavailable until the relevant access/integration is supplied; Search Console is connected but no performance export is stored in the repository.

## Recovery, accessibility and performance baseline — 2026-07-22

- The repository previously had no custom `404.html`; invalid GitHub Pages paths would use the host default and lose clinic navigation/call context.
- A custom `noindex,follow` 404 template now links to the canonical home, orthodontics and price pages and retains confirmed phone actions without entering the sitemap.
- Mobile navigation now exposes expanded/hidden state and is inert while closed. Certificate images are keyboard operable and the labelled modal returns focus.
- The certificate gallery no longer claims recurring training or international attendance; asset ownership/current relevance remains a clinic confirmation item.
- A public PageSpeed Insights API attempt for the current pre-PR production home returned HTTP `429`; no lab or field score is recorded. The PR requires post-deploy lab checks and field data when available.

## SERP sample

Sampled on 2026-07-19 for Ukrainian and Russian orthodontic queries in Zaporizhzhia. Organic competitors included ABG, Smart Clinic, Studio Smile, Vidnova Dental, Dental Studio, Chertov Clinic and Happy Dental. The common winning page pattern was a dedicated orthodontics or braces landing page with service detail, doctor information, prices, process and cases.

No proprietary search-volume, CPC, keyword-difficulty, backlink or rank-history data was available. No numeric estimates are used.

## Initial priority

1. Build one evidence-based orthodontics landing page without claiming unconfirmed services.
2. Improve home-page entity and orthodontic relevance.
3. Add crawl and AI-search access controls.
4. Verify DNS, HTTPS, canonical URLs and sitemap on the confirmed permanent domain `status-dent.zp.ua`.
5. Verify business facts, Google Business Profile, orthodontic offer, cases and reviews before expanding content.
