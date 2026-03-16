/**
 * Restores node_modules/stockfish/src/stockfish.js from git after npm install.
 *
 * The stockfish npm package v16 ships only NNUE variants; the legacy
 * stockfish.js (v10, compatible with the app's Worker API usage) is committed
 * to this repo via the !node_modules/stockfish/src/stockfish.js gitignore
 * exception. A clean npm install wipes it, so we restore it here.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'stockfish', 'src', 'stockfish.js');

if (!fs.existsSync(target)) {
  try {
    execSync('git checkout HEAD -- node_modules/stockfish/src/stockfish.js', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('postinstall: restored node_modules/stockfish/src/stockfish.js from git');
  } catch (e) {
    console.error('postinstall: failed to restore stockfish.js —', e.message);
    process.exit(1);
  }
} else {
  console.log('postinstall: stockfish.js already present, skipping restore');
}
