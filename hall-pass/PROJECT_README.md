# Hall Pass — High School Life Simulator

## 🎮 What You've Got

A complete, production-ready **cross-platform life simulation game** with:

- ✅ **Mobile App** (Expo/React Native) - iOS & Android
- ✅ **Web App** (Next.js) - Browser playable
- ✅ **Game Engine** - State management, stats, progression
- ✅ **AI NPCs** - Dynamic dialogue with OpenAI integration
- ✅ **Room Customization** - Drag-drop furniture system
- ✅ **Mini-Games** - 12 different games across archetypes
- ✅ **IAP System** - RevenueCat integration for monetization
- ✅ **Shared UI** - Cross-platform design system
- ✅ **Backend Schema** - Supabase database ready

## 📁 Project Structure

```
hall-pass/
├── apps/
│   ├── mobile/          # Expo app (iOS/Android)
│   └── web/             # Next.js app (Web)
├── packages/
│   ├── game-engine/     # Core game logic & state
│   ├── ai-npcs/         # AI dialogue generation
│   ├── shared-ui/       # Cross-platform UI components
│   └── iap-core/        # RevenueCat purchase handling
├── supabase/
│   └── schema.sql       # Database schema
├── docs/
│   ├── GDD.md           # Full game design document
│   ├── ARCHITECTURE.md  # Technical architecture
│   └── IAP.md           # Monetization guide
└── scripts/
    ├── setup.sh         # One-command setup
    └── deploy.sh        # Production deployment
```

## 🚀 Quick Start

```bash
# 1. Run the setup script
bash scripts/setup.sh

# 2. Configure environment
cp .env.example apps/mobile/.env.local
cp .env.example apps/web/.env.local
# Edit .env.local files with your keys

# 3. Start developing

# Mobile (iOS simulator)
cd apps/mobile
npm run ios

# Mobile (Android emulator)
npm run android

# Web (browser)
cd apps/web
npm run dev
```

## 🎯 Game Features

### Character System
- 6 archetypes: Jock, Nerd, Popular, Goth, Artist, Rebel
- Hybrid system for mixed identities
- Stats that affect gameplay (Athletic, Knowledge, Social, Creative, Cool)

### Room Customization
- 40+ furniture items across categories
- Wall decorations and lighting
- Archetype-specific items
- Drag-drop placement (mobile) / drag (web)

### AI NPCs
- 8 fully characterized NPCs with backstories
- Dynamic dialogue powered by OpenAI
- Relationship system with memory
- Gossip and social dynamics

### Mini-Games
| Game | Archetype | Type |
|------|-----------|------|
| Quiz Bowl | Nerd | Trivia |
| Basketball Shootout | Jock | Timing |
| Band Practice | Goth | Rhythm |
| Art Studio | Artist | Physics |
| Cafeteria Dash | Popular | Memory |
| + 7 more | - | - |

### Monetization
- **Cool Points** - Earned through gameplay
- **Hall Passes** - Premium currency ($0.99 - $29.99)
- **Furniture Packs** - $2.99 - $4.99 per pack
- **VIP Subscription** - $9.99/mo or $79.99/yr
- **Ad Removal** - $4.99 one-time

## 🔧 Required Services

### 1. Supabase (Backend)
- Auth (magic link + social)
- PostgreSQL database
- Realtime subscriptions
- Storage for screenshots

### 2. RevenueCat (IAP)
- Unified IAP across iOS/Android/Web
- Subscription management
- Purchase verification

### 3. OpenAI (AI Dialogue)
- GPT-4 for NPC responses
- Context-aware conversation
- Fallback responses for offline

## 📊 Revenue Projections

| DAU | ARPDAU | Monthly Revenue |
|-----|--------|-----------------|
| 1,000 | $0.05 | $1,500 |
| 10,000 | $0.08 | $24,000 |
| 50,000 | $0.10 | $150,000 |

## 🎨 Customization

### Adding New Furniture
Edit `packages/game-engine/src/furniture.ts`:
```typescript
{
  id: 'your_item_id',
  name: 'Your Item Name',
  category: 'decor',
  rarity: 'rare',
  price: 100,
  currency: 'cool',
  imageUrl: '/furniture/your_item.png',
  dimensions: { width: 1, height: 1 },
  interactable: true,
}
```

### Adding New NPCs
Edit `packages/game-engine/src/npcs.ts`:
```typescript
{
  id: 'npc_your_id',
  name: 'NPC Name',
  avatar: 'avatar_id',
  archetype: 'nerd',
  traits: { loyal: true, jealous: false, ... },
  backstory: 'Their backstory...',
  // ... rest of NPC definition
}
```

### Adding New Mini-Games
Edit `packages/game-engine/src/minigames.ts`:
```typescript
{
  id: 'your_game_id',
  name: 'Game Name',
  type: 'quiz',
  archetype: 'nerd',
  description: 'Game description',
  difficulty: 3,
  rewards: { coolPoints: 50, archetypePoints: 30 },
  highScore: 0,
  dailyPlays: 0,
  maxDailyPlays: 5,
}
```

## 📱 Building for Stores

### iOS App Store
```bash
cd apps/mobile
# Configure app.json with your bundle ID
npx expo prebuild
npx eas build --platform ios
```

### Google Play
```bash
cd apps/mobile
npx expo prebuild
npx eas build --platform android
```

### Web Deployment
```bash
cd apps/web
npm run build
# Deploy to Vercel, Netlify, or your host
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Expo, React Native |
| Web | Next.js, React |
| State | Zustand, Immer |
| Backend | Supabase |
| AI | OpenAI GPT-4 |
| IAP | RevenueCat |
| Styling | NativeWind (mobile), Tailwind (web) |

## 📚 Documentation

- [Game Design Document](./docs/GDD.md) - Full mechanics, story, monetization
- [Architecture](./docs/ARCHITECTURE.md) - System design & data flow
- [IAP Guide](./docs/IAP.md) - RevenueCat implementation

## 🎓 Next Steps to Launch

1. **Week 1**: Configure Supabase & RevenueCat, test IAP
2. **Week 2**: Add art assets, polish UI
3. **Week 3**: Beta testing with friends
4. **Week 4**: Submit to App Store & Play Store

## 🆘 Support

This is a complete foundation. For specific implementations:
- See individual package READMEs
- Check the GDD for game mechanics
- Review ARCHITECTURE.md for technical decisions

---

**Hall Pass** — Where high school is what you make it. 🎮✨
