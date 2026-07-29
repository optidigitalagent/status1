import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const loader = require('../price-loader.js');
const endpoint = 'https://script.google.com/macros/s/status-price-test-deployment/exec';

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

function okResponse(payload) {
  return { ok: true, status: 200, json: async () => payload };
}

function listRows(documentRef, categoryId) {
  return documentRef.snapshot()[categoryId];
}

const silentLogger = { warn() {} };

test('loads valid JSON and preserves all seven allowlisted categories', async () => {
  const documentRef = new FakeDocument();
  let requestedUrl = '';
  let requestOptions;
  const loaded = await loader.loadPrices({
    documentRef,
    endpoint,
    fetchImpl: async (url, options) => {
      requestedUrl = url;
      requestOptions = options;
      return okResponse(buildPayload());
    },
    logger: silentLogger,
    now: () => 12345
  });

  assert.equal(loaded, true);
  assert.equal(Object.keys(documentRef.snapshot()).length, 7);
  assert.match(requestedUrl, /_price_cache=12345/);
  assert.equal(requestOptions.cache, 'no-store');
  assert.equal(requestOptions.credentials, 'omit');
});

test('applies changed service names and prices', () => {
  const documentRef = new FakeDocument();
  loader.renderPricePayload(documentRef, buildPayload({
    zagalni: [{ id: 'zagalni-001', name: 'Оновлена консультація', price: '450 грн' }]
  }));
  assert.deepEqual(listRows(documentRef, 'zagalni'), [['Оновлена консультація', '450 грн']]);
});

test('adds and deletes services by replacing one complete category list', () => {
  const documentRef = new FakeDocument();
  loader.renderPricePayload(documentRef, buildPayload({
    zagalni: [
      { id: 'zagalni-001', name: 'Перша', price: '100 грн' },
      { id: 'zagalni-002', name: 'Нова послуга', price: '200 грн' }
    ]
  }));
  assert.equal(listRows(documentRef, 'zagalni').length, 2);

  loader.renderPricePayload(documentRef, buildPayload({
    zagalni: [{ id: 'zagalni-002', name: 'Нова послуга', price: '200 грн' }]
  }));
  assert.deepEqual(listRows(documentRef, 'zagalni'), [['Нова послуга', '200 грн']]);
});

test('preserves Google Sheets row order and supports an empty category', () => {
  const documentRef = new FakeDocument();
  loader.renderPricePayload(documentRef, buildPayload({
    zagalni: [
      { id: 'zagalni-003', name: 'Третя', price: '300 грн' },
      { id: 'zagalni-001', name: 'Перша', price: '100 грн' },
      { id: 'zagalni-002', name: 'Друга', price: '200 грн' }
    ],
    hirurgiya: []
  }));

  assert.deepEqual(listRows(documentRef, 'zagalni').map((row) => row[0]), ['Третя', 'Перша', 'Друга']);
  assert.deepEqual(listRows(documentRef, 'hirurgiya'), []);
});

test('rejects empty service rows without changing the static fallback', async () => {
  const documentRef = new FakeDocument();
  const before = documentRef.snapshot();
  const loaded = await loader.loadPrices({
    documentRef,
    endpoint,
    fetchImpl: async () => okResponse(buildPayload({
      zagalni: [{ id: 'zagalni-002', name: '  ', price: '400 грн' }]
    })),
    logger: silentLogger
  });

  assert.equal(loaded, false);
  assert.deepEqual(documentRef.snapshot(), before);
});

test('rejects unknown and missing categories atomically', () => {
  const unknown = buildPayload();
  unknown.categories.nevidoma = [];
  assert.throws(() => loader.validatePricePayload(unknown), /Unknown category/);

  const missing = buildPayload();
  delete missing.categories.terapiya;
  assert.throws(() => loader.validatePricePayload(missing), /Missing category/);
});

