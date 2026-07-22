# AI discovery and citation-readiness baseline

Baseline time: 2026-07-22, Asia/Hebron
Market/language: Zaporizhzhia, Ukrainian primary; Russian demand documented separately
Scope: source and public-response audit only; no automated querying of external AI accounts

## Platform controls

| Surface | Current draft control | Production state | Decision |
|---|---|---|---|
| Google AI features | Googlebot allowed; indexable pages allow full snippets | draft robots/sitemap/orthodontics are not deployed | ordinary Search eligibility is the prerequisite; no special AI schema or file added |
| ChatGPT search | `OAI-SearchBot` explicitly allowed in `robots.txt` | production robots currently returns 404 until deployment | keep search discovery allowed and verify the response after deployment |
| OpenAI training | GPTBot currently inherits the wildcard allow rule | same | clinic must choose allow/disallow separately; do not conflate this with ChatGPT search discovery |
| ChatGPT referrals | measurement plan includes `utm_source=chatgpt.com` | analytics access absent | create an analytics segment after access is granted |

Current primary guidance checked on 2026-07-22:

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): normal SEO, crawl/index and snippet eligibility apply; no special AI file or schema is required.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): OAI-SearchBot controls search discovery separately from GPTBot training preferences.
- [OpenAI publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq): ChatGPT search referrals include `utm_source=chatgpt.com`.

## Citation-readiness changes in the draft

- Important clinic facts are visible as text and consistent with Dentist/Service/WebSite JSON-LD.
- The location uses one stable Maps CID, one address and two confirmed phone numbers.
- The price and orthodontics pages have visible/structured breadcrumbs and contextual links.
- Foreign treatment cases, unattributed testimonials and unsupported promotional/medical claims were removed.
- `.seo/evidence-register.csv` records source, verification status, owner and restoration dependency for claims.
- `llms.txt` was intentionally not added because it is not an eligibility or ranking requirement.

## Fixed future query/prompt sample

Record the exact date, locale/account context, answer, cited URL and limitations for each repeat. Do not call a single sample a ranking.

1. `ортодонт Запоріжжя`
2. `брекети Запоріжжя ціна`
3. `де виправити прикус у Запоріжжі`
4. `стоматологія Запоріжжя Поштова`
5. `ортодонт Запорожье`
6. `брекеты Запорожье цена`
7. `Які брекети пропонує STATUS у Запоріжжі та скільки вони коштують?`
8. `Як записатися до стоматології STATUS у Запоріжжі?`

The baseline result is intentionally blank until the permanent-domain pages are deployed and the user authorizes/executes surface testing. Compare classic organic, local and AI referral outcomes separately.
