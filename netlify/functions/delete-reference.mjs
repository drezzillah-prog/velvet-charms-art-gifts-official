import { getStore } from "@netlify/blobs";

export default async function handler(request) {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
  let body = {};
  try { body = await request.json(); } catch {}
  const pathname = String(body?.pathname || "");
  const key = String(body?.key || "");
  if (!pathname || !key || !/^[a-f0-9]{32}$/.test(key) || !pathname.startsWith(`custom-requests/${key}/`)) return Response.json({ error: "Invalid reference cleanup request." }, { status: 403 });
  try {
    const store = getStore({ name: "velvet-private-references", consistency: "strong" });
    await store.delete(pathname);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Netlify reference cleanup error:", error);
    return Response.json({ ok: false });
  }
}
export const config = { path: "/api/delete-reference" };
