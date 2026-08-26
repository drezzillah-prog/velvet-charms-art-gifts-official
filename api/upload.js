const { readFile } = require('node:fs/promises');
const { randomUUID } = require('node:crypto');
const formidable = require('formidable');
const { put } = require('@vercel/blob');

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const UPLOAD_WINDOW_MS = 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 20;
const uploadBuckets = globalThis.__VELVET_ART_GIFTS_CUSTOM_UPLOAD_BUCKETS || new Map();
globalThis.__VELVET_ART_GIFTS_CUSTOM_UPLOAD_BUCKETS = uploadBuckets;

module.exports.config = {
  api: { bodyParser: false }
};

function sameOriginRequest(req) {
  const origin = String(req.headers?.origin || '').trim();
  if (!origin) return true;
  const forwardedHost = String(req.headers?.['x-forwarded-host'] || '').split(',')[0].trim();
  const host = (forwardedHost || String(req.headers?.host || '')).toLowerCase();
  if (!host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function clientKey(req) {
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function allowUpload(req) {
  const now = Date.now();
  const key = clientKey(req);
  const bucket = uploadBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= UPLOAD_WINDOW_MS) {
    uploadBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (bucket.count >= MAX_UPLOADS_PER_WINDOW) return false;
  bucket.count += 1;
  if (uploadBuckets.size > 1000) {
    for (const [storedKey, stored] of uploadBuckets) {
      if (now - stored.startedAt >= UPLOAD_WINDOW_MS) uploadBuckets.delete(storedKey);
    }
  }
  return true;
}

function parseForm(req) {
  const form = formidable({
    multiples: false,
    maxFiles: 1,
    maxFileSize: MAX_FILE_SIZE,
    allowEmptyFiles: false,
    filter: part => part.name === 'file' && ALLOWED_TYPES.has(part.mimetype)
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!sameOriginRequest(req)) {
    return res.status(403).json({ error: 'Cross-site uploads are not allowed.' });
  }
  if (!allowUpload(req)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Too many uploads. Please wait a moment and try again.' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: 'Reference photo storage is not configured yet.' });
  }

  try {
    const { files } = await parseForm(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !ALLOWED_TYPES.has(file.mimetype) || file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'Please upload a JPG, PNG or WEBP image under 4 MB.' });
    }

    const extension = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
    const accessKey = randomUUID().replace(/-/g, '');
    const pathname = `custom-requests/${accessKey}/reference-${Date.now()}.${extension}`;
    const data = await readFile(file.filepath);

    const blob = await put(pathname, data, {
      access: 'private',
      addRandomSuffix: true,
      contentType: file.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const viewUrl = `/api/reference-file?pathname=${encodeURIComponent(blob.pathname)}&key=${encodeURIComponent(accessKey)}`;

    return res.status(200).json({
      ok: true,
      file: {
        originalName: file.originalFilename || 'reference image',
        size: file.size,
        pathname: blob.pathname,
        accessKey,
        viewUrl
      }
    });
  } catch (error) {
    console.error('Reference upload error:', error);
    const status = error?.code === 1009 ? 413 : 400;
    return res.status(status).json({ error: 'The reference image could not be uploaded. Please try again.' });
  }
};
