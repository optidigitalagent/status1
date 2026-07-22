import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../conversion-tracking.js', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { buildConversionDetail } = await import(moduleUrl);

const mobileCall = buildConversionDetail({
  href: 'tel:+380983181262',
  isMapLink: false,
  placement: 'mobile_sticky',
  pagePath: '/ortodontiya.html'
});
assert.deepEqual(mobileCall, {
  event: 'status_conversion_intent',
  interaction_type: 'phone_click',
  placement: 'mobile_sticky',
  page_path: '/ortodontiya.html',
  phone_line: 'mobile_098'
});

const directions = buildConversionDetail({
  href: 'https://www.google.com/maps?cid=11625904097192140703',
  isMapLink: true,
  placement: 'contact_details',
  pagePath: '/'
});
assert.equal(directions.interaction_type, 'directions_click');
assert.equal('phone_line' in directions, false);

const instagram = buildConversionDetail({
  href: 'https://instagram.com/status_dent_zp',
  isMapLink: false,
  placement: 'footer',
  pagePath: '/price.html'
});
assert.equal(instagram.interaction_type, 'instagram_click');
assert.equal(JSON.stringify(instagram).includes('tel:'), false);

console.log('Conversion tracking contract passed: phone, directions and Instagram payloads.');
