# Maison Resorts — Claude Code Context

## What this project is
A premium luxury hotel booking platform built with Next.js 16, React 19, TypeScript, and Firebase. It integrates the LiteAPI SDK for real hotel inventory and bookings, Stripe for payments, MapLibre GL for interactive map views, and Remotion for video/animated content. Features include AI sentiment analysis on reviews, semantic vibe search, loyalty program, booking management, and currency/nationality preferences.

## Project type
Language: TypeScript  Framework: Next.js 16 (App Router)  Package manager: npm

## Key directories / files
- `src/` — Next.js App Router source (pages, components, API routes)
- `dist/` / `dist-test/` — Build output
- `docs/` — Project documentation
- `next.config.ts` — Next.js configuration
- `firebase.json` / `.firebaserc` — Firebase hosting config (project: likely maison-resorts)
- `firestore.rules` — Firestore security rules
- `PROJECT_SUMMARY.md` — High-level project summary
- `maisonresortsredesign.html` — Static redesign mockup/reference
- `scratch-test-*.js` — One-off API test scripts (hotel search, bookings, flights) — not production code
- `diagnose-liteapi.mjs` — LiteAPI SDK diagnostic script
- `.env` — Real API keys (LiteAPI, Stripe, Firebase, Gemini) — never commit

## Skills to invoke
- superpowers:brainstorming — before planning any change
- superpowers:writing-plans — for multi-step work
- superpowers:subagent-driven-development — for executing plans
- superpowers:systematic-debugging — when hitting bugs
- superpowers:test-driven-development — when adding features
- page-cro — for hotel search results and booking conversion optimization
- deep-research — for luxury travel market research and competitor analysis

## Agents to use
- Frontend Developer — Next.js App Router, React 19, Tailwind, MapLibre GL
- Backend Architect — Next.js API routes, LiteAPI integration, Stripe webhooks
- Database Optimizer — Firestore schema for bookings, loyalty, user profiles
- AI Engineer — Gemini sentiment analysis, semantic vibe search implementation
- Hospitality Guest Services — Domain knowledge for booking UX and hotel features

## Critical notes
- `.env` at root contains LiteAPI, Stripe, and Firebase keys — never commit
- `next.config.js.bak` exists alongside `next.config.ts` — the `.bak` is stale, ignore it
- LiteAPI SDK (`liteapi-node-sdk`) is the hotel inventory source — test with `diagnose-liteapi.mjs` before debugging booking issues
- `scratch-test-*.js` files at root are debugging artifacts — safe to ignore but do not delete without checking if still needed
- Deployed to Firebase Hosting: `firebase deploy --only hosting`
- Node.js 20 required (specified in `package.json` `engines` field)
- `@modelcontextprotocol/sdk` is a dependency — MCP integration exists somewhere in the codebase
- Remotion player integrated for video content — check Remotion docs before touching video components
