import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  GameState, 
  PlayerProfile, 
  RoomState, 
  NPC, 
  FurnitureItem, 
  PlacedItem, 
  Position,
  CharacterStats,
  MiniGame,
  MemoryEntry,
  Archetype
} from './types';

// Initial state factory
export const createInitialState = (): GameState => ({
  player: {
    id: '',
    userId: '',
    name: '',
    avatar: 'default',
    archetype: 'hybrid',
    stats: {
      athletic: 10,
      knowledge: 10,
      social: 10,
      creative: 10,
      cool: 100,
      reputation: 0,
    },
    year: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  room: {
    id: '',
    playerId: '',
    walls: [
      { position: 'wall1', paintColor: '#f0f0f0', posters: [], shelves: [] },
      { position: 'wall2', paintColor: '#f0f0f0', posters: [], shelves: [] },
      { position: 'wall3', paintColor: '#f0f0f0', posters: [], shelves: [] },
      { position: 'wall4', paintColor: '#f0f0f0', posters: [], shelves: [] },
    ],
    floorItems: [],
    wallItems: [],
    lighting: {
      ambient: '#ffffff',
      sources: [{ id: 'default', type: 'window', color: '#ffffff', intensity: 0.8, position: { x: 0, y: 0, rotation: 0 } }],
    },
    layoutVersion: 1,
    lastModified: new Date(),
  },
  npcs: [],
  story: {
    currentArc: 'freshman',
    completedScenes: [],
    majorChoices: [],
  },
  currency: {
    coolPoints: 0,
    hallPasses: 0,
    archetypePoints: {
      jock: 0,
      nerd: 0,
      popular: 0,
      goth: 0,
      artist: 0,
      rebel: 0,
      hybrid: 0,
    },
  },
  inventory: [],
  outfits: [],
  unlockedOutfits: ['default'],
  achievements: [],
  miniGames: [],
  meta: {
    lastLogin: new Date(),
    streakDays: 1,
    totalPlayTime: 0,
    vipStatus: false,
    adFree: false,
    infiniteEnergy: false,
  },
});

// Store interface with actions
interface GameActions {
  // Player actions
  setPlayer: (player: Partial<PlayerProfile>) => void;
  updateStats: (stats: Partial<CharacterStats>) => void;
  setArchetype: (archetype: Archetype) => void;
  
  // Room actions
  addFurniture: (item: FurnitureItem, position: Position, zone: string) => void;
  moveFurniture: (placedItemId: string, newPosition: Position) => void;
  removeFurniture: (placedItemId: string) => void;
  changeWallColor: (wallPosition: string, color: string) => void;
  addWallDecor: (item: FurnitureItem, wallPosition: string, position: Position) => void;
  updateLighting: (lighting: GameState['room']['lighting']) => void;
  
  // NPC actions
  interactWithNPC: (npcId: string, interactionType: string, impact: number) => void;
  addNPCMemory: (npcId: string, memory: Omit<MemoryEntry, 'id' | 'timestamp'>) => void;
  
  // Currency actions
  addCoolPoints: (amount: number) => void;
  spendCoolPoints: (amount: number) => boolean;
  addHallPasses: (amount: number) => void;
  spendHallPasses: (amount: number) => boolean;
  addArchetypePoints: (archetype: Archetype, amount: number) => void;
  
  // Mini-game actions
  recordMiniGameScore: (gameId: string, score: number) => void;
  resetDailyMiniGames: () => void;
  
  // Meta actions
  updateLastLogin: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addPlayTime: (minutes: number) => void;
  setVIPStatus: (active: boolean, expiry?: Date) => void;
  
  // Persistence
  loadGame: (saveData: GameState) => void;
  resetGame: () => void;
}

export type GameStore = GameState & GameActions;

// Create the store
export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...createInitialState(),

    // Player actions
    setPlayer: (player) =>
      set((state) => {
        Object.assign(state.player, player);
        state.player.updatedAt = new Date();
      }),

    updateStats: (stats) =>
      set((state) => {
        Object.assign(state.player.stats, stats);
        // Clamp stats to 0-100 range
        Object.keys(state.player.stats).forEach((key) => {
          const k = key as keyof CharacterStats;
          state.player.stats[k] = Math.max(0, Math.min(100, state.player.stats[k]));
        });
      }),

    setArchetype: (archetype) =>
      set((state) => {
        state.player.archetype = archetype;
      }),

    // Room actions
    addFurniture: (item, position, zone) =>
      set((state) => {
        const placedItem: PlacedItem = {
          id: `placed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.id,
          item,
          position,
          zone: zone as any,
          scale: 1,
          locked: false,
        };
        
        if (zone.startsWith('wall')) {
          state.room.wallItems.push(placedItem);
        } else {
          state.room.floorItems.push(placedItem);
        }
        state.room.lastModified = new Date();
        state.room.layoutVersion += 1;
      }),

    moveFurniture: (placedItemId, newPosition) =>
      set((state) => {
        const floorItem = state.room.floorItems.find((i) => i.id === placedItemId);
        const wallItem = state.room.wallItems.find((i) => i.id === placedItemId);
        
        if (floorItem) {
          floorItem.position = newPosition;
        } else if (wallItem) {
          wallItem.position = newPosition;
        }
        
        state.room.lastModified = new Date();
      }),

    removeFurniture: (placedItemId) =>
      set((state) => {
        state.room.floorItems = state.room.floorItems.filter((i) => i.id !== placedItemId);
        state.room.wallItems = state.room.wallItems.filter((i) => i.id !== placedItemId);
        state.room.lastModified = new Date();
      }),

    changeWallColor: (wallPosition, color) =>
      set((state) => {
        const wall = state.room.walls.find((w) => w.position === wallPosition);
        if (wall) {
          wall.paintColor = color;
        }
        state.room.lastModified = new Date();
      }),

    addWallDecor: (item, wallPosition, position) =>
      set((state) => {
        const placedItem: PlacedItem = {
          id: `placed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.id,
          item,
          position,
          zone: wallPosition as any,
          scale: 1,
          locked: false,
        };
        state.room.wallItems.push(placedItem);
        state.room.lastModified = new Date();
      }),

    updateLighting: (lighting) =>
      set((state) => {
        state.room.lighting = lighting;
        state.room.lastModified = new Date();
      }),

    // NPC actions
    interactWithNPC: (npcId, interactionType, impact) =>
      set((state) => {
        const npc = state.npcs.find((n) => n.id === npcId);
        if (npc) {
          npc.relationship.level = Math.max(-100, Math.min(100, npc.relationship.level + impact));
          npc.relationship.lastInteraction = new Date();
          
          // Update status based on level
          if (npc.relationship.level >= 80) npc.relationship.status = 'best_friend';
          else if (npc.relationship.level >= 50) npc.relationship.status = 'close_friend';
          else if (npc.relationship.level >= 20) npc.relationship.status = 'friend';
          else if (npc.relationship.level >= 0) npc.relationship.status = 'acquaintance';
          else if (npc.relationship.level >= -30) npc.relationship.status = 'rival';
          else npc.relationship.status = 'enemy';
        }
      }),

    addNPCMemory: (npcId, memory) =>
      set((state) => {
        const npc = state.npcs.find((n) => n.id === npcId);
        if (npc) {
          const newMemory: MemoryEntry = {
            ...memory,
            id: `mem_${Date.now()}`,
            timestamp: new Date(),
          };
          npc.relationship.memories.unshift(newMemory);
          // Keep only last 50 memories
          npc.relationship.memories = npc.relationship.memories.slice(0, 50);
        }
      }),

    // Currency actions
    addCoolPoints: (amount) =>
      set((state) => {
        const multiplier = state.meta.vipStatus ? 2 : 1;
        state.currency.coolPoints += amount * multiplier;
      }),

    spendCoolPoints: (amount) => {
      const state = get();
      if (state.currency.coolPoints >= amount) {
        set((s) => {
          s.currency.coolPoints -= amount;
        });
        return true;
      }
      return false;
    },

    addHallPasses: (amount) =>
      set((state) => {
        state.currency.hallPasses += amount;
      }),

    spendHallPasses: (amount) => {
      const state = get();
      if (state.currency.hallPasses >= amount) {
        set((s) => {
          s.currency.hallPasses -= amount;
        });
        return true;
      }
      return false;
    },

    addArchetypePoints: (archetype, amount) =>
      set((state) => {
        state.currency.archetypePoints[archetype] += amount;
      }),

    // Mini-game actions
    recordMiniGameScore: (gameId, score) =>
      set((state) => {
        const game = state.miniGames.find((g) => g.id === gameId);
        if (game) {
          game.highScore = Math.max(game.highScore, score);
          game.lastPlayed = new Date();
          game.dailyPlays += 1;
          
          // Award currency based on score
          const earnedCool = Math.floor(score * game.rewards.coolPoints / 100);
          const earnedArchetype = Math.floor(score * game.rewards.archetypePoints / 100);
          
          const multiplier = state.meta.vipStatus ? 2 : 1;
          state.currency.coolPoints += earnedCool * multiplier;
          state.currency.archetypePoints[game.archetype] += earnedArchetype * multiplier;
        }
      }),

    resetDailyMiniGames: () =>
      set((state) => {
        state.miniGames.forEach((game) => {
          game.dailyPlays = 0;
        });
      }),

    // Meta actions
    updateLastLogin: () =>
      set((state) => {
        const now = new Date();
        const lastLogin = new Date(state.meta.lastLogin);
        const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          state.meta.streakDays += 1;
        } else if (daysDiff > 1) {
          state.meta.streakDays = 1;
        }
        
        state.meta.lastLogin = now;
      }),

    incrementStreak: () =>
      set((state) => {
        state.meta.streakDays += 1;
      }),

    resetStreak: () =>
      set((state) => {
        state.meta.streakDays = 1;
      }),

    addPlayTime: (minutes) =>
      set((state) => {
        state.meta.totalPlayTime += minutes;
      }),

    setVIPStatus: (active, expiry) =>
      set((state) => {
        state.meta.vipStatus = active;
        state.meta.vipExpiry = expiry;
      }),

    // Persistence
    loadGame: (saveData) =>
      set(() => ({
        ...saveData,
      })),

    resetGame: () =>
      set(() => createInitialState()),
  }))
);

// Selectors
export const selectPlayer = (state: GameStore) => state.player;
export const selectRoom = (state: GameStore) => state.room;
export const selectNPCs = (state: GameStore) => state.npcs;
export const selectCurrency = (state: GameStore) => state.currency;
export const selectMiniGames = (state: GameStore) => state.miniGames;
export const selectMeta = (state: GameStore) => state.meta;
export const selectAchievements = (state: GameStore) => state.achievements;

// Computed selectors
export const selectCanAfford = (coolCost: number, hallPassCost: number = 0) => 
  (state: GameStore) => 
    state.currency.coolPoints >= coolCost && state.currency.hallPasses >= hallPassCost;

export const selectNPCById = (npcId: string) => 
  (state: GameStore) => 
    state.npcs.find((n) => n.id === npcId);

export const selectFurnitureByCategory = (category: string) =>
  (state: GameStore) =>
    state.inventory.filter((item) => {
      // This would need to reference a catalog of furniture items
      return true;
    });
