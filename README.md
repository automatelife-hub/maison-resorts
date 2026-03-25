# Maison - Premium Hotel Booking Platform

A modern, luxury hotel booking application built with Next.js 16, React 19, TypeScript, and Supabase.

## Features

### Phase 0: Foundation
- [x] Centralized API configuration and types
- [x] Preferences context (currency, nationality)
- [x] Reusable UI component library

### Phase 1: Core Features
- [x] AI Sentiment Analysis on reviews
- [x] Currency selector
- [x] Advanced search filters
- [x] Semantic/AI-powered vibe search
- [x] Booking management (cancel, amend)
- [x] Voucher/promo code system

### Phase 2: Premium Features  
- [x] Explore/discovery pages
- [x] Loyalty program
- [x] Guest profiles & account area
- [x] Interactive map view
- [x] Favorites/wishlist

### Phase 3: Polish & Delight
- [x] Recent searches
- [x] Share functionality
- [x] Mobile-first responsive design
- [ ] Multi-room bookings (in progress)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Hotel Data**: LiteAPI
- **Maps**: MapLibre GL

## Environment Setup

Copy `.env.local` and update with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
LITEAPI_KEY=your_liteapi_key
LITEAPI_BASE_URL=https://api.liteapi.travel/v1
LITEAPI_VOUCHERS_BASE_URL=https://da.liteapi.travel
```

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   ├── account/     # User account pages
│   ├── hotel/       # Hotel detail pages
│   ├── results/     # Search results
│   └── ...
├── components/      # Reusable React components
├── context/         # React contexts (PreferencesContext)
├── lib/            # Utility functions and API client
└── types/          # TypeScript type definitions
```

## API Routes

### Search & Discovery
- `GET /api/data/countries` - List all countries
- `GET /api/data/cities?countryCode=XX` - Cities in country
- `GET /api/data/facilities` - Amenity filters
- `GET /api/data/hotel-types` - Hotel type options
- `GET /api/data/currencies` - Available currencies
- `GET /api/data/semantic-search?vibe=X&destination=Y` - AI-powered search
- `POST /api/hotels/min-rates` - Minimum rates for hotels

### Hotels & Reviews
- `GET /api/reviews?hotelId=X&getSentiment=true` - Reviews with sentiment

### Bookings
- `GET /api/bookings` - List user bookings
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Cancel booking
- `PUT /api/bookings/[id]/amend` - Amend guest details

### Loyalty
- `GET /api/loyalty?guestId=X` - Get loyalty info
- `POST /api/guests/[id]/redeem` - Redeem points

### Vouchers
- `GET /api/vouchers` - List vouchers
- `GET /api/vouchers/[code]` - Apply voucher

## Styling

Uses Tailwind CSS with custom theme colors:
- `luxury`: Dark luxury theme (#1a1a1a)
- `accent`: Gold (#d4af37)

## License

© 2026 Maison. All rights reserved.
