// Core type definitions for Hall Pass game engine

export type Archetype = 'jock' | 'nerd' | 'popular' | 'goth' | 'artist' | 'rebel' | 'hybrid';

export interface CharacterStats {
  athletic: number;
  knowledge: number;
  social: number;
  creative: number;
  cool: number;
  reputation: number;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  archetype: Archetype;
  secondaryArchetype?: Archetype;
  stats: CharacterStats;
  year: 1 | 2 | 3 | 4;
  createdAt: Date;
  updatedAt: Date;
}

// Room System Types
export type WallPosition = 'wall1' | 'wall2' | 'wall3' | 'wall4';
export type FloorZone = 'bed' | 'desk' | 'wardrobe' | 'center' | 'window' | 'door';

export interface Position {
  x: number;
  y: number;
  z?: number;
  rotation: number;
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: 'bed' | 'desk' | 'chair' | 'storage' | 'decor' | 'lighting' | 'wall' | 'floor';
  archetype?: Archetype;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  currency: 'cool' | 'hallpass' | 'archetype';
  imageUrl: string;
  dimensions: { width: number; height: number; depth?: number };
  interactable: boolean;
  effects?: {
    stat?: keyof CharacterStats;
    bonus?: number;
    unlocksMinigame?: string;
  };
}

export interface PlacedItem {
  id: string;
  itemId: string;
  item: FurnitureItem;
  position: Position;
  zone: FloorZone | WallPosition;
  scale: number;
  locked: boolean;
}

export interface WallConfig {
  position: WallPosition;
  paintColor: string;
  posters: PlacedItem[];
  shelves: PlacedItem[];
}

export interface LightingConfig {
  ambient: string;
  sources: {
    id: string;
    type: 'lamp' | 'led' | 'fairy' | 'neon' | 'window';
    color: string;
    intensity: number;
    position: Position;
  }[];
}

export interface RoomState {
  id: string;
  playerId: string;
  walls: WallConfig[];
  floorItems: PlacedItem[];
  wallItems: PlacedItem[];
  lighting: LightingConfig;
  layoutVersion: number;
  lastModified: Date;
}

// NPC System Types
export type RelationshipStatus = 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'best_friend' | 'dating' | 'rival' | 'enemy';

export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'gift' | 'betrayal' | 'help' | 'shared_activity' | 'conflict' | 'romance';
  description: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
  impact: number;
  relatedNpcIds?: string[];
}

export interface NPCTrait {
  loyal: boolean;
  jealous: boolean;
  ambitious: boolean;
  romantic: boolean;
  gossip: boolean;
  protective: boolean;
}

export interface NPC {
  id: string;
  name: string;
  avatar: string;
  archetype: Archetype;
  traits: NPCTrait;
  backstory: string;
  schedule: {
    morning: string;
    lunch: string;
    afternoon: string;
    evening: string;
  };
  // Dynamic state
  relationship: {
    level: number;
    status: RelationshipStatus;
    memories: MemoryEntry[];
    lastInteraction: Date;
    currentMood: string;
  };
  // Relationships with other NPCs
  npcRelationships: Record<string, number>;
}

// Story System Types
export type StoryArc = 'freshman' | 'sophomore' | 'junior' | 'senior';

export interface Choice {
  id: string;
  text: string;
  consequences: {
    statChanges?: Partial<CharacterStats>;
    relationshipChanges?: Record<string, number>;
    memoryCreation?: Omit<MemoryEntry, 'id' | 'timestamp'>;
    unlockArchetype?: Archetype;
    unlockScene?: string;
    unlockItem?: string;
  };
  requiredStats?: Partial<CharacterStats>;
  requiredArchetype?: Archetype;
}

export interface Scene {
  id: string;
  arc: StoryArc;
  location: string;
  characters: string[];
  dialogue: DialogueLine[];
  choices: Choice[];
  conditions?: {
    requiredRelationships?: Record<string, RelationshipStatus>;
    requiredStats?: Partial<CharacterStats>;
    requiredItems?: string[];
    completedScenes?: string[];
  };
}

export interface DialogueLine {
  id: string;
  speakerId: string;
  text: string;
  emotion: string;
  playerResponse?: string;
}

export interface StoryProgress {
  currentArc: StoryArc;
  currentScene?: string;
  completedScenes: string[];
  majorChoices: {
    choiceId: string;
    sceneId: string;
    timestamp: Date;
    consequences: string[];
  }[];
}

// Mini-game Types
export type MiniGameType = 'quiz' | 'rhythm' | 'timing' | 'puzzle' | 'memory' | 'physics';

export interface MiniGame {
  id: string;
  name: string;
  type: MiniGameType;
  archetype: Archetype;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  rewards: {
    coolPoints: number;
    archetypePoints: number;
    itemChance?: string;
  };
  highScore: number;
  lastPlayed?: Date;
  dailyPlays: number;
  maxDailyPlays: number;
}

// Progression Types
export interface Currency {
  coolPoints: number;
  hallPasses: number;
  archetypePoints: Record<Archetype, number>;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  acquiredAt: Date;
}

export interface Outfit {
  id: string;
  name: string;
  archetype: Archetype;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pieces: {
    top: string;
    bottom: string;
    shoes: string;
    accessory?: string;
  };
  statsBonus?: Partial<CharacterStats>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'academic' | 'creative' | 'athletic' | 'collection' | 'story';
  requirement: {
    type: 'stat_reached' | 'relationship_status' | 'item_owned' | 'scene_completed' | 'minigame_score';
    target: number | string;
    count?: number;
  };
  reward: {
    coolPoints?: number;
    hallPasses?: number;
    itemId?: string;
  };
  unlockedAt?: Date;
}

// Complete Game State
export interface GameState {
  player: PlayerProfile;
  room: RoomState;
  npcs: NPC[];
  story: StoryProgress;
  currency: Currency;
  inventory: InventoryItem[];
  outfits: Outfit[];
  unlockedOutfits: string[];
  achievements: Achievement[];
  miniGames: MiniGame[];
  meta: {
    lastLogin: Date;
    streakDays: number;
    totalPlayTime: number;
    vipStatus: boolean;
    vipExpiry?: Date;
    adFree: boolean;
    infiniteEnergy: boolean;
  };
}
