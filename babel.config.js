module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', 'babel-preset-expo', '@babel/preset-typescript', 'module:metro-react-native-babel-preset'],
    plugins: ['react-native-reanimated/plugin',
    ["@babel/plugin-transform-class-properties", { "loose": false }],
    ["@babel/plugin-transform-private-methods", { "loose": false }],
    ["@babel/plugin-transform-private-property-in-object", { "loose": false }]],
  };
};
