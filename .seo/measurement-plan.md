# SEO measurement plan

Plan updated: 2026-07-22
Reporting timezone: pending clinic analytics decision; use `Europe/Kyiv` unless the existing property requires continuity
Primary market/language: Zaporizhzhia, Ukrainian

## Objective and KPI tree

Business objective: increase qualified appointment enquiries attributable to organic, local and AI-assisted discovery.

- Primary outcome KPI: confirmed qualified phone calls plus server-confirmed appointment forms.
- Leading conversion indicators: `phone_click`, `directions_click`, price-page visits and verified form success after the relay exists.
- Search indicators: non-branded clicks/impressions by landing page and query cluster, CTR, indexation and canonical selection.
- Local indicators: GBP calls, directions and website clicks; localized query samples with date/device/coordinates.
- AI indicators: sessions containing `utm_source=chatgpt.com`, other identifiable AI referrals and dated fixed-query citation samples.
- Guardrails: no loss of working phone paths, no false form success, no robots/canonical/sitemap regression, no material mobile-overflow or CWV regression.

A client-side phone click is an intent signal, not proof that a call connected or was qualified. Connected/qualified calls require telephony or CRM evidence.

## Source event contract prepared in the draft

`status.js` dispatches `status:conversion-intent` in the browser and pushes the same payload only when an approved implementation has already created `window.dataLayer`. The draft does not load analytics, create cookies or transmit data.

| Event | `interaction_type` | Optional field | Required fields | Meaning |
|---|---|---|---|---|
| `status_conversion_intent` | `phone_click` | `phone_line`: `mobile_098` or `landline_061` | `placement`, `page_path` | user activated a telephone link |
| `status_conversion_intent` | `directions_click` | none | `placement`, `page_path` | user opened the confirmed Maps destination |
| `status_conversion_intent` | `instagram_click` | none | `placement`, `page_path` | user opened the confirmed Instagram profile |

Allowed `placement` values: `mobile_sticky`, `mobile_navigation`, `header`, `hero`, `service_cta`, `booking`, `contact_details`, `footer`, `content`.

Do not send names, entered phone numbers, free-text form contents, URLs containing personal data, Telegram tokens or medical information in analytics events.

## Data sources and access state

| Source | Property/account identifier | Access | Use |
|---|---|---|---|
| Google Search Console | pending | blocked | queries, pages, clicks, impressions, CTR, position, indexation and sitemap state |
| Analytics/GA4 | pending | blocked | landing sessions, event counts, conversion rate and referral source |
| Google Business Profile | pending | blocked | calls, directions and website clicks |
| Telephony/CRM | pending | blocked | connected and qualified calls; appointment outcome |
| Rank/local grid provider | none supplied | unavailable | sampled non-branded visibility with explicit market/device/coordinates |

Never commit credentials or property secrets. Prefer read-only/least-privilege access and exports.

## Baseline and comparison windows

- Technical pre-launch baseline: repository scan and public HTTP responses recorded on 2026-07-22.
- Measurement baseline: first complete 28 days after deployment, GSC verification and analytics QA.
- Early launch check: daily for the first 7 days, then weekly through day 28.
- Initial SEO comparison: days 29–56 versus days 1–28, segmented by page/query/device; treat as directional if volume is low.
- Strategy review: 90 days after indexation, with seasonality, paid activity, outages and site changes annotated.
- AI citation/query sample: same prompt set, market/language and account context monthly; outputs are stochastic and not rankings.

## Required segments

- branded versus non-branded queries;
- homepage, orthodontics and price landing pages;
- orthodontics, general dentistry, pricing and navigational query clusters;
- Ukraine/Zaporizhzhia where the source supports it;
- Ukrainian versus Russian query language;
- mobile versus desktop;
- classic organic, GBP/local, ChatGPT UTM and other identifiable referrals;
- phone line, CTA placement and conversion type.

Do not sum Search Console and analytics counts or treat them as matching datasets.

## QA and alerts

- Alert immediately when an indexable sitemap URL stops returning `200`, canonical/sitemap values diverge, robots blocks a required crawler, or the phone CTA disappears.
- Investigate when tracked conversion-intent events fall to zero for 24 hours after a release with otherwise normal traffic.
- Investigate a 30% or greater week-over-week organic-click drop only after checking data latency, seasonality, outages, paid/brand activity and Google system updates.
- Re-run desktop/mobile render, link, JSON-LD, sitemap and JavaScript checks before every merge.
- Validate a real call separately from the browser click event; validate a form only when the server confirms one delivered lead.

## Decision rules

- Technical release succeeds when all three canonical URLs return `200`, are crawlable, agree with sitemap/internal links and preserve working phone actions.
- The orthodontics initiative is ready for outcome evaluation only after qualified medical review, deployment, indexation and event QA.
- After at least 8–12 weeks of stable indexed data, keep/iterate the page when non-branded impressions and qualified call evidence improve without guardrail regressions; diagnose intent, proof, technical and conversion causes before rewriting if they do not.
- Do not claim causality from a single rank check, prompt sample, short window or unsegmented traffic change.

## Ownership still required

- Clinic owner: conversion definition, phone-call qualification rule, access approval and GBP fact confirmation.
- Developer/analytics owner: approved tag implementation, consent behavior, dataLayer mapping and debug validation.
- SEO owner: GSC/GA4/GBP segments, change annotations, monthly report and decision log.
