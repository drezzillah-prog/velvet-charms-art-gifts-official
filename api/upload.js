const { readFile } = require('node:fs/promises');
const { randomUUID } = require('node:crypto');
const formidable = require('formidable');
const { put } = require('@vercel/blob');

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

module.exports.config = {
  api: { bodyParser: false }
};

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
        viewUrl
      }
    });
  } catch (error) {
    console.error('Reference upload error:', error);
    const status = error?.code === 1009 ? 413 : 400;
    return res.status(status).json({ error: 'The reference image could not be uploaded. Please try again.' });
  }
};
