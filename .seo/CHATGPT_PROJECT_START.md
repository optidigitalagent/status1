# Start SEO Project — STATUS

Use SEO Site Operator for this client and continue the existing implementation.

## Project

- Website repository: `optidigitalagent/status1`
- Reusable SEO operator repository: `optidigitalagent/seo-site-operator`
- Permanent domain: `https://status-dent.zp.ua`
- Business: STATUS, dental clinic
- Primary market: Zaporizhzhia, Ukraine
- Primary website language: Ukrainian
- Secondary demand to research: Russian-language searches in Zaporizhzhia; do not create a second-language site without an architecture decision

## Business priority

- Primary direction: orthodontics
- Priority intents: orthodontist in Zaporizhzhia, braces in Zaporizhzhia, bite correction and teeth alignment
- Secondary scope: general dentistry, treatment, professional hygiene, periodontology, prosthodontics and dental surgery where confirmed by the clinic
- Primary conversion now: phone call
- Planned conversion later: website form delivered to Telegram through a secure server-side relay
- Never expose a Telegram bot token in browser JavaScript, chat output or version control

## Confirmed public facts

- Public business name: STATUS
- Address: вул. Поштова, 161/36, Запоріжжя
- Phones: +38 (098) 318-12-62; +38 (061) 787-55-11
- Current website hours: Monday–Saturday 09:00–19:00; Sunday by appointment; verify before changing Google Business Profile
- Google Maps: https://www.google.com/maps?cid=11625904097192140703
- Google Maps coordinates: 47.827689, 35.161495
- Instagram: https://www.instagram.com/status_dent_zp/
- Confirmed orthodontic price: metal ligature braces, one jaw — 17,000 UAH
- Orthodontist currently shown on the website: Овсій Олена Михайлівна; credentials and medical copy still require clinic/doctor verification

## Current implementation state

- Existing draft pull request: https://github.com/optidigitalagent/status1/pull/1
- Working branch: `agent/seo-foundation`
- The PR already includes the orthodontics landing page, improved home and price pages, internal links, Dentist and Service schema, canonical URLs, robots.txt, sitemap.xml, Google Maps entity data and `.seo/` controls
- Static HTML, local links, image alt attributes, JSON-LD, sitemap XML, JavaScript syntax, page map and diff formatting passed validation
- Do not create a duplicate branch or duplicate orthodontics page; inspect and continue the existing PR

## Known blockers and safeguards

- Do not merge or deploy without explicit approval
- Verify live DNS, HTTPS, redirects, canonical responses and sitemap URLs after deployment
- Forms do not have a real endpoint yet; do not claim that a lead was sent until a server confirms delivery
- Google Business Profile ownership, verification, categories, services and exact hours still require owner access/review
- Visible cases require treatment ownership and patient consent verification
- Visible reviews require provenance verification; do not add review or aggregate-rating schema yet
- Do not invent services, doctors, qualifications, prices, cases, reviews, outcomes, traffic, rankings or backlinks
- Do not guarantee first place in Google, Maps, ChatGPT or other AI search systems

## Work mode

Mode: `implement`.

First read the repository and all `.seo/` files, then inspect draft PR #1 and its current diff. Continue from the saved backlog instead of starting a new audit from zero. Ask only for missing facts that materially affect implementation. Work in small reviewable batches, run relevant checks, update `.seo/backlog.csv` and `.seo/change-log.md`, and keep the PR as a draft until the owner explicitly authorizes merge and deployment.
