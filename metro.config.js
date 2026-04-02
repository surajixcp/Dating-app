const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Aggressive resolver for Expo Go: Force-redirect all ZegoCloud and RevenueCat requests to mocks
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const mocks = {
    'react-native-purchases': path.resolve(__dirname, 'src/services/revenuecat-mock.js'),
    'zego-express-engine-reactnative': path.resolve(__dirname, 'src/services/zego-mock.js'),
    'zego-zim-react-native': path.resolve(__dirname, 'src/services/zego-mock.js'),
    '@zegocloud/zego-uikit-prebuilt-call-rn': path.resolve(__dirname, 'src/services/zego-mock.js'),
    '@zegocloud/zego-uikit-rn': path.resolve(__dirname, 'src/services/zego-mock.js'),
  };

  // Match package name or any sub-module within the package
  const matchedKey = Object.keys(mocks).find(key => 
    moduleName === key || moduleName.startsWith(`${key}/`)
  );

  if (matchedKey) {
    return {
      type: 'sourceFile',
      filePath: mocks[matchedKey],
    };
  }

  // Fallback to default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
