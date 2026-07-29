(function initializeStatusPriceLoader(root) {
  'use strict';

  // Replace this single value with the deployed Apps Script Web App /exec URL.
  const PRICE_API_URL = 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE';

  const SCHEMA_VERSION = 1;
  const REQUEST_TIMEOUT_MS = 7000;
  const MAX_SERVICES_PER_CATEGORY = 500;
  const MAX_NAME_LENGTH = 300;
  const MAX_PRICE_LENGTH = 100;
  const MAX_ID_LENGTH = 100;
  const CATEGORY_IDS = Object.freeze([
    'zagalni',
    'profilaktyka',
    'parodontologiya',
    'terapiya',
    'ortodontiya',
    'ortopediya',
    'hirurgiya'
  ]);

  const HTML_TAG_PATTERN = /<\s*\/?\s*[a-z][^>]*>/i;
  const SCRIPT_LIKE_PATTERN = /(?:javascript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=)/i;

  class PriceDataError extends Error {
    constructor(message) {
      super(message);
      this.name = 'PriceDataError';
    }
  }

  function isPlainObject(value) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function validateText(value, label, maxLength) {
    if (typeof value !== 'string') throw new PriceDataError(`${label} must be a string.`);

    const trimmed = value.trim();
    if (!trimmed) throw new PriceDataError(`${label} must not be empty.`);
    if (trimmed.length > maxLength) throw new PriceDataError(`${label} is too long.`);
    if (HTML_TAG_PATTERN.test(trimmed) || SCRIPT_LIKE_PATTERN.test(trimmed)) {
      throw new PriceDataError(`${label} contains markup or script-like content.`);
    }

    return trimmed;
  }

  function validateService(service, categoryId, index) {
    if (!isPlainObject(service)) {
      throw new PriceDataError(`${categoryId}[${index}] must be an object.`);
    }

    const id = validateText(service.id, `${categoryId}[${index}].id`, MAX_ID_LENGTH);
    if (!/^[a-z0-9_-]+$/i.test(id)) {
      throw new PriceDataError(`${categoryId}[${index}].id is not safe.`);
    }

    return Object.freeze({
      id,
      name: validateText(service.name, `${categoryId}[${index}].name`, MAX_NAME_LENGTH),
      price: validateText(service.price, `${categoryId}[${index}].price`, MAX_PRICE_LENGTH)
    });
  }

  function validatePricePayload(payload) {
    if (!isPlainObject(payload)) throw new PriceDataError('The price payload must be an object.');
    if (payload.schemaVersion !== SCHEMA_VERSION) {
      throw new PriceDataError(`Unsupported schemaVersion: ${String(payload.schemaVersion)}.`);
    }
    if (!isPlainObject(payload.categories)) {
      throw new PriceDataError('The categories object is missing or invalid.');
    }

    const suppliedCategoryIds = Object.keys(payload.categories);
    const unknownCategory = suppliedCategoryIds.find((id) => !CATEGORY_IDS.includes(id));
    if (unknownCategory) throw new PriceDataError(`Unknown category: ${unknownCategory}.`);

    const categories = {};
    for (const categoryId of CATEGORY_IDS) {
      if (!Object.prototype.hasOwnProperty.call(payload.categories, categoryId)) {
        throw new PriceDataError(`Missing category: ${categoryId}.`);
      }

      const services = payload.categories[categoryId];
      if (!Array.isArray(services)) throw new PriceDataError(`${categoryId} must be an array.`);
      if (services.length > MAX_SERVICES_PER_CATEGORY) {
        throw new PriceDataError(`${categoryId} contains too many services.`);
      }

      categories[categoryId] = Object.freeze(
        services.map((service, index) => validateService(service, categoryId, index))
      );
    }

    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : '',
      categories: Object.freeze(categories)
    });
  }

  function createPriceRow(documentRef, service) {
    const row = documentRef.createElement('li');
    row.className = 'price-row';

    const name = documentRef.createElement('span');
    name.className = 'price-name';
    name.textContent = service.name;

    const cost = documentRef.createElement('span');
    cost.className = 'price-cost';
    cost.textContent = service.price;

    row.append(name, cost);
    return row;
  }

  function renderPricePayload(documentRef, payload) {
    if (!documentRef || typeof documentRef.createElement !== 'function') {
      throw new PriceDataError('A valid document is required to render prices.');
    }

    const validated = validatePricePayload(payload);
    const replacements = [];

    for (const categoryId of CATEGORY_IDS) {
      const section = documentRef.getElementById(categoryId);
      const list = section && section.querySelector('.price-list');
      if (!list || typeof list.replaceChildren !== 'function') {
        throw new PriceDataError(`Price list container is missing for ${categoryId}.`);
      }

      const rows = validated.categories[categoryId].map((service) =>
        createPriceRow(documentRef, service)
      );
      replacements.push({ list, rows });
    }

    // Nothing in the visible fallback is changed until all categories and rows are valid.
    for (const replacement of replacements) replacement.list.replaceChildren(...replacement.rows);
    return validated;
  }

  function isConfiguredEndpoint(endpoint) {
    if (typeof endpoint !== 'string') return false;

    try {
      const url = new URL(endpoint);
      return url.protocol === 'https:' &&
        url.hostname === 'script.google.com' &&
        /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname);
    } catch {
      return false;
    }
  }

  function buildRequestUrl(endpoint, now = Date.now) {
    if (!isConfiguredEndpoint(endpoint)) {
      throw new PriceDataError('The Apps Script Web App endpoint is not configured.');
    }

    const requestUrl = new URL(endpoint);
    requestUrl.searchParams.set('_price_cache', String(now()));
    return requestUrl.toString();
  }

  async function fetchPricePayload(options = {}) {
    const endpoint = options.endpoint === undefined ? PRICE_API_URL : options.endpoint;
    const fetchImpl = options.fetchImpl || (root.fetch && root.fetch.bind(root));
    const AbortControllerImpl = options.AbortControllerImpl || root.AbortController;
    const setTimeoutImpl = options.setTimeoutImpl || (root.setTimeout && root.setTimeout.bind(root));
    const clearTimeoutImpl = options.clearTimeoutImpl || (root.clearTimeout && root.clearTimeout.bind(root));
    const timeoutMs = options.timeoutMs === undefined ? REQUEST_TIMEOUT_MS : options.timeoutMs;

    if (typeof fetchImpl !== 'function') throw new PriceDataError('Fetch is unavailable.');
    if (typeof AbortControllerImpl !== 'function') throw new PriceDataError('AbortController is unavailable.');
    if (typeof setTimeoutImpl !== 'function' || typeof clearTimeoutImpl !== 'function') {
      throw new PriceDataError('Timer APIs are unavailable.');
    }

    const requestUrl = buildRequestUrl(endpoint, options.now || Date.now);
    const controller = new AbortControllerImpl();
    const timer = setTimeoutImpl(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(requestUrl, {
        cache: 'no-store',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
        redirect: 'follow',
        signal: controller.signal
      });

      if (!response || !response.ok) {
        throw new PriceDataError(`Price endpoint returned HTTP ${response ? response.status : 'unknown'}.`);
      }

      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new PriceDataError('Price endpoint returned invalid JSON.');
      }

      return validatePricePayload(payload);
    } finally {
      clearTimeoutImpl(timer);
    }
  }

  async function loadPrices(options = {}) {
    const documentRef = options.documentRef || root.document;
    const logger = options.logger || root.console;

    try {
      const payload = await fetchPricePayload(options);
      renderPricePayload(documentRef, payload);
      return true;
    } catch {
      if (logger && typeof logger.warn === 'function') {
        logger.warn('Dynamic price list is unavailable; the static fallback remains visible.');
      }
      return false;
    }
  }

  const api = Object.freeze({
    CATEGORY_IDS,
    PRICE_API_URL,
    PriceDataError,
    buildRequestUrl,
    createPriceRow,
    fetchPricePayload,
    isConfiguredEndpoint,
    loadPrices,
    renderPricePayload,
    validatePricePayload
  });

  if (typeof module === 'object' && module.exports) module.exports = api;
  root.StatusPriceLoader = api;

  if (root.document) {
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', () => loadPrices(), { once: true });
    } else {
      loadPrices();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
