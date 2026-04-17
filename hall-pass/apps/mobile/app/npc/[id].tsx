import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGameStore, initialNPCs, getNPCById } from '@hallpass/game-engine';
import { generateNPCDialogue, analyzeChoiceImpact } from '@hallpass/ai-npcs';
import { Button, Card, ArchetypeBadge, colors, spacing, typography } from '@hallpass/shared-ui';
import { StatusBar } from 'expo-status-bar';

export default function NPCScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const npcId = Array.isArray(id) ? id[0] : id;
  
  const npc = useGameStore((state) => state.npcs.find((n) => n.id === npcId)) || getNPCById(npcId || '');
  const player = useGameStore((state) => state.player);
  const interactWithNPC = useGameStore((state) => state.interactWithNPC);
  const addNPCMemory = useGameStore((state) => state.addNPCMemory);
  
  const [dialogue, setDialogue] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('neutral');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ speaker: string; text: string; emotion?: string }>>([]);

  useEffect(() => {
    if (npc) {
      loadInitialGreeting();
    }
  }, [npc]);

  const loadInitialGreeting = async () => {
    if (!npc) return;
    
    setLoading(true);
    try {
      const result = await generateNPCDialogue({
        npc,
        player,
        currentLocation: 'hallway',
        recentEvents: npc.relationship.memories.slice(0, 3),
        timeOfDay: getCurrentTimeOfDay(),
      });
      
      setDialogue(result.response);
      setEmotion(result.emotion);
      setConversationHistory([{ speaker: npc.name, text: result.response, emotion: result.emotion }]);
    } catch (error) {
      setDialogue(`Hey, I'm ${npc?.name}. What's up?`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeOfDay = (): 'morning' | 'lunch' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 14) return 'lunch';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const handleResponse = async (responseType: string) => {
    if (!npc) return;
    
    setLoading(true);
    
    // Add player response to history
    const playerText = getResponseText(responseType);
    setConversationHistory(prev => [...prev, { speaker: 'You', text: playerText }]);
    
    // Calculate impact
    const impact = analyzeChoiceImpact(responseType, npc, {
      npc,
      player,
      currentLocation: 'hallway',
      recentEvents: [],
      timeOfDay: getCurrentTimeOfDay(),
    });
    
    // Update relationship
    interactWithNPC(npc.id, responseType, impact.impact);
    addNPCMemory(npc.id, impact.memory);
    
    // Generate NPC response
    try {
      const result = await generateNPCDialogue({
        npc,
        player,
        currentLocation: 'hallway',
        recentEvents: npc.relationship.memories.slice(0, 3),
        timeOfDay: getCurrentTimeOfDay(),
        playerInput: playerText,
      });
      
      setDialogue(result.response);
      setEmotion(result.emotion);
      setConversationHistory(prev => [...prev, { speaker: npc.name, text: result.response, emotion: result.emotion }]);
    } catch (error) {
      setDialogue('...');
    } finally {
      setLoading(false);
    }
  };

  const getResponseText = (type: string): string => {
    const responses: Record<string, string> = {
      friendly: 'Hey! How are you doing?',
      flirt: 'You look really nice today...',
      insult: 'What are you looking at?',
      help: 'Do you need help with anything?',
      gossip: 'Have you heard the latest?',
      leave: 'I gotta go, see you around.',
    };
    return responses[type] || '...';
  };

  const getRelationshipColor = (level: number): string => {
    if (level > 50) return colors.accentGreen;
    if (level > 20) return colors.accentCyan;
    if (level > -10) return colors.textSecondary;
    if (level > -30) return colors.accentGold;
    return colors.error;
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      excited: '🤩',
      nervous: '😰',
      cool: '😎',
      mysterious: '🌙',
      neutral: '😐',
    };
    return emojis[emotion] || '😐';
  };

  if (!npc) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>NPC not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* NPC Header */}
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <Text style={styles.avatar}>👤</Text>
          <View style={styles.npcInfo}>
            <Text style={styles.npcName}>{npc.name}</Text>
            <ArchetypeBadge archetype={npc.archetype} size="sm" />
            <View style={styles.relationshipBar}>
              <View 
                style={[
                  styles.relationshipFill, 
                  { 
                    width: `${Math.max(0, Math.min(100, (npc.relationship.level + 100) / 2))}%`,
                    backgroundColor: getRelationshipColor(npc.relationship.level),
                  }
                ]} 
              />
            </View>
            <Text style={[styles.relationshipText, { color: getRelationshipColor(npc.relationship.level) }]}>
              {npc.relationship.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Conversation */}
      <ScrollView style={styles.conversation}>
        {conversationHistory.map((msg, idx) => (
          <View key={idx} style={[styles.message, msg.speaker === 'You' && styles.playerMessage]}>
            <Text style={styles.messageSpeaker}>{msg.speaker}</Text>
            {msg.emotion && <Text style={styles.emotionEmoji}>{getEmotionEmoji(msg.emotion)}</Text>}
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {loading && <Text style={styles.typing}>Typing...</Text>}
      </ScrollView>

      {/* Response Options */}
      <View style={styles.responses}>
        <Text style={styles.responsePrompt}>How do you respond?</Text>
        <View style={styles.responseGrid}>
          <Button title="👋 Friendly" onPress={() => handleResponse('friendly')} variant="secondary" size="sm" />
          <Button title="💕 Flirt" onPress={() => handleResponse('flirt')} variant="secondary" size="sm" />
          <Button title="😤 Insult" onPress={() => handleResponse('insult')} variant="secondary" size="sm" />
          <Button title="🤝 Help" onPress={() => handleResponse('help')} variant="secondary" size="sm" />
          <Button title="📢 Gossip" onPress={() => handleResponse('gossip')} variant="secondary" size="sm" />
          <Button title="👋 Leave" onPress={() => router.back()} variant="ghost" size="sm" />
        </View>
      </View>
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
    backgroundColor: colors.bgCard,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 64,
    marginRight: spacing.lg,
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  relationshipBar: {
    height: 4,
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  relationshipFill: {
    height: '100%',
    borderRadius: 2,
  },
  relationshipText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  conversation: {
    flex: 1,
    padding: spacing.lg,
  },
  message: {
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  playerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  messageSpeaker: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emotionEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  messageText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  typing: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  responses: {
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
  },
  responsePrompt: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  responseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    margin: spacing.lg,
  },
});
