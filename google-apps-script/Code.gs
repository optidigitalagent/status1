const STATUS_PRICE_SPREADSHEET_ID = '1Vg2jk_p9DQV2KJubMuD7pcGXAB-k9WO4JZty5YTxYCU';
const STATUS_PRICE_SCHEMA_VERSION = 1;
const STATUS_PRICE_HEADERS = Object.freeze(['ID', 'Назва послуги', 'Ціна']);
const STATUS_PRICE_MAX_SERVICES = 500;
const STATUS_PRICE_MAX_NAME_LENGTH = 300;
const STATUS_PRICE_MAX_PRICE_LENGTH = 100;
const STATUS_PRICE_HEADER_PROTECTION = 'Status price feed — protected headers';
const STATUS_PRICE_ID_PROTECTION = 'Status price feed — protected service IDs';

const STATUS_PRICE_CATEGORIES = Object.freeze([
  Object.freeze({ sheetName: 'Загальні', categoryId: 'zagalni', idPrefix: 'zagalni' }),
  Object.freeze({ sheetName: 'Профілактика', categoryId: 'profilaktyka', idPrefix: 'profilaktyka' }),
  Object.freeze({ sheetName: 'Пародонтологія', categoryId: 'parodontologiya', idPrefix: 'parodontologiya' }),
  Object.freeze({ sheetName: 'Терапія', categoryId: 'terapiya', idPrefix: 'terapiya' }),
  Object.freeze({ sheetName: 'Ортодонтія', categoryId: 'ortodontiya', idPrefix: 'ortodontiya' }),
  Object.freeze({ sheetName: 'Ортопедія', categoryId: 'ortopediya', idPrefix: 'ortopediya' }),
  Object.freeze({ sheetName: 'Хірургія', categoryId: 'hirurgiya', idPrefix: 'hirurgiya' })
]);

/**
 * Public Web App entry point. It returns only the seven allowlisted price tabs.
 */
function doGet() {
  try {
    return statusPriceJsonResponse_(statusPriceBuildPayload_());
  } catch (error) {
    console.error('Status price feed could not be built.');
    return statusPriceJsonResponse_({
      schemaVersion: STATUS_PRICE_SCHEMA_VERSION,
      error: 'Price data unavailable'
    });
  }
}

/**
 * Run once from the Apps Script editor before deploying the Web App.
 * It validates all expected tabs and headers, then protects headers and IDs.
 */
function setupStatusPriceSheet() {
  const spreadsheet = SpreadsheetApp.openById(STATUS_PRICE_SPREADSHEET_ID);
  const resolvedSheets = [];

  // Validate everything before making any setup change.
  STATUS_PRICE_CATEGORIES.forEach((category) => {
    const sheet = spreadsheet.getSheetByName(category.sheetName);
    if (!sheet) throw new Error(`Missing required sheet: ${category.sheetName}`);
    statusPriceAssertHeaders_(sheet);
    resolvedSheets.push(sheet);
  });

  resolvedSheets.forEach((sheet) => {
    statusPriceProtectRange_(sheet, 'A1:C1', STATUS_PRICE_HEADER_PROTECTION);
    statusPriceProtectRange_(sheet, 'A:A', STATUS_PRICE_ID_PROTECTION);
    sheet.hideColumns(1, 1);
    if (sheet.getFrozenRows() < 1) sheet.setFrozenRows(1);
  });

  return `Validated and protected ${resolvedSheets.length} Status price sheets.`;
}

/**
 * Bound simple trigger: creates IDs when a client fills columns B and C.
 * Existing IDs, names, prices, categories and row order are never changed.
 */
