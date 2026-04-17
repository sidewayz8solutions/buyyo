// RevenueCat purchase handler
import Purchases, { CustomerInfo, PurchasesPackage, PurchaseResult } from 'react-native-purchases';
import { REVENUECAT_API_KEYS, PRODUCTS, ENTITLEMENTS, getProductConfig, ProductConfig } from './config';

// Initialize RevenueCat
export async function initializeIAP(platform: 'ios' | 'android'): Promise<void> {
  const apiKey = REVENUECAT_API_KEYS[platform];
  await Purchases.configure({ apiKey });
  
  // Enable debug logs in development
  if (__DEV__) {
    await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  }
}

// Get available products
export async function getOfferings(): Promise<{
  availablePackages: PurchasesPackage[];
  currentOfferingId: string;
}> {
  const offerings = await Purchases.getOfferings();
  
  if (offerings.current) {
    return {
      availablePackages: offerings.current.availablePackages,
      currentOfferingId: offerings.current.identifier,
    };
  }
  
  throw new Error('No offerings available');
}

// Purchase a product
export async function purchaseProduct(
  productId: string
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      return { success: false, error: 'No offerings available' };
    }
    
    // Find the package containing our product
    const packageToBuy = offerings.current.availablePackages.find(
      pkg => pkg.product.identifier === productId
    );
    
    if (!packageToBuy) {
      return { success: false, error: 'Product not found in offerings' };
    }
    
    const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
    
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, error: 'Purchase cancelled by user' };
    }
    
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

// Restore purchases
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, customerInfo };
  } catch (error: any) {
    return { success: false, error: error.message || 'Restore failed' };
  }
}

// Get customer info
export async function getCustomerInfo(): Promise<CustomerInfo> {
  return await Purchases.getCustomerInfo();
}

// Check entitlement status
export function checkEntitlement(
  customerInfo: CustomerInfo,
  entitlementId: string
): { active: boolean; expirationDate?: string } {
  const entitlement = customerInfo.entitlements.active[entitlementId];
  
  return {
    active: !!entitlement,
    expirationDate: entitlement?.expirationDate,
  };
}

// Process purchase rewards
export function processPurchaseRewards(
  productId: string
): {
  hallPasses?: number;
  items?: string[];
  outfitIds?: string[];
  effects?: string[];
} {
  const config = getProductConfig(productId);
  
  if (!config || !config.rewards) {
    return {};
  }
  
  const rewards: {
    hallPasses?: number;
    items?: string[];
    outfitIds?: string[];
    effects?: string[];
  } = {};
  
  if (config.rewards.hallPasses) {
    rewards.hallPasses = config.rewards.hallPasses;
  }
  
  if (config.rewards.items) {
    rewards.items = config.rewards.items;
  }
  
  if (config.rewards.outfitIds) {
    rewards.outfitIds = config.rewards.outfitIds;
  }
  
  if (config.rewards.effect) {
    rewards.effects = [config.rewards.effect];
  }
  
  return rewards;
}

// Sync purchase to backend
export async function syncPurchaseToBackend(
  productId: string,
  customerInfo: CustomerInfo,
  userId: string
): Promise<boolean> {
  try {
    const rewards = processPurchaseRewards(productId);
    
    // Call your backend API to grant rewards
    const response = await fetch('/api/purchases/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify({
        productId,
        rewards,
        receipt: customerInfo,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to sync purchase:', error);
    return false;
  }
}

// Web-specific purchase (using Stripe + RevenueCat)
export async function initiateWebPurchase(
  productId: string,
  stripePublicKey: string
): Promise<{ sessionId: string; url: string }> {
  const response = await fetch('/api/purchases/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }
  
  const { sessionId, url } = await response.json();
  return { sessionId, url };
}

// Listener for purchase updates
export function addPurchaseListener(
  callback: (customerInfo: CustomerInfo) => void
): () => void {
  return Purchases.addCustomerInfoUpdateListener(callback);
}
