# Permanent-domain SEO launch checklist

The owner confirmed `status-dent.zp.ua` as the permanent apex hostname on 2026-07-22. Source configuration is prepared; network and Search Console checks remain launch tasks.

## Public state observed on 2026-07-22

- DNS resolves the apex to GitHub Pages and HTTP redirects once to HTTPS.
- The legacy `optidigitalagent.github.io/status1/` URL redirects to the apex.
- The current production home and price pages return `200`.
- Draft-PR additions `/robots.txt`, `/sitemap.xml` and `/ortodontiya.html` still return `404`; verify them only after authorized merge/deployment.

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
- Forms create a verified lead or are replaced by honest phone/booking actions.
- Search Console URL Inspection sees the same meaningful text as users.
