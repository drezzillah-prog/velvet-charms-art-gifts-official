import fs from 'node:fs';
import assert from 'node:assert/strict';

const shipping = fs.readFileSync('shipping-clarity.js', 'utf8');
const guard = fs.readFileSync('checkout-return-guard.js', 'utf8');

for (const lang of ['en:', 'ro:', 'fr:', 'it:', 'de:']) {
  assert.ok(shipping.includes(lang), `shipping-clarity missing ${lang}`);
  assert.ok(guard.includes(lang), `checkout-return-guard missing ${lang}`);
}

for (const key of ['uploadProgress', 'tooManyPhotos', 'preparingCheckout', 'checkoutError', 'confirmingPayment', 'paymentFailed', 'paymentConfirmed']) {
  assert.ok(shipping.includes(key), `dynamic localization key missing: ${key}`);
}
assert.ok(shipping.includes('node.textContent !== value'), 'dynamic localization writes must stay idempotent');
assert.ok(shipping.includes('nativeAlert'), 'customization alert translation guard missing');
assert.ok(guard.includes('cancelled') && guard.includes('missing'), 'PayPal return messages must be localized');

console.log('Dynamic i18n polish guard passed.');
