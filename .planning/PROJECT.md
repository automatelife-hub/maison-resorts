# Maison Resorts — Premium Travel Platform

## What This Is
A high-end, boutique hotel and flight booking platform for 2026. Maison Resorts focuses on "Conscious Authenticity," offering a curated collection of niche vacation spots across Europe. The platform provides a cinematic, high-precision escape experience powered by AI sentiment analysis and a seamless LiteAPI integration.

## Core Value
Maison Resorts delivers a "precision escape" — the luxury of absolute certainty in travel discovery and booking, presented through a high-aesthetic, cinematic interface.

## Requirements

### Validated
- ✓ Centralized LiteAPI v3.0 integration (Hotels & Flights) — existing
- ✓ Cinematic UI with Remotion backgrounds — existing
- ✓ AI Sentiment Analysis for hotel reviews — existing
- ✓ Mobile-first responsive design with Tailwind CSS — existing
- ✓ Firebase Authentication (Google & Email/Pass) — existing
- ✓ Firestore integration for Bookings & User Profiles — existing
- ✓ Multi-currency and User Preferences context — existing

### Active
- [ ] **Production-Ready Stripe Flow**: Fully wire the LiteAPI Payment Intent to a secure Stripe Elements UI.
- [ ] **Multi-Room Booking Support**: Update search and checkout to handle multiple room selections.
- [ ] **Loyalty Program V1**: Implement point accumulation and voucher redemption logic in Firestore.
- [ ] **Firebase Security Rules**: Harden Firestore and Storage against unauthorized access.
- [ ] **Final Deployment Audit**: Verify all environment variables and build optimization for Firebase Hosting.

### Out of Scope
- Native Mobile App (iOS/Android) — focus on Web/PWA first.
- Social Media platform features — focus on booking and discovery.
- Physical concierge services — digital-only platform.

## Context
- **Path**: `C:\Users\PokerConnect\maison-resorts`
- **Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Primary API**: LiteAPI v3.0 (Merchant of Record for payments)
- **Design**: "Luxury" theme (#1a1a1a) with "Accent" gold (#d4af37)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pivot to Firebase | User preference for unified hosting and database ecosystem | ✅ Switched from Supabase |
| LiteAPI as Merchant of Record | Simplifies financial compliance and hotel settlement | ✅ Confirmed in api.ts |
| Remotion for Hero | High-impact visual differentiation in the luxury space | ✅ Implemented in LuxuryHero |

## Evolution
This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-19 after Project Initialization*
