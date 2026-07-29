import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8');
const sheetNames = [
  'Загальні',
  'Профілактика',
  'Пародонтологія',
  'Терапія',
  'Ортодонтія',
  'Ортопедія',
  'Хірургія'
];

class MockProtection {
  constructor(range) {
    this.range = range;
    this.description = '';
    this.editors = [];
  }
  setDescription(value) { this.description = value; return this; }
  getDescription() { return this.description; }
  setRange(value) { this.range = value; return this; }
  setWarningOnly() { return this; }
  addEditor(user) { this.editors.push(user); return this; }
  removeEditors() { this.editors = []; return this; }
  getEditors() { return [...this.editors]; }
  canDomainEdit() { return false; }
  setDomainEdit() { return this; }
}

class MockRange {
  constructor(sheet, row, column, rowCount, columnCount) {
    this.sheet = sheet;
    this.row = row;
    this.column = column;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
  }
  getSheet() { return this.sheet; }
  getRow() { return this.row; }
  getColumn() { return this.column; }
  getLastRow() { return this.row + this.rowCount - 1; }
  getLastColumn() { return this.column + this.columnCount - 1; }
  getDisplayValues() {
    return Array.from({ length: this.rowCount }, (_unused, rowOffset) =>
      Array.from({ length: this.columnCount }, (_unusedColumn, columnOffset) =>
        String(this.sheet.rows[this.row - 1 + rowOffset]?.[this.column - 1 + columnOffset] ?? '')
      )
    );
  }
  setValue(value) {
    while (this.sheet.rows.length < this.row) this.sheet.rows.push([]);
    this.sheet.rows[this.row - 1][this.column - 1] = value;
    return this;
  }
  protect() {
    const protection = new MockProtection(this);
    this.sheet.protections.push(protection);
    return protection;
  }
}

class MockSheet {
  constructor(name, serviceRows) {
    this.name = name;
    this.rows = [['ID', 'Назва послуги', 'Ціна'], ...serviceRows.map((row) => [...row])];
    this.protections = [];
    this.hiddenIdColumn = false;
    this.frozenRows = 1;
  }
  getName() { return this.name; }
  getLastRow() {
    for (let index = this.rows.length - 1; index >= 0; index -= 1) {
      if (this.rows[index].some((value) => String(value ?? '').trim())) return index + 1;
    }
    return 0;
  }
  getRange(rowOrNotation, column, rowCount, columnCount) {
    if (typeof rowOrNotation === 'number') {
      return new MockRange(this, rowOrNotation, column, rowCount, columnCount);
    }
    if (rowOrNotation === 'A1:C1') return new MockRange(this, 1, 1, 1, 3);
    if (rowOrNotation === 'A:A') return new MockRange(this, 1, 1, 200, 1);
    throw new Error(`Unsupported range ${rowOrNotation}`);
  }
  getProtections() { return this.protections; }
  hideColumns(column, count) { if (column === 1 && count === 1) this.hiddenIdColumn = true; }
  getFrozenRows() { return this.frozenRows; }
  setFrozenRows(value) { this.frozenRows = value; }
}

function createRuntime({ invalidHeader = false } = {}) {
  const sheets = new Map(sheetNames.map((sheetName, index) => [
    sheetName,
    new MockSheet(sheetName, [[`${index === 0 ? '' : `service-${index}`}`, `Послуга ${index + 1}`, `${index + 1}00 грн`]])
  ]));
  const instruction = new MockSheet('Інструкція', [['private-note', 'Не публікувати', '']]);
  sheets.set('Інструкція', instruction);
  if (invalidHeader) sheets.get('Хірургія').rows[0][2] = 'Price';

  let uuidCounter = 0;
  const lock = { tryLock: () => true, releaseLock() {} };
  const spreadsheet = { getSheetByName: (name) => sheets.get(name) || null };
  const context = vm.createContext({
    console: { log() {}, error() {} },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(content) {
        return {
          content,
          mimeType: '',
          setMimeType(value) { this.mimeType = value; return this; }
        };
      }
    },
    LockService: { getScriptLock: () => lock },
    Session: { getEffectiveUser: () => ({ email: 'owner@example.com' }) },
    SpreadsheetApp: {
      ProtectionType: { RANGE: 'RANGE' },
      openById: (id) => {
        assert.equal(id, '1Vg2jk_p9DQV2KJubMuD7pcGXAB-k9WO4JZty5YTxYCU');
        return spreadsheet;
      }
    },
    Utilities: {
      getUuid: () => `${String(++uuidCounter).padStart(8, '0')}-0000-0000-0000-000000000000`
    }
  });
  vm.runInContext(source, context, { filename: 'Code.gs' });
  return { context, sheets };
}

