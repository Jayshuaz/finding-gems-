# 💎 Gems Signals

**AI-powered location intelligence platform.** Discover opportunities around you — hidden gems, trending spots, events, and more.

> Built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and the Gems Signals architecture spec.

## ✨ Features

- 🗺️ **Interactive Map** — Browse places near you with category filtering and radius control
- 🤖 **AI Concierge** — Natural language search: "Find rooftop restaurants under KSh 2,000"
- 📡 **Signal Feed** — Real-time local opportunities (new places, price drops, promotions, trending)
- 📅 **Events Discovery** — Upcoming events aggregated from multiple sources
- 💎 **Hidden Gems** — AI discovers underrated places with high ratings but low visitor counts
- 📊 **AI Scoring** — Every place scored 1-10 on safety, affordability, popularity, and more
- 🎨 **Beautiful UI** — Dark mode ready, responsive, WCAG accessible, with fluid animations
- ⚡ **Production Ready** — API routes, cursor pagination, error/loading/empty states, tests

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS + Radix UI |
| **State** | Zustand + React Query |
| **Animation** | Framer Motion |
| **Database** | PostgreSQL + Prisma |
| **Auth** | NextAuth.js |
| **Testing** | Vitest |
| **Deployment** | Vercel |

## 📁 Project Structure

```
gems-signals/
├── prisma/                # Database schema + seed
│   ├── schema.prisma
│   └── seed.ts
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/           # API routes (places, signals, events, concierge, gems)
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── globals.css    # Global styles + CSS variables
│   │   └── providers.tsx  # React Query + Analytics providers
│   ├── components/        # React components
│   │   ├── ui/            # UI primitives (Button, Card, Badge, Input, etc.)
│   │   ├── layout/        # Sidebar, TopBar
│   │   ├── map/           # MapView
│   │   ├── places/        # PlaceCard, PlaceDetail
│   │   ├── signals/       # SignalCard
│   │   ├── events/        # EventCard
│   │   ├── concierge/     # AI Concierge panel
│   │   └── panels/        # Explore, Signals, Events, Gems panels
│   ├── hooks/             # Custom hooks (usePlaces, useSignals, useEvents, useConcierge)
│   ├── lib/               # Utilities, validators, API client, mock data
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   └── test/              # Test setup
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── vitest.config.ts
└── README.md
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/places` | GET | Search/filter places (lat, lng, radius, category, cursor) |
| `/api/places/:id` | GET | Single place detail with scores |
| `/api/signals` | GET | Signal feed (cursor-paginated) |
| `/api/events` | GET | Events list (geo-filtered, date-range) |
| `/api/concierge` | POST | AI Concierge natural language query |
| `/api/gems` | GET | Hidden Gems feed |
| `/api/health` | GET | Health check |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📐 Architecture Principles

1. **API-first** — Every feature exposed via REST; thin client shells over shared API
2. **Geospatial-native** — All queries accept lat/lng/radius; distance is always returned
3. **8-category taxonomy** — Property, Food, Entertainment, Lifestyle, Shopping, Essentials, Education, Outdoor
4. **Multi-source ready** — Adapter pattern ready for multiple data providers
5. **AI-augmented** — Core features work without AI; AI enhances discovery
6. **Every place scored** — Safety, affordability, and popularity scores always shown
7. **Signals expire** — Every signal has an expiry; stale data erodes trust

## 🛠️ Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_MAPBOX_TOKEN=pk...
```

## 📄 License

MIT © Gems Signals 2024