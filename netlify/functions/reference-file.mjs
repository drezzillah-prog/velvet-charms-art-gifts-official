import { getStore } from "@netlify/blobs";

const MAX_REFERENCE_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function referenceTimestamp(pathname) {
  const match = pathname.match(/\/reference-(\d{13})(?:[-.])/);
  return match ? Number(match[1]) : 0;
}

export default async function handler(request) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  const url = new URL(request.url);
  const pathname = String(url.searchParams.get("pathname") || "");
  const key = String(url.searchParams.get("key") || "");
  if (!pathname || !key || !/^[a-f0-9]{32}$/.test(key) || !pathname.startsWith(`custom-requests/${key}/`)) return new Response("Invalid reference link.", { status: 403 });

  const createdAt = referenceTimestamp(pathname);
  const store = getStore({ name: "velvet-private-references", consistency: "strong" });
  if (!createdAt || Date.now() - createdAt > MAX_REFERENCE_AGE_MS) {
    store.delete(pathname).catch(error => console.error("Expired reference cleanup error:", error));
    return new Response("This private reference link has expired.", { status: 410 });
  }

  try {
    const entry = await store.getWithMetadata(pathname, { type: "arrayBuffer", consistency: "strong" });
    if (!entry?.data) return new Response("Reference image not found.", { status: 404 });
    return new Response(entry.data, { status: 200, headers: { "Content-Type": entry.metadata?.contentType || "application/octet-stream", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Disposition": "inline" } });
  } catch (error) {
    console.error("Netlify private reference read error:", error);
    return new Response("Reference image not found.", { status: 404 });
  }
}
export const config = { path: "/api/reference-file" };
