# 💎 Gems Signals — Project Documentation & Pending Fixes

## 📋 Project Overview

**Gems Signals** is an **AI-powered location intelligence platform** that helps users discover hidden gems, trending spots, events, and opportunities around them in Nairobi, Kenya.

| Attribute | Details |
|-----------|---------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS + Radix UI |
| **State** | Zustand + React Query |
| **Animation** | Framer Motion |
| **Database** | PostgreSQL + Prisma |
| **Auth** | NextAuth.js |
| **Testing** | Vitest |
| **Deployment** | Vercel |

## 📁 File Structure

```
gems-signals/
├── prisma/
│   ├── schema.prisma          # Database schema (Place, Signal, Event, User, etc.)
│   └── seed.ts                # Seed script for development data
├── public/
│   └── icon.svg               # Favicon / icon
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles + CSS variables + dark mode
│   │   ├── layout.tsx         # Root layout (fonts, metadata, viewport)
│   │   ├── page.tsx           # Home page (sidebar + map + panels + concierge)
│   │   ├── providers.tsx      # React Query + Toaster + Analytics providers
│   │   └── api/
│   │       ├── concierge/route.ts   # POST — AI Concierge NLP query
│   │       ├── events/route.ts      # GET — Events list (returns mock data)
│   │       ├── gems/route.ts        # GET — Hidden Gems feed (returns mock data)
│   │       ├── health/route.ts      # GET — Health check
│   │       ├── places/route.ts      # GET — Places search/filter (mock data)
│   │       └── signals/route.ts     # GET — Signal feed (mock data)
│   ├── components/
│   │   ├── concierge/
│   │   │   └── concierge-panel.tsx  # AI Concierge chat panel overlay
│   │   ├── events/
│   │   │   └── event-card.tsx       # Event card with image, date, venue
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # Main sidebar (search, filters, nav)
│   │   │   └── top-bar.tsx          # Top bar (menu, location, notifications)
│   │   ├── map/
│   │   │   └── map-view.tsx         # Interactive mock map with place pins
│   │   ├── panels/
│   │   │   ├── explore-panel.tsx    # Explore tab — place list
│   │   │   ├── events-panel.tsx     # Events tab — event list
│   │   │   ├── gems-panel.tsx       # Hidden Gems tab — gem places
│   │   │   └── signals-panel.tsx    # Signals tab — real-time feed
│   │   ├── places/
│   │   │   ├── place-card.tsx       # Place card (default + compact variants)
│   │   │   └── place-detail.tsx     # Bottom sheet place detail (overview/scores/hours)
│   │   ├── signals/
│   │   │   └── signal-card.tsx      # Signal card with type icon, relevance bar
│   │   └── ui/
│   │       ├── badge.tsx            # Badge component (gem, signal, warning variants)
│   │       ├── button.tsx           # Button component (default, gem, signal variants)
│   │       ├── card.tsx             # Card, CardHeader, CardContent, CardFooter
│   │       ├── empty-state.tsx      # Empty state placeholder
│   │       ├── error-state.tsx      # Error state with retry button
│   │       ├── input.tsx            # Input with icon support
│   │       ├── skeleton.tsx         # Skeleton loaders (PlaceCard, Signal, Event)
│   │       └── tabs.tsx             # Tabs (TabsList, TabsTrigger, TabsContent)
│   ├── hooks/
│   │   ├── use-concierge.ts         # Concierge hook — NLP extraction + place filtering
│   │   ├── use-events.ts            # Events hook — fetches from mock data
│   │   ├── use-places.ts            # Places hook — fetches + filters mock data
│   │   └── use-signals.ts           # Signals hook — fetches mock signals
│   ├── lib/
│   │   ├── api-client.ts            # API client class (GET, POST, PUT, DELETE)
│   │   ├── mock-data.ts             # 10 mock places, 6 signals, 4 events
│   │   ├── utils.test.ts            # Vitest tests for utils
│   │   ├── utils.ts                 # Utility functions (formatting, math, etc.)
│   │   └── validators.ts            # Zod schemas for API validation
│   ├── store/
│   │   └── index.ts                 # Zustand stores (map, places, signals, events, search, concierge, ui)
│   ├── test/
│   │   └── setup.ts                 # Vitest test setup
│   └── types/
│       └── index.ts                 # TypeScript types (Place, Signal, Event, etc.)
├── scripts/
│   ├── deploy.ps1                   # PowerShell deployment script
│   └── deploy.sh                    # Bash deployment script
├── .env.example                     # Environment variables template
├── .eslintrc.json                   # ESLint config
├── .gitignore                       # Git ignore rules
├── .prettierrc                      # Prettier config
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS config
├── tailwind.config.ts               # Tailwind CSS theme configuration
├── tsconfig.json                    # TypeScript configuration
├── vercel.json                      # Vercel deployment config
├── vitest.config.ts                 # Vitest configuration
├── README.md                        # Project README
├── SETUP.md                         # Setup instructions
└── TODO.md                          # THIS FILE — pending fixes
```

## ✅ Working Features

| Feature | Status | Notes |
|---------|--------|-------|
| Interactive mock map with place pins | ✅ | Custom canvas-based map with drag, zoom, geo-location |
| Sidebar with search, category filters, radius | ✅ | Fully functional with Zustand state |
| Explore panel with place cards | ✅ | Compact card list with distance, scores, amenities |
| Signals feed panel | ✅ | Signal cards with type badges, relevance scores, time ago |
| Events panel | ✅ | Event cards with image, date, price, ticket links |
| Hidden Gems panel | ✅ | AI-discovered underrated places with explanation |
| AI Concierge chat panel | ✅ | Modal with NLP query, suggested queries, place results |
| Place detail bottom sheet | ✅ | Overview, scores, hours tabs with save/share |
| Dark mode CSS variables | ✅ | CSS variables defined, dark class supported |
| Responsive layout | ✅ | md breakpoints for sidebar/map/panels |
| Skeleton loading states | ✅ | PlaceCard, Signal, Event skeletons |
| Empty and error states | ✅ | EmptyState + ErrorState with retry |
| Font optimization | ✅ | Inter + Outfit with next/font |
| SEO metadata | ✅ | OpenGraph, Twitter card, viewport |
| Security headers | ✅ | Vercel.json with XSS, CSP, etc. |
| Vitest test suite | ✅ | 12 unit tests for utils |

## 🚨 Pending Fixes & Improvements

| # | Priority | Category | Issue | Description | Location |
|---|----------|----------|-------|-------------|----------|
| 1 | 🔴 **High** | **API** | **Missing dynamic place route** | `/api/places/[id]` route for single place detail doesn't exist | `src/app/api/places/` |
| 2 | 🔴 **High** | **Architecture** | **Hooks use mock data directly** | `usePlaces`, `useSignals`, `useEvents` bypass API routes and import mock data directly. Should use `apiClient` instead | `src/hooks/use-places.ts`, `use-signals.ts`, `use-events.ts` |
| 3 | 🔴 **High** | **Auth** | **Missing NextAuth route handler** | No `/api/auth/[...nextauth]/route.ts` file — NextAuth.js in deps but not wired up | `src/app/api/auth/` |
| 4 | 🔴 **High** | **Auth** | **No authentication UI** | No login/signup pages despite NextAuth dependency. Guest mode shows "10 searches left" with no login flow | Entire app |
| 5 | 🟠 **Medium** | **API** | **API routes return mock data** | All 6 API endpoints return mock data instead of querying Prisma/PostgreSQL | All `src/app/api/*/route.ts` |
| 6 | 🟠 **Medium** | **Database** | **No Prisma migrations** | Schema uses `db push` instead of formal migrations for version control | `prisma/schema.prisma` |
| 7 | 🟠 **Medium** | **Database** | **No database connection configured** | `.env.local` with `DATABASE_URL` not set up, no Neon/Railway/Supabase connection | Setup pending |
| 8 | 🟠 **Medium** | **Map** | **Map uses mock canvas, not Mapbox** | `MapView` renders a simulated grid with dots instead of actual Mapbox GL map. Mapbox token env var exists but unused | `src/components/map/map-view.tsx` |
| 9 | 🟠 **Medium** | **AI** | **Concierge uses regex, not OpenAI** | NLP extraction is a simple keyword match, not GPT-4o as UI claims | `src/hooks/use-concierge.ts` |
| 10 | 🟠 **Medium** | **UI** | **Dark mode toggle unwired** | `useUIStore` has `darkMode`/`toggleDarkMode` but no UI toggle button anywhere | `src/store/index.ts`, `src/components/layout/top-bar.tsx` |
| 11 | 🟠 **Medium** | **Notifications** | **No notification system** | Bell icon in TopBar with badge but no notification panel or logic | `src/components/layout/top-bar.tsx` |
| 12 | 🟠 **Medium** | **Routing** | **No individual place pages** | Only bottom-sheet overlay — no `/places/[id]` page for deep linking/SEO | `src/app/` |
| 13 | 🟠 **Medium** | **Auth** | **Search quota is hardcoded** | "10 searches remaining" is static text, not tied to any backend quota system | `src/components/concierge/concierge-panel.tsx`, `prisma/schema.prisma` |
| 14 | 🟡 **Low** | **Testing** | **No API route tests** | Only `utils.test.ts` exists — no tests for API routes, hooks, or components | `src/test/` |
| 15 | 🟡 **Low** | **Testing** | **No integration tests** | No test for full data flow (mock data → hooks → components) | `src/test/` |
| 16 | 🟡 **Low** | **Accessibility** | **ARIA labels missing** | Some interactive elements lack `aria-label` or `role` attributes | Various components |
| 17 | 🟡 **Low** | **Error Handling** | **No React Error Boundaries** | No error boundary wrapper for catching component crashes | `src/app/layout.tsx` |
| 18 | 🟡 **Low** | **Accessibility** | **Reduced motion support** | CSS prefers-reduced-motion exists but framer-motion animations not respecting it | `src/app/globals.css` / Framer Motion components |
| 19 | 🟡 **Low** | **Performance** | **Images lack sizes/loading attributes** | Some images missing `loading="lazy"` or `sizes` attributes | Various cards |
| 20 | 🟡 **Low** | **Code Quality** | **Unused imports** | Several components import unused variables (e.g., `Loader2` in map-view, `motion` in panels) | Various components |
| 21 | 🟡 **Low** | **API** | **CORS not configured** | No CORS headers for potential third-party usage of API | `src/app/api/*/route.ts` |
| 22 | 🟡 **Low** | **UI** | **No onboarding/welcome flow** | First-time users see empty state with no guided onboarding | `src/app/page.tsx` |
| 23 | 🟡 **Low** | **Infrastructure** | **Docker/compose missing** | No docker-compose for local PostgreSQL + app development | Root |

