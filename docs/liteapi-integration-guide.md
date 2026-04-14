# LiteAPI Integration Guide — Maison Resorts
> **Base URL:** `https://api.liteapi.travel/v3.0`  
> **Auth:** Pass your API key as `X-API-Key` header on every request.  
> **SDK Support:** Node.js, Python, Ruby, PHP  
> **Sandbox:** Full production-like sandbox available — no real charges in test mode.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Hotels — Data & Search](#hotels--data--search)
3. [Hotel Booking Flow](#hotel-booking-flow)
4. [Flights](#flights)
5. [Flight Booking Flow](#flight-booking-flow)
6. [Countries & Currencies](#countries--currencies)
7. [Loyalty Program](#loyalty-program)
8. [Vouchers & Promotions](#vouchers--promotions)
9. [Price Index](#price-index)
10. [Analytics & Reporting](#analytics--reporting)
11. [Supply Customization](#supply-customization)
12. [AI Integrations](#ai-integrations)
13. [Reference Data](#reference-data)
14. [Error Handling & Rate Limits](#error-handling--rate-limits)
15. [Best Practices for Maison Resorts](#best-practices-for-maison-resorts)

---

## Authentication

LiteAPI supports two authentication methods:

### Simple Authentication
Add the API key to every request header:
```http
X-API-Key: YOUR_API_KEY
```

### HMAC Authentication (Recommended for Production)
Use HMAC-signed requests for maximum security. Generate a signature using your secret key + timestamp + request body hash. Ideal for server-side calls handling real payments.

```http
X-API-Key: YOUR_API_KEY
X-Signature: <hmac_signature>
X-Timestamp: <unix_timestamp>
```

---

## Hotels — Data & Search

### List Hotels in a Destination
```http
GET /data/hotels
```
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `countryCode` | string | Yes | ISO-2 country code (e.g. `US`) |
| `cityName` | string | Yes | City name |
| `language` | string | No | Language code (e.g. `fr`, `es`) |
| `timeout` | float | No | Request timeout (default: 4s) |

Returns: Hotel IDs, names, addresses, star ratings, coordinates.

---

### Get Hotel Details
```http
GET /data/hotel?hotelId={hotelId}
```
**What you get:**
- Full hotel description
- Complete amenities list
- Image gallery (all photos)
- Exact GPS coordinates + address
- Star rating, chain info, classifications
- Accessibility details (pass `advancedAccessibilityOnly=true`)

> 💡 **Use for:** Hotel detail pages, booking confirmation pages, hotel profile cards on Maison.

---

### Hotel Reviews
```http
GET /data/reviews?hotelId={hotelId}
```
Returns verified guest reviews. Display on hotel detail pages to build trust and conversion.

---

### Search Places (Destination Search)
```http
GET /data/places?textQuery={query}
GET /data/places/{placeId}
```
Powers your destination autocomplete search bar. Returns cities, regions, landmarks with `placeId` for further queries.

---

### AI-Powered Hotel Search (Beta)
```http
GET /data/hotels/semantic-search?query={natural_language_query}
GET /data/hotels/room-search?query={query}   # search by image + text
GET /data/hotel/ask?hotelId={id}&question={question}
```
> 🤖 These beta endpoints allow guests to search using natural language like "romantic beachfront hotel with rooftop pool" — a huge differentiator for Maison's luxury positioning.

---

### Search Hotel Rates (Availability)
```http
POST /hotels/rates
```
**Request Body:**
```json
{
  "hotelIds": ["hotel_id_1", "hotel_id_2"],
  "checkin": "2026-06-01",
  "checkout": "2026-06-05",
  "adults": 2,
  "children": [8],
  "currency": "USD",
  "guestNationality": "US",
  "countryCode": "US"
}
```
Returns: Room options, rate plans, cancellation policies, board types (BB, HB, AI), total price.

---

### Minimum Rates (For Hotel Listing Cards)
```http
POST /hotels/min-rates
```
Same parameters as `/hotels/rates` but returns only the cheapest available rate per hotel. Use this to populate price tags on hotel listing/grid pages without overloading the UI.

---

## Hotel Booking Flow

```
1. Search rates     → POST /hotels/rates
2. Prebook          → POST /rates/prebook          (creates checkout session, locks rate)
3. Complete booking → POST /rates/book             (charges guest, confirms reservation)
```

### Step 2 — Prebook
```http
POST /rates/prebook
```
**Returns:** `prebookId`, final price, cancellation policy, payment token. Always prebook before charging — this locks the rate and prevents price changes at checkout.

### Step 3 — Book
```http
POST /rates/book
```
**Body includes:** `prebookId`, guest details (name, email, phone), payment info.

---

### Manage Bookings
| Action | Endpoint |
|--------|----------|
| List all bookings | `GET /bookings` |
| Get booking details | `GET /bookings/{bookingId}` |
| Cancel a booking | `PUT /bookings/{bookingId}` |
| Amend guest name | `PUT /bookings/{bookingId}/amend` |
| Amend dates/occupancy | `POST /bookings/{bookingId}/alternative-prebooks` |
| Get prebook details | `GET /prebooks/{prebookId}` |

---

## Flights

LiteAPI's Flights API lets you offer complete air travel booking alongside hotels — enabling true package deals on Maison Resorts.

### Airlines Data
```http
GET /data/flights/airlines                           # List all airlines
GET /data/flights/airlines/iatas                     # List all airline IATA codes
GET /data/flights/airlines/iatas/{iataCode}          # Get airline by IATA code (e.g. AA, BA)
```

### Airports Data
```http
GET /data/flights/airports                           # Search airports (by name/city)
GET /data/flights/airports/iatas                     # List all airport IATA codes
GET /data/flights/airports/iatas/{iataCode}          # Get airport by IATA code (e.g. JFK, LHR)
```

---

### Search for Flights
```http
POST /flights/rates
```
**Request Body:**
```json
{
  "origin": "BNA",
  "destination": "CDG",
  "departureDate": "2026-06-01",
  "returnDate": "2026-06-08",
  "adults": 2,
  "children": [],
  "cabinClass": "ECONOMY",
  "currency": "USD"
}
```
**Returns:** Flight offers with pricing, baggage info, airline, departure/arrival times, layovers, cabin class.

---

### Verify Flight Offer
```http
POST /flights/verify
```
Always verify a flight offer before prebook to confirm price is still valid. Returns updated pricing and availability confirmation.

---

## Flight Booking Flow

```
1. Search flights     → POST /flights/rates
2. Verify offer       → POST /flights/verify
3. Prebook            → POST /flights/prebooks
4. Add services       → POST /flights/prebooks/{prebookId}/services   (optional: seat selection, baggage)
5. Complete booking   → POST /flights/bookings
6. Get details        → GET /flights/bookings/{bookingId}
```

### Add Services (Optional)
```http
POST /flights/prebooks/{prebookId}/services
```
Attach ancillary services to a flight prebook:
- Extra baggage
- Seat selection
- Meal preferences
- Priority boarding

> 💡 These upsells are great revenue drivers — display them on Maison's checkout flow.

---

## Countries & Currencies

### List All Countries
```http
GET /data/countries?timeout=4
```
Returns: Full country names + ISO-2 codes (US, GB, FR, etc.)  
Use for: Country dropdowns in search forms, guest nationality fields, and filtering hotel supply by country.

---

### List Cities by Country
```http
GET /data/cities?countryCode={ISO2}
```
Returns all cities within a country. Chain this after country selection for a destination drill-down UX.

---

### List All Currencies
```http
GET /data/currencies
```
Returns: All supported currencies with codes (USD, EUR, GBP, AED, etc.)  
Use for: Currency selector in the booking widget. Pass the selected `currency` code in all rate and booking requests to display pricing in the guest's preferred currency.

---

### IATA Codes (Hotel & Airport)
```http
GET /data/iatacodes
```
Returns IATA airport/location codes. Use to link hotel destinations with flight origins for package booking.

---

## Loyalty Program

LiteAPI provides a built-in guest loyalty (cashback) system — no third-party tool needed.

### Configure Your Loyalty Program
```http
GET  /loyalties           # Get current settings
PUT  /loyalties           # Update settings
```
**Settings include:**
- `enabled` (boolean) — turn program on/off
- `cashbackRate` (percentage) — how much guests earn per booking
- `currency` — currency for cashback rewards

---

### Guest Management
```http
GET /guests                              # Fetch all guests
GET /guests/{guestId}                    # Fetch specific guest profile
GET /guests/{guestId}/bookings           # All bookings by a guest
GET /guests/{guestId}/vouchers           # Vouchers held by a guest
GET /guests/{guestId}/loyalty-points     # Current loyalty point balance
POST /guests/{guestId}/loyalty-points/redeem   # Redeem points on a booking
```

### Loyalty Workflow
```
1. Guest books hotel → Points automatically earned (based on cashback rate)
2. Points accumulate in guest profile
3. On next booking → guest redeems points via POST /guests/{id}/loyalty-points/redeem
4. Redeemed value applied as discount on checkout
```

> 🏆 **Maison Strategy:** Set cashback at 2–5% for luxury positioning. Display guest tier + balance on their profile dashboard. Use vouchers (below) for tier-upgrade rewards.

---

## Vouchers & Promotions

LiteAPI's voucher system lets you run promo campaigns, welcome offers, and loyalty rewards.

```http
POST   /vouchers                          # Create a voucher
GET    /vouchers                          # List all vouchers
GET    /vouchers/{voucherId}              # Get specific voucher
PUT    /vouchers/{id}                     # Update voucher
PUT    /vouchers/{id}/status              # Enable/disable voucher
GET    /vouchers/history                  # Voucher usage history
DELETE /vouchers/{id}                     # Delete a voucher
```

**Voucher Types You Can Create:**
- Percentage discount (e.g., `WELCOME10` = 10% off first booking)
- Fixed amount off (e.g., `$50 off stays over $500`)
- Usage-limited codes (single use or multi-use)
- Date-restricted campaigns

---

## Price Index

The Price Index API lets you show guests whether a hotel or city is currently at a good price — adding a trust-building "Deal Score" feature to Maison.

```http
GET /price-index/city?cityName={city}&countryCode={code}    # City-level price index
GET /price-index/hotels?hotelIds={ids}                       # Hotel-level price index
```

Returns aggregated pricing data to show:
- "Prices are 15% below average this week"
- "Best time to book" indicators
- Price trend context on hotel detail pages

---

## Analytics & Reporting

Full analytics suite for your Maison admin dashboard.

| Endpoint | Description |
|----------|-------------|
| `POST /analytics/weekly` | Weekly booking performance |
| `POST /analytics/report` | Detailed custom date range report |
| `POST /analytics/markets` | Market-level demand analytics |
| `POST /analytics/hotels` | Most booked hotels |
| `POST /commissions/report` | Commission earnings by period |
| `GET /bookings/guest-nationality-report` | Guest source country breakdown |
| `GET /bookings/source-markets-report` | Destination country report |
| `GET /bookings/hotels-sales-report` | Per-property revenue report |
| `POST /bookings/search` | Search bookings by text |

---

## Supply Customization

Control exactly which hotels and supply appear on Maison Resorts.

```http
GET /supply-customization    # View current supply settings
PUT /supply-customization    # Update supply settings
```

**What you can customize:**
- Blacklist/whitelist specific hotel chains or properties
- Filter by star rating (only show 4★ and 5★ for luxury positioning)
- Restrict to specific countries or regions
- Set preferred suppliers

---

## AI Integrations

LiteAPI offers native AI tooling — perfect for Maison's premium UX.

### MCP Server for AI Agents
Connect LiteAPI directly to AI agent frameworks (Claude, OpenAI, etc.) via the MCP server. Your AI concierge can search hotels, check rates, and complete bookings autonomously.
- Docs: https://docs.liteapi.travel/reference/mcp-server

### Booking Assistant AI Chatbot
Embed LiteAPI's pre-built AI chatbot widget on Maison — guests can book hotels through natural conversation.
- Docs: https://docs.liteapi.travel/reference/liteapi-ai-chatbot

### Vibe Coding Prompt
LiteAPI provides a dedicated prompt for use with AI coding tools (Cursor, Copilot) to accelerate development.
- Docs: https://docs.liteapi.travel/reference/prompt-for-vibe-coding-tools

---

## Reference Data

Use these endpoints to populate dropdowns and filter UIs — cache responses as they rarely change.

| Endpoint | Returns |
|----------|---------|
| `GET /data/facilities` | All hotel amenities/facilities (multi-language) |
| `GET /data/hoteltypes` | Hotel type classifications (resort, boutique, etc.) |
| `GET /data/chains` | All hotel chain names and IDs |
| `GET /data/languages` | All supported content languages |
| `GET /data/weather?lat={lat}&lng={lng}` | Current weather for a hotel's location |

### Multi-Language Support
Pass `language={code}` on most data endpoints to return content in guest's language. Supported codes via `GET /data/languages`.

---

## Error Handling & Rate Limits

### Common HTTP Status Codes
| Code | Meaning | Action |
|------|---------|--------|
| `200` | Success | Process response |
| `400` | Bad Request | Check required params |
| `401` | Unauthorized | Verify API key |
| `429` | Rate Limited | Implement exponential backoff |
| `500` | Server Error | Retry after delay |

### Rate Limiting
- LiteAPI enforces per-endpoint rate limits
- Implement request queuing for bulk hotel list fetches
- Cache `/data/*` endpoints (countries, currencies, facilities) — these change infrequently
- Reference: https://docs.liteapi.travel/reference/rate-limiting

---

## Best Practices for Maison Resorts

### Performance
- **Cache reference data** — countries, currencies, hotel types, facilities. Refresh daily max.
- **Use `/hotels/min-rates`** for listing pages, only fetch full rates on hotel detail page load.
- **Lazy-load images** from hotel image galleries.

### UX / Conversion
- Show **cancellation policy prominently** at checkout — comes back in prebook response.
- Display **loyalty points earned** on the booking confirmation page (motivates return visits).
- Use **semantic hotel search** (beta) for Maison's AI concierge feature — luxury guests expect smart search.
- Add **Price Index badges** ("Great Deal", "Peak Pricing") to hotel cards to drive urgency.

### Revenue
- Enable **vouchers** for email campaigns and first-booking promotions.
- Track commission earnings via `POST /commissions/report` — tie this to your affiliate dashboard.
- Offer **flight add-ons** at hotel checkout with the Flights API — package upsell = higher AOV.
- Set loyalty cashback at **3%** to match luxury travel industry norms without eroding margin.

### Security
- Use **HMAC authentication** for all server-side booking and payment calls.
- Never expose your API key in client-side/browser code — proxy through your Next.js API routes.
- Validate prebook response before charging — always check that `prebookId` status is `confirmed`.

---

## Quick Reference — Key Endpoints

```
# Hotel Search & Data
GET  /data/hotels              → List hotels in a city
GET  /data/hotel               → Hotel details (by hotelId)
GET  /data/reviews             → Hotel reviews
POST /hotels/rates             → Search availability & rates
POST /hotels/min-rates         → Cheapest rate per hotel (for listings)

# Hotel Booking
POST /rates/prebook            → Lock rate, create checkout session
POST /rates/book               → Confirm booking & charge guest
GET  /bookings                 → List all bookings
PUT  /bookings/{id}            → Cancel booking

# Flights
POST /flights/rates            → Search flights
POST /flights/verify           → Verify offer before booking
POST /flights/prebooks         → Create flight checkout session
POST /flights/bookings         → Complete flight booking

# Reference Data
GET  /data/countries           → All countries (ISO-2 codes)
GET  /data/currencies          → All currencies
GET  /data/cities              → Cities in a country
GET  /data/iatacodes           → IATA codes

# Loyalty
GET  /loyalties                → Get loyalty program config
PUT  /loyalties                → Update loyalty program
GET  /guests/{id}/loyalty-points       → Guest points balance
POST /guests/{id}/loyalty-points/redeem → Redeem points

# Vouchers
POST /vouchers                 → Create voucher
GET  /vouchers                 → List vouchers

# Analytics
POST /analytics/report         → Detailed bookings report
POST /commissions/report       → Commission earnings
```

---

*Generated: April 2026 | LiteAPI v3.0 | Maison Resorts — maisonresorts.com*
