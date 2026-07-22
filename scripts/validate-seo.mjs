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
  const [rawPath, fragment = ''] = href.split('#', 2);
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

  if (!/<html\s+lang=["']uk["']/i.test(html)) fail(`${file}: expected html lang="uk"`);
  if (titles.length !== 1) fail(`${file}: expected one title, found ${titles.length}`);
  if (descriptions.length !== 1) fail(`${file}: expected one meta description, found ${descriptions.length}`);
  if (canonicals.length !== 1) fail(`${file}: expected one canonical, found ${canonicals.length}`);
  if (h1s.length !== 1) fail(`${file}: expected one H1, found ${h1s.length}`);
  if (ogImages.length !== 1 || ogWidths.length !== 1 || ogHeights.length !== 1) {
    fail(`${file}: incomplete Open Graph image metadata`);
  }
  if (mobileCallBars.length !== 1) fail(`${file}: expected one mobile phone CTA, found ${mobileCallBars.length}`);

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
}

publicSources.push(read('status.js'), read('conversion-tracking.js'));
const combinedPublicSource = publicSources.join('\n');
if (!/status_conversion_intent/.test(combinedPublicSource) || !/status:conversion-intent/.test(combinedPublicSource)) {
  fail('conversion-tracking.js: conversion-intent event contract is missing');
}
const forbiddenPublicPatterns = [
  [/bella-dent/i, 'foreign clinic case assets'],
  [/\bid=["']cases["']/i, 'unverified treatment-case section'],
  [/\bid=["']reviews["']/i, 'unverified testimonial section'],
  [/15\s*<i>\+<\/i>[\s\S]{0,80}років практики/i, 'unverified years-in-practice claim'],
  [/0[\s\S]{0,80}болю на процедурах/i, 'absolute pain-free claim'],
];
for (const [pattern, label] of forbiddenPublicPatterns) {
  if (pattern.test(combinedPublicSource)) fail(`Public source contains ${label}`);
}

if (canonicalSet.size !== htmlFiles.length) fail('Canonical URLs are not unique across indexable HTML files');

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
