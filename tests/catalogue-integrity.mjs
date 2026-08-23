import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const catalogue = JSON.parse(readFileSync(join(root, "catalogue-art-gifts.json"), "utf8"));
const pricingRo = JSON.parse(readFileSync(join(root, "pricing-ro.json"), "utf8"));
const products = [];
for (const category of catalogue.categories || []) {
  for (const product of category.products || []) products.push(product);
  for (const subcategory of category.subcategories || []) for (const product of subcategory.products || []) products.push(product);
}

assert.equal(products.length, 33, "Art & Gifts should keep all 33 existing products");
assert.equal(Object.keys(pricingRo).length, 33, "Romanian pricing map must cover all 33 products");
const ids = new Set(); let imageCount = 0;
for (const product of products) {
  assert.ok(product.id && typeof product.id === "string", "Every product needs an id");
  assert.ok(!ids.has(product.id), `Duplicate product id: ${product.id}`); ids.add(product.id);
  assert.ok(product.name && typeof product.name === "string", `Missing product name for ${product.id}`);
  assert.ok(Number.isFinite(Number(product.price)) && Number(product.price) > 0, `Invalid international price for ${product.id}`);
  assert.ok(Number.isFinite(Number(pricingRo[product.id])) && Number(pricingRo[product.id]) > 0, `Missing curated Romanian price for ${product.id}`);
  assert.ok(Number.isFinite(Number(product.price_ro_eur)) && Number(product.price_ro_eur) > 0, `Invalid Romanian PayPal fallback price for ${product.id}`);
  const expectedRoEur = Number((Number(pricingRo[product.id]) / 5).toFixed(2));
  assert.equal(Number(product.price_ro_eur), expectedRoEur, `${product.id} Romanian PayPal price must stay aligned with curated RON pricing`);
  for (const key of ["gift_wrap", "gift_card", "collectible_charm", "velvet_passport"]) assert.ok(Array.isArray(product.options?.[key]) && product.options[key].length > 0, `Missing ${key} choices for ${product.id}`);
  assert.ok(Array.isArray(product.images) && product.images.length > 0, `Missing images for ${product.id}`);
  for (const image of product.images) { imageCount += 1; assert.ok(typeof image === "string" && image.trim(), `Invalid image reference for ${product.id}`); assert.ok(existsSync(join(root, image)), `Missing image file: ${image}`); }
}
assert.equal(imageCount, 118, "Art & Gifts should keep all 118 existing product image references");

for (const requiredFile of ["catalogue.html","script.js","features.js","localization.js","currency.js","api/currency.js","production.css","pricing-ro.json","api/create-order.js","api/capture-order.js","api/upload-photo.js","api/upload.js","api/reference-file.js","api/delete-reference.js","custom-orders.js","shipping-clarity.js","language-polish.js"]) {
  assert.ok(existsSync(join(root, requiredFile)), `Missing required file: ${requiredFile}`);
}

const script = readFileSync(join(root, "script.js"), "utf8");
const features = readFileSync(join(root, "features.js"), "utf8");
const createOrder = readFileSync(join(root, "api/create-order.js"), "utf8");
const captureOrder = readFileSync(join(root, "api/capture-order.js"), "utf8");
const customOrders = readFileSync(join(root, "custom-orders.js"), "utf8");
const upload = readFileSync(join(root, "api/upload.js"), "utf8");
const referenceFile = readFileSync(join(root, "api/reference-file.js"), "utf8");
const currencyApi = readFileSync(join(root, "api/currency.js"), "utf8");
const shipping = readFileSync(join(root, "shipping-clarity.js"), "utf8");
const catalogueHtml = readFileSync(join(root, "catalogue.html"), "utf8");

assert.match(script, /data-eur-price/, "Catalogue must expose EUR base prices for localization");
assert.match(script, /approximateMakingTime/, "Catalogue must show realistic making times");
assert.match(features, /VELVET_CURRENCY/, "Cart must use the visitor's local currency");
assert.match(createOrder, /pricing-ro\.json/, "PayPal creation must use the curated Romanian pricing map");
assert.match(captureOrder, /pricing-ro\.json/, "PayPal capture must revalidate the curated Romanian pricing map");
assert.match(createOrder, /x-vercel-ip-timezone/, "PayPal creation must share the Romania geolocation fallback");
assert.match(createOrder, /custom_id:\s*market/, "Checkout must stamp the access market into the PayPal order");
assert.match(captureOrder, /storedMarket/, "Capture must trust the server-stamped access market, not a shipping address");
assert.match(captureOrder, /amountMatches/, "Capture must verify approved amount before collecting payment");
assert.doesNotMatch(captureOrder, /shipping.*Romania|delivery address in Romania/i, "Delivery address must not determine Romanian pricing");
assert.doesNotMatch(captureOrder, /RESEND_API_KEY|resend\.com/i, "Current launch checkout must remain PayPal-only for customer payment confirmation");
assert.match(currencyApi, /x-vercel-ip-country/, "currency display must use access country");
assert.match(currencyApi, /x-vercel-ip-timezone/, "currency display must share checkout's Bucharest fallback");
assert.match(currencyApi, /Europe\/Bucharest/, "currency fallback must align with Romania pricing fallback");
assert.match(catalogueHtml, /language-polish\.js/, "final natural-language polish must load in the catalogue");
assert.match(catalogueHtml, /shipping-clarity\.js/, "explicit shipping-cost disclosure must load in the catalogue");
assert.match(shipping, /Shipping is not included in the product total/);
assert.match(shipping, /No shipping charge is taken without your approval/);
for (const language of ['ro','fr','it','de']) assert.match(shipping, new RegExp(`${language}:`), `shipping disclosure needs ${language} localization`);
assert.match(customOrders, /velvet_language_art_gifts/, "Custom request status messages must follow the Art & Gifts language setting");
assert.match(customOrders, /delete-reference/, "Failed custom requests must clean up newly uploaded private references");
assert.match(upload, /access:\s*['"]private['"]/, "Custom references must use private Blob storage");
assert.match(referenceFile, /MAX_REFERENCE_AGE_MS/, "Private custom reference links must expire");

console.log(`Catalogue integrity OK: ${products.length} products, ${imageCount} image references, regional pricing, currency fallback, shipping disclosure, private uploads and PayPal validation are intact.`);
