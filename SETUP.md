# 💎 Gems Signals — Setup Guide

## Prerequisites
- **Node.js** ≥ 18
- **Git** (for pushing to GitHub)
- **Vercel CLI** (`npm i -g vercel`) — for deployment
- **PostgreSQL** database (Vercel Postgres, Neon, Railway, or Supabase)

## Quick Start (3 Steps)

### 1. Install dependencies
```powershell
cd C:\Users\user\Desktop\gems-signals
npm install
```

### 2. Configure environment
```powershell
copy .env.example .env.local
```
Edit `.env.local` with your credentials:
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_MAPBOX_TOKEN=pk...
```

### 3. Run locally
```powershell
npm run dev
```
Open http://localhost:3000

## Push to GitHub

```powershell
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Gems Signals - AI location intelligence platform"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/gems-signals.git

# Push
git branch -M main
git push -u origin main
```

## Deploy to Vercel

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project directory)
vercel --prod
```

## Database Setup (PostgreSQL)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

## Verify Everything Works

After deployment, visit:
- **Home** — Interactive map with place pins
- **/api/health** — Health check endpoint
- **/api/places?lat=-1.2921&lng=36.8219&radiusM=5000** — Place search API
- **/api/events** — Events endpoint
- **/api/signals** — Signals feed
- **/api/gems** — Hidden gems

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret key |
| `OPENAI_API_KEY` | Optional | For AI Concierge NLP features |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Optional | For production Mapbox maps |

## Project Statistics
- **60 files** created
- **6 API routes** (places, signals, events, concierge, gems, health)
- **8 UI components** (button, card, badge, input, tabs, skeleton, empty-state, error-state)
- **8 feature components** (place-card, place-detail, signal-card, event-card, map-view, sidebar, top-bar, concierge-panel)
- **4 panel pages** (explore, signals, events, gems)
- **4 custom hooks** (usePlaces, useSignals, useEvents, useConcierge)
- **7 Zustand stores** (map, places, signals, events, search, concierge, ui)
- **10 mock places, 6 signals, 4 events** for development