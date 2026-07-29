import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const htmlFiles = ['index.html', 'ortodontiya.html', 'price.html'];
const expectedCanonicals = new Map([
  ['index.html', 'https://status-dent.zp.ua/'],
  ['ortodontiya.html', 'https://status-dent.zp.ua/ortodontiya.html'],
  ['price.html', 'https://status-dent.zp.ua/price.html'],
]);
const errors = [];

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const matches = (source, regex) => Array.from(source.matchAll(regex));
const fail = (message) => errors.push(message);

function resolveLocalTarget(sourceFile, href) {
  const [pathWithQuery, fragment = ''] = href.split('#', 2);
  const rawPath = pathWithQuery.split('?', 1)[0];
  if (!rawPath) return { file: sourceFile, fragment };

  let normalized = rawPath.replace(/^\.\//, '').replace(/^\//, '');
  if (!normalized || normalized === '.') normalized = 'index.html';
  if (normalized.endsWith('/')) normalized += 'index.html';
  return { file: path.normalize(normalized), fragment };
}

const canonicalSet = new Set();
const publicSources = [];

for (const file of htmlFiles) {
  const html = read(file);
  publicSources.push(html);
  const titles = matches(html, /<title>[^<]+<\/title>/gi);
  const descriptions = matches(html, /<meta\s+name=["']description["'][^>]*>/gi);
  const canonicals = matches(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi);
  const h1s = matches(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi);
  const ogImages = matches(html, /<meta\s+property=["']og:image["'][^>]*>/gi);
  const ogWidths = matches(html, /<meta\s+property=["']og:image:width["'][^>]*>/gi);
  const ogHeights = matches(html, /<meta\s+property=["']og:image:height["'][^>]*>/gi);
  const mobileCallBars = matches(html, /<a\b[^>]*class=["'][^"']*mobile-call-bar[^"']*["'][^>]*href=["']tel:\+380983181262["'][^>]*>/gi);
  const trackingModules = matches(html, /<script\s+type=["']module["']\s+src=["']conversion-tracking\.js\?v=1["']><\/script>/gi);

  if (!/<html\s+lang=["']uk["']/i.test(html)) fail(`${file}: expected html lang="uk"`);
  if (titles.length !== 1) fail(`${file}: expected one title, found ${titles.length}`);
  if (descriptions.length !== 1) fail(`${file}: expected one meta description, found ${descriptions.length}`);
  if (canonicals.length !== 1) fail(`${file}: expected one canonical, found ${canonicals.length}`);
  if (h1s.length !== 1) fail(`${file}: expected one H1, found ${h1s.length}`);
  if (ogImages.length !== 1 || ogWidths.length !== 1 || ogHeights.length !== 1) {
    fail(`${file}: incomplete Open Graph image metadata`);
  }
  if (mobileCallBars.length !== 1) fail(`${file}: expected one mobile phone CTA, found ${mobileCallBars.length}`);
  if (trackingModules.length !== 1) fail(`${file}: expected one conversion tracking module`);
  if (!/aria-controls=["']nav-mobile["']/.test(html)) fail(`${file}: menu button is missing aria-controls`);
  if (!/<div\s+class=["']nav-mobile["']\s+id=["']nav-mobile["']\s+aria-hidden=["']true["']\s+inert>/i.test(html)) {
    fail(`${file}: closed mobile navigation must start aria-hidden and inert`);
  }

  if (canonicals.length === 1) {
    const canonical = canonicals[0][1];
    canonicalSet.add(canonical);
    if (canonical !== expectedCanonicals.get(file)) {
      fail(`${file}: canonical ${canonical} does not match expected ${expectedCanonicals.get(file)}`);
    }
  }

  for (const image of matches(html, /<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[0])) fail(`${file}: image is missing alt`);
  }

  if (file === 'index.html') {
    const casesSection = html.match(/<section\b[^>]*\bid=["']cases["'][^>]*>([\s\S]*?)<\/section>/i)?.[0] || '';
    const caseIds = matches(casesSection, /\bid=["'](case-\d{2})["']/gi).map((match) => match[1]);
    const expectedCaseIds = Array.from({ length: 13 }, (_, index) => `case-${String(index + 1).padStart(2, '0')}`);
    for (const id of expectedCaseIds) {
      const count = caseIds.filter((candidate) => candidate === id).length;
      if (count !== 1) fail(`index.html: expected ${id} exactly once, found ${count}`);
    }
    if (caseIds.length !== expectedCaseIds.length) fail(`index.html: expected 13 case IDs, found ${caseIds.length}`);
    if (matches(casesSection, /<div\b[^>]*class=["'][^"']*case-card[^"']*["'][^>]*role=["']button["'][^>]*tabindex=["']0["']/gi).length !== 13) {
      fail('index.html: expected 13 keyboard-focusable case buttons');
    }

    const expectedCasePhases = new Map(expectedCaseIds.map((id) => [id, ['before', 'after']]));
    expectedCasePhases.set('case-02', ['before', 'intermediate', 'after']);
    expectedCasePhases.set('case-06', ['before', 'intermediate', 'after']);
    const caseUrlPrefix = 'https://res.cloudinary.com/qofhq8xa/image/upload/f_auto,q_auto,c_limit,w_1600/status/cases';
    const expectedCaseUrls = new Set(Array.from(expectedCasePhases, ([id, phases]) =>
      phases.map((phase) => `${caseUrlPrefix}/${id}/${phase}.png`)
    ).flat());

    const caseImages = matches(casesSection, /<img\b[^>]*>/gi).map((match) => match[0]);
    if (caseImages.length !== 28) fail(`index.html: expected 28 manifest case images, found ${caseImages.length}`);
    const actualCaseUrls = [];
    for (const image of caseImages) {
      const url = image.match(/\bdata-src=["']([^"']+)["']/i)?.[1] || '';
      actualCaseUrls.push(url);
      if (!expectedCaseUrls.has(url)) fail(`index.html: case image is not in the approved 28-asset manifest: ${url || '(missing data-src)'}`);
      if (!/\bloading=["']lazy["']/i.test(image)) fail('index.html: case image is not lazy-loaded');
      if (!/\bdecoding=["']async["']/i.test(image)) fail('index.html: case image is missing async decoding');
    }
    if (new Set(actualCaseUrls).size !== expectedCaseUrls.size) {
      fail(`index.html: expected ${expectedCaseUrls.size} unique manifest case URLs, found ${new Set(actualCaseUrls).size}`);
    }
    for (const expectedUrl of expectedCaseUrls) {
      if (!actualCaseUrls.includes(expectedUrl)) fail(`index.html: missing approved manifest URL ${expectedUrl}`);
    }
    if (/\bdata-composite(?:=|\s|>)/i.test(casesSection)) fail('index.html: case gallery must use separate image panels, not data-composite');

    for (const [id, phases] of expectedCasePhases) {
      const card = casesSection.match(new RegExp(`<div\\b(?=[^>]*\\bid=["']${id}["'])([^>]*)>([\\s\\S]*?)<\\/div>`, 'i'));
      if (!card) continue;
      const attributes = card[1];
      const body = card[2];
      if (!new RegExp(`\\bdata-images=["']${phases.length}["']`, 'i').test(attributes)) {
        fail(`index.html: ${id} must declare data-images="${phases.length}"`);
      }
      const cardUrls = matches(body, /<img\b[^>]*\bdata-src=["']([^"']+)["'][^>]*>/gi).map((match) => match[1]);
      const expectedUrls = phases.map((phase) => `${caseUrlPrefix}/${id}/${phase}.png`);
      if (cardUrls.length !== expectedUrls.length || cardUrls.some((url, index) => url !== expectedUrls[index])) {
        fail(`index.html: ${id} images must follow the approved ${phases.join(' → ')} order`);
      }
    }
    if (!/Демонстраційні візуалізації\. Зображення не підтверджені як результати лікування конкретних пацієнтів і не гарантують аналогічного результату\./.test(casesSection)) {
      fail('index.html: required individual-result and visualization disclosure is missing');
    }
    if (!/Демонстраційна візуалізація/.test(casesSection)) {
      fail('index.html: required demonstration visualization label is missing');
    }
    if (!/<h2\b[^>]*>Кейси до та після<\/h2>/i.test(casesSection)) fail('index.html: cases heading is incorrect');
    for (const caption of matches(casesSection, /<figcaption>([\s\S]*?)<\/figcaption>/gi)) {
      for (const label of matches(caption[1], /<span>([^<]+)<\/span>/gi).map((match) => match[1])) {
        if (!['До', 'Проміжний етап', 'Після'].includes(label)) fail(`index.html: unsupported case label ${label}`);
      }
    }
    const intermediateUrls = actualCaseUrls.filter((url) => url.endsWith('/intermediate.png'));
    if (intermediateUrls.length !== 2) fail(`index.html: expected intermediate images only for case-02 and case-06, found ${intermediateUrls.length}`);

    const mapFrame = html.match(/<iframe\b[^>]*\bsrc=["']https:\/\/www\.google\.com\/maps\/embed\?origin=mfe&amp;pb=!1m3!2m1!1s47\.827689,35\.161495!6i17["'][^>]*><\/iframe>/i)?.[0] || '';
    if (!mapFrame) fail('index.html: embed-safe coordinates map iframe is missing');
    if (!/\ballowfullscreen\b/i.test(mapFrame)) fail('index.html: map iframe is missing allowfullscreen');
    if (!/\bloading=["']lazy["']/i.test(mapFrame)) fail('index.html: map iframe is not lazy-loaded');
    if (!/\breferrerpolicy=["']strict-origin-when-cross-origin["']/i.test(mapFrame)) fail('index.html: map iframe referrer policy is incorrect');
    if (!/<a\b[^>]*href=["']https:\/\/www\.google\.com\/maps\?cid=11625904097192140703["'][^>]*>Відкрити маршрут у Google Maps<\/a>/i.test(html)) {
      fail('index.html: Maps fallback link is missing or incorrect');
    }
    if (matches(html, /<a\b[^>]*href=["']#cases["'][^>]*>Кейси<\/a>/gi).length !== 3) {
      fail('index.html: expected Cases links in desktop nav, mobile nav and footer');
    }
    if (!/<div\b[^>]*\bid=["']case-modal["'][^>]*\brole=["']dialog["'][^>]*\baria-modal=["']true["']/i.test(html)) {
      fail('index.html: case modal dialog semantics are missing');
    }
  }

  for (const script of matches(html, /<script\s+type=["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      fail(`${file}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const link of matches(html, /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = link[1];
    if (/^(?:https?:|tel:|mailto:)/i.test(href)) continue;
    if (/index\.html(?:#|$)/i.test(href)) fail(`${file}: internal link points to duplicate homepage URL ${href}`);

    const target = resolveLocalTarget(file, href);
    const absoluteTarget = path.join(root, target.file);
    if (!fs.existsSync(absoluteTarget)) {
      fail(`${file}: unresolved local link ${href}`);
      continue;
    }
    if (target.fragment && target.file.endsWith('.html')) {
      const targetHtml = fs.readFileSync(absoluteTarget, 'utf8');
      const escaped = target.fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid=["']${escaped}["']`, 'i').test(targetHtml)) {
        fail(`${file}: unresolved fragment ${href}`);
      }
    }
  }

  for (const resource of matches(html, /\b(?:href|src)=["']([^"']+)["']/gi)) {
    const resourceUrl = resource[1];
    if (/^(?:https?:|tel:|mailto:|data:|#)/i.test(resourceUrl)) continue;
    const target = resolveLocalTarget(file, resourceUrl);
    if (!fs.existsSync(path.join(root, target.file))) {
      fail(`${file}: unresolved local resource ${resourceUrl}`);
    }
  }

  if (file === 'price.html') {
    const categoryIds = ['zagalni', 'profilaktyka', 'parodontologiya', 'terapiya', 'ortodontiya', 'ortopediya', 'hirurgiya'];
    categoryIds.forEach((categoryId, index) => {
      const startMatch = new RegExp(`<div\\b(?=[^>]*\\bid=["']${categoryId}["'])[^>]*>`, 'i').exec(html);
      const nextId = categoryIds[index + 1];
      const nextMatch = nextId
        ? new RegExp(`<div\\b(?=[^>]*\\bid=["']${nextId}["'])[^>]*>`, 'i').exec(html)
        : /<div\s+class=["'][^"']*price-cta/i.exec(html);
      const categoryBlock = startMatch
        ? html.slice(startMatch.index, nextMatch ? nextMatch.index : html.length)
        : '';
      if (!categoryBlock) fail(`price.html: missing fixed category ${categoryId}`);
      if (matches(categoryBlock, /<ul\s+class=["']price-list["']>/gi).length !== 1) {
        fail(`price.html: ${categoryId} must contain exactly one static fallback price-list`);
      }
    });
    if (matches(html, /<script\s+src=["']price-loader\.js\?v=1["']><\/script>/gi).length !== 1) {
      fail('price.html: expected one price loader script');
    }
    if (!/Лігатурна брекет-система \(метал\), 1 щелепа[\s\S]{0,160}17 000 грн/.test(html)) {
      fail('price.html: confirmed 17 000 UAH static fallback price is missing');
    }
    const note = html.match(/<p\s+class=["']price-note["']>([\s\S]*?)<\/p>/i)?.[1] || '';
    if (/\b17\s*000\s*грн\b/i.test(note)) {
      fail('price.html: orthodontic note duplicates a numeric price outside price-list');
    }
  } else if (/price-loader\.js/i.test(html)) {
    fail(`${file}: price-loader.js must be connected only to price.html`);
  }
}

publicSources.push(read('status.js'), read('conversion-tracking.js'));
const priceLoader = read('price-loader.js');
if (!/documentRef\.createElement/.test(priceLoader) || !/\.textContent\s*=/.test(priceLoader) ||
    !/\.append\(/.test(priceLoader) || !/\.replaceChildren\(/.test(priceLoader)) {
  fail('price-loader.js: required safe DOM construction APIs are missing');
}
if (/\.innerHTML\s*=|insertAdjacentHTML|document\.write|\beval\s*\(/.test(priceLoader)) {
  fail('price-loader.js: unsafe DOM or script execution API detected');
}
if (!/docs\.google\.com\/spreadsheets\/d\//.test(priceLoader) || !/\/gviz\/tq/.test(priceLoader)) {
  fail('price-loader.js: direct read-only Google Sheets query endpoint is missing');
}
if (/script\.google\.com|PRICE_API_URL|PASTE_APPS_SCRIPT/.test(priceLoader)) {
  fail('price-loader.js: obsolete Apps Script endpoint configuration remains');
}
const expectedSheetNames = ['Загальні', 'Профілактика', 'Пародонтологія', 'Терапія', 'Ортодонтія', 'Ортопедія', 'Хірургія'];
for (const sheetName of expectedSheetNames) {
  if (!priceLoader.includes(`'${sheetName}'`)) fail(`price-loader.js: missing fixed Sheet tab ${sheetName}`);
}
const combinedPublicSource = publicSources.join('\n');
if (!/status_conversion_intent/.test(combinedPublicSource) || !/status:conversion-intent/.test(combinedPublicSource)) {
  fail('conversion-tracking.js: conversion-intent event contract is missing');
}
const forbiddenPublicPatterns = [
  [/bella-dent/i, 'foreign clinic case assets'],
  [/\bid=["']reviews["']/i, 'unverified testimonial section'],
  [/15\s*<i>\+<\/i>[\s\S]{0,80}років практики/i, 'unverified years-in-practice claim'],
  [/0[\s\S]{0,80}болю на процедурах/i, 'absolute pain-free claim'],
  [/["']@type["']\s*:\s*["'](?:Review|AggregateRating|MedicalCase)["']/i, 'unsupported case, review or rating schema'],
];
for (const [pattern, label] of forbiddenPublicPatterns) {
  if (pattern.test(combinedPublicSource)) fail(`Public source contains ${label}`);
}

if (canonicalSet.size !== htmlFiles.length) fail('Canonical URLs are not unique across indexable HTML files');

const notFound = read('404.html');
if (!/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']\s*>/i.test(notFound)) {
  fail('404.html: expected noindex,follow');
}
if (/<link\s+rel=["']canonical["']/i.test(notFound)) fail('404.html: must not declare a canonical URL');
if (matches(notFound, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi).length !== 1) fail('404.html: expected one H1');
if (!/conversion-tracking\.js\?v=1/.test(notFound)) fail('404.html: conversion tracking module is missing');
for (const link of matches(notFound, /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
  const href = link[1];
  if (/^(?:https?:|tel:|mailto:)/i.test(href)) continue;
  const target = resolveLocalTarget('404.html', href);
  if (!fs.existsSync(path.join(root, target.file))) fail(`404.html: unresolved local link ${href}`);
}

const sitemap = read('sitemap.xml');
const sitemapUrls = new Set(matches(sitemap, /<loc>([^<]+)<\/loc>/g).map((match) => match[1]));
for (const canonical of canonicalSet) {
  if (!sitemapUrls.has(canonical)) fail(`sitemap.xml: missing canonical ${canonical}`);
}
for (const sitemapUrl of sitemapUrls) {
  if (!canonicalSet.has(sitemapUrl)) fail(`sitemap.xml: non-canonical or unknown URL ${sitemapUrl}`);
}

const robots = read('robots.txt');
if (!/^Sitemap:\s+https:\/\/status-dent\.zp\.ua\/sitemap\.xml\s*$/mi.test(robots)) {
  fail('robots.txt: missing canonical sitemap directive');
}
if (!/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(robots)) {
  fail('robots.txt: OAI-SearchBot is not explicitly allowed');
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`SEO validation passed: ${htmlFiles.length} HTML pages, ${canonicalSet.size} canonicals, ${sitemapUrls.size} sitemap URLs.`);
