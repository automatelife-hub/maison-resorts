# Maison Resorts Roadmap

## 🎯 Launch Goal: Premium Experience (2026)

Maison Resorts provides a high-end travel discovery and booking platform.

### Phase 1: Production Readiness & Payment Logic
*Focus on completing the core booking loop and ensuring system security.*

- [ ] **1.1. Payment Integration (Stripe + LiteAPI)**
  - Integrate Stripe Elements into `src/app/checkout/page.tsx`.
  - Wire `handlePaymentSuccess` to the `book` API call with real transaction IDs.
  - Implement server-side verification of payment intent in `src/app/api/book/route.ts`.
- [ ] **1.2. Firebase Security & Data Integrity**
  - Define Firestore security rules for `users/{uid}`, `users/{uid}/bookings`, etc.
  - Set up Cloud Functions for booking confirmation triggers (optional).
  - Verify environment variable mapping for all Firebase services.
- [ ] **1.3. Error Boundaries & UX Polish**
  - Add robust error handling for API failures (LiteAPI downtime).
  - Implement persistent feedback for failed payments.
  - Finalize mobile-responsive layout for the Checkout flow.

### Phase 2: Premium Features & Loyalty
*Focus on enhancing value for frequent travelers.*

- [ ] **2.1. Multi-Room & Group Bookings**
  - Update search parameters to support multiple occupancy rooms.
  - Implement a "basket" experience for selecting several rooms within one prebook session.
  - Refine the summary card in the Checkout flow to reflect multiple room types.
- [ ] **2.2. Loyalty & Points Engine**
  - Connect Firestore-stored points (from `AuthContext.tsx`) to the Checkout flow.
  - Implement point redemption logic (points-to-discount conversion).
  - Update `src/app/account/loyalty/page.tsx` with dynamic point balance.
- [ ] **2.3. Advanced Discovery (AI Semantic)**
  - Finalize the vibe-based search logic in `src/app/api/data/semantic-search/route.ts`.
  - Add "persona" tags (e.g., "The Minimalist," "The Bohemian") to destination cards.

### Phase 3: Final Launch & Optimization
*Focus on performance and the 2026 official rollout.*

- [ ] **3.1. Cinematic Performance Tuning**
  - Optimize Remotion background rendering for low-end mobile devices.
  - Implement lazy loading for high-resolution destination images.
- [ ] **3.2. SEO & Global Metadata**
  - Set up dynamic meta tags for hotel detail pages.
  - Implement structured data (JSON-LD) for better search ranking.
- [ ] **3.3. Production Handover**
  - Execute a final build and deployment to Firebase Hosting.
  - Perform a complete manual UAT (User Acceptance Testing) of the booking flow.

---
*Roadmap updated: 2026-04-19 after Project Initialization*
