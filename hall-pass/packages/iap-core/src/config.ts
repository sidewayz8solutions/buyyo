// RevenueCat configuration for Hall Pass
import { Platform } from 'react-native';

// RevenueCat API Keys - Replace with your actual keys
export const REVENUECAT_API_KEYS = {
  ios: 'appl_YOUR_IOS_API_KEY',
  android: 'goog_YOUR_ANDROID_API_KEY',
  web: 'rcb_YOUR_WEB_API_KEY',
};

// Product IDs
export const PRODUCTS = {
  // Consumables
  HALL_PASSES_10: 'hall_passes_10',
  HALL_PASSES_50: 'hall_passes_50',
  HALL_PASSES_100: 'hall_passes_100',
  HALL_PASSES_500: 'hall_passes_500',
  
  // Non-consumables
  AD_FREE: 'ad_free',
  INFINITE_ENERGY: 'infinite_energy',
  
  // Furniture packs
  FURNITURE_GAMER_PACK: 'furniture_gamer_pack',
  FURNITURE_BOHO_PACK: 'furniture_boho_pack',
  FURNITURE_LUXURY_PACK: 'furniture_luxury_pack',
  FURNITURE_PUNK_PACK: 'furniture_punk_pack',
  
  // Outfit packs
  OUTFIT_PREPPY_PACK: 'outfit_preppy_pack',
  OUTFIT_STREET_PACK: 'outfit_street_pack',
  OUTFIT_VINTAGE_PACK: 'outfit_vintage_pack',
  
  // Subscriptions
  VIP_MONTHLY: 'vip_monthly',
  VIP_YEARLY: 'vip_yearly',
};

// Entitlements
export const ENTITLEMENTS = {
  VIP: 'vip_status',
  AD_FREE: 'ad_free',
  INFINITE_ENERGY: 'infinite_energy',
};

// Product configurations
export interface ProductConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
  rewards?: {
    hallPasses?: number;
    items?: string[];
    outfitIds?: string[];
    effect?: string;
  };
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  [PRODUCTS.HALL_PASSES_10]: {
    id: PRODUCTS.HALL_PASSES_10,
    name: '10 Hall Passes',
    description: 'Premium currency for exclusive items',
    price: 0.99,
    currency: 'USD',
    type: 'consumable',
    rewards: { hallPasses: 10 },
  },
  [PRODUCTS.HALL_PASSES_50]: {
    id: PRODUCTS.HALL_PASSES_50,
    name: '50 Hall Passes',
    description: 'Premium currency pack',
    price: 3.99,
    currency: 'USD',
    type: 'consumable',
    rewards: { hallPasses: 50 },
  },
  [PRODUCTS.HALL_PASSES_100]: {
    id: PRODUCTS.HALL_PASSES_100,
    name: '100 Hall Passes',
    description: 'Best value premium currency',
    price: 6.99,
    currency: 'USD',
    type: 'consumable',
    rewards: { hallPasses: 100 },
  },
  [PRODUCTS.HALL_PASSES_500]: {
    id: PRODUCTS.HALL_PASSES_500,
    name: '500 Hall Passes',
    description: 'Mega pack for serious players',
    price: 29.99,
    currency: 'USD',
    type: 'consumable',
    rewards: { hallPasses: 500 },
  },
  [PRODUCTS.AD_FREE]: {
    id: PRODUCTS.AD_FREE,
    name: 'Remove Ads',
    description: 'Play without interruptions',
    price: 4.99,
    currency: 'USD',
    type: 'non_consumable',
    rewards: { effect: 'ad_free' },
  },
  [PRODUCTS.INFINITE_ENERGY]: {
    id: PRODUCTS.INFINITE_ENERGY,
    name: 'Infinite Energy',
    description: 'Never run out of energy again',
    price: 19.99,
    currency: 'USD',
    type: 'non_consumable',
    rewards: { effect: 'infinite_energy' },
  },
  [PRODUCTS.FURNITURE_GAMER_PACK]: {
    id: PRODUCTS.FURNITURE_GAMER_PACK,
    name: 'Gamer Paradise Pack',
    description: 'RGB everything for the ultimate setup',
    price: 3.99,
    currency: 'USD',
    type: 'non_consumable',
    rewards: {
      items: [
        'bed_gaming',
        'desk_gaming',
        'chair_gaming',
        'led_strips',
        'gaming_figurines',
        'neon_sign_cool',
      ],
    },
  },
  [PRODUCTS.FURNITURE_BOHO_PACK]: {
    id: PRODUCTS.FURNITURE_BOHO_PACK,
    name: 'Boho Dreams Pack',
    description: 'Cozy vibes with plants and textures',
    price: 3.99,
    currency: 'USD',
    type: 'non_consumable',
    rewards: {
      items: [
        'bed_futon',
        'tapestry_mandala',
        'fairy_lights',
        'plant_succulent',
        'rug_shag',
        'shelf_floating',
      ],
    },
  },
  [PRODUCTS.FURNITURE_LUXURY_PACK]: {
    id: PRODUCTS.FURNITURE_LUXURY_PACK,
    name: 'Luxury Living Pack',
    description: 'High-end modern minimalist furniture',
    price: 4.99,
    currency: 'USD',
    type: 'non_consumable',
    rewards: {
      items: [
        'bed_canopy',
        'wardrobe_modern',
        'vanity_luxury',
        'lamp_designer',
        'mirror_full',
        'rug_luxury',
      ],
    },
  },
  [PRODUCTS.FURNITURE_PUNK_PACK]: {
    id: PRODUCTS.FURNITURE_PUNK_PACK,
    name: 'Punk Rock Pack',
    description: 'Raw, edgy, and rebellious decor',
    price: 2.99,
    currency: 'USD',
    type: 'non_consumable',
    rewards: {
      items: [
        'poster_band_bundle',
        'skateboard_rack',
        'vinyl_records',
        'graffiti_wall',
        'distressed_furniture',
        'chains_decor',
      ],
    },
  },
  [PRODUCTS.VIP_MONTHLY]: {
    id: PRODUCTS.VIP_MONTHLY,
    name: 'VIP Monthly',
    description: '2x earnings, exclusive items, no ads',
    price: 9.99,
    currency: 'USD',
    type: 'subscription',
    rewards: { effect: 'vip_status' },
  },
  [PRODUCTS.VIP_YEARLY]: {
    id: PRODUCTS.VIP_YEARLY,
    name: 'VIP Yearly',
    description: 'VIP status with 33% savings',
    price: 79.99,
    currency: 'USD',
    type: 'subscription',
    rewards: { effect: 'vip_status' },
  },
};

// Get product config by ID
export function getProductConfig(productId: string): ProductConfig | undefined {
  return PRODUCT_CONFIGS[productId];
}

// Get all products of a specific type
export function getProductsByType(type: ProductConfig['type']): ProductConfig[] {
  return Object.values(PRODUCT_CONFIGS).filter(p => p.type === type);
}

// Calculate savings for yearly vs monthly
export function calculateYearlySavings(): { monthlyCost: number; yearlyCost: number; savings: number; savingsPercent: number } {
  const monthly = PRODUCT_CONFIGS[PRODUCTS.VIP_MONTHLY].price * 12;
  const yearly = PRODUCT_CONFIGS[PRODUCTS.VIP_YEARLY].price;
  const savings = monthly - yearly;
  const savingsPercent = Math.round((savings / monthly) * 100);
  
  return { monthlyCost: monthly, yearlyCost: yearly, savings, savingsPercent };
}
