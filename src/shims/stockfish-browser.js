/**
 * stockfish-browser.js
 *
 * Shim that loads the Stockfish single-threaded WASM variant in browser context.
 *
 * The v16 stockfish variants detect ENVIRONMENT_IS_NODE via:
 *   typeof process === "object" && typeof require === "function"
 *
 * Metro injects both `process` and `require` into the bundle, causing the
 * Node code path to run (which uses worker_threads — shimmed to {}, so no output).
 *
 * This shim temporarily hides `process` so Stockfish's browser code path runs
 * (which uses document/self and returns a proper Promise<engine>).
 */

// Save and hide process so Stockfish uses the browser initialization path
const savedProcess = global.process;
global.process = undefined;

let StockfishFactory;
try {
  StockfishFactory = require('stockfish/src/stockfish-nnue-16-single');
} finally {
  global.process = savedProcess;
}

module.exports = StockfishFactory;
