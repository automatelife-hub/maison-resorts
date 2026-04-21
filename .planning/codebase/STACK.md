# Technology Stack

**Analysis Date:** 2026-04-19

## Languages

**Primary:**
- TypeScript 5.x - All application code and type definitions
- TSX - React components with Type safety

**Secondary:**
- JavaScript - Configuration files (`next.config.js`, `tailwind.config.js`, etc.)
- CSS - Tailwind CSS with global styles in `src/app/globals.css`

## Runtime

**Environment:**
- Node.js 20.x - Primary runtime environment
- Browser - Modern browser APIs (Web Share API, localStorage)

**Package Manager:**
- npm - Version 10.x+
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.0.0 (App Router) - Full-stack framework
- React 19.0.0 - UI library

**UI & Animation:**
- Tailwind CSS 3.4.x - Styling framework
- Framer Motion 12.38.x - Animation library
- Lucide React 1.8.x - Icon library
- Remotion 4.0.448 - Video/Cinematic backgrounds in React

**Testing:**
- Not explicitly configured in `package.json` (no Jest/Vitest dependencies visible)

**Build/Dev:**
- TypeScript 5.x - Compilation and type checking
- PostCSS / Autoprefixer - CSS processing

## Key Dependencies

**Critical:**
- `next` 16.0.0 - Core framework
- `@supabase/supabase-js` 2.45.x - Supabase client for Auth and DB
- `firebase` 12.11.x - Firebase client for hosting and additional services
- `@remotion/player` 4.0.448 - Video playback for cinematic UI elements
- `lucide-react` 1.8.0 - Core iconography

**Infrastructure:**
- `firebase-admin` 13.8.x - Server-side Firebase operations
- `firebase-functions` 7.2.x - Backend logic (if deployed to Firebase)
- `@stripe/stripe-js` 3.3.x - Payment processing integration

## Configuration

**Environment:**
- `.env` and `.env.local` - Environment variables (Supabase, LiteAPI keys)
- `.npmrc` - NPM configuration

**Build:**
- `next.config.ts` / `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` / `tailwind.config.js` - Tailwind CSS theme and content paths
- `postcss.config.js` - PostCSS plugins

## Platform Requirements

**Development:**
- Node.js 20.x
- Git - Version control

**Production:**
- Firebase Hosting (configured in `firebase.json`)
- Supabase - Backend-as-a-Service (Auth, Database)
- LiteAPI - Hotel and Flight data provider

---

*Stack analysis: 2026-04-19*
*Update after major dependency changes*
