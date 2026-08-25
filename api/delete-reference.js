const { del } = require('@vercel/blob');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pathname = String(req.body?.pathname || '');
  const key = String(req.body?.key || '');

  if (!pathname || !key || !/^[a-f0-9]{32}$/.test(key) || !pathname.startsWith(`custom-requests/${key}/`)) {
    return res.status(403).json({ error: 'Invalid reference cleanup request.' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: 'Reference photo storage is not configured yet.' });
  }

  try {
    await del(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Reference cleanup error:', error);
    return res.status(200).json({ ok: false });
  }
};
