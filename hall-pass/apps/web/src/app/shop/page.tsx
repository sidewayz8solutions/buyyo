'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@hallpass/game-engine';
import { PRODUCTS, getProductConfig, getProductsByType, calculateYearlySavings } from '@hallpass/iap-core';

export default function ShopPage() {
  const currency = useGameStore((state) => state.currency);
  const meta = useGameStore((state) => state.meta);
  const addHallPasses = useGameStore((state) => state.addHallPasses);
  const setVIPStatus = useGameStore((state) => state.setVIPStatus);
  
  const [activeTab, setActiveTab] = useState<'currency' | 'furniture' | 'vip'>('currency');

  const currencyProducts = getProductsByType('consumable');
  const furnitureProducts = getProductsByType('non_consumable');
  const vipSavings = calculateYearlySavings();

  // Web demo purchase (simulated)
  const handlePurchase = (productId: string) => {
    const config = getProductConfig(productId);
    
    if (config?.rewards?.hallPasses) {
      addHallPasses(config.rewards.hallPasses);
      alert(`Purchased ${config.name}! +${config.rewards.hallPasses} Hall Passes added.`);
    }
    
    if (config?.rewards?.effect === 'vip_status') {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + (productId === PRODUCTS.VIP_YEARLY ? 12 : 1));
      setVIPStatus(true, expiry);
      alert('VIP Status activated!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛍️ Shop</h1>
        <div className="flex gap-4">
          <span className="text-[#22d3ee]">❄️ {currency.coolPoints.toLocaleString()}</span>
          <span className="text-[#fbbf24]">🎟️ {currency.hallPasses.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['currency', 'furniture', 'vip'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === tab 
                ? 'bg-indigo-500 text-white' 
                : 'bg-[#16162a] text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'currency' && '💎 Currency'}
            {tab === 'furniture' && '🛋️ Furniture'}
            {tab === 'vip' && '👑 VIP'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Currency Tab */}
        {activeTab === 'currency' && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold">Hall Passes</h2>
              <p className="text-gray-400">Premium currency for exclusive items</p>
            </div>
            
            {currencyProducts.map((product) => (
              <div key={product.id} className="bg-[#16162a] rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🎟️</span>
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.description}</p>
                    {product.rewards?.hallPasses && (
                      <p className="text-sm text-[#fbbf24]">+{product.rewards.hallPasses} Hall Passes</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(product.id)}
                  className="px-6 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  ${product.price}
                </button>
              </div>
            ))}
          </>
        )}

        {/* Furniture Tab */}
        {activeTab === 'furniture' && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold">Furniture Packs</h2>
              <p className="text-gray-400">Exclusive room decorations</p>
            </div>
            
            {furnitureProducts.filter(p => p.id.includes('furniture')).map((product) => (
              <div key={product.id} className="bg-[#16162a] rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">
                    {product.id.includes('gamer') && '🎮'}
                    {product.id.includes('boho') && '🌿'}
                    {product.id.includes('luxury') && '💎'}
                    {product.id.includes('punk') && '🤘'}
                  </span>
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.description}</p>
                    {product.rewards?.items && (
                      <p className="text-sm text-[#22d3ee]">+{product.rewards.items.length} exclusive items</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(product.id)}
                  className="px-6 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  ${product.price}
                </button>
              </div>
            ))}
          </>
        )}

        {/* VIP Tab */}
        {activeTab === 'vip' && (
          <>
            <div className="bg-[#fbbf24]/15 border border-[#fbbf24] rounded-xl p-6 mb-4">
              <h2 className="text-2xl font-bold text-[#fbbf24] text-center mb-2">👑 VIP Status</h2>
              <p className="text-3xl font-bold text-center mb-4">$9.99/month</p>
              
              <ul className="space-y-2 mb-6">
                <li className="text-white">✓ 2x Cool Points earnings</li>
                <li className="text-white">✓ Exclusive VIP items</li>
                <li className="text-white">✓ No ads</li>
                <li className="text-white">✓ Priority support</li>
              </ul>
              
              {!meta.vipStatus ? (
                <button
                  onClick={() => handlePurchase(PRODUCTS.VIP_MONTHLY)}
                  className="w-full py-3 bg-[#fbbf24] text-black font-bold rounded-lg hover:bg-[#f59e0b] transition-colors"
                >
                  Subscribe Monthly
                </button>
              ) : (
                <div className="bg-green-500 text-white py-3 rounded-lg text-center font-bold">
                  ✓ VIP ACTIVE
                </div>
              )}
            </div>

            <div className="bg-[#16162a] rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">💰 Best Value: Yearly</h3>
              <p className="text-2xl text-[#4ade80] font-bold mb-1">$79.99/year</p>
              <p className="text-[#4ade80] mb-4">
                Save ${vipSavings.savings.toFixed(2)} ({vipSavings.savingsPercent}% off)
              </p>
              
              {!meta.vipStatus && (
                <button
                  onClick={() => handlePurchase(PRODUCTS.VIP_YEARLY)}
                  className="w-full py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Subscribe Yearly
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Link href="/">
        <button className="mt-6 px-6 py-3 text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}
