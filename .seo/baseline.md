# STATUS SEO baseline

Baseline date: 2026-07-19; network re-check: 2026-07-22 (Asia/Hebron)
Market: Zaporizhzhia, Ukraine
Primary language: Ukrainian
Deployment observed: custom-domain GitHub Pages production plus an unmerged draft-PR implementation
Implementation state: `status-dent.zp.ua` resolves to GitHub Pages and serves the pre-PR production version; the draft PR remains undeployed

## Business facts used

- Public name: STATUS
- Category: dental clinic
- Address: вул. Поштова, 161/36, Запоріжжя
- Phones: +38 (098) 318-12-62, +38 (061) 787-55-11
- Hours: Monday–Saturday 09:00–19:00; Sunday by appointment
- Orthodontist shown on site: Овсій Олена Михайлівна
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
- `/robots.txt`, `/sitemap.xml` and `/ortodontiya.html` return `404` on production because draft PR #1 has not been merged or deployed.
- The implementation now aligns homepage internal links with `/`, adds page-specific self-canonicals, complete 1200×630 social-preview metadata, WebSite entity markup and visible/structured breadcrumbs. Production response validation remains post-deployment work.

## SERP sample

Sampled on 2026-07-19 for Ukrainian and Russian orthodontic queries in Zaporizhzhia. Organic competitors included ABG, Smart Clinic, Studio Smile, Vidnova Dental, Dental Studio, Chertov Clinic and Happy Dental. The common winning page pattern was a dedicated orthodontics or braces landing page with service detail, doctor information, prices, process and cases.

No proprietary search-volume, CPC, keyword-difficulty, backlink or rank-history data was available. No numeric estimates are used.

## Initial priority

1. Build one evidence-based orthodontics landing page without claiming unconfirmed services.
2. Improve home-page entity and orthodontic relevance.
3. Add crawl and AI-search access controls.
4. Verify DNS, HTTPS, canonical URLs and sitemap on the confirmed permanent domain `status-dent.zp.ua`.
5. Verify business facts, Google Business Profile, orthodontic offer, cases and reviews before expanding content.
