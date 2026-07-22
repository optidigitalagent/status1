# Permanent-domain SEO launch checklist

The owner confirmed `status-dent.zp.ua` as the permanent apex hostname on 2026-07-22. PR #1 was merged as `efe5a0b072c03988addfc5c0f163d4eaaf807b2c` and the GitHub Pages deployment was verified on the permanent domain. Search Console, external profiles and field-performance data remain pending.

## Public state observed on 2026-07-22

- DNS resolves the apex to GitHub Pages and HTTP redirects once to HTTPS.
- The legacy `optidigitalagent.github.io/status1/` URL redirects to the apex.
- The production home, `/ortodontiya.html`, `/price.html`, `/robots.txt` and `/sitemap.xml` return `200`.
- HTTP and the legacy `optidigitalagent.github.io/status1/` URL redirect to `https://status-dent.zp.ua/`.
- A nonexistent production URL returns a real `404` and the custom recovery page contains `noindex,follow`.
- All three sitemap URLs return `200`; live canonical URLs and JSON-LD parse successfully.

## Completed launch verification

- [x] Apex DNS and GitHub Pages custom domain resolve correctly.
- [x] HTTPS is canonical and HTTP redirects to HTTPS.
- [x] The legacy GitHub Pages URL redirects to the permanent domain.
- [x] Home, orthodontics and price canonical URLs agree with the sitemap.
- [x] `robots.txt` returns `200`, allows OAI-SearchBot and links the sitemap.
- [x] `sitemap.xml` returns `200` and lists only the three canonical `200` pages.
- [x] Live JSON-LD blocks parse on all three indexable pages.
- [x] Invalid URLs return `404` with the custom noindex recovery page.
- [ ] Verify a Search Console Domain property and submit the sitemap.
- [ ] Measure lab and available field Core Web Vitals after data/tool access.

## Required domain work

- Confirm in DNS and GitHub Pages that the owner-confirmed apex hostname `status-dent.zp.ua` resolves correctly.
- Confirm the repository `CNAME` and GitHub Pages custom-domain setting both use `status-dent.zp.ua`.
- Enforce HTTPS and one host/protocol version.
- Verify the old GitHub Pages URL redirects to the permanent domain.
- Verify the configured absolute self-canonical on every indexable HTML page.
- Add absolute `og:url` and social-preview image URLs.
- Verify the configured stable `url` and `@id` values in Dentist and Service schema.
- Verify `sitemap.xml` contains only canonical 200-status URLs.
- Verify the sitemap directive in `robots.txt` resolves successfully.
- Verify a Search Console Domain property and submit the sitemap.
- Connect the permanent domain to Google Business Profile and consistent public citations.

## Required business verification

- Confirm legal/public clinic name and whether `STATUS` is the exact Google Business Profile name.
- Confirm all opening hours, including Sunday behavior.
- Metal ligature braces confirmed at 17,000 UAH per jaw on 2026-07-22; verify future price changes before publication.
- Confirm whether the clinic offers aligners, retainers and child orthodontics before creating those pages.
- Obtain verified orthodontist biography, education, qualifications and professional review of medical copy.
- Confirm which orthodontic cases have patient consent and who performed each case.
- Confirm the public source of every visible review; do not add review schema until eligibility and provenance are verified.
- Connect a secure server-side Telegram relay for forms; never expose a bot token in GitHub Pages JavaScript. Add analytics events for phone, verified form, directions and Instagram clicks.

## Acceptance tests

- All canonical, sitemap and internal-link URLs agree.
- robots.txt returns 200 and allows Googlebot and OAI-SearchBot.
- Structured data parses and matches visible facts.
- Every sitemap URL returns 200 without a redirect.
- Desktop and mobile navigation reach the orthodontics page, prices and contacts.
- Invalid production URLs render the custom `404.html`, keep it `noindex`, and offer working canonical navigation and phone actions.
- Closed mobile navigation is not focusable; certificate modal is labelled, keyboard operable and returns focus.
- Forms create a verified lead or are replaced by honest phone/booking actions.
- Search Console URL Inspection sees the same meaningful text as users.
