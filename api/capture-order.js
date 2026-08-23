import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const CURRENCY = "EUR";
const REFERENCE_LINK_TTL_MS = 180 * 24 * 60 * 60 * 1000;

function paypalBaseUrl() {
  const mode = String(process.env.PAYPAL_ENV || process.env.PAYPAL_MODE || "live").toLowerCase();
  return mode === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
}
function paypalSecret() { return process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET; }
function formspreeUrl() {
  const configured = String(process.env.FORMSPREE_ENDPOINT || "").trim();
  if (/^https:\/\/formspree\.io\/f\/[A-Za-z0-9_-]+$/.test(configured)) return configured;
  const formId = String(process.env.FORMSPREE_FORM_ID || "").trim();
  return /^[A-Za-z0-9_-]+$/.test(formId) ? `https://formspree.io/f/${formId}` : "";
}
function referenceSigningSecret() { return String(process.env.ORDER_REFERENCE_SECRET || process.env.BLOB_READ_WRITE_TOKEN || ""); }
function romanianPricing() { return JSON.parse(readFileSync(join(process.cwd(), "pricing-ro.json"), "utf8")); }

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
    return [product.id, { ...product, price_ro: Number.isFinite(ron) ? ron : Number(product.price_ro), price_ro_eur: Number.isFinite(ron) ? Number((ron / 5).toFixed(2)) : Number(product.price_ro_eur) }];
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
    if (!Number.isFinite(price) || price < 0) throw new Error("INVALID_CART");

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
    return { id: String(product.id), name: String(product.name), quantity, price, options, attachments };
  });
}

function signedReferenceUrl(req, pathname) {
  const secret = referenceSigningSecret();
  const host = String(req.headers.host || "");
  if (!secret || !host) return "";
  const exp = String(Date.now() + REFERENCE_LINK_TTL_MS);
  const sig = createHmac("sha256", secret).update(`${pathname}.${exp}`).digest("hex");
  return `https://${host}/api/order-reference?pathname=${encodeURIComponent(pathname)}&exp=${exp}&sig=${sig}`;
}
function requestedDate(requestBody) {
  const value = String(requestBody?.cart?.requiredByDate || "");
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "Not requested";
}
function shippingSummary(details) {
  const shipping = details.purchase_units?.[0]?.shipping;
  const address = shipping?.address || {};
  return [shipping?.name?.full_name, address.address_line_1, address.address_line_2, address.admin_area_2, address.admin_area_1, address.postal_code, address.country_code].filter(Boolean).join(", ") || "See PayPal order";
}

async function notifySeller(req, { details, items, captureID, orderID, market, total }) {
  const endpoint = formspreeUrl();
  if (!endpoint) return false;
  const itemLines = items.flatMap((item, itemIndex) => {
    const lines = [`${itemIndex + 1}. ${item.name} × ${item.quantity} — ${CURRENCY} ${(item.price * item.quantity).toFixed(2)}`];
    for (const [key, value] of Object.entries(item.options || {})) lines.push(`   ${key.replaceAll("_", " ")}: ${value}`);
    item.attachments.forEach((attachment, photoIndex) => {
      const link = signedReferenceUrl(req, attachment.pathname);
      lines.push(`   Reference photo ${photoIndex + 1}: ${attachment.name}${link ? ` — ${link}` : ` — private blob: ${attachment.pathname}`}`);
    });
    return lines;
  });
  const payerName = [details.payer?.name?.given_name, details.payer?.name?.surname].filter(Boolean).join(" ") || "Not provided";
  const payerEmail = details.payer?.email_address || "Not provided";
  const message = [
    "PAID VELVET CHARMS — ART & GIFTS ORDER",
    `PayPal order: ${orderID}`,
    `PayPal capture: ${captureID}`,
    `Pricing market: ${market}`,
    `Paid product total: ${CURRENCY} ${total.toFixed(2)}`,
    `Preferred date: ${requestedDate(req.body)} (not confirmed until production slot is reviewed)`,
    `Customer: ${payerName}`,
    `Customer email: ${payerEmail}`,
    `Shipping address: ${shippingSummary(details)}`,
    "Shipping charge: handled separately; not included in this product total.",
    "",
    "ITEMS",
    ...itemLines
  ].join("\n");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ name: payerName, email: payerEmail === "Not provided" ? "" : payerEmail, message, paypal_order_id: orderID, paypal_capture_id: captureID, _subject: `PAID Art & Gifts order — ${orderID}` })
    });
    if (!response.ok) console.error("Seller order handoff failed:", response.status, await response.text().catch(() => ""));
    return response.ok;
  } catch (error) {
    console.error("Seller order handoff error:", error);
    return false;
  }
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

