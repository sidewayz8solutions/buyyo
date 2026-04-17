#!/bin/bash
# Quick setup script for Hall Pass development

set -e

echo "🎮 Setting up Hall Pass development environment..."
echo "=================================================="

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install package dependencies
echo "📦 Installing package dependencies..."
cd packages/game-engine && npm install && cd ../..
cd packages/ai-npcs && npm install && cd ../..
cd packages/shared-ui && npm install && cd ../..
cd packages/iap-core && npm install && cd ../..

# Install app dependencies
echo "📦 Installing app dependencies..."
cd apps/mobile && npm install && cd ../..
cd apps/web && npm install && cd ../..

# Build packages
echo "🔨 Building packages..."
cd packages/game-engine && npm run build && cd ../..
cd packages/ai-npcs && npm run build && cd ../..
cd packages/shared-ui && npm run build && cd ../..
cd packages/iap-core && npm run build && cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo "  cd apps/mobile && npm run ios       # Run iOS simulator"
echo "  cd apps/mobile && npm run android   # Run Android emulator"
echo "  cd apps/web && npm run dev          # Run web app"
echo ""
echo "Don't forget to:"
echo "  1. Set up Supabase (see .env.example)"
echo "  2. Set up RevenueCat for IAP"
echo "  3. Configure OpenAI API key"
echo ""
