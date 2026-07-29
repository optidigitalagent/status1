import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const loader = require('../price-loader.js');

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.className = '';
    this.textContent = '';
    this.children = [];
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.children = [...children];
  }
}

class FakeDocument {
  constructor() {
    this.lists = new Map();
    this.sections = new Map();

    loader.CATEGORY_IDS.forEach((categoryId) => {
      const list = new FakeElement('ul');
      list.className = 'price-list';
      const fallback = new FakeElement('li');
      fallback.textContent = `fallback-${categoryId}`;
      list.children = [fallback];
      this.lists.set(categoryId, list);
      this.sections.set(categoryId, {
        querySelector: (selector) => selector === '.price-list' ? list : null
      });
    });
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  getElementById(id) {
    return this.sections.get(id) || null;
  }

  snapshot() {
    return Object.fromEntries(loader.CATEGORY_IDS.map((categoryId) => [
      categoryId,
      this.lists.get(categoryId).children.map((row) =>
        row.children.length
          ? row.children.map((child) => child.textContent)
          : [row.textContent]
      )
    ]));
  }
}

function buildPayload(categoryOverrides = {}, rootOverrides = {}) {
  const categories = Object.fromEntries(loader.CATEGORY_IDS.map((categoryId) => [
    categoryId,
    [{ id: `${categoryId}-001`, name: `Послуга ${categoryId}`, price: '100 грн' }]
  ]));

  Object.assign(categories, categoryOverrides);
  return {
    schemaVersion: 1,
    updatedAt: '2026-07-29T10:00:00.000Z',
    categories,
    ...rootOverrides
  };
}

function gvizResponse(rows) {
  return {
    status: 'ok',
    table: {
      rows: rows.map((values) => ({
        c: values.map((value) => value === null ? null : { v: value })
      }))
    }
  };
}

function defaultSheetRows() {
  return [['row-001', 'Тестова послуга', '100 грн']];
}

function queryAllSheets(overrides = {}) {
  return async ({ sheetName }) => gvizResponse(overrides[sheetName] || defaultSheetRows());
}

function listRows(documentRef, categoryId) {
  return documentRef.snapshot()[categoryId];
}

const silentLogger = { warn() {} };

test('loads all seven fixed Google Sheets tabs', async () => {
  const documentRef = new FakeDocument();
  const requestedSheets = [];
  const loaded = await loader.loadPrices({
    documentRef,
    querySheetImpl: async ({ sheetName }) => {
      requestedSheets.push(sheetName);
      return gvizResponse(defaultSheetRows());
    },
    logger: silentLogger
  });

  assert.equal(loaded, true);
  assert.deepEqual(requestedSheets.sort(), Object.values(loader.CATEGORY_SHEETS).sort());
  assert.equal(Object.keys(documentRef.snapshot()).length, 7);
});

test('builds a fixed Google Visualization query URL', () => {
  const url = new URL(loader.buildSheetQueryUrl(
    loader.SPREADSHEET_ID,
    'Ортодонтія',
    '__statusPriceTest',
    () => 12345
  ));

  assert.equal(url.hostname, 'docs.google.com');
  assert.equal(url.pathname, `/spreadsheets/d/${loader.SPREADSHEET_ID}/gviz/tq`);
  assert.equal(url.searchParams.get('headers'), '1');
  assert.equal(url.searchParams.get('sheet'), 'Ортодонтія');
  assert.equal(url.searchParams.get('tq'), 'select A, B, C');
  assert.equal(url.searchParams.get('tqx'), 'responseHandler:__statusPriceTest');
  assert.equal(url.searchParams.get('_price_cache'), '12345');
});

test('parses changed service names and prices from sheet cells', () => {
  const services = loader.parseGvizResponse(gvizResponse([
    ['zagalni-001', 'Оновлена консультація', '450 грн']
  ]), 'zagalni');

  assert.deepEqual(services, [{
    id: 'zagalni-001',
    name: 'Оновлена консультація',
    price: '450 грн'
  }]);
});

test('supports adding, deleting and reordering services', () => {
  const services = loader.parseGvizResponse(gvizResponse([
    ['zagalni-003', 'Третя', '300 грн'],
    ['zagalni-001', 'Перша', '100 грн'],
    ['zagalni-002', 'Друга', '200 грн']
  ]), 'zagalni');

  assert.deepEqual(services.map((service) => service.name), ['Третя', 'Перша', 'Друга']);
  assert.equal(services.length, 3);
});

test('ignores blank and incomplete editing rows', () => {
  const services = loader.parseGvizResponse(gvizResponse([
    [null, null, null],
    [null, 'Нова послуга', null],
    [null, null, '500 грн'],
    [null, 'Готова послуга', '500 грн']
  ]), 'zagalni');

  assert.equal(services.length, 1);
  assert.equal(services[0].name, 'Готова послуга');
});

test('generates a safe display ID when column A is empty', () => {
  const services = loader.parseGvizResponse(gvizResponse([
    [null, 'Нова послуга', '500 грн']
  ]), 'terapiya');

  assert.equal(services[0].id, 'terapiya-row-2');
});

test('renders complete categories atomically', () => {
  const documentRef = new FakeDocument();
  loader.renderPricePayload(documentRef, buildPayload({
    zagalni: [
      { id: 'zagalni-001', name: 'Перша', price: '100 грн' },
      { id: 'zagalni-002', name: 'Нова послуга', price: '200 грн' }
    ],
    hirurgiya: []
  }));

  assert.equal(listRows(documentRef, 'zagalni').length, 2);
  assert.deepEqual(listRows(documentRef, 'hirurgiya'), []);
});

test('rejects unknown and missing categories atomically', () => {
  const unknown = buildPayload();
  unknown.categories.nevidoma = [];
  assert.throws(() => loader.validatePricePayload(unknown), /Unknown category/);

  const missing = buildPayload();
  delete missing.categories.terapiya;
  assert.throws(() => loader.validatePricePayload(missing), /Missing category/);
});

test('rejects malformed Google Visualization responses', () => {
  assert.throws(() => loader.parseGvizResponse({}, 'zagalni'), /invalid response/);
  assert.throws(
    () => loader.parseGvizResponse({ status: 'ok', table: {} }, 'zagalni'),
    /rows are missing/
  );
});

test('rejects invalid payload value types and schema versions', () => {
  assert.throws(
    () => loader.validatePricePayload(buildPayload({ zagalni: {} })),
    /must be an array/
  );
  assert.throws(
    () => loader.validatePricePayload(buildPayload({}, { schemaVersion: 2 })),
    /Unsupported schemaVersion/
  );
});

test('rejects markup, script-like and excessive sheet values', () => {
  assert.throws(
    () => loader.parseGvizResponse(gvizResponse([
      ['zagalni-001', '<script>alert(1)</script>', '400 грн']
    ]), 'zagalni'),
    /markup or script-like content/
  );
  assert.throws(
    () => loader.parseGvizResponse(gvizResponse([
      ['zagalni-001', 'Д'.repeat(301), '400 грн']
    ]), 'zagalni'),
    /too long/
  );
});

test('uses textContent and never creates executable markup', () => {
  const documentRef = new FakeDocument();
  const row = loader.createPriceRow(documentRef, {
    name: '<script>alert(1)</script>',
    price: '<img src=x onerror=alert(1)>'
  });

  assert.equal(row.children[0].textContent, '<script>alert(1)</script>');
  assert.equal(row.children[1].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(row.children.length, 2);
});

test('rejects an absent or invalid spreadsheet ID', async () => {
  assert.equal(loader.isConfiguredSpreadsheetId('bad'), false);
  await assert.rejects(
    loader.fetchPricePayload({
      spreadsheetId: 'bad',
      querySheetImpl: queryAllSheets()
    }),
    /spreadsheet ID is not configured/
  );
});

test('keeps the static fallback when one Google tab is unavailable', async () => {
  const documentRef = new FakeDocument();
  const before = documentRef.snapshot();
  const loaded = await loader.loadPrices({
    documentRef,
    querySheetImpl: async ({ sheetName }) => {
      if (sheetName === 'Терапія') throw new Error('network unavailable');
      return gvizResponse(defaultSheetRows());
    },
    logger: silentLogger
  });

  assert.equal(loaded, false);
  assert.deepEqual(documentRef.snapshot(), before);
});

test('applies no partial update when one category contains unsafe data', async () => {
  const documentRef = new FakeDocument();
  const before = documentRef.snapshot();
  const loaded = await loader.loadPrices({
    documentRef,
    querySheetImpl: queryAllSheets({
      Терапія: [['terapiya-001', '<b>Небезпечна назва</b>', '400 грн']]
    }),
    logger: silentLogger
  });

  assert.equal(loaded, false);
  assert.deepEqual(documentRef.snapshot(), before);
});

test('accepts numeric cell values as visible text', () => {
  const response = {
    status: 'ok',
    table: { rows: [{ c: [{ v: '' }, { v: 'Консультація' }, { v: 400 }] }] }
  };
  const services = loader.parseGvizResponse(response, 'zagalni');
  assert.equal(services[0].price, '400');
});

test('uses only safe DOM APIs in the public loader source', async () => {
  const source = await fs.readFile(new URL('../price-loader.js', import.meta.url), 'utf8');
  assert.match(source, /documentRef\.createElement/);
  assert.match(source, /\.textContent\s*=/);
  assert.match(source, /\.append\(/);
  assert.match(source, /\.replaceChildren\(/);
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.doesNotMatch(source, /insertAdjacentHTML|document\.write|\beval\s*\(/);
});
