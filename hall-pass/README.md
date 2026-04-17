# Hall Pass — High School Life Simulator

A cross-platform life simulation game built with Expo and Next.js.

## 🎮 Concept
Navigate high school as your chosen archetype. Build relationships, customize your room, play mini-games, and make choices that shape your story.

## 📁 Monorepo Structure

```
hall-pass/
├── apps/
│   ├── mobile/          # Expo React Native (iOS/Android)
│   └── web/             # Next.js web app
├── packages/
│   ├── game-engine/     # Core simulation logic
│   ├── ai-npcs/         # AI personality system
│   ├── shared-ui/       # Design system components
│   └── iap-core/        # RevenueCat integration
└── docs/                # Game design documents
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run mobile app
npm run dev:mobile

# Run web app
npm run dev:web
```

## 📄 Documentation

- [Game Design Document](./docs/GDD.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [IAP Implementation](./docs/IAP.md)
