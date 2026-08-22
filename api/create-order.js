import { readFileSync } from "node:fs";
import { join } from "node:path";

const CURRENCY = "EUR";

function paypalBaseUrl() {
  const mode = String(process.env.PAYPAL_ENV || process.env.PAYPAL_MODE || "live").toLowerCase();
  return mode === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
}
function paypalSecret() { return process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET; }
function romanianPricing() {
  return JSON.parse(readFileSync(join(process.cwd(), "pricing-ro.json"), "utf8"));
}
function catalogueProducts() {
  const catalogue = JSON.parse(readFileSync(join(process.cwd(), "catalogue-art-gifts.json"), "utf8"));
  const roPricing = romanianPricing();
  const products = [];
  for (const category of catalogue.categories || []) {
    products.push(...(category.products || []));
    for (const subcategory of category.subcategories || []) products.push(...(subcategory.products || []));
  }
  return new Map(products.map(product => {
    const ron = Number(roPricing[product.id]);
    return [product.id, {
      ...product,
      price_ro: Number.isFinite(ron) ? ron : Number(product.price_ro),
      price_ro_eur: Number.isFinite(ron) ? Number((ron / 5).toFixed(2)) : Number(product.price_ro_eur)
    }];
  }));
}

function validatedItems(requestBody, market) {
  const rawItems = requestBody?.cart?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 100) throw new Error("INVALID_CART");
  const catalogue = catalogueProducts();
  return rawItems.map(rawItem => {
    const product = catalogue.get(rawItem?.id);
    const quantity = Number.parseInt(rawItem?.qty, 10);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error("INVALID_CART");
    const price = market === "RO" ? Number(product.price_ro_eur) : Number(product.price);
    if (!Number.isFinite(price) || price < 0) throw new Error("INVALID_PRICE");

    const options = {};
    const rawOptions = rawItem?.options && typeof rawItem.options === "object" ? rawItem.options : {};
    for (const [key, value] of Object.entries(rawOptions)) {
      const cleanValue = String(value || "").trim().slice(0, 1000);
      if (!cleanValue) continue;
      if (key === "special_instructions") { options[key] = cleanValue; continue; }
      const allowed = product.options?.[key];
      if (!Array.isArray(allowed) || !allowed.includes(cleanValue)) throw new Error("INVALID_CUSTOMIZATION");
      options[key] = cleanValue;
    }

    const attachments = (Array.isArray(rawItem?.attachments) ? rawItem.attachments : []).slice(0, 5).map(attachment => {
      const pathname = String(attachment?.pathname || "");
      if (!/^custom-orders\/reference-[A-Za-z0-9._-]+$/.test(pathname)) throw new Error("INVALID_CUSTOMIZATION");
      return { pathname, name: String(attachment?.name || "Reference photo").slice(0, 200) };
    });

    return { id: String(product.id), name: String(product.name).slice(0, 127), quantity, price, options, attachments };
  });
}

function paypalDescription(item, requestedDate, index) {
  const details = Object.entries(item.options || {}).map(([key, value]) => `${key.replaceAll("_", " ")}: ${value}`);
  if (item.attachments.length) details.push(`${item.attachments.length} private reference photo(s)`);
  if (index === 0 && requestedDate) details.push(`Preferred date: ${requestedDate} (not confirmed)`);
  return details.join("; ").slice(0, 127);
}

async function accessToken(baseUrl) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = paypalSecret();
  if (!clientId || !secret) throw new Error("PAYPAL_NOT_CONFIGURED");
  const authorization = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, { method: "POST", headers: { Authorization: `Basic ${authorization}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("PAYPAL_AUTH_FAILED");
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const market = String(req.headers["x-vercel-ip-country"] || "").toUpperCase() === "RO" ? "RO" : "INTL";
    const items = validatedItems(req.body, market);
    const itemTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const requestedDate = /^\d{4}-\d{2}-\d{2}$/.test(String(req.body?.cart?.requiredByDate || "")) ? String(req.body.cart.requiredByDate) : "";
    const baseUrl = paypalBaseUrl();
    const token = await accessToken(baseUrl);
    const siteUrl = `https://${req.headers.host}`;
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: market,
          amount: { currency_code: CURRENCY, value: itemTotal.toFixed(2), breakdown: { item_total: { currency_code: CURRENCY, value: itemTotal.toFixed(2) } } },
          items: items.map((item, index) => {
            const description = paypalDescription(item, requestedDate, index);
            return { name: item.name, sku: item.id, quantity: String(item.quantity), unit_amount: { currency_code: CURRENCY, value: item.price.toFixed(2) }, ...(description ? { description } : {}) };
          })
        }],
        payment_source: { paypal: { experience_context: { user_action: "PAY_NOW", return_url: `${siteUrl}/catalogue.html?payment=success`, cancel_url: `${siteUrl}/catalogue.html?payment=cancelled` } } }
      })
    });
    const order = await response.json();
    if (!response.ok) return res.status(502).json({ error: "PayPal could not create the order." });
    const approveUrl = order.links?.find(link => link.rel === "payer-action" || link.rel === "approve")?.href;
    if (!approveUrl) return res.status(502).json({ error: "PayPal approval link is unavailable." });
    return res.status(200).json({ orderID: order.id, approveUrl, market });
  } catch (error) {
    console.error("Create order error:", error);
    if (["INVALID_CART", "INVALID_PRICE", "INVALID_CUSTOMIZATION"].includes(error.message)) return res.status(400).json({ error: "The cart or customization details are invalid." });
    if (error.message === "PAYPAL_NOT_CONFIGURED") return res.status(503).json({ error: "PayPal is not configured yet." });
    return res.status(500).json({ error: "Checkout could not be started." });
  }
}
