import fs from 'node:fs';

const currency = fs.readFileSync('currency.js', 'utf8');
const shipping = fs.readFileSync('shipping-clarity.js', 'utf8');

if (currency.includes('observe(root')) {
  throw new Error('Art & Gifts currency.js must not observe catalogue-root');
}
if (!currency.includes('velvet:catalogue-rendered')) {
  throw new Error('Art & Gifts currency.js must refresh from the explicit catalogue render event');
}
if (!currency.includes('node.textContent !== nextValue')) {
  throw new Error('Art & Gifts currency price writes must remain idempotent');
}
if (!shipping.includes('totalRow.textContent !== c.total')) {
  throw new Error('Shipping total label writes must remain idempotent');
}
if (!shipping.includes('note.textContent !== c.shipping')) {
  throw new Error('Shipping note writes must remain idempotent');
}
if (!shipping.includes('queueMicrotask')) {
  throw new Error('Shipping observer updates must remain coalesced');
}

console.log('Observer loop regression guard PASS');
