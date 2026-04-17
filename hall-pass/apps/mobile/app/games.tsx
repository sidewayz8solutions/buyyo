import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useGameStore, miniGames, getMiniGameById, MiniGame } from '@hallpass/game-engine';
import { Button, Card, StatBadge, colors, spacing, typography } from '@hallpass/shared-ui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

// Quiz Game Component
function QuizGame({ onScore }: { onScore: (score: number) => void }) {
  const questions = [
    { q: 'What is the powerhouse of the cell?', a: ['Mitochondria', 'Nucleus', 'Ribosome'], correct: 0 },
    { q: 'Who wrote "Romeo and Juliet"?', a: ['Charles Dickens', 'William Shakespeare', 'Jane Austen'], correct: 1 },
    { q: 'What is 8 × 7?', a: ['54', '56', '58'], correct: 1 },
  ];
  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const answer = (idx: number) => {
    if (idx === questions[current].correct) {
      setScore(s => s + 1);
    }
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      onScore(Math.floor((score / questions.length) * 100));
    }
  };

  return (
    <Card style={styles.gameContainer}>
      <Text style={styles.gameTitle}>Quiz Bowl</Text>
      <Text style={styles.question}>{questions[current].q}</Text>
      {questions[current].a.map((ans, idx) => (
        <Button key={idx} title={ans} onPress={() => answer(idx)} style={styles.answerButton} />
      ))}
      <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
    </Card>
  );
}

// Basketball Game Component
function BasketballGame({ onScore }: { onScore: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const shoot = () => {
    const made = Math.random() > 0.4;
    if (made) setScore(s => s + 1);
  };

  return (
    <Card style={styles.gameContainer}>
      <Text style={styles.gameTitle}>Basketball Shootout</Text>
      <Text style={styles.timer}>Time: {timeLeft}s</Text>
      <Text style={styles.scoreDisplay}>Baskets: {score}</Text>
      <Button title="🏀 SHOOT!" onPress={shoot} size="lg" />
      <Button title="End Game" onPress={() => onScore(score * 10)} variant="secondary" style={styles.endButton} />
    </Card>
  );
}

// Rhythm Game Component
function RhythmGame({ onScore }: { onScore: (score: number) => void }) {
  const [combo, setCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const tap = () => {
    const onBeat = Math.random() > 0.3;
    if (onBeat) {
      setCombo(c => c + 1);
      setHits(h => h + 1);
    } else {
      setCombo(0);
      setMisses(m => m + 1);
    }
  };

  const total = hits + misses;
  const accuracy = total > 0 ? (hits / total) * 100 : 0;

  return (
    <Card style={styles.gameContainer}>
      <Text style={styles.gameTitle}>Band Practice</Text>
      <Text style={styles.comboText}>🔥 Combo: {combo}</Text>
      <Text style={styles.accuracyText}>Accuracy: {accuracy.toFixed(0)}%</Text>
      <Button title="🎵 TAP TO THE BEAT!" onPress={tap} size="lg" />
      <Button title="Finish" onPress={() => onScore(Math.floor(accuracy * 10))} variant="secondary" />
    </Card>
  );
}

export default function GamesScreen() {
  const router = useRouter();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const recordMiniGameScore = useGameStore((state) => state.recordMiniGameScore);

  const handleGameComplete = (gameId: string, score: number) => {
    recordMiniGameScore(gameId, score);
    setActiveGame(null);
  };

  const archetypeIcons: Record<string, string> = {
    nerd: '🤓',
    jock: '🏃',
    popular: '👑',
    goth: '🖤',
    artist: '🎨',
    hybrid: '🎲',
  };

  const archetypeColors: Record<string, string> = {
    nerd: colors.nerd,
    jock: colors.jock,
    popular: colors.popular,
    goth: colors.goth,
    artist: colors.artist,
    hybrid: colors.textSecondary,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Mini Games</Text>
        <Text style={styles.subtitle}>Play to earn Cool Points!</Text>
      </View>

      {activeGame ? (
        <View style={styles.gameWrapper}>
          {activeGame === 'quiz_bowl' && <QuizGame onScore={(s) => handleGameComplete('quiz_bowl', s)} />}
          {activeGame === 'basketball_shoot' && <BasketballGame onScore={(s) => handleGameComplete('basketball_shoot', s)} />}
          {activeGame === 'band_practice' && <RhythmGame onScore={(s) => handleGameComplete('band_practice', s)} />}
          <Button title="Quit" onPress={() => setActiveGame(null)} variant="ghost" style={styles.quitButton} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {miniGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderColor: archetypeColors[game.archetype] }]}
              onPress={() => setActiveGame(game.id)}
              disabled={game.dailyPlays >= game.maxDailyPlays}
            >
              <View style={styles.gameHeader}>
                <Text style={styles.gameIcon}>{archetypeIcons[game.archetype]}</Text>
                <View style={styles.gameMeta}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={[styles.gameArchetype, { color: archetypeColors[game.archetype] }]}>
                    {game.archetype.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.gameDesc}>{game.description}</Text>
              
              <View style={styles.gameStats}>
                <Text style={styles.rewardText}>
                  +{game.rewards.coolPoints} Cool Points
                </Text>
                <Text style={styles.playsText}>
                  {game.dailyPlays}/{game.maxDailyPlays} plays today
                </Text>
              </View>
              
              {game.dailyPlays >= game.maxDailyPlays && (
                <View style={styles.maxedOverlay}>
                  <Text style={styles.maxedText}>Come back tomorrow!</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
  gameCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gameIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  gameMeta: {
    flex: 1,
  },
  gameName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  gameArchetype: {
    ...typography.caption,
    fontWeight: '600',
  },
  gameDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardText: {
    ...typography.bodySmall,
    color: colors.accentCyan,
    fontWeight: '600',
  },
  playsText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  maxedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgPrimary + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  maxedText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  gameWrapper: {
    flex: 1,
    padding: spacing.lg,
  },
  gameContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  gameTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  question: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  answerButton: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  scoreText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  timer: {
    ...typography.h3,
    color: colors.accentGold,
  },
  scoreDisplay: {
    ...typography.h2,
    color: colors.textPrimary,
    marginVertical: spacing.lg,
  },
  endButton: {
    marginTop: spacing.lg,
  },
  comboText: {
    ...typography.h2,
    color: colors.accentGold,
  },
  accuracyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginVertical: spacing.lg,
  },
  quitButton: {
    marginTop: spacing.lg,
  },
  backButton: {
    margin: spacing.lg,
  },
});