test('doGet returns only seven allowlisted categories and assigns a missing stable ID', () => {
  const { context, sheets } = createRuntime();
  const output = context.doGet();
  const payload = JSON.parse(output.content);

  assert.equal(output.mimeType, 'application/json');
  assert.equal(payload.schemaVersion, 1);
  assert.deepEqual(Object.keys(payload.categories), [
    'zagalni', 'profilaktyka', 'parodontologiya', 'terapiya',
    'ortodontiya', 'ortopediya', 'hirurgiya'
  ]);
  assert.equal(JSON.stringify(payload).includes('Не публікувати'), false);
  assert.match(payload.categories.zagalni[0].id, /^zagalni-[a-z0-9]{12}$/);
  assert.equal(sheets.get('Загальні').rows[1][0], payload.categories.zagalni[0].id);
});

test('doGet trims values, preserves order and ignores blank or incomplete rows', () => {
  const { context, sheets } = createRuntime();
  const general = sheets.get('Загальні');
  general.rows.push(
    ['', '', ''],
    ['', 'Без ціни', ''],
    ['', '', '900 грн'],
    ['', '  Друга повна послуга  ', '  500 грн  ']
  );

  const payload = JSON.parse(context.doGet().content);
  assert.deepEqual(
    payload.categories.zagalni.map((service) => [service.name, service.price]),
    [['Послуга 1', '100 грн'], ['Друга повна послуга', '500 грн']]
  );
  assert.equal(general.rows[2][0], '');
  assert.equal(general.rows[3][0], '');
  assert.match(general.rows[5][0], /^zagalni-[a-z0-9]{12}$/);
});

test('setup validates before changes, then protects headers and hides ID columns', () => {
  const invalid = createRuntime({ invalidHeader: true });
  assert.throws(() => invalid.context.setupStatusPriceSheet(), /Invalid header/);
  assert.equal(invalid.sheets.get('Загальні').protections.length, 0);

  const valid = createRuntime();
  assert.match(valid.context.setupStatusPriceSheet(), /Validated and protected 7/);
  sheetNames.forEach((sheetName) => {
    const sheet = valid.sheets.get(sheetName);
    assert.equal(sheet.protections.length, 2);
    assert.equal(sheet.hiddenIdColumn, true);
    assert.equal(sheet.rows.length, 2);
  });
});

test('onEdit assigns an ID only after name and price exist and never changes an existing ID', () => {
  const { context, sheets } = createRuntime();
  const sheet = sheets.get('Загальні');
  sheet.rows.push(['', 'Нова послуга', '']);
  const editRange = sheet.getRange(3, 2, 1, 2);

  context.onEdit({ range: editRange });
  assert.equal(sheet.rows[2][0], '');

  sheet.rows[2][2] = '500 грн';
  context.onEdit({ range: editRange });
  const assignedId = sheet.rows[2][0];
  assert.match(assignedId, /^zagalni-[a-z0-9]{12}$/);

  sheet.rows[2][1] = 'Перейменована послуга';
  sheet.rows[2][2] = '550 грн';
  context.onEdit({ range: editRange });
  assert.equal(sheet.rows[2][0], assignedId);
});
