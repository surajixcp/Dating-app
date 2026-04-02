import { Platform } from 'react-native';

const PurchasesMock = {
  configure: async () => console.log("[RevenueCat Mock] configure"),
  getOfferings: async () => ({ current: null }),
  purchasePackage: async () => ({ customerInfo: { entitlements: { active: {} } } }),
  getCustomerInfo: async () => ({ entitlements: { active: {} } }),
  isConfigured: async () => false,
  addCustomerInfoUpdateListener: (l) => {},
  removeCustomerInfoUpdateListener: (l) => {},
  LOG_LEVEL: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  },
  PURCHASE_TYPE: {
    SUBS: 'subs',
    INAPP: 'inapp',
  }
};

export default PurchasesMock;
export const LOG_LEVEL = PurchasesMock.LOG_LEVEL;
export const PURCHASE_TYPE = PurchasesMock.PURCHASE_TYPE;