function completedCapture(details, expectedTotal) {
  if (details?.status !== "COMPLETED") return null;
  const capture = details.purchase_units?.[0]?.payments?.captures?.[0];
  const amount = capture?.amount;
  if (!capture?.id || amount?.currency_code !== CURRENCY || Number(amount?.value) !== Number(expectedTotal.toFixed(2))) return null;
  return capture;
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  const orderID = String(req.body?.orderID || "");
  if (!/^[A-Z0-9]{1,36}$/i.test(orderID)) return res.status(400).json({ error: "Missing or invalid PayPal order ID." });

  try {
    const baseUrl = paypalBaseUrl();
    const token = await accessToken(baseUrl);
    const detailsResponse = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}`, { headers: { Authorization: `Bearer ${token}` } });
    const details = await detailsResponse.json();
    if (!detailsResponse.ok) return res.status(502).json({ error: "PayPal order details could not be verified." });

    const storedMarket = details.purchase_units?.[0]?.custom_id;
    if (storedMarket !== "RO" && storedMarket !== "INTL") return res.status(409).json({ error: "The approved PayPal order has an invalid pricing market." });
    const items = validatedItems(req.body, storedMarket);
    const expectedTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const paypalItems = details.purchase_units?.[0]?.items || [];
    const itemsMatch = paypalItems.length === items.length && items.every((item, index) => paypalItems[index]?.sku === item.id && Number(paypalItems[index]?.quantity) === item.quantity && paypalItems[index]?.unit_amount?.currency_code === CURRENCY && Number(paypalItems[index]?.unit_amount?.value) === Number(item.price.toFixed(2)));
    const approvedAmount = details.purchase_units?.[0]?.amount;
    const amountMatches = approvedAmount?.currency_code === CURRENCY && Number(approvedAmount?.value) === Number(expectedTotal.toFixed(2));
    if (!itemsMatch || !amountMatches) return res.status(409).json({ error: "The approved PayPal order no longer matches this cart." });

    const previousCapture = completedCapture(details, expectedTotal);
    if (details.status === "COMPLETED") {
      if (!previousCapture) return res.status(409).json({ error: "The completed PayPal order does not match the expected captured amount." });
      const sellerNotificationSent = await notifySeller(req, { details, items, captureID: previousCapture.id, orderID: details.id || orderID, market: storedMarket, total: expectedTotal });
      return res.status(200).json({ status: "COMPLETED", orderID: details.id || orderID, captureID: previousCapture.id, sellerNotificationSent, recovered: true });
    }

    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=representation" } });
    const capture = await captureResponse.json();
    if (!captureResponse.ok) return res.status(502).json({ error: "PayPal could not confirm the payment." });
    const captureID = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id || "";
    const capturedAmount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    if (capture.status !== "COMPLETED" || capturedAmount?.currency_code !== CURRENCY || Number(capturedAmount?.value) !== Number(expectedTotal.toFixed(2))) return res.status(502).json({ error: "PayPal payment was not completed." });

    const sellerNotificationSent = await notifySeller(req, { details, items, captureID, orderID: capture.id || orderID, market: storedMarket, total: expectedTotal });
    return res.status(200).json({ status: capture.status, orderID: capture.id || orderID, captureID, sellerNotificationSent, recovered: false });
  } catch (error) {
    console.error("Capture order error:", error);
    if (["INVALID_CART", "INVALID_CUSTOMIZATION"].includes(error.message)) return res.status(400).json({ error: "The cart or customization details are invalid." });
    if (error.message === "PAYPAL_NOT_CONFIGURED") return res.status(503).json({ error: "PayPal is not configured yet." });
    return res.status(500).json({ error: "Payment could not be confirmed." });
  }
}
