# Start SEO Project — Status

Use SEO Site Operator for this client and continue the existing implementation.

## Project

- Website repository: `optidigitalagent/status1`
- Reusable SEO operator repository: `optidigitalagent/seo-site-operator`
- Permanent domain: `https://status-dent.zp.ua`
- Business: Status, dental clinic
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

- Public business name: Status
- Address: вул. Поштова, 161/36, Запоріжжя
- Phones: +38 (098) 318-12-62; +38 (061) 787-55-11
- Current website hours: Monday–Saturday 09:00–19:00; Sunday closed; do not change Google Business Profile while its updates are under review
- Google Maps: https://www.google.com/maps?cid=11625904097192140703
- Google Maps coordinates: 47.827689, 35.161495
- Instagram: https://www.instagram.com/status_dent_zp/
- Confirmed orthodontic price: metal ligature braces, one jaw — 17,000 UAH
- Confirmed orthodontists: Овсій Олена Михайлівна and Андрій Володимирович Лебедєв
- Confirmed dentist/assistant: Щупак Світлана Петрівна; no credentials beyond the approved roles are asserted

## Current implementation state

- PR #1 and PR #2 are merged into `main`; the permanent-domain implementation and post-deploy evidence are live
- Current review branch: `seo/status-facts-and-team`, created from `main` at `10d7fe0`
- The branch aligns confirmed brand/hours, restores three verified team cards, strengthens orthodontist references and updates current SEO controls
- Keep this work in a separate draft PR; do not merge or deploy without explicit approval

## Known blockers and safeguards

- Do not merge or deploy without explicit approval
- DNS, HTTPS, redirects, canonical responses and sitemap URLs were verified after the 2026-07-22 deployment
- Forms do not have a real endpoint yet; do not claim that a lead was sent until a server confirms delivery
- Google Business Profile changes are under review; do not modify the profile in this branch
- Visible cases require treatment ownership and patient consent verification
- Visible reviews require provenance verification; do not add review or aggregate-rating schema yet
- Do not invent services, doctors, qualifications, prices, cases, reviews, outcomes, traffic, rankings or backlinks
- Do not guarantee first place in Google, Maps, ChatGPT or other AI search systems

## Work mode

Mode: `implement`.

First read the repository and all `.seo/` files, then inspect the current branch and its draft PR. Continue from the saved backlog instead of starting a new audit from zero. Ask only for missing facts that materially affect implementation. Work in small reviewable batches, run relevant checks, update `.seo/backlog.csv` and `.seo/change-log.md`, and keep the PR as a draft until the owner explicitly authorizes merge and deployment.
