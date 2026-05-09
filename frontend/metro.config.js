const path = require('path');
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = path.resolve(__dirname);
const config = getDefaultConfig(projectRoot);

// Configure metro to handle nativewind styling without lightningcss
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'lightningcss': path.resolve(__dirname, 'node_modules/lightningcss')
};

module.exports = config;