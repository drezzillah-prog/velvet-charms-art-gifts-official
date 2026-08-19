import { readFileSync } from "node:fs";
import { join } from "node:path";

const CURRENCY = "EUR";

function paypalBaseUrl() {
  const mode = String(process.env.PAYPAL_ENV || process.env.PAYPAL_MODE || "live").toLowerCase();
  return mode === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

function paypalSecret() {
  return process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET;
}

function catalogueProducts() {
  const catalogue = JSON.parse(
    readFileSync(join(process.cwd(), "catalogue-art-gifts.json"), "utf8")
  );
  const products = [];

  for (const category of catalogue.categories || []) {
    products.push(...(category.products || []));
    for (const subcategory of category.subcategories || []) {
      products.push(...(subcategory.products || []));
    }
  }

  return new Map(products.map(product => [product.id, product]));
}

function validatedItems(requestBody) {
  const rawItems = requestBody?.cart?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 100) {
    throw new Error("INVALID_CART");
  }

  const catalogue = catalogueProducts();

  return rawItems.map(rawItem => {
    const product = catalogue.get(rawItem?.id);
    const quantity = Number.parseInt(rawItem?.qty, 10);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error("INVALID_CART");
    }

    const price = Number(product.price);
    if (!Number.isFinite(price) || price < 0) throw new Error("INVALID_CART");

    return {
      id: String(product.id),
      quantity,
      price
    };
  });
}

async function accessToken(baseUrl) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = paypalSecret();
  if (!clientId || !secret) throw new Error("PAYPAL_NOT_CONFIGURED");

  const authorization = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("PAYPAL_AUTH_FAILED");
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const orderID = String(req.body?.orderID || "");
  if (!/^[A-Z0-9]{1,36}$/i.test(orderID)) {
    return res.status(400).json({ error: "Missing or invalid PayPal order ID." });
  }

  try {
    const items = validatedItems(req.body);
    const expectedTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const baseUrl = paypalBaseUrl();
    const token = await accessToken(baseUrl);

    const detailsResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const details = await detailsResponse.json();
    if (!detailsResponse.ok) {
      return res.status(502).json({ error: "PayPal order details could not be verified." });
    }

    const paypalItems = details.purchase_units?.[0]?.items || [];
    const itemsMatch = paypalItems.length === items.length && items.every((item, index) =>
      paypalItems[index]?.sku === item.id &&
      Number(paypalItems[index]?.quantity) === item.quantity &&
      paypalItems[index]?.unit_amount?.currency_code === CURRENCY &&
      Number(paypalItems[index]?.unit_amount?.value) === Number(item.price.toFixed(2))
    );

    const approvedAmount = details.purchase_units?.[0]?.amount;
    const amountMatches =
      approvedAmount?.currency_code === CURRENCY &&
      Number(approvedAmount?.value) === Number(expectedTotal.toFixed(2));

    if (!itemsMatch || !amountMatches) {
      return res.status(409).json({ error: "The approved PayPal order no longer matches this cart." });
    }

    const captureResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        }
      }
    );

    const capture = await captureResponse.json();
    if (!captureResponse.ok) {
      console.error("PayPal capture failed:", captureResponse.status, capture);
      return res.status(502).json({ error: "PayPal could not confirm the payment." });
    }

    const capturedAmount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    if (
      capture.status !== "COMPLETED" ||
      capturedAmount?.currency_code !== CURRENCY ||
      Number(capturedAmount?.value) !== Number(expectedTotal.toFixed(2))
    ) {
      return res.status(502).json({ error: "PayPal payment was not completed." });
    }

    return res.status(200).json({
      status: capture.status,
      orderID: capture.id,
      captureID: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id || ""
    });
  } catch (error) {
    console.error("Capture order error:", error);

    if (error.message === "INVALID_CART") {
      return res.status(400).json({ error: "The cart is empty or invalid." });
    }
    if (error.message === "PAYPAL_NOT_CONFIGURED") {
      return res.status(503).json({ error: "PayPal is not configured yet." });
    }

    return res.status(500).json({ error: "Payment could not be confirmed." });
  }
}
