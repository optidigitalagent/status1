# Search demand and competitor research — Zaporizhzhia

Research date: 2026-07-22

Market: Zaporizhzhia, Ukraine

Primary site language: Ukrainian
Scope: orthodontics, braces, teeth alignment, bite correction and broad dental-clinic discovery

## Method and limits

- Evidence is a current public web-search sample for Zaporizhzhia-modified queries, collected through the Codex web-search tool. The sample is non-personalized and is not a fixed Google rank-tracking view; exact order, local-pack composition and device-specific results can differ.
- Search-result and competitor-page types were reviewed qualitatively. No Search Console, analytics, paid keyword database or reliable local search-volume export was available.
- Volume, difficulty, CPC and current STATUS rankings are therefore intentionally left blank. The presence of competing clinic pages and directories is evidence of an active result set, not a numeric demand estimate.
- Competitor statements below describe page and result types observed on 2026-07-22. They are not endorsements and their medical or commercial claims were not adopted.

## Ukrainian-language demand

| Query | Dominant intent | Journey / expected page | Qualitative result evidence | STATUS decision |
|---|---|---|---|---|
| `ортодонт Запоріжжя` | Local evaluation and appointment | Orthodontist/service page with doctor, location, process, prices and booking | Clinic service pages and doctor/directories appear together: Reface, RD Clinic, Rafael, Doc.ua and Barb | Target `/ortodontiya.html` |
| `брекети Запоріжжя` | Compare systems and prices, then book | Orthodontic or braces service page with visible options and price path | Clinic pages and aggregators compete: Exima, Smile, Nikolov and Barb | Consolidate on `/ortodontiya.html`; do not create a second braces landing page |
| `вирівнювання зубів` | Evaluate a solution and provider | Problem/solution-led orthodontic service page | Dedicated local pages were observed from Smile, Nikolov Dental Clinic and DM-Clinic | Target `/ortodontiya.html` and make this wording explicit in metadata and visible copy |
| `виправлення прикусу` | Evaluate treatment and provider | Orthodontic service page explaining consultation and available systems | The phrase is covered inside local orthodontic pages including Reface, Smile and RD Clinic | Target `/ortodontiya.html`; retain medical-review requirement for clinical detail |
| `стоматологія Запоріжжя` | Choose a local clinic | Clinic home page with services, address, team/proof, prices and contact action | Clinic home pages, the city portal and broad providers compete: Chertov, Dental Studio, Teeth Lab, ART and the municipal directory | Target `/` |

## Russian-language demand

| Query | Dominant intent | Journey / expected page | Qualitative result evidence | STATUS decision |
|---|---|---|---|---|
| `стоматолог Запорожье` | Find and compare a dentist or clinic locally | Doctor directory or clinic home page in Russian | Doc.ua and Barb directories appear alongside Russian or bilingual clinic home pages such as Nikolov and Kuzemka | Record as secondary-market demand. Do not actively target it on the Ukrainian home page or create a Russian URL without a language-architecture decision |
| `брекеты Запорожье` | Compare braces, prices and providers, then book | Russian braces/orthodontic service page or aggregator | Russian service pages and directories are prominent: Nikolov, stomatology.zp.ua, Smile, Chertov, Dental Studio and Barb | Record as secondary-market demand. Closest current offer is `/ortodontiya.html`, but no Russian landing page is created in this batch |

The Russian result set is materially distinct in language but not in user job. A future Russian version should be considered only as a coherent language architecture with equivalent useful content, navigation, canonicals and hreflang—not as one isolated exact-match page.

## Competitor and result-set observations

