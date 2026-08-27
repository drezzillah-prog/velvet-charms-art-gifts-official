import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UPLOAD_WINDOW_MS = 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 20;
const uploadBuckets = globalThis.__VELVET_NETLIFY_ART_CUSTOM_UPLOAD_BUCKETS || new Map();
globalThis.__VELVET_NETLIFY_ART_CUSTOM_UPLOAD_BUCKETS = uploadBuckets;

function sameOrigin(request) {
  const origin = String(request.headers.get("origin") || "").trim();
  if (!origin) return true;
  try { return new URL(origin).host.toLowerCase() === new URL(request.url).host.toLowerCase(); } catch { return false; }
}
function allowUpload(ip) {
  const now = Date.now();
  const key = ip || "unknown";
  const bucket = uploadBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= UPLOAD_WINDOW_MS) { uploadBuckets.set(key, { startedAt: now, count: 1 }); return true; }
  if (bucket.count >= MAX_UPLOADS_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}
function json(value, status = 200, headers = {}) { return Response.json(value, { status, headers }); }

export default async function handler(request, context) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
  if (!sameOrigin(request)) return json({ error: "Cross-site uploads are not allowed." }, 403);
  if (!allowUpload(context?.ip)) return json({ error: "Too many uploads. Please wait a moment and try again." }, 429, { "Retry-After": "60" });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type) || file.size <= 0 || file.size > MAX_FILE_SIZE) return json({ error: "Please upload a JPG, PNG or WEBP image under 4 MB." }, 400);
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const accessKey = randomUUID().replaceAll("-", "");
    const pathname = `custom-requests/${accessKey}/reference-${Date.now()}-${randomUUID().replaceAll("-", "")}.${extension}`;
    const store = getStore({ name: "velvet-private-references", consistency: "strong" });
    await store.set(pathname, await file.arrayBuffer(), { metadata: { contentType: file.type, originalName: String(file.name || "reference image").slice(0, 200), createdAt: Date.now(), accessKey }, onlyIfNew: true });
    return json({ ok: true, file: { originalName: String(file.name || "reference image"), size: file.size, pathname, accessKey, viewUrl: `/api/reference-file?pathname=${encodeURIComponent(pathname)}&key=${encodeURIComponent(accessKey)}` } });
  } catch (error) {
    console.error("Netlify reference upload error:", error);
    return json({ error: "The reference image could not be uploaded. Please try again." }, 400);
  }
}
export const config = { path: "/api/upload" };
