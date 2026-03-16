// Empty shim for Node.js built-ins that are guarded by ENVIRONMENT_IS_NODE
// checks at runtime but are statically required by stockfish.js.
// These are never actually called in the browser.
module.exports = {};
