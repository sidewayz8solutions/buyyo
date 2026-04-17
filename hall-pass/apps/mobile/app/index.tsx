import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore, initialNPCs, selectPlayer, selectCurrency, selectMeta } from '@hallpass/game-engine';
import { Button, StatBadge, Currency, ArchetypeBadge, colors, spacing, typography } from '@hallpass/shared-ui';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();
  const player = useGameStore(selectPlayer);
  const currency = useGameStore(selectCurrency);
  const meta = useGameStore(selectMeta);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickActions = [
    { title: 'My Room', icon: '🏠', route: '/room', color: colors.accentCyan },
    { title: 'School', icon: '🏫', route: '/school', color: colors.accentPink },
    { title: 'Mini Games', icon: '🎮', route: '/games', color: colors.accentGreen },
    { title: 'Shop', icon: '🛍️', route: '/shop', color: colors.accentGold },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.playerName}>{player.name || 'Student'}</Text>
          </View>
          <ArchetypeBadge archetype={player.archetype} />
        </View>

        {/* Currency Bar */}
        <View style={styles.currencyBar}>
          <Currency amount={currency.coolPoints} type="cool" />
          <Currency amount={currency.hallPasses} type="hallpass" />
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <StatBadge label="Athletic" value={player.stats.athletic} color={colors.jock} />
          <StatBadge label="Knowledge" value={player.stats.knowledge} color={colors.nerd} />
          <StatBadge label="Social" value={player.stats.social} color={colors.popular} />
          <StatBadge label="Creative" value={player.stats.creative} color={colors.artist} />
          <StatBadge label="Cool" value={player.stats.cool} color={colors.accentCyan} />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={[styles.actionCard, { borderColor: action.color }]}
              onPress={() => router.push(action.route)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={[styles.actionText, { color: action.color }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Year Status */}
        <View style={styles.yearCard}>
          <Text style={styles.yearTitle}>
            {player.year === 1 && '🌟 Freshman Year'}
            {player.year === 2 && '📚 Sophomore Year'}
            {player.year === 3 && '🎓 Junior Year'}
            {player.year === 4 && '🏆 Senior Year'}
          </Text>
          <Text style={styles.yearSubtitle}>
            {meta.streakDays} day streak! Keep it up!
          </Text>
        </View>

        {/* VIP Status */}
        {meta.vipStatus && (
          <View style={styles.vipBadge}>
            <Text style={styles.vipText}>👑 VIP MEMBER</Text>
            <Text style={styles.vipSubtext}>2x earnings active</Text>
          </View>
        )}

        {/* NPCs Preview */}
        <Text style={styles.sectionTitle}>People at School</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.npcScroll}>
          {initialNPCs.slice(0, 4).map((npc) => (
            <TouchableOpacity
              key={npc.id}
              style={styles.npcCard}
              onPress={() => router.push(`/npc/${npc.id}`)}
            >
              <Text style={styles.npcAvatar}>👤</Text>
              <Text style={styles.npcName}>{npc.name}</Text>
              <ArchetypeBadge archetype={npc.archetype} size="sm" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  playerName: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  currencyBar: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: 12,
  },
  statsCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionText: {
    ...typography.button,
    fontSize: 14,
  },
  yearCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  yearTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  yearSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  vipBadge: {
    backgroundColor: colors.accentGold + '20',
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  vipText: {
    ...typography.h3,
    color: colors.accentGold,
  },
  vipSubtext: {
    ...typography.bodySmall,
    color: colors.accentGold,
    opacity: 0.8,
  },
  npcScroll: {
    marginBottom: spacing.lg,
  },
  npcCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: 12,
    marginRight: spacing.md,
    alignItems: 'center',
    minWidth: 100,
  },
  npcAvatar: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  npcName: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
});
