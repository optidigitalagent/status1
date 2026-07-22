# Post-deploy verification — 2026-07-22

Permanent domain: `https://status-dent.zp.ua`  
Hosting: GitHub Pages  
Merged PR: https://github.com/optidigitalagent/status1/pull/1  
Merge commit: `efe5a0b072c03988addfc5c0f163d4eaaf807b2c`  
Evidence time: 2026-07-22 11:38 Europe/Kyiv

## Observed HTTP behavior

| Request | Observed result |
|---|---|
| `http://status-dent.zp.ua/` | `301` to `https://status-dent.zp.ua/` |
| `https://optidigitalagent.github.io/status1/` | `301` to the permanent apex |
| `https://status-dent.zp.ua/` | `200` |
| `https://status-dent.zp.ua/ortodontiya.html` | `200` |
| `https://status-dent.zp.ua/price.html` | `200` |
| `https://status-dent.zp.ua/robots.txt` | `200` |
| `https://status-dent.zp.ua/sitemap.xml` | `200` |
| Nonexistent test URL | `404`; custom page contains `noindex,follow` |

## Verified controls

- The three indexable pages expose matching permanent-domain self-canonicals.
- The sitemap lists exactly those three canonical URLs and all return `200`.
- `robots.txt` allows the wildcard crawler group and OAI-SearchBot and references the live sitemap.
- Live JSON-LD parses: two blocks on home, two on orthodontics and one on price.
- Both confirmed telephone numbers remain crawlable; the persistent primary phone CTA is live.
- No online form claims delivery without a server-confirmed endpoint.

## Remaining limitations

- No GSC/CrUX field data or approved production Lighthouse evidence was available, so no Core Web Vitals result or score is invented.
- Indexation, rankings and AI citations require later dated measurement; successful deployment is not evidence of ranking.
- GBP, GSC, GA4, directories and sitemap submission were not changed.
