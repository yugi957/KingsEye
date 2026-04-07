/**
 * copy-wasm.js
 *
 * Copies the Stockfish WASM file to dist/ after `npm run build:web`.
 *
 * stockfish-nnue-16-single.js resolves its WASM relative to the bundle JS
 * file at /bundles/web-xxx.js, so the WASM must live at dist/bundles/.
 *
 * Metro does not bundle .wasm files as static assets automatically.
 * Run automatically via the "postbuild:web" npm hook.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'node_modules', 'stockfish', 'src', 'stockfish-nnue-16-single.wasm');
const DEST = path.join(__dirname, '..', 'dist', 'bundles', 'stockfish-nnue-16-single.wasm');

if (!fs.existsSync(SRC)) {
  console.error('copy-wasm: source WASM not found at', SRC);
  process.exit(1);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.copyFileSync(SRC, DEST);
console.log('copy-wasm: copied stockfish-nnue-16-single.wasm to dist/bundles/');
