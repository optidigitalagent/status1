(function initializeStatusPriceLoader(root) {
  'use strict';

  const SPREADSHEET_ID = '1Vg2jk_p9DQV2KJubMuD7pcGXAB-k9WO4JZty5YTxYCU';
  const SCHEMA_VERSION = 1;
  const REQUEST_TIMEOUT_MS = 7000;
  const MAX_SERVICES_PER_CATEGORY = 500;
  const MAX_NAME_LENGTH = 300;
  const MAX_PRICE_LENGTH = 100;
  const MAX_ID_LENGTH = 100;
  const CATEGORY_SHEETS = Object.freeze({
    zagalni: 'Загальні',
    profilaktyka: 'Профілактика',
    parodontologiya: 'Пародонтологія',
    terapiya: 'Терапія',
    ortodontiya: 'Ортодонтія',
    ortopediya: 'Ортопедія',
    hirurgiya: 'Хірургія'
  });
  const CATEGORY_IDS = Object.freeze(Object.keys(CATEGORY_SHEETS));

  const HTML_TAG_PATTERN = /<\s*\/?\s*[a-z][^>]*>/i;
  const SCRIPT_LIKE_PATTERN = /(?:javascript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=)/i;
  let callbackSequence = 0;

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

    for (const replacement of replacements) replacement.list.replaceChildren(...replacement.rows);
    return validated;
  }

  function isConfiguredSpreadsheetId(spreadsheetId) {
    return typeof spreadsheetId === 'string' && /^[a-zA-Z0-9_-]{20,100}$/.test(spreadsheetId);
  }

  function isSafeCallbackName(callbackName) {
    return typeof callbackName === 'string' && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callbackName);
  }

  function buildSheetQueryUrl(spreadsheetId, sheetName, callbackName, now = Date.now) {
    if (!isConfiguredSpreadsheetId(spreadsheetId)) {
      throw new PriceDataError('The Google Sheets spreadsheet ID is not configured.');
    }
    if (typeof sheetName !== 'string' || !sheetName.trim()) {
      throw new PriceDataError('A valid sheet name is required.');
    }
    if (!isSafeCallbackName(callbackName)) {
      throw new PriceDataError('A safe response callback name is required.');
    }

    const requestUrl = new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`);
    requestUrl.searchParams.set('headers', '1');
    requestUrl.searchParams.set('sheet', sheetName);
    requestUrl.searchParams.set('tq', 'select A, B, C');
    requestUrl.searchParams.set('tqx', `responseHandler:${callbackName}`);
    requestUrl.searchParams.set('_price_cache', String(now()));
    return requestUrl.toString();
  }

  function cellToText(cell) {
    if (!cell || typeof cell !== 'object') return '';
    const value = cell.f !== undefined && cell.f !== null ? cell.f : cell.v;
    return value === undefined || value === null ? '' : String(value).trim();
  }

  function parseGvizResponse(response, categoryId) {
    if (!isPlainObject(response) || response.status !== 'ok') {
      throw new PriceDataError(`Google Sheets returned an invalid response for ${categoryId}.`);
    }
    if (!isPlainObject(response.table) || !Array.isArray(response.table.rows)) {
      throw new PriceDataError(`Google Sheets rows are missing for ${categoryId}.`);
    }

    const services = [];
    for (let index = 0; index < response.table.rows.length; index += 1) {
      const row = response.table.rows[index];
      if (!isPlainObject(row) || !Array.isArray(row.c)) continue;

      const rawId = cellToText(row.c[0]);
      const rawName = cellToText(row.c[1]);
      const rawPrice = cellToText(row.c[2]);

      if (!rawName && !rawPrice) continue;
      if (!rawName || !rawPrice) continue;

      const generatedId = `${categoryId}-row-${index + 2}`;
      const id = /^[a-z0-9_-]{1,100}$/i.test(rawId) ? rawId : generatedId;
      services.push({
        id,
        name: validateText(rawName, `${categoryId}[${index}].name`, MAX_NAME_LENGTH),
        price: validateText(rawPrice, `${categoryId}[${index}].price`, MAX_PRICE_LENGTH)
      });

      if (services.length > MAX_SERVICES_PER_CATEGORY) {
        throw new PriceDataError(`${categoryId} contains too many services.`);
      }
    }

    return Object.freeze(services.map((service) => Object.freeze(service)));
  }

  function querySheet(options = {}) {
    const spreadsheetId = options.spreadsheetId === undefined ? SPREADSHEET_ID : options.spreadsheetId;
    const sheetName = options.sheetName;
    const documentRef = options.documentRef || root.document;
    const setTimeoutImpl = options.setTimeoutImpl || (root.setTimeout && root.setTimeout.bind(root));
    const clearTimeoutImpl = options.clearTimeoutImpl || (root.clearTimeout && root.clearTimeout.bind(root));
    const timeoutMs = options.timeoutMs === undefined ? REQUEST_TIMEOUT_MS : options.timeoutMs;
    const now = options.now || Date.now;

    if (!documentRef || typeof documentRef.createElement !== 'function') {
      return Promise.reject(new PriceDataError('A valid document is required to query Google Sheets.'));
    }
    if (typeof setTimeoutImpl !== 'function' || typeof clearTimeoutImpl !== 'function') {
      return Promise.reject(new PriceDataError('Timer APIs are unavailable.'));
    }

    const scriptParent = documentRef.head || documentRef.documentElement || documentRef.body;
    if (!scriptParent || typeof scriptParent.appendChild !== 'function') {
      return Promise.reject(new PriceDataError('The document cannot load the Google Sheets response.'));
    }

    callbackSequence += 1;
    const callbackName = `__statusPriceSheet${Date.now()}_${callbackSequence}`;
    const script = documentRef.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = buildSheetQueryUrl(spreadsheetId, sheetName, callbackName, now);

    return new Promise((resolve, reject) => {
      let settled = false;
      let timer;

      const cleanup = () => {
        if (timer !== undefined) clearTimeoutImpl(timer);
        try {
          delete root[callbackName];
        } catch {
          root[callbackName] = undefined;
        }
        if (typeof script.remove === 'function') script.remove();
        else if (script.parentNode && typeof script.parentNode.removeChild === 'function') {
          script.parentNode.removeChild(script);
        }
      };

      const finish = (error, response) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (error) reject(error);
        else resolve(response);
      };

      root[callbackName] = (response) => finish(null, response);
      script.onerror = () => finish(new PriceDataError(`Google Sheets request failed for ${sheetName}.`));
      timer = setTimeoutImpl(
        () => finish(new PriceDataError(`Google Sheets request timed out for ${sheetName}.`)),
        timeoutMs
      );

      try {
        scriptParent.appendChild(script);
      } catch (error) {
        finish(error instanceof Error ? error : new PriceDataError('Google Sheets request failed.'));
      }
    });
  }

  async function fetchPricePayload(options = {}) {
    const spreadsheetId = options.spreadsheetId === undefined ? SPREADSHEET_ID : options.spreadsheetId;
    if (!isConfiguredSpreadsheetId(spreadsheetId)) {
      throw new PriceDataError('The Google Sheets spreadsheet ID is not configured.');
    }

    const querySheetImpl = options.querySheetImpl || ((queryOptions) => querySheet(queryOptions));
    const categories = {};

    const categoryEntries = await Promise.all(
      Object.entries(CATEGORY_SHEETS).map(async ([categoryId, sheetName]) => {
        const response = await querySheetImpl({
          spreadsheetId,
          sheetName,
          documentRef: options.documentRef,
          timeoutMs: options.timeoutMs,
          setTimeoutImpl: options.setTimeoutImpl,
          clearTimeoutImpl: options.clearTimeoutImpl,
          now: options.now
        });
        return [categoryId, parseGvizResponse(response, categoryId)];
      })
    );

    for (const [categoryId, services] of categoryEntries) categories[categoryId] = services;
    return validatePricePayload({
      schemaVersion: SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      categories
    });
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
    CATEGORY_SHEETS,
    SPREADSHEET_ID,
    PriceDataError,
    buildSheetQueryUrl,
    cellToText,
    createPriceRow,
    fetchPricePayload,
    isConfiguredSpreadsheetId,
    loadPrices,
    parseGvizResponse,
    querySheet,
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