test('rejects invalid category, service, name and price value types', () => {
  assert.throws(
    () => loader.validatePricePayload(buildPayload({ zagalni: {} })),
    /must be an array/
  );
  assert.throws(
    () => loader.validatePricePayload(buildPayload({ zagalni: ['not an object'] })),
    /must be an object/
  );
  assert.throws(
    () => loader.validatePricePayload(buildPayload({
      zagalni: [{ id: 'zagalni-001', name: 400, price: '400 грн' }]
    })),
    /name must be a string/
  );
  assert.throws(
    () => loader.validatePricePayload(buildPayload({
      zagalni: [{ id: 'zagalni-001', name: 'Консультація', price: 400 }]
    })),
    /price must be a string/
  );
});

test('rejects a wrong or absent schema version', () => {
  assert.throws(
    () => loader.validatePricePayload(buildPayload({}, { schemaVersion: 2 })),
    /Unsupported schemaVersion/
  );
  assert.throws(
    () => loader.validatePricePayload(buildPayload({}, { schemaVersion: undefined })),
    /Unsupported schemaVersion/
  );
});

test('rejects damaged JSON and HTTP errors', async () => {
  await assert.rejects(
    loader.fetchPricePayload({
      endpoint,
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        json: async () => { throw new SyntaxError('bad JSON'); }
      })
    }),
    /invalid JSON/
  );

  await assert.rejects(
    loader.fetchPricePayload({
      endpoint,
      fetchImpl: async () => ({ ok: false, status: 503 })
    }),
    /HTTP 503/
  );
});

test('aborts a timed-out request', async () => {
  const neverCompletes = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => {
      const error = new Error('aborted');
      error.name = 'AbortError';
      reject(error);
    }, { once: true });
  });

  await assert.rejects(
    loader.fetchPricePayload({ endpoint, fetchImpl: neverCompletes, timeoutMs: 5 }),
    /aborted/
  );
});

test('uses textContent for XSS-like values and never creates executable markup', () => {
  const documentRef = new FakeDocument();
  const row = loader.createPriceRow(documentRef, {
    name: '<script>alert(1)</script>',
    price: '<img src=x onerror=alert(1)>'
  });

  assert.equal(row.children[0].textContent, '<script>alert(1)</script>');
  assert.equal(row.children[1].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(row.children.length, 2);
  assert.throws(
    () => loader.validatePricePayload(buildPayload({
      zagalni: [{ id: 'zagalni-001', name: '<script>alert(1)</script>', price: '400 грн' }]
    })),
    /markup or script-like content/
  );
});

test('rejects HTML tags and excessive values', () => {
  assert.throws(
    () => loader.validatePricePayload(buildPayload({
      zagalni: [{ id: 'zagalni-001', name: '<b>Консультація</b>', price: '400 грн' }]
    })),
    /markup or script-like content/
  );
  assert.throws(
    () => loader.validatePricePayload(buildPayload({
      zagalni: [{ id: 'zagalni-001', name: 'Д'.repeat(301), price: '400 грн' }]
    })),
    /too long/
  );
});

test('rejects an absent or invalid endpoint before making a request', async () => {
  let fetchCalled = false;
  await assert.rejects(
    loader.fetchPricePayload({
      endpoint: loader.PRICE_API_URL,
      fetchImpl: async () => { fetchCalled = true; return okResponse(buildPayload()); }
    }),
    /endpoint is not configured/
  );
  assert.equal(fetchCalled, false);
});

test('keeps the static fallback when Google is unavailable', async () => {
  const documentRef = new FakeDocument();
  const before = documentRef.snapshot();
  const loaded = await loader.loadPrices({
    documentRef,
    endpoint,
    fetchImpl: async () => { throw new TypeError('network unavailable'); },
    logger: silentLogger
  });

  assert.equal(loaded, false);
  assert.deepEqual(documentRef.snapshot(), before);
});

test('uses only safe DOM APIs in the public loader source', async () => {
  const source = await import('node:fs/promises').then((fs) =>
    fs.readFile(new URL('../price-loader.js', import.meta.url), 'utf8')
  );
  assert.match(source, /documentRef\.createElement/);
  assert.match(source, /\.textContent\s*=/);
  assert.match(source, /\.append\(/);
  assert.match(source, /\.replaceChildren\(/);
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.doesNotMatch(source, /insertAdjacentHTML|document\.write|\beval\s*\(/);
});