## 🔌 API Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/api/places` | ✅ Implemented (mock) | Search/filter places with pagination |
| GET | `/api/places/[id]` | ❌ **Missing** | Single place detail with scores |
| GET | `/api/signals` | ✅ Implemented (mock) | Signal feed, cursor-paginated |
| GET | `/api/events` | ✅ Implemented (mock) | Events list, geo-filtered |
| POST | `/api/concierge` | ✅ Implemented (mock) | AI Concierge NLP query |
| GET | `/api/gems` | ✅ Implemented (mock) | Hidden Gems feed |
| GET | `/api/health` | ✅ Implemented | Health check |
| GET/POST | `/api/auth/[...nextauth]` | ❌ **Missing** | NextAuth authentication |

## 🏗️ Architecture Notes

### Current Mock Architecture
```
Components ↕ Hooks ↕ Mock Data (in-memory)
         ↕ API Routes (return mock data)
         ↕ Zustand Stores (UI state only)
```

### Target Production Architecture
```
Components ↕ Hooks ↕ API Client ↕ API Routes ↕ Prisma ↕ PostgreSQL
         ↕ Zustand Stores (UI state + caching)
         ↕ NextAuth (authentication)
         ↕ OpenAI API (AI Concierge)
         ↕ Mapbox GL (maps)
```

## 📦 Dependencies Overview

**Production:**
- `next`, `react`, `react-dom` — Framework
- `@prisma/client` — Database ORM
- `@tanstack/react-query` — Server state
- `zustand` — Client state
- `framer-motion` — Animations
- `@radix-ui/*` — UI primitives (dialog, dropdown, scroll-area, select, slider, tabs, tooltip)
- `lucide-react` — Icons
- `next-themes` — Theme management
- `zod` — Validation
- `sonner` — Toast notifications
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate` — Styling utilities
- `date-fns` — Date formatting
- `@vercel/analytics`, `@vercel/speed-insights` — Observability
- `next-auth` — Authentication (unwired)

**Dev:**
- `typescript`, `eslint`, `prettier` — Code quality
- `vitest`, `jsdom`, `@vitejs/plugin-react` — Testing
- `prisma`, `tsx` — Database tooling
- `tailwindcss`, `autoprefixer`, `postcss` — Styling
- `@types/*` — Type definitions

---

*Last updated: March 2025*
*Generated by: Gems Signals documentation bot*

