import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useGameStore, selectCurrency, selectMeta } from '@hallpass/game-engine';
import { PRODUCTS, getProductConfig, getProductsByType, purchaseProduct, restorePurchases, calculateYearlySavings } from '@hallpass/iap-core';
import { Button, Card, Currency, colors, spacing, typography } from '@hallpass/shared-ui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function ShopScreen() {
  const router = useRouter();
  const currency = useGameStore(selectCurrency);
  const meta = useGameStore(selectMeta);
  const addHallPasses = useGameStore((state) => state.addHallPasses);
  const setVIPStatus = useGameStore((state) => state.setVIPStatus);
  const [activeTab, setActiveTab] = useState<'currency' | 'furniture' | 'vip'>('currency');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const currencyProducts = getProductsByType('consumable');
  const furnitureProducts = getProductsByType('non_consumable');
  const vipSavings = calculateYearlySavings();

  const handlePurchase = async (productId: string) => {
    setPurchasing(productId);
    
    try {
      const result = await purchaseProduct(productId);
      
      if (result.success && result.customerInfo) {
        const config = getProductConfig(productId);
        
        // Grant rewards
        if (config?.rewards?.hallPasses) {
          addHallPasses(config.rewards.hallPasses);
        }
        
        if (config?.rewards?.effect === 'vip_status') {
          const expiry = new Date();
          expiry.setMonth(expiry.getMonth() + (productId === PRODUCTS.VIP_YEARLY ? 12 : 1));
          setVIPStatus(true, expiry);
        }
        
        Alert.alert('Success!', `You received: ${config?.name}`);
      } else {
        Alert.alert('Purchase Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    const result = await restorePurchases();
    if (result.success) {
      Alert.alert('Restored', 'Your purchases have been restored!');
    } else {
      Alert.alert('Nothing to Restore', 'No previous purchases found.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Shop</Text>
        <View style={styles.currencyDisplay}>
          <Currency amount={currency.coolPoints} type="cool" />
          <Currency amount={currency.hallPasses} type="hallpass" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['currency', 'furniture', 'vip'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'currency' && '💎 Currency'}
              {tab === 'furniture' && '🛋️ Furniture'}
              {tab === 'vip' && '👑 VIP'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Currency Tab */}
        {activeTab === 'currency' && (
          <>
            <Text style={styles.sectionTitle}>Hall Passes</Text>
            <Text style={styles.sectionSubtitle}>Premium currency for exclusive items</Text>
            
            {currencyProducts.map((product) => (
              <Card key={product.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productIcon}>🎟️</Text>
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDesc}>{product.description}</Text>
                    {product.rewards?.hallPasses && (
                      <Text style={styles.rewardText}>
                        +{product.rewards.hallPasses} Hall Passes
                      </Text>
                    )}
                  </View>
                </View>
                <Button
                  title={`$${product.price}`}
                  onPress={() => handlePurchase(product.id)}
                  loading={purchasing === product.id}
                  disabled={purchasing !== null}
                />
              </Card>
            ))}
          </>
        )}

        {/* Furniture Tab */}
        {activeTab === 'furniture' && (
          <>
            <Text style={styles.sectionTitle}>Furniture Packs</Text>
            <Text style={styles.sectionSubtitle}>Exclusive room decorations</Text>
            
            {furnitureProducts.filter(p => p.id.includes('furniture')).map((product) => (
              <Card key={product.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productIcon}>
                    {product.id.includes('gamer') && '🎮'}
                    {product.id.includes('boho') && '🌿'}
                    {product.id.includes('luxury') && '💎'}
                    {product.id.includes('punk') && '🤘'}
                  </Text>
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDesc}>{product.description}</Text>
                    {product.rewards?.items && (
                      <Text style={styles.rewardText}>
                        +{product.rewards.items.length} exclusive items
                      </Text>
                    )}
                  </View>
                </View>
                <Button
                  title={`$${product.price}`}
                  onPress={() => handlePurchase(product.id)}
                  loading={purchasing === product.id}
                  disabled={purchasing !== null}
                />
              </Card>
            ))}
          </>
        )}

        {/* VIP Tab */}
        {activeTab === 'vip' && (
          <>
            <Card style={styles.vipCard}>
              <Text style={styles.vipTitle}>👑 VIP Status</Text>
              <Text style={styles.vipPrice}>$9.99/month</Text>
              
              <View style={styles.benefitsList}>
                <Text style={styles.benefit}>✓ 2x Cool Points earnings</Text>
                <Text style={styles.benefit}>✓ Exclusive VIP items</Text>
                <Text style={styles.benefit}>✓ No ads</Text>
                <Text style={styles.benefit}>✓ Priority support</Text>
              </View>
              
              {!meta.vipStatus ? (
                <Button
                  title="Subscribe Monthly"
                  onPress={() => handlePurchase(PRODUCTS.VIP_MONTHLY)}
                  loading={purchasing === PRODUCTS.VIP_MONTHLY}
                  style={styles.vipButton}
                />
              ) : (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>✓ ACTIVE</Text>
                </View>
              )}
            </Card>

            <Card style={styles.yearlyCard}>
              <Text style={styles.yearlyTitle}>💰 Best Value: Yearly</Text>
              <Text style={styles.yearlyPrice}>$79.99/year</Text>
              <Text style={styles.savingsText}>
                Save ${vipSavings.savings.toFixed(2)} ({vipSavings.savingsPercent}% off)
              </Text>
              
              {!meta.vipStatus && (
                <Button
                  title="Subscribe Yearly"
                  onPress={() => handlePurchase(PRODUCTS.VIP_YEARLY)}
                  loading={purchasing === PRODUCTS.VIP_YEARLY}
                  variant="secondary"
                  style={styles.vipButton}
                />
              )}
            </Card>

            <Button
              title="Restore Purchases"
              onPress={handleRestore}
              variant="ghost"
              style={styles.restoreButton}
            />
          </>
        )}
      </ScrollView>

      <Button title="Back" onPress={() => router.back()} variant="ghost" style={styles.backButton} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  currencyDisplay: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  productCard: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  productDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  rewardText: {
    ...typography.caption,
    color: colors.accentGold,
    marginTop: spacing.xs,
  },
  vipCard: {
    backgroundColor: colors.accentGold + '15',
    borderColor: colors.accentGold,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  vipTitle: {
    ...typography.h1,
    color: colors.accentGold,
    textAlign: 'center',
  },
  vipPrice: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  benefitsList: {
    marginVertical: spacing.lg,
  },
  benefit: {
    ...typography.body,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  vipButton: {
    marginTop: spacing.md,
  },
  activeBadge: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  activeText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  yearlyCard: {
    marginBottom: spacing.lg,
  },
  yearlyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  yearlyPrice: {
    ...typography.h2,
    color: colors.accentGreen,
    marginVertical: spacing.xs,
  },
  savingsText: {
    ...typography.body,
    color: colors.accentGreen,
  },
  restoreButton: {
    marginTop: spacing.md,
  },
  backButton: {
    margin: spacing.lg,
  },
});
