# Coding Conventions

**Analysis Date:** 2026-04-19

## Naming Patterns

**Files:**
- PascalCase.tsx for React components (e.g., `LuxuryHero.tsx`, `StarRating.tsx`).
- camelCase.ts for libraries and utilities (e.g., `api.ts`, `utils.ts`).
- Route Handlers follow Next.js App Router conventions: `route.ts`.
- Types are centralized in `src/types/index.ts`.

**Functions:**
- camelCase for all functions.
- `async/await` used for all asynchronous operations (no `.then()` chains).
- API functions in `lib/api.ts` are named by action: `searchHotels`, `getReviews`.

**Variables:**
- camelCase for variables.
- UPPER_SNAKE_CASE for environment variables (e.g., `LITEAPI_KEY`).
- No underscore prefix for private members.

**Types:**
- PascalCase for interfaces and type aliases (e.g., `HotelData`, `Rate`).
- No `I` prefix for interfaces.

## Code Style

**Formatting:**
- Prettier is expected (standard for Next.js projects), though no `.prettierrc` is in the root.
- Single quotes used for strings in some files, double quotes in others (slight inconsistency).
- 2-space indentation.

**Linting:**
- Next.js default ESLint configuration.
- `package.json` includes `next lint`.

## Import Organization

**Order:**
1. React and Next.js core imports (`'use client'`, `useEffect`, `Link`).
2. Third-party libraries (`framer-motion`, `lucide-react`, `remotion`).
3. Internal modules using `@/` path alias (`@/lib/api`, `@/components/Badge`).
4. Type imports (`import type { ... } from '@/types'`).

**Path Aliases:**
- `@/` maps to `src/`.

## Error Handling

**Patterns:**
- Try-catch blocks used at the Route Handler level (`src/app/api/.../route.ts`).
- `Response.json({ error: ... }, { status: ... })` returned for API errors.
- Service layer (`src/lib/api.ts`) throws Errors with descriptive messages.

**Error Types:**
- Basic `Error` objects with message strings.
- 400 Bad Request for validation errors.
- 500 Internal Server Error for unexpected failures.

## Logging

**Framework:**
- `console.log` and `console.error` are used for server-side and client-side logging.
- No structured logger (like Pino or Winston) implemented.

## Comments

**When to Comment:**
- Section headers in large files (e.g., `// Hotel Search & Details` in `api.ts`).
- Documentation comments for complex logic (Remotion interpolation).
- TODOs are present in `PROJECT_SUMMARY.md` but few in actual code.

## Function Design

**Size:**
- Components are kept focused and modular.
- API functions are atomic and handle one LiteAPI endpoint each.

**Parameters:**
- Destructured objects preferred for complex parameter sets (e.g., `searchFlights(params: { ... })`).

## Module Design

**Exports:**
- Named exports preferred for utilities and libraries (`export function searchHotels...`).
- Default exports for page components and Next.js layouts.

---

*Convention analysis: 2026-04-19*
*Update when patterns change*
