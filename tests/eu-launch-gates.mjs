import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const script = readFileSync('script.js','utf8');
const catalogue = JSON.parse(readFileSync('catalogue-art-gifts.json','utf8'));
const products = (catalogue.categories||[]).flatMap(c=>[...(c.products||[]),...(c.subcategories||[]).flatMap(s=>s.products||[])]);
const ids = new Set(products.map(p=>p.id));

for (const id of ['relax_restore','cozy_winter','home_harmony']) {
  assert.ok(ids.has(id), `${id} must remain preserved in the source catalogue`);
  assert.match(script, new RegExp(`\\b${id}\\b`), `${id} must be hidden by the EU storefront gate`);
}
for (const id of ['epoxy_lamp','wall_clock_large']) {
  assert.ok(ids.has(id), `${id} must remain preserved in the source catalogue`);
  assert.match(script, new RegExp(`\\b${id}\\b`), `${id} must be checkout-blocked in the EU storefront`);
}
assert.match(script,/__storefront_hidden/);
assert.match(script,/__checkout_blocked/);
assert.match(script,/disabled aria-disabled="true">Checkout unavailable/);
console.log('EU launch gates OK: mixed bundles preserved-but-hidden; powered products preserved-but-blocked.');

if(!captureOrder.includes('PRODUCT_NOT_READY')) throw new Error('capture must reject gated EU products');
for(const id of ['relax_restore','cozy_winter','home_harmony','epoxy_lamp','wall_clock_large']) if(!captureOrder.includes(id)) throw new Error(`capture gate missing ${id}`);
