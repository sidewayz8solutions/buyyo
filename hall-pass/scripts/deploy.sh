#!/bin/bash
# Deploy Hall Pass to production

set -e

echo "🎮 Hall Pass Deployment Script"
echo "=============================="

# Check dependencies
echo "📦 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build packages
echo "🔨 Building packages..."
cd packages/game-engine && npm run build
cd ../ai-npcs && npm run build
cd ../shared-ui && npm run build
cd ../iap-core && npm run build
cd ../..

# Build web app
echo "🌐 Building web app..."
cd apps/web
npm run build

# Deploy web (example for Vercel)
# echo "🚀 Deploying web app to Vercel..."
# vercel --prod

echo ""
echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. Deploy the web app: cd apps/web && vercel --prod"
echo "2. Build mobile apps: cd apps/mobile && eas build --platform ios"
echo "3. Configure environment variables in production"
echo ""
echo "Hall Pass is ready! 🎮"
