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
