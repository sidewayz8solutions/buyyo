# In-App Purchase Implementation Guide

## RevenueCat Setup

RevenueCat provides a unified IAP API across iOS, Android, and Web.

### Configuration

```typescript
// packages/iap-core/src/config.ts
export const REVENUECAT_API_KEY = {
  ios: 'appl_YOUR_IOS_KEY',
  android: 'goog_YOUR_ANDROID_KEY',
  web: 'rcb_YOUR_WEB_KEY',
};

export const ENTITLEMENTS = {
  VIP: 'vip_status',
  AD_FREE: 'ad_free',
  INFINITE_ENERGY: 'infinite_energy',
};

export const OFFERINGS = {
  FURNITURE_PACKS: 'furniture_packs',
  OUTFIT_PACKS: 'outfit_packs',
  STORY_DLC: 'story_dlc',
  CONSUMABLES: 'consumables',
};
```

### Products

#### Consumables
| ID | Price | Description |
|----|-------|-------------|
| `hall_passes_10` | $0.99 | 10 Hall Passes |
| `hall_passes_50` | $3.99 | 50 Hall Passes |
| `hall_passes_100` | $6.99 | 100 Hall Passes |
| `hall_passes_500` | $29.99 | 500 Hall Passes |

#### Non-Consumables (One-time)
| ID | Price | Description |
|----|-------|-------------|
| `ad_free` | $4.99 | Remove all ads |
| `infinite_energy` | $19.99 | Never run out of energy |
| `furniture_gamer_pack` | $3.99 | Gamer Paradise furniture set |
| `furniture_boho_pack` | $3.99 | Boho Dreams furniture set |
| `furniture_luxury_pack` | $4.99 | Luxury Living furniture set |
| `furniture_punk_pack` | $2.99 | Punk Rock furniture set |

#### Subscriptions
| ID | Price | Description |
|----|-------|-------------|
| `vip_monthly` | $9.99/mo | VIP Status: 2x earnings, exclusive items |
| `vip_yearly` | $79.99/yr | VIP Status (33% savings) |

## Implementation

### Initialization
```typescript
// packages/iap-core/src/index.ts
import Purchases from 'react-native-purchases';
import { REVENUECAT_API_KEY } from './config';

export async function initializeIAP(platform: 'ios' | 'android' | 'web') {
  const apiKey = REVENUECAT_API_KEY[platform];
  await Purchases.configure({ apiKey });
  
  // Sync with Supabase on purchase
  Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    syncPurchasesToSupabase(customerInfo);
  });
}
```

### Purchase Flow
```typescript
export async function purchaseProduct(productId: string) {
  try {
    const { customerInfo } = await Purchases.purchaseProduct(productId);
    
    // Grant items to player
    await grantPurchaseRewards(productId, customerInfo);
    
    return { success: true, customerInfo };
  } catch (error) {
    if (error.userCancelled) {
      return { success: false, cancelled: true };
    }
    throw error;
  }
}
```

### Server Validation
```typescript
// Supabase Edge Function
export async function validatePurchase(req: Request) {
  const { productId, receipt } = await req.json();
  
  // Call RevenueCat API to verify
  const isValid = await RevenueCat.validate(receipt);
  
  if (isValid) {
    // Grant items in database
    await grantItemsToUser(req.user.id, productId);
  }
  
  return new Response(JSON.stringify({ valid: isValid }));
}
```

## Web-Specific IAP

For web, use Stripe + RevenueCat:

```typescript
// Web checkout flow
export async function purchaseOnWeb(productId: string) {
  const stripe = await loadStripe(STRIPE_KEY);
  
  const session = await fetch('/api/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }).then(r => r.json());
  
  await stripe.redirectToCheckout({ sessionId: session.id });
}
```

## Analytics

Track these events:
- `iap_product_viewed`
- `iap_purchase_started`
- `iap_purchase_completed`
- `iap_purchase_cancelled`
- `iap_purchase_failed`
