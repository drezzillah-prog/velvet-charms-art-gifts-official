const { Readable } = require('node:stream');
const { get, del } = require('@vercel/blob');

const MAX_REFERENCE_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function referenceTimestamp(pathname) {
  const match = pathname.match(/\/reference-(\d{13})(?:[-.])/);
  return match ? Number(match[1]) : 0;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pathname = String(req.query?.pathname || '');
  const key = String(req.query?.key || '');

  if (!pathname || !key || !/^[a-f0-9]{32}$/.test(key) || !pathname.startsWith(`custom-requests/${key}/`)) {
    return res.status(403).send('Invalid reference link.');
  }

  const createdAt = referenceTimestamp(pathname);
  if (!createdAt || Date.now() - createdAt > MAX_REFERENCE_AGE_MS) {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      del(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(error => {
        console.error('Expired reference cleanup error:', error);
      });
    }
    return res.status(410).send('This private reference link has expired.');
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return res.status(404).send('Reference image not found.');
    }

    res.setHeader('Content-Type', result.blob?.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');

    const stream = typeof Readable.fromWeb === 'function' ? Readable.fromWeb(result.stream) : result.stream;
    stream.on('error', error => {
      console.error('Private reference stream error:', error);
      if (!res.headersSent) res.status(500).end();
      else res.destroy(error);
    });
    stream.pipe(res);
  } catch (error) {
    console.error('Private reference read error:', error);
    return res.status(404).send('Reference image not found.');
  }
};
