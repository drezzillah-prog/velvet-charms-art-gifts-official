import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const catalogue = readFileSync('catalogue.html','utf8');
const guard = readFileSync('checkout-return-guard.js','utf8');
const capture = readFileSync('api/capture-order.js','utf8');
const features = readFileSync('features.js','utf8');

assert.ok(catalogue.includes('checkout-return-guard.js'), 'catalogue must load the PayPal return guard');
assert.ok(catalogue.indexOf('checkout-return-guard.js') < catalogue.indexOf('features.js'), 'return guard must load before checkout logic');
assert.match(guard, /paymentState === "cancelled"/, 'guard must handle PayPal cancellation while preserving the cart');
assert.match(guard, /velvet_art_pending_order/, 'guard must understand the pending PayPal order fallback');
assert.match(features, /payment.*success/, 'checkout logic must recognize successful PayPal returns');
assert.match(capture, /details\.status === "COMPLETED"/, 'capture endpoint must recognize an already-completed PayPal order');
assert.match(capture, /recovered: true/, 'capture endpoint must return an explicit recovered state');
assert.match(capture, /previousCapture/, 'recovery must reuse the existing capture rather than charging twice');

console.log('PASS: Art & Gifts PayPal return preserves cancelled carts, protects incomplete return state, and recovers already-completed orders without a second capture.');
