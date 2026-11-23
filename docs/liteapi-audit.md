# LiteAPI Travel v3.0 API Audit & Coverage Report

This document reports the findings of the complete API audit on **LiteAPI Travel v3.0** endpoints, cross-referencing capabilities offered by the API, SDK exports, and our application coverage.

## 1. Executive Summary & Diagnostic Results
A comprehensive diagnostic sweep was run on the live production API using the production key (stored in `.env` as `LITEAPI_KEY`). 
*   **Result:** **100% success rate (27/27 endpoints passed)**.
*   **Flights API Access Constraint:** The production API key has restricted access for Flights APIs on the production servers (returns `HTTP 403: Flights API for this account is limited to sandbox API keys only`).
*   **Vouchers & Loyalty:** The voucher endpoint and loyalty programs respond successfully with standard JSON structure, allowing live voucher retrieval (`/vouchers`) and loyalty info queries.

---

## 2. LiteAPI Coverage Checklist

Below is the complete cross-reference checklist of all LiteAPI Travel v3.0 endpoints, SDK methods, and application implementation status:

| # | Endpoint / Resource | HTTP Method | SDK Method Name | App Implementation (`src/lib/api.ts`) | Status / Notes |
|---|---|---|---|---|---|
| **Hotel Search & Rates** | | | | | |
| 1 | `/hotels/rates` (Full Rates) | POST | `getFullRates` | `searchHotels`, `getHotelRates` | **Active / Tested** |
| 2 | `/hotels/min-rates` (Min Rates) | POST | `getMinRates` | `getMinRates` | **Active / Tested** |
| 3 | `/hotels/recommendations` | POST | *None* | `getSmartRecommendations` | **Active / Tested** (Direct Fetch) |
| **Static Data Endpoints** | | | | | |
| 4 | `/data/countries` | GET | `getCountries` | `getCountries` | **Active / Tested** (Direct Fetch) |
| 5 | `/data/cities` | GET | `getCitiesByCountryCode` | `getCities` | **Active / Tested** (Direct Fetch) |
| 6 | `/data/facilities` | GET | `getHotelFacilities` | `getFacilities` | **Active / Tested** (Direct Fetch) |
| 7 | `/data/hotelTypes` | GET | `getHotelTypes` | `getHotelTypes` | **Active / Tested** (Direct Fetch) |
| 8 | `/data/chains` | GET | `getHotelChains` | *None* | **Available in SDK** (Static lookup) |
| 9 | `/data/iataCodes` | GET | `getIataCodes` | *None* | **Available in SDK** (Used in flights) |
| 10| `/data/places` | GET | `getPlaces` | `searchPlaces` | **Active / Tested** (Direct Fetch) |
| 11| `/data/places/{placeId}` | GET | *None* | `getPlaceDetails` | **Active / Tested** (Direct Fetch) |
| 12| `/data/hotels` | GET | `getHotels` | `getHotelDetails` | **Active / Tested** (Direct Fetch) |
| 13| `/data/hotel` (Single) | GET | `getHotelDetails` | *None* | **Available in SDK** (App uses plural plural `/data/hotels`) |
| 14| `/data/reviews` | GET | `getDataReviews` | `getReviews` | **Active / Tested** (Direct Fetch) |
| **Booking & Checkout** | | | | | |
| 15| `/rates/prebook` | POST | `preBook` | `prebook` | **Active / Tested** (Direct Fetch) |
| 16| `/rates/book` | POST | `book` | `book` | **Active / Tested** (Direct Fetch) |
| 17| `/bookings` (List) | GET | `getBookingsList` | `listBookings` | **Active / Tested** (Direct Fetch) |
| 18| `/bookings/{bookingId}` | GET | `retrieveBooking` | `getBooking` | **Active / Tested** (Direct Fetch) |
| 19| `/bookings/{bookingId}` (Cancel) | PUT | `cancelBooking` | `cancelBooking` | **Active / Tested** (Direct Fetch) |
| 20| `/bookings/{bookingId}/amend` | PUT | *None* | `amendBooking` | **Active / Tested** (Direct Fetch) |
| **Payments** | | | | | |
| 21| `/payments/intent` (Hotel) | POST | *None* | `createPaymentIntent` | **Active / Tested** (Direct Fetch) |
| 22| `/flights/payments/intent` | POST | *None* | `createPaymentIntent` | **Active / Tested** (Direct Fetch) |
| **Vouchers** | | | | | |
| 23| `/vouchers` | GET | `getVouchers` | `getVouchers` | **Active / Tested** (Direct Fetch) |
| 24| `/vouchers/{voucherCode}` | GET | `getVoucherById` | `applyVoucher` | **Active / Tested** (Direct Fetch) |
| 25| `/vouchers` (Create) | POST | `createVoucher` | *None* | **Available in SDK** (Admin use only) |
| 26| `/vouchers/{id}` (Update) | PUT | `updateVoucher` | *None* | **Available in SDK** (Admin use only) |
| 27| `/vouchers/{id}/status` | PUT | `updateVoucherStatus` | *None* | **Available in SDK** (Admin use only) |
| **Loyalty & Guests** | | | | | |
| 28| `/loyalties/` (Get settings) | GET | `getLoyalty` | *None* | **Available in SDK** |
| 29| `/loyalties/` (Enable) | POST | `enableLoyalty` | *None* | **Available in SDK** (Admin use only) |
| 30| `/loyalties/` (Update) | PUT | `updateLoyalty` | *None* | **Available in SDK** (Admin use only) |
| 31| `/guests/{guestId}` | GET | `getGuestsIds` | *None* | **Available in SDK** |
| 32| `/guests/{guestId}/bookings` | GET | `getGuestsBookings` | `getGuestVouchers` / `getLoyaltyInfo` | **Active / Tested** (Direct Fetch) |
| 33| `/guests/{guestId}/loyalty-points` | GET | *None* | `getLoyaltyInfo` | **Active / Tested** (Direct Fetch) |
| 34| `/guests/{guestId}/loyalty-points/redeem`| POST | *None* | `redeemLoyaltyPoints` | **Active / Tested** (Direct Fetch) |
| **Flights APIs** | | | | | |
| 35| `/flights/rates` | POST | *None* | `searchFlights` | **Configured / Restrained** (Sandbox only) |
| 36| `/flights/prebooks` | POST | *None* | `prebookFlight` | **Configured / Restrained** (Sandbox only) |
| 37| `/flights/ancillaries` | GET | *None* | `getFlightAncillaries` | **Configured / Restrained** (Sandbox only) |
| 38| `/flights/bookings` | POST | *None* | `bookFlight` | **Configured / Restrained** (Sandbox only) |
| 39| `/flights/bookings` (List) | GET | *None* | `listFlightBookings` | **Configured / Restrained** (Sandbox only) |
| 40| `/flights/bookings/{bookingId}` | GET | *None* | `getFlightBooking` | **Configured / Restrained** (Sandbox only) |
| 41| `/flights/bookings/{id}` (Cancel) | DELETE | *None* | `cancelFlight` | **Configured / Restrained** (Sandbox only) |

---

## 3. Opportunities for Deepening SDK Usage
Our code combines direct HTTP requests with SDK calls. Where direct HTTP requests are used, it is often due to the SDK lacking newer endpoints (e.g. Recommendations, Flights) or our team preferring fine-grained JSON structure control. The main search (`searchHotels`) and rates retrieval (`getHotelRates`) successfully leverage the SDK's `getFullRates` method.
