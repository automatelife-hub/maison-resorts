# Codebase Concerns

**Analysis Date:** 2026-04-19

## Tech Debt

**Duplicate Configuration Files:**
- Issue: Both `.js` and `.ts` versions of `next.config` and `tailwind.config` exist in the root.
- Files: `next.config.js`, `next.config.ts`, `tailwind.config.js`, `tailwind.config.ts`.
- Why: Likely a partial migration from JS to TS or conflicting boilerplates.
- Impact: Confusing for developers; changes in one might not reflect in the application if the other is being used by the build tool.
- Fix approach: Consolidate into the preferred TypeScript versions and remove the `.js` files.

**Hardcoded API Versioning Logic:**
- Issue: `src/lib/api.ts` contains many mapping functions to transform LiteAPI v3.0 responses to internal types.
- Files: `src/lib/api.ts`.
- Why: LiteAPI v3.0 transition from an older version.
- Impact: Brittle if the API schema changes; logic is scattered across many small mapping blocks.
- Fix approach: Create dedicated mapper utilities or use a schema validation library (e.g., Zod) to handle transformations centrally.

## Known Bugs

**No Major Functional Bugs Detected:**
- Symptoms: The core search and display logic appears functional in code.
- Note: Without automated tests or a running environment, runtime bugs are difficult to detect.

## Security Considerations

**Secrets in Version Control:**
- Risk: A production-looking LiteAPI key is present in the `.env` file.
- Files: `.env`.
- Current mitigation: None (it's in a tracked file).
- Recommendations: Move all secrets to `.env.local` (which is gitignored) and remove them from `.env`. Use environment variables in the deployment platform (Firebase/Supabase).

**Client-Side Data Exposure:**
- Risk: Sensitive booking or user data might be fetched directly in client components.
- Current mitigation: Basic try-catch handling.
- Recommendations: Ensure all sensitive data fetching happens in Server Components or protected Route Handlers with proper authentication checks.

## Performance Bottlenecks

**Cinematic Background Rendering:**
- Problem: High CPU/GPU usage for Remotion-powered video backgrounds.
- Files: `src/components/LuxuryHero.tsx`, `src/remotion/CinematicBackground.tsx`.
- Cause: Real-time React-based video rendering can be intensive.
- Improvement path: Consider pre-rendering the background as a static video file or using CSS-only animations for lower-end devices.

## Fragile Areas

**LiteAPI Integration:**
- Why fragile: The entire application depends on the LiteAPI response structure. Any upstream change will break the UI.
- Common failures: Missing fields in API response leading to "undefined" errors in components.
- Safe modification: Add robust null-checking and default values in the `api.ts` mapping functions.
- Test coverage: Zero automated tests.

## Scaling Limits

**LiteAPI Rate Limits:**
- Current capacity: Dependent on the LiteAPI plan (currently using a production-tier key).
- Limit: API rate limits could be hit during high traffic.
- Symptoms at limit: 429 Too Many Requests errors.
- Scaling path: Implement server-side caching (e.g., Redis) for common search results and hotel details.

## Dependencies at Risk

**Next.js 16.0.0 & React 19.0.0:**
- Risk: Using cutting-edge/future versions might have undocumented bugs or breaking changes in the ecosystem.
- Impact: Difficulty finding community support or compatible third-party libraries.
- Migration plan: Monitor official release notes and maintain a conservative update policy for other dependencies.

## Missing Critical Features

**Automated Testing Suite:**
- Problem: No unit, integration, or E2E tests.
- Current workaround: Manual verification only.
- Blocks: Rapid deployment and refactoring confidence.
- Implementation complexity: Medium (requires setting up Vitest/Playwright and writing initial suites).

**Complete Stripe Flow:**
- Problem: Stripe is in `package.json` but no direct implementation found in `src/lib/api.ts` (it uses LiteAPI's payment intent instead).
- Current workaround: Relying on LiteAPI's direct payment handling (if functional).
- Implementation complexity: High (requires syncing LiteAPI bookings with Stripe payments).

## Test Coverage Gaps

**Entire Codebase:**
- What's not tested: Everything.
- Risk: Regressions are guaranteed during refactoring or version upgrades.
- Priority: High.
- Difficulty to test: Requires initial infrastructure setup.

---

*Concerns audit: 2026-04-19*
*Update as issues are fixed or new ones discovered*
