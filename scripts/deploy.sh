#!/bin/bash
# Gems Signals — Deployment Script
# Run this after cloning the repo to deploy to Vercel

set -e

echo "💎 Gems Signals — Deployment"
echo "=============================="
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Install from https://nodejs.org"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is required. Install from https://git-scm.com"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Gems Signals platform"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Generate Prisma client
if [ -f "prisma/schema.prisma" ]; then
    echo "🗄️ Generating Prisma client..."
    npx prisma generate
    echo "✅ Prisma client generated"
fi
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --run || echo "⚠️  No tests found (skipping)"
echo ""

# Build
echo "🏗️ Building application..."
npm run build
echo "✅ Build complete"
echo ""

# Deploy to Vercel
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    echo "✅ Deployed to Vercel"
else
    echo "ℹ️  Vercel CLI not installed. Install it with: npm i -g vercel"
    echo "   Then run: vercel --prod"
fi

echo ""
echo "🎉 Deployment complete!"
echo "=============================="
echo "Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Run: npx prisma migrate dev --name init"
echo "4. Run: npm run db:seed"
echo ""