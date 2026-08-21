import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const cataloguePath = join(root, "catalogue-art-gifts.json");
const catalogue = JSON.parse(readFileSync(cataloguePath, "utf8"));

const products = [];
for (const category of catalogue.categories || []) {
  for (const product of category.products || []) products.push(product);
  for (const subcategory of category.subcategories || []) {
    for (const product of subcategory.products || []) products.push(product);
  }
}

assert.equal(products.length, 33, "Art & Gifts should keep all 33 existing products");

const ids = new Set();
let imageCount = 0;

for (const product of products) {
  assert.ok(product.id && typeof product.id === "string", "Every product needs an id");
  assert.ok(!ids.has(product.id), `Duplicate product id: ${product.id}`);
  ids.add(product.id);

  assert.ok(product.name && typeof product.name === "string", `Missing product name for ${product.id}`);
  assert.ok(Number.isFinite(Number(product.price)) && Number(product.price) > 0, `Invalid international price for ${product.id}`);
  assert.ok(Number.isFinite(Number(product.price_ro)) && Number(product.price_ro) > 0, `Invalid Romanian price for ${product.id}`);
  assert.ok(Number.isFinite(Number(product.price_ro_eur)) && Number(product.price_ro_eur) > 0, `Invalid Romanian PayPal price for ${product.id}`);
  for (const key of ["gift_wrap", "gift_card", "collectible_charm", "velvet_passport"]) {
    assert.ok(Array.isArray(product.options?.[key]) && product.options[key].length > 0, `Missing ${key} choices for ${product.id}`);
  }
  assert.ok(Array.isArray(product.images) && product.images.length > 0, `Missing images for ${product.id}`);

  for (const image of product.images) {
    imageCount += 1;
    assert.ok(typeof image === "string" && image.trim(), `Invalid image reference for ${product.id}`);
    assert.ok(existsSync(join(root, image)), `Missing image file: ${image}`);
  }
}

assert.equal(imageCount, 118, "Art & Gifts should keep all 118 existing product image references");

for (const requiredFile of [
  "catalogue.html",
  "script.js",
  "features.js",
  "localization.js",
  "currency.js",
  "api/currency.js",
  "production.css",
  "api/create-order.js",
  "api/capture-order.js",
  "api/upload-photo.js"
]) {
  assert.ok(existsSync(join(root, requiredFile)), `Missing required file: ${requiredFile}`);
}

console.log(`Catalogue integrity OK: ${products.length} products, ${imageCount} image references, ${ids.size} unique IDs.`);

const script = readFileSync(join(root, "script.js"), "utf8");
const features = readFileSync(join(root, "features.js"), "utf8");
const createOrder = readFileSync(join(root, "api/create-order.js"), "utf8");
const captureOrder = readFileSync(join(root, "api/capture-order.js"), "utf8");
assert.match(script, /data-eur-price/, "Catalogue must expose EUR base prices for localization");
assert.match(script, /approximateMakingTime/, "Catalogue must show realistic making times");
assert.match(features, /VELVET_CURRENCY/, "Cart must use the visitor's local currency");
assert.match(createOrder, /price_ro_eur/, "PayPal creation must use the curated Romanian price");
assert.match(captureOrder, /price_ro_eur/, "PayPal capture must revalidate the curated Romanian price");
