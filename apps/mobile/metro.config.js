const { getDefaultConfig } = require('expo/metro-config');
const metroResolver = require('metro-resolver');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const nodeBuiltins = new Set([
  'crypto',
  'stream',
  'http',
  'https',
  'fs',
  'path',
  'os',
  'url',
  'zlib',
  'net',
  'tls',
  'buffer',
  'util',
  'assert',
  'vm',
]);

// 3. Resolve NodeNext-style .js extensions and node built-ins
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (nodeBuiltins.has(moduleName)) {
    return { type: 'empty' };
  }

  let targetName = moduleName;
  if (
    (moduleName.startsWith('./') || moduleName.startsWith('../')) &&
    moduleName.endsWith('.js')
  ) {
    targetName = moduleName.slice(0, -3);
  }

  const defaultContext = {
    ...context,
    resolveRequest: null,
  };

  try {
    return metroResolver.resolve(defaultContext, targetName, platform);
  } catch (err) {
    if (targetName !== moduleName) {
      return metroResolver.resolve(defaultContext, moduleName, platform);
    }
    throw err;
  }
};

module.exports = config;
