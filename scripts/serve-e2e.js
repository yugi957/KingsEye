/**
 * serve-e2e.js
 *
 * Minimal static file server for Playwright E2E tests.
 * Serves the dist/ folder on port 3000 with the COOP/COEP headers
 * required for SharedArrayBuffer (Stockfish WASM multithreading).
 *
 * Usage: node scripts/serve-e2e.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST_DIR = path.join(__dirname, '..', 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.ttf':  'font/ttf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
  '.map':  'application/json',
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Strip query strings
  const urlPath = req.url.split('?')[0];

  let filePath = path.join(DIST_DIR, urlPath);

  // Check if path exists as a file
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(res, filePath);
    } else if (!err && stat.isDirectory()) {
      serveFile(res, path.join(filePath, 'index.html'));
    } else {
      // SPA fallback: serve index.html for all unknown routes
      serveFile(res, path.join(DIST_DIR, 'index.html'));
    }
  });
});

server.listen(PORT, () => {
  console.log(`E2E server listening on http://localhost:${PORT}`);
  console.log(`Serving: ${DIST_DIR}`);
  console.log('COOP/COEP headers enabled for SharedArrayBuffer support');
});
