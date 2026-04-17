// Mini-game definitions for Hall Pass
import { MiniGame } from './types';

export const miniGames: MiniGame[] = [
  // NERD GAMES
  {
    id: 'quiz_bowl',
    name: 'Quiz Bowl',
    type: 'quiz',
    archetype: 'nerd',
    description: 'Test your knowledge across various subjects. Speed and accuracy matter!',
    difficulty: 2,
    rewards: {
      coolPoints: 50,
      archetypePoints: 30,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  {
    id: 'chem_lab',
    name: 'Chemistry Lab',
    type: 'puzzle',
    archetype: 'nerd',
    description: 'Mix compounds to create reactions. Be careful not to cause an explosion!',
    difficulty: 3,
    rewards: {
      coolPoints: 60,
      archetypePoints: 40,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 3,
  },
  {
    id: 'code_break',
    name: 'Code Breaker',
    type: 'puzzle',
    archetype: 'nerd',
    description: 'Hack into the school system to change your grades... or help a friend.',
    difficulty: 4,
    rewards: {
      coolPoints: 80,
      archetypePoints: 50,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 2,
  },
  
  // JOCK GAMES
  {
    id: 'basketball_shoot',
    name: 'Basketball Shootout',
    type: 'timing',
    archetype: 'jock',
    description: 'Time your shots perfectly to sink as many baskets as possible.',
    difficulty: 2,
    rewards: {
      coolPoints: 50,
      archetypePoints: 30,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  {
    id: 'track_sprint',
    name: 'Track Sprint',
    type: 'rhythm',
    archetype: 'jock',
    description: 'Tap in rhythm to sprint faster. Don\'t trip!',
    difficulty: 3,
    rewards: {
      coolPoints: 60,
      archetypePoints: 40,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  {
    id: 'weight_room',
    name: 'Weight Room',
    type: 'timing',
    archetype: 'jock',
    description: 'Pump iron with perfect timing. Build those muscles!',
    difficulty: 2,
    rewards: {
      coolPoints: 40,
      archetypePoints: 25,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 3,
  },
  
  // POPULAR GAMES
  {
    id: 'cafeteria_dash',
    name: 'Cafeteria Dash',
    type: 'memory',
    archetype: 'popular',
    description: 'Serve the right food to the right cliques. Don\'t mix up the orders!',
    difficulty: 3,
    rewards: {
      coolPoints: 50,
      archetypePoints: 30,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  {
    id: 'party_planner',
    name: 'Party Planner',
    type: 'puzzle',
    archetype: 'popular',
    description: 'Organize the perfect party. Balance popularity, budget, and drama.',
    difficulty: 4,
    rewards: {
      coolPoints: 70,
      archetypePoints: 45,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 2,
  },
  {
    id: 'gossip_chain',
    name: 'Gossip Chain',
    type: 'memory',
    archetype: 'popular',
    description: 'Pass the gossip down the line without it getting twisted.',
    difficulty: 3,
    rewards: {
      coolPoints: 60,
      archetypePoints: 35,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 3,
  },
  
  // ARTIST/GOTH GAMES
  {
    id: 'art_studio',
    name: 'Art Studio',
    type: 'physics',
    archetype: 'artist',
    description: 'Paint with physics-based brush strokes. Create your masterpiece!',
    difficulty: 3,
    rewards: {
      coolPoints: 60,
      archetypePoints: 40,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  {
    id: 'band_practice',
    name: 'Band Practice',
    type: 'rhythm',
    archetype: 'goth',
    description: 'Keep the rhythm in this guitar hero-style game.',
    difficulty: 4,
    rewards: {
      coolPoints: 70,
      archetypePoints: 45,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 3,
  },
  {
    id: 'photo_shoot',
    name: 'Photo Shoot',
    type: 'timing',
    archetype: 'artist',
    description: 'Frame the perfect shot. Timing is everything!',
    difficulty: 2,
    rewards: {
      coolPoints: 50,
      archetypePoints: 30,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  
  // UNIVERSAL GAMES
  {
    id: 'locker_organize',
    name: 'Locker Organizer',
    type: 'puzzle',
    archetype: 'hybrid',
    description: 'Tetris-style packing. Fit everything into your locker!',
    difficulty: 2,
    rewards: {
      coolPoints: 40,
      archetypePoints: 20,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 10,
  },
  {
    id: 'hallway_nav',
    name: 'Hallway Navigation',
    type: 'memory',
    archetype: 'hybrid',
    description: 'Avoid bullies, find your friends, and get to class on time.',
    difficulty: 3,
    rewards: {
      coolPoints: 50,
      archetypePoints: 25,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 5,
  },
  {
    id: 'social_media',
    name: 'Social Media Star',
    type: 'timing',
    archetype: 'popular',
    description: 'Edit photos and craft the perfect hashtag to go viral.',
    difficulty: 2,
    rewards: {
      coolPoints: 45,
      archetypePoints: 30,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 10,
  },
  {
    id: 'esports_arena',
    name: 'E-Sports Arena',
    type: 'rhythm',
    archetype: 'nerd',
    description: 'Compete in the school gaming tournament. Combo for max points!',
    difficulty: 5,
    rewards: {
      coolPoints: 100,
      archetypePoints: 60,
    },
    highScore: 0,
    dailyPlays: 0,
    maxDailyPlays: 3,
  },
];

// Utility functions
export function getMiniGameById(id: string): MiniGame | undefined {
  return miniGames.find((game) => game.id === id);
}

export function getMiniGamesByArchetype(archetype: string): MiniGame[] {
  return miniGames.filter((game) => game.archetype === archetype);
}

export function getMiniGamesByType(type: string): MiniGame[] {
  return miniGames.filter((game) => game.type === type);
}

export function getAvailableMiniGames(dailyResetTime?: Date): MiniGame[] {
  return miniGames.filter((game) => game.dailyPlays < game.maxDailyPlays);
}

export function getDailyResetTime(): Date {
  const now = new Date();
  const resetTime = new Date(now);
  resetTime.setHours(0, 0, 0, 0);
  if (resetTime <= now) {
    resetTime.setDate(resetTime.getDate() + 1);
  }
  return resetTime;
}
