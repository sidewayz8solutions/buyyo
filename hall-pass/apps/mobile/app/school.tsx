import { useGameStore, initialNPCs } from '@hallpass/game-engine';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, ArchetypeBadge, Card, colors, spacing, typography } from '@hallpass/shared-ui';
import { StatusBar } from 'expo-status-bar';

export default function SchoolScreen() {
  const router = useRouter();
  const npcs = useGameStore((state) => state.npcs.length > 0 ? state.npcs : initialNPCs);

  const locations = [
    { name: 'Cafeteria', icon: '🍽️', description: 'Lunch hangout spot' },
    { name: 'Classroom', icon: '📚', description: 'Study and learn' },
    { name: 'Gym', icon: '🏀', description: 'Sports and fitness' },
    { name: 'Library', icon: '📖', description: 'Quiet study zone' },
    { name: 'Art Room', icon: '🎨', description: 'Creative space' },
    { name: 'Hallway', icon: '🚶', description: 'Social hub' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🏫 School</Text>
        <Text style={styles.subtitle}>Explore and meet people</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Locations */}
        <Text style={styles.sectionTitle}>Locations</Text>
        <View style={styles.locationsGrid}>
          {locations.map((location) => (
            <TouchableOpacity key={location.name} style={styles.locationCard}>
              <Text style={styles.locationIcon}>{location.icon}</Text>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationDesc}>{location.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* People at School */}
        <Text style={styles.sectionTitle}>People at School</Text>
        {npcs.map((npc) => (
          <TouchableOpacity
            key={npc.id}
            style={styles.npcCard}
            onPress={() => router.push(`/npc/${npc.id}`)}
          >
            <Text style={styles.npcAvatar}>👤</Text>
            <View style={styles.npcInfo}>
              <Text style={styles.npcName}>{npc.name}</Text>
              <ArchetypeBadge archetype={npc.archetype} size="sm" />
              <Text style={styles.npcStatus}>
                {npc.relationship.status === 'stranger' ? 'Never met' : npc.relationship.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button title="Back to Home" onPress={() => router.push('/')} variant="ghost" style={styles.backButton} />
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
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  locationCard: {
    width: '47%',
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  locationName: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  locationDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  npcCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  npcAvatar: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  npcStatus: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  backButton: {
    margin: spacing.lg,
  },
});
