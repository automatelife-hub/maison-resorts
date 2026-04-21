# External Integrations

**Analysis Date:** 2026-04-19

## APIs & External Services

**Hotel & Flight Data (LiteAPI):**
- LiteAPI - Provider for 1.5M+ hotel data, real-time rates, and flight booking.
  - SDK/Client: REST API via `fetch` in `src/lib/api.ts`.
  - Auth: `X-API-Key` in `LITEAPI_KEY` env var.
  - Endpoints used: `/hotels/rates`, `/data/hotels`, `/data/reviews`, `/flights/rates`, etc.

**Payment Processing (Stripe):**
- Stripe - Payment processing for hotel and flight bookings.
  - SDK/Client: `@stripe/stripe-js` 3.3.x.
  - Auth: API keys (expected in env, though not in root `.env`).
  - Integration: `src/app/api/payments/route.ts` (if exists).

**Video Infrastructure (Remotion):**
- Remotion - React-based video rendering for cinematic UI.
  - Implementation: `CinematicBackground.tsx` and `Player` in `LuxuryHero.tsx`.

## Data Storage

**Databases & Auth (Supabase):**
- Supabase - Planned or in-use primary data store and authentication.
  - Client: `@supabase/supabase-js` 2.45.x.
  - Auth: Supabase Auth via client SDK.
  - Data: PostgreSQL storage.

**Backend & Hosting (Firebase):**
- Firebase - Hosting and backend functions.
  - Implementation: `firebase.json` for hosting, `firebase-admin` for server-side operations.
  - Hosting: Deployable via `firebase deploy`.

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Social and email/password authentication.
- Token storage: Expected to use cookies/localStorage via Supabase client.

## Monitoring & Observability

**Error Tracking:**
- No explicit Sentry/Datadog integration detected in `package.json`.

**Analytics:**
- No explicit analytics provider detected.

## CI/CD & Deployment

**Hosting:**
- Firebase Hosting - Primary deployment target for the web application.

**CI Pipeline:**
- No GitHub Actions or other CI workflows detected in root.

## Environment Configuration

**Development:**
- Required env vars: `LITEAPI_KEY`, `LITEAPI_BASE_URL`, `LITEAPI_VOUCHERS_BASE_URL`.
- Secrets location: `.env` (currently contains a production key).

**Production:**
- Secrets management: Expected to be managed in Firebase/Supabase dashboards.

## Webhooks & Callbacks

**Incoming:**
- LiteAPI webhooks for booking updates (if configured).

---

*Integration audit: 2026-04-19*
*Update when adding/removing external services*