function onEdit(event) {
  if (!event || !event.range) return;

  const range = event.range;
  const sheet = range.getSheet();
  const category = statusPriceCategoryForSheet_(sheet.getName());
  if (!category || range.getLastRow() < 2) return;

  const firstColumn = range.getColumn();
  const lastColumn = range.getLastColumn();
  if (lastColumn < 2 || firstColumn > 3) return;

  const firstRow = Math.max(2, range.getRow());
  const rowCount = range.getLastRow() - firstRow + 1;
  if (rowCount < 1) return;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;

  try {
    const values = sheet.getRange(firstRow, 1, rowCount, 3).getDisplayValues();
    const usedIds = statusPriceCollectUsedIds_(sheet);

    values.forEach((row, index) => {
      const id = statusPriceTrim_(row[0]);
      const name = statusPriceTrim_(row[1]);
      const price = statusPriceTrim_(row[2]);
      if (id || !name || !price) return;

      const newId = statusPriceCreateId_(category.idPrefix, usedIds);
      sheet.getRange(firstRow + index, 1).setValue(newId);
      usedIds.add(newId);
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Optional editor-side smoke test. Review the execution log; it does not edit prices.
 */
function testStatusPricePayload() {
  const payload = statusPriceBuildPayload_();
  console.log(JSON.stringify(payload, null, 2));
  return payload;
}

function statusPriceBuildPayload_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Could not acquire the price-feed lock.');

  try {
    const spreadsheet = SpreadsheetApp.openById(STATUS_PRICE_SPREADSHEET_ID);
    const categories = {};

    STATUS_PRICE_CATEGORIES.forEach((category) => {
      const sheet = spreadsheet.getSheetByName(category.sheetName);
      if (!sheet) throw new Error(`Missing required sheet: ${category.sheetName}`);
      statusPriceAssertHeaders_(sheet);
      categories[category.categoryId] = statusPriceReadServices_(sheet, category);
    });

    return {
      schemaVersion: STATUS_PRICE_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      categories
    };
  } finally {
    lock.releaseLock();
  }
}

function statusPriceReadServices_(sheet, category) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, 3).getDisplayValues();
  const usedIds = new Set(rows.map((row) => statusPriceTrim_(row[0])).filter(Boolean));
  const services = [];

  rows.forEach((row, index) => {
    let id = statusPriceTrim_(row[0]);
    const name = statusPriceTrim_(row[1]);
    const price = statusPriceTrim_(row[2]);

    if (!id && !name && !price) return;
    if (!name || !price) return;
    statusPriceAssertPublicText_(name, STATUS_PRICE_MAX_NAME_LENGTH, `${category.sheetName} name`);
    statusPriceAssertPublicText_(price, STATUS_PRICE_MAX_PRICE_LENGTH, `${category.sheetName} price`);

    if (!id) {
      id = statusPriceCreateId_(category.idPrefix, usedIds);
      sheet.getRange(index + 2, 1).setValue(id);
      usedIds.add(id);
    }

    if (!/^[a-z0-9_-]{1,100}$/i.test(id)) {
      throw new Error(`Unsafe service ID in ${category.sheetName}.`);
    }
    if (services.length >= STATUS_PRICE_MAX_SERVICES) {
      throw new Error(`Too many services in ${category.sheetName}.`);
    }

    services.push({ id, name, price });
  });

  return services;
}

function statusPriceAssertHeaders_(sheet) {
  const headers = sheet.getRange(1, 1, 1, 3).getDisplayValues()[0].map(statusPriceTrim_);
  STATUS_PRICE_HEADERS.forEach((expected, index) => {
    if (headers[index] !== expected) {
      throw new Error(
        `Invalid header ${sheet.getName()}!${String.fromCharCode(65 + index)}1: expected "${expected}".`
      );
    }
  });
}

function statusPriceProtectRange_(sheet, a1Notation, description) {
  const range = sheet.getRange(a1Notation);
  const protection = sheet
    .getProtections(SpreadsheetApp.ProtectionType.RANGE)
    .find((candidate) => candidate.getDescription() === description) || range.protect();

  protection.setDescription(description);
  protection.setRange(range);
  protection.setWarningOnly(false);

  const effectiveUser = Session.getEffectiveUser();
  protection.addEditor(effectiveUser);
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) protection.setDomainEdit(false);
}

function statusPriceCategoryForSheet_(sheetName) {
  return STATUS_PRICE_CATEGORIES.find((category) => category.sheetName === sheetName) || null;
}

function statusPriceCollectUsedIds_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return new Set();
  return new Set(
    sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues()
      .map((row) => statusPriceTrim_(row[0]))
      .filter(Boolean)
  );
}

function statusPriceCreateId_(prefix, usedIds) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = Utilities.getUuid().replace(/-/g, '').slice(0, 12).toLowerCase();
    const candidate = `${prefix}-${suffix}`;
    if (!usedIds.has(candidate)) return candidate;
  }
  throw new Error('Could not create a unique service ID.');
}

function statusPriceAssertPublicText_(value, maxLength, label) {
  if (!value || value.length > maxLength) throw new Error(`Invalid ${label}.`);
  if (/<\s*\/?\s*[a-z][^>]*>/i.test(value)) throw new Error(`Markup is not allowed in ${label}.`);
  if (/(?:javascript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=)/i.test(value)) {
    throw new Error(`Script-like content is not allowed in ${label}.`);
  }
}

function statusPriceTrim_(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function statusPriceJsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