| Segment | Examples observed | What the result set rewards | Safe implication for STATUS |
|---|---|---|---|
| Orthodontic clinic service pages | [Reface](https://refacedental.com.ua/poslugi/ortodonyiya), [RD Clinic](https://rdclinic.com.ua/ortodontiya), [Rafael](https://rafael.zp.ua/braces) | A dedicated local service URL, clear consultation path, treatment options and local contact details | Keep one strong orthodontics page and connect it to home and prices |
| Alignment / bite-correction pages | [Smile](https://studio-smile.com.ua/ua/vyravnivanie-zubov-zaporoje/), [Nikolov Dental Clinic](https://www.nikolovdental.com.ua/uk/brackets/vyravnivanie-zubov/), [DM-Clinic](https://dmclinic.zp.ua/services/virivnyuvannya-zubiv/) | Problem-led wording, process, comparison support and FAQs | Add neutral query wording to the existing page; clinical elaboration waits for doctor review |
| Braces pages and aggregators | [Exima](https://exima.zp.ua/services/breketi), [Barb Ukrainian](https://barb.ua/uk/zaporozhye/med/stomatologiya/ortodontiya/brekety), [Barb Russian](https://barb.ua/zaporozhye/med/stomatologiya/ortodontiya/brekety) | Visible system types, price information, local provider comparison and booking | Existing STATUS page and price link already cover the core job; a duplicate braces URL is not justified |
| Broad dentistry home pages | [Chertov Clinic](https://chertov.com.ua/), [Dental Studio](https://dentalstudio.in.ua/), [Teeth Lab](https://teeth-lab.com/), [ART](https://artstomat.com.ua/) | Broad service inventory, location, team/proof, prices and a direct contact path | Keep `/` as the sole target for general clinic discovery |
| Doctor and clinic directories | [Doc.ua orthodontists](https://doc.ua/ua/doctors/zaporozhe/all/ortodont), [Doc.ua dentists](https://doc.ua/doctors/zaporozhe/all/stomatolog), Barb | Doctor/provider comparison, reviews, price and map filters | STATUS needs verified first-party proof eventually; do not fabricate reviews, credentials or ratings |

## Content gaps and page decisions

1. **No new orthodontics page:** `/ortodontiya.html` can satisfy the overlapping Ukrainian orthodontist, braces, alignment and bite-correction intents. The proposed `/brekety-zaporizhzhya/` would risk cannibalization without a distinct offer or stronger first-party evidence, so it is removed from the page map.
2. **Safe gap closed now:** the existing page did not explicitly use `вирівнювання зубів` in its main metadata and option heading. Neutral wording is added without changing medical advice or promising outcomes.
3. **Russian demand remains unassigned for active targeting:** the current Ukrainian pages remain the closest business URLs, but mixed-language copy and a one-off Russian doorway page would be poor architecture. A Russian site section remains a future decision, not an implementation item in this batch.
4. **Evidence gaps remain blocked:** verified doctor credentials, owned/consented cases, review provenance and differentiated clinic proof would strengthen evaluation intent, but require clinic evidence and qualified review.
5. **General dentistry needs no new page for this query set:** `/` is the correct target for `стоматологія Запоріжжя`; narrower treatment pages should be created only from verified service facts and separate intent evidence.

## Keyword-to-page map

| Language | Query cluster | Target URL | Mapping action | Rationale |
|---|---|---|---|---|
| uk | `стоматологія Запоріжжя`; `стоматолог Запоріжжя` | `/` | Keep/update | Broad local clinic-selection intent matches the home page |
| uk | `ортодонт Запоріжжя`; `ортодонтія Запоріжжя`; `брекети Запоріжжя`; `вирівнювання зубів`; `вирівнювання зубів Запоріжжя`; `виправлення прикусу`; `виправлення прикусу Запоріжжя` | `/ortodontiya.html` | Consolidate/update | Same commercial-local user job and overlapping clinic service-page result set |
| uk | `ціни стоматологія Запоріжжя`; `ціна брекетів Запоріжжя` | `/price.html` | Keep | Price-comparison intent is best served by the existing price list, linked to orthodontics |
| ru | `стоматолог Запорожье` | `/` (closest current business URL) | Defer active targeting | Russian demand is recorded, but the current page is Ukrainian and no language architecture is approved |
| ru | `брекеты Запорожье`; `ортодонт Запорожье`; `исправление прикуса Запорожье`; `выравнивание зубов Запорожье` | `/ortodontiya.html` (closest current offer) | Defer active targeting | Do not create a duplicate or isolated Russian exact-match page |

Review after deployment: reassess query coverage after 8–12 weeks of indexation data, or sooner if a verified keyword-provider export or Search Console access becomes available.
