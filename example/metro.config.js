const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const escape = (value) => value.replace(/[/\\]/g, (char) => `\\${char}`);
const asArray = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]);

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Ignore the library workspace copies so Metro cannot mix React Native 0.87
// (root) with Expo's 0.86 (example). That mix causes "Invalid hook call".
config.resolver.blockList = [
  ...asArray(config.resolver.blockList),
  new RegExp(`^${escape(path.join(workspaceRoot, 'node_modules/react'))}[\\\\/].*`),
  new RegExp(`^${escape(path.join(workspaceRoot, 'node_modules/react-dom'))}[\\\\/].*`),
  new RegExp(`^${escape(path.join(workspaceRoot, 'node_modules/react-native'))}[\\\\/].*`),
];

const PINNED = ['react', 'react-dom', 'react-native', 'react-native-web'];
const isPinned = (name) =>
  PINNED.some((pkg) => name === pkg || name.startsWith(`${pkg}/`));

const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (isPinned(moduleName)) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [projectRoot] }),
    };
  }
  if (defaultResolve) {
    return defaultResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
