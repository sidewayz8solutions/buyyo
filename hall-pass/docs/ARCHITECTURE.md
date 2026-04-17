# Hall Pass — Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
├─────────────────────┬───────────────────────────────────────┤
│   Expo (iOS/Android)│        Next.js (Web)                  │
│                     │                                       │
│  ┌───────────────┐  │   ┌───────────────┐                   │
│  │ React Native  │  │   │    React      │                   │
│  │     UI        │  │   │     UI        │                   │
│  └───────┬───────┘  │   └───────┬───────┘                   │
│          │          │           │                           │
│  ┌───────▼───────┐  │   ┌───────▼───────┐                   │
│  │  Shared Game  │◄─┼──►│  Shared Game  │                   │
│  │    Engine     │  │   │    Engine     │                   │
│  └───────┬───────┘  │   └───────┬───────┘                   │
│          │          │           │                           │
│  ┌───────▼───────┐  │   ┌───────▼───────┐                   │
│  │  RevenueCat   │  │   │  RevenueCat   │                   │
│  │  (Purchases)  │  │   │  (Purchases)  │                   │
│  └───────┬───────┘  │   └───────┬───────┘                   │
└──────────┼──────────┴───────────┼───────────────────────────┘
           │                      │
           └──────────┬───────────┘
                      │
           ┌──────────▼───────────┐
           │      SUPABASE        │
           │                      │
           │  ┌────────────────┐   │
           │  │   PostgreSQL   │   │
           │  │   (Game Data)  │   │
           │  └────────────────┘   │
           │  ┌────────────────┐   │
           │  │    Auth        │   │
           │  │  (JWT/Magic)   │   │
           │  └────────────────┘   │
           │  ┌────────────────┐   │
           │  │  Realtime Subs │   │
           │  └────────────────┘   │
           │  ┌────────────────┐   │
           │  │    Storage     │   │
           │  │  (Room Images) │   │
           │  └────────────────┘   │
           └───────────────────────┘
                      │
           ┌──────────▼───────────┐
           │    OPENAI/CLAUDE     │
           │   (NPC Dialogue)     │
           └───────────────────────┘
```

## Package Structure

### `packages/game-engine`
Core simulation logic, state management, and game rules.

### `packages/ai-npcs`
AI integration for dynamic NPC dialogue and personality.

### `packages/shared-ui`
Cross-platform UI components using React Native Web.

### `packages/iap-core`
RevenueCat integration for unified in-app purchases.

## State Flow

```
User Action
    ↓
Game Engine (process)
    ↓
┌─────────────────────────────┐
│  Update Local State (Zustand) │
│  → Immediate UI feedback    │
└─────────────────────────────┘
    ↓
Background Sync to Supabase
    ↓
Conflict Resolution (if needed)
```

## Data Models

### Player Profile
```typescript
interface PlayerProfile {
  id: string;
  user_id: string;
  name: string;
  archetype: Archetype;
  stats: CharacterStats;
  year: number;
  created_at: Date;
  updated_at: Date;
}
```

### Room State
```typescript
interface RoomState {
  id: string;
  player_id: string;
  walls: WallConfig[];
  furniture: PlacedItem[];
  lighting: LightingConfig;
  layout_version: number;
}
```

### NPC Relationship
```typescript
interface Relationship {
  id: string;
  player_id: string;
  npc_id: string;
  level: number;  // -100 to 100
  status: RelationshipStatus;
  memories: MemoryEntry[];
  last_interaction: Date;
}
```

## Sync Strategy

### Offline-First
- All game logic runs locally
- AsyncStorage for immediate persistence
- Background sync to cloud
- Conflict resolution: Server wins for currency, merge for relationships

### Realtime (Optional)
- Supabase Realtime for live events
- Used for: seasonal events, global announcements

## Security

### Row Level Security (RLS)
```sql
-- Players can only access their own data
CREATE POLICY "Players own their profile"
ON player_profiles FOR ALL
USING (auth.uid() = user_id);

-- Rooms are private to owner
CREATE POLICY "Players own their room"
ON rooms FOR ALL
USING (auth.uid() = player_id);
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Time to Interactive | < 3s |
| Mini-game FPS | 60fps |
| State sync latency | < 500ms |
| APK size | < 50MB |
