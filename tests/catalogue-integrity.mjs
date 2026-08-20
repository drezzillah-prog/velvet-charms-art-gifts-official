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
  assert.ok(Number.isFinite(Number(product.price)) && Number(product.price) > 0, `Invalid price for ${product.id}`);
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
  "production.css",
  "api/create-order.js",
  "api/capture-order.js",
  "api/upload-photo.js"
]) {
  assert.ok(existsSync(join(root, requiredFile)), `Missing required file: ${requiredFile}`);
}

console.log(`Catalogue integrity OK: ${products.length} products, ${imageCount} image references, ${ids.size} unique IDs.`);
