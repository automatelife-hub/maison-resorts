# Architecture

**Analysis Date:** 2026-04-19

## Pattern Overview

**Overall:** Full-stack Web Application (Next.js App Router)

**Key Characteristics:**
- **Server-Side Rendering (SSR) & Client-Side Rendering (CSR):** Leverages Next.js 16 for optimal performance.
- **API-First Integration:** Centralized communication with LiteAPI for real-time travel data.
- **Component-Driven UI:** Highly modular React components with a focus on premium aesthetics.
- **State Management:** React Context API for global preferences and local state for component-specific logic.

## Layers

**UI Layer (Client):**
- Purpose: Render the user interface and handle user interactions.
- Contains: React components (Client & Server components), Framer Motion animations.
- Location: `src/components/*.tsx`, `src/app/**/*.tsx`
- Depends on: Context layer, API layer (via Route Handlers or direct fetch).
- Used by: End users.

**API Layer (Server/Route Handlers):**
- Purpose: Proxy requests to external services (LiteAPI, Supabase) and handle server-side logic.
- Contains: Next.js Route Handlers (GET/POST/PUT/DELETE).
- Location: `src/app/api/**/*.ts`
- Depends on: Service Layer (`src/lib/api.ts`).
- Used by: UI Layer.

**Service Layer:**
- Purpose: Centralized business logic and external service abstraction.
- Contains: `api.ts` for LiteAPI communication, Supabase client initialization.
- Location: `src/lib/*.ts`
- Depends on: External APIs (LiteAPI, Supabase).
- Used by: API Layer, Server Components.

**Context Layer:**
- Purpose: Global state management for user preferences (currency, language, etc.).
- Contains: `PreferencesContext.tsx`.
- Location: `src/context/*.tsx`
- Depends on: `localStorage` for persistence.
- Used by: UI Layer.

## Data Flow

**Hotel Search Flow:**

1. User enters destination and dates in `LuxuryHero.tsx`.
2. Form submission triggers navigation to `/results` with query parameters.
3. `results/page.tsx` (Server Component) or a client-side fetch calls `searchHotels` in `src/lib/api.ts`.
4. LiteAPI returns raw hotel and rate data.
5. Data is mapped to frontend types (`src/types/index.ts`) and rendered using `HotelCard` components.

**State Management:**
- **Global:** User preferences (currency, nationality) stored in `PreferencesContext` and persisted to `localStorage`.
- **Server:** Data fetched per request/page in Next.js Server Components or Route Handlers.
- **Local:** Component-level state (e.g., search form inputs, modal visibility) managed with `useState`.

## Key Abstractions

**LiteAPI Client:**
- Purpose: Centralized, typed wrapper around LiteAPI v3.0 endpoints.
- Examples: `src/lib/api.ts` functions like `searchHotels`, `getHotelDetails`.
- Pattern: Service Module.

**UI Component Library:**
- Purpose: Reusable, styled primitives for consistent premium branding.
- Examples: `Badge.tsx`, `PriceDisplay.tsx`, `StarRating.tsx`.
- Pattern: Atomic Design / Component-based UI.

**Route Handlers:**
- Purpose: Backend logic isolation and API proxying.
- Examples: `src/app/api/hotels/route.ts`, `src/app/api/reviews/route.ts`.
- Pattern: RESTful API Handlers.

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Any page load.
- Responsibilities: Initialize `PreferencesProvider`, render global Navigation and Footer.

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: Landing on the root URL (`/`).
- Responsibilities: Render `LuxuryHero`, `Recommendations`, and featured content.

## Error Handling

**Strategy:** Try-catch blocks in Service Layer and Route Handlers, with UI-level error states.

**Patterns:**
- Services throw Errors with descriptive messages.
- Route Handlers return 500/400 status codes with error JSON.
- UI uses `EmptyState.tsx` or error boundaries (planned) to show feedback to users.

## Cross-Cutting Concerns

**Styling:**
- Tailwind CSS for utility-first styling.
- Luxury theme colors defined in `tailwind.config.js`.

**Animation:**
- Framer Motion for sophisticated transitions and interactive elements.
- Remotion for cinematic background video rendering.

**Authentication:**
- Supabase Auth for user sign-in and session management.

---

*Architecture analysis: 2026-04-19*
*Update when major patterns change*
