// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('cjs');

// stockfish.js (v10, asm.js) requires Node built-ins (fs, path, crypto, etc.)
// inside ENVIRONMENT_IS_NODE guards that never fire in the browser.
// Metro resolves all require() calls statically, so we stub them all out.
const nodeBuiltinShim = path.resolve(__dirname, 'src/shims/empty.js');
const NODE_BUILTINS = [
  'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console',
  'constants', 'crypto', 'dgram', 'diagnostics_channel', 'dns', 'domain',
  'events', 'fs', 'http', 'http2', 'https', 'inspector', 'module', 'net',
  'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring',
  'readline', 'repl', 'stream', 'string_decoder', 'sys', 'timers', 'tls',
  'trace_events', 'tty', 'url', 'util', 'v8', 'vm', 'wasi',
  'worker_threads', 'zlib',
];

const nodeBuiltinShims = NODE_BUILTINS.reduce((acc, name) => {
  acc[name] = nodeBuiltinShim;
  return acc;
}, {});

defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  ...nodeBuiltinShims,
};

module.exports = defaultConfig;
