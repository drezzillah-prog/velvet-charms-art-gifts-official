import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

for (const file of ['api/upload.js','api/upload-photo.js']) {
  const source = readFileSync(file, 'utf8');
  assert.match(source, /MAX_FILE_SIZE\s*=\s*4\s*\*\s*1024\s*\*\s*1024/, `${file} must cap uploads at 4 MB`);
  assert.match(source, /image\/jpeg/, `${file} must allow-list JPEG`);
  assert.match(source, /image\/png/, `${file} must allow-list PNG`);
  assert.match(source, /image\/webp/, `${file} must allow-list WEBP`);
  assert.match(source, /access:\s*["']private["']/, `${file} must keep reference photos private`);
  assert.match(source, /sameOriginRequest\(req\)/, `${file} must reject cross-site browser uploads`);
  assert.match(source, /allowUpload\(req\)/, `${file} must apply burst limiting`);
  assert.match(source, /status\(429\)/, `${file} must return HTTP 429 when rate limited`);
  assert.match(source, /Retry-After/, `${file} must tell rate-limited clients when to retry`);
}

console.log('PASS: Art & Gifts photo uploads keep file restrictions, private storage, same-origin checks and burst limiting.');
