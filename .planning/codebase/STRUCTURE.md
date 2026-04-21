# Codebase Structure

**Analysis Date:** 2026-04-19

## Directory Layout

```
maison-resorts/
├── src/
│   ├── app/              # Next.js App Router (pages and API routes)
│   │   ├── account/      # User account and favorites
│   │   ├── api/          # Route handlers (hotels, flights, reviews, etc.)
│   │   ├── explore/      # Destination discovery
│   │   ├── hotel/        # Hotel detail pages
│   │   ├── results/      # Search results
│   │   └── ...           # Global layout and styles
│   ├── components/       # Shared UI components (LuxuryHero, Badge, etc.)
│   ├── context/          # React contexts (PreferencesContext)
│   ├── data/             # Static data or mocks
│   ├── lib/              # Core utilities and API clients (api.ts)
│   ├── remotion/         # Cinematic background rendering logic
│   └── types/            # Centralized TypeScript definitions
├── public/               # Static assets (images, icons)
├── .firebase/            # Firebase local state and cache
├── firebase.json         # Firebase deployment configuration
├── next.config.ts        # Next.js framework configuration
├── package.json          # Project metadata and dependencies
├── tailwind.config.js    # Tailwind CSS luxury theme config
└── tsconfig.json         # TypeScript compiler configuration
```

## Directory Purposes

**src/app/**
- Purpose: Root of the application, containing pages and backend route handlers.
- Contains: Layouts, Pages, and API routes.
- Key files: `layout.tsx` (root), `page.tsx` (home), `globals.css` (styles).
- Subdirectories: `api/` (backend), `hotel/` (hotel details), `results/` (search).

**src/components/**
- Purpose: Reusable UI elements and complex page sections.
- Contains: `LuxuryHero.tsx`, `StarRating.tsx`, `Modal.tsx`, etc.
- Key files: `LuxuryHero.tsx` - high-impact landing component.
- Subdirectories: None (flat or categorized).

**src/lib/**
- Purpose: Core logic and external service integrations.
- Contains: `api.ts` (LiteAPI client), `utils.ts` (helpers).
- Key files: `api.ts` - primary interface for travel data.
- Subdirectories: None.

**src/remotion/**
- Purpose: Video background logic using the Remotion framework.
- Contains: `CinematicBackground.tsx`.
- Key files: `CinematicBackground.tsx`.

**src/types/**
- Purpose: Shared TypeScript interfaces for the entire project.
- Contains: `index.ts`.
- Key files: `index.ts` - all domain types (Hotel, Rate, etc.).

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Home page.
- `src/app/layout.tsx`: Root layout and provider initialization.

**Configuration:**
- `next.config.ts` / `next.config.js`: Next.js config.
- `tailwind.config.js`: Luxury theme and Tailwind paths.
- `tsconfig.json`: TypeScript configuration.
- `.env`: Environment variables (LiteAPI, Supabase).

**Core Logic:**
- `src/lib/api.ts`: Centralized LiteAPI and travel logic.
- `src/context/PreferencesContext.tsx`: Global user settings.

**Deployment:**
- `firebase.json`: Hosting and function configuration for Firebase.
- `.firebaserc`: Firebase project aliases.

## Naming Conventions

**Files:**
- PascalCase.tsx: React components (e.g., `LuxuryHero.tsx`).
- camelCase.ts: Utilities, APIs, and hooks (e.g., `api.ts`).
- kebab-case: Directories and occasionally configuration files.

**Directories:**
- kebab-case: `maison-resorts`, `featured-hotels`, etc.
- Plural names for collections: `components`, `types`, `lib`.

## Where to Add New Code

**New Page:**
- Implementation: `src/app/[page-name]/page.tsx`.
- Components used: `src/components/`.

**New API Endpoint:**
- Handler: `src/app/api/[resource]/route.ts`.
- Service method: `src/lib/api.ts`.

**New Shared Component:**
- Implementation: `src/components/`.
- Types if new: `src/types/index.ts`.

**New Utility:**
- Shared helper: `src/lib/utils.ts` or a new file in `src/lib/`.

## Special Directories

**.firebase/**
- Purpose: Firebase CLI local cache and metadata.
- Committed: No (in `.gitignore`).

**.next/**
- Purpose: Next.js build output and cache.
- Committed: No (in `.gitignore`).

---

*Structure analysis: 2026-04-19*
*Update when directory structure changes*
