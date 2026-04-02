import { Platform, NativeModules } from 'react-native';

// Mock object to prevent crashes in Expo Go or Web
const PurchasesMock = {
  configure: async () => console.log("[RevenueCat Mock] configure"),
  getOfferings: async () => ({ current: null }),
  purchasePackage: async () => ({ customerInfo: { entitlements: { active: {} } } }),
  getCustomerInfo: async () => ({ entitlements: { active: {} } }),
  isConfigured: async () => false,
};

let Purchases;

// Detection logic: The most reliable way is checking if the native module is linked
const hasNativeModule = !!NativeModules.ReactNativePurchases;

console.log(`[RevenueCat Debug] OS: ${Platform.OS}, hasNativeModule: ${hasNativeModule}`);

if (Platform.OS !== 'web' && hasNativeModule) {
  try {
    console.log("[RevenueCat Debug] Attempting to require real package...");
    // Attempt to load the real package only if the native side exists
    Purchases = require('react-native-purchases').default;
    console.log("[RevenueCat Debug] Real package loaded successfully.");
  } catch (e) {
    console.log("[RevenueCat Debug] Require failed:", e.message);
    Purchases = PurchasesMock;
  }
} else {
  console.log(`[RevenueCat Debug] Skipping real package. Reason: ${Platform.OS === 'web' ? 'Web Platform' : 'Native Module Missing (Expo Go)'}`);
  Purchases = PurchasesMock;
}

export default Purchases;
