import type { HotelData, Rate, Review, Currency, Facility, SearchParams, SearchFilter, Country, City } from '@/types';
import { COLLECTION_2026 } from '@/data/collection';
// @ts-ignore
import liteApiSdk from 'liteapi-node-sdk';

const isServerSide = typeof window === 'undefined';
const LOCAL_SANDBOX_KEY = process.env.LITEAPI_SANDBOX_KEY || '';
const isLocalDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL_ENV;

const getValidatedLiteApiKey = () => {
  const configuredKey = process.env.LITEAPI_KEY || '';
  if (isServerSide && configuredKey.startsWith('prod_public_')) {
    if (isLocalDev && LOCAL_SANDBOX_KEY) {
      console.warn('[LiteAPI] Detected a public LiteAPI key on the server. Falling back to LITEAPI_SANDBOX_KEY for local development only.');
      return LOCAL_SANDBOX_KEY;
    }
    const message = '[LiteAPI] Refusing to use a public LiteAPI key on the server. Set LITEAPI_KEY to a private server-side key. For local-only testing, set LITEAPI_SANDBOX_KEY and run in a local dev environment.';
    console.error(message);
    throw new Error(message);
  }

  if (isServerSide && !configuredKey) {
    console.warn('[LiteAPI] LITEAPI_KEY is not set. Server-side requests will fail until a private LiteAPI key is configured.');
  }

  return configuredKey;
};

const LITEAPI_KEY = getValidatedLiteApiKey();
const LITEAPI_BASE_URL = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0';
const LITEAPI_BOOK_URL = process.env.LITEAPI_BOOK_URL || 'https://book.liteapi.travel/v3.0';
const LITEAPI_VOUCHERS_BASE_URL = process.env.LITEAPI_VOUCHERS_BASE_URL || 'https://da.liteapi.travel';

const LUXURY_MARGIN = 1.15; // 15% Maison Markup

const liteApi = liteApiSdk(LITEAPI_KEY);

// Runtime validation and header helper
const validateLiteApiKey = () => {
  // Server-side safety check: prod_public_ keys are client-only and should not be used for server calls
  const isServer = typeof window === 'undefined';
  if (isServer && LITEAPI_KEY && LITEAPI_KEY.startsWith('prod_public_') && process.env.NODE_ENV === 'production') {
    throw new Error('Invalid LiteAPI key detected on server: a public key (prod_public_) was found. Use a private server key or HMAC authentication for production.');
  }
};

const getHeaders = () => ({
  'X-API-Key': LITEAPI_KEY,
  'Content-Type': 'application/json',
});

// Generic JSON request helper that injects headers, validates key, parses JSON and logs 401s with request-id hints
async function requestJson(url: string, opts: any = {}) {
  validateLiteApiKey();
  const merged: any = Object.assign({}, opts, { headers: Object.assign({}, getHeaders(), opts.headers || {}) });
  const response = await fetch(url, merged);
  if (response.status === 401) {
    const requestId = response.headers.get('x-request-id') || response.headers.get('X-Request-ID') || 'unknown';
    console.error('[LiteAPI] 401 Unauthorized - check LITEAPI_KEY and permissions. Endpoint:', url, 'Request-ID:', requestId);
    const bodyText = await response.text().catch(() => '');
    // avoid logging keys, just show a short snippet of response body
    console.error('[LiteAPI] Response body (trim):', bodyText.slice(0, 500));
    throw new Error(`LiteAPI 401 Unauthorized. Request-ID: ${requestId}. Check LITEAPI_KEY and use a private server-side key or HMAC auth.`);
  }
  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    throw new Error(`LiteAPI request failed: ${response.status} ${response.statusText} - ${txt.slice(0, 500)}`);
  }
  const json = await response.json().catch(() => null);
  return json;
}

const getRequestId = (response: Response) => response.headers.get('X-Request-ID') || response.headers.get('x-request-id') || 'n/a';

const assertLiteApiResponse = async (response: Response, endpoint: string) => {
  if (response.status === 401) {
    const requestId = getRequestId(response);
    const message = `[LiteAPI 401] ${endpoint} was rejected. Request ID: ${requestId}. Check the LiteAPI key permissions and confirm you are using a private server key in LITEAPI_KEY.`;
    console.error(message);
    throw new Error(message);
  }

  if (!response.ok) {
    const requestId = getRequestId(response);
    console.error(`[LiteAPI ${response.status}] ${endpoint} failed. Request ID: ${requestId}`);
  }

  return response;
};

const fetchLiteApi = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init);
  await assertLiteApiResponse(response, typeof input === 'string' ? input : input.toString());
  return response;
};

// Map occupancies to SDK format
const mapOccupancies = (occupancies: any[]) => {
  return occupancies.map(occ => ({
    rooms: occ.rooms || 1,
    adults: occ.adults,
    children: occ.childrenAges || occ.children || []
  }));
};

const VIBES = ['Quiet Luxury', 'Barefoot Luxury', 'Slow Mode', 'Heritage Haven'];

// Hotel Search & Details
export async function searchHotels(
  destination: string,
  checkInDate: string,
  checkOutDate: string,
  occupancies: any[],
  placeId?: string
) {
  try {
    // Step 1: Resolve coordinates from placeId or destination text
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (placeId) {
      const res = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/places/${placeId}`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        const p = json.data;
        latitude = p?.latitude ?? p?.lat ?? null;
        longitude = p?.longitude ?? p?.lng ?? null;
      }
    }

    if (!latitude || !longitude) {
      const res = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/places?textQuery=${encodeURIComponent(destination)}`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        const first = Array.isArray(json.data) ? json.data[0] : json.data;
        if (first) {
          latitude = first.latitude ?? first.lat ?? null;
          longitude = first.longitude ?? first.lng ?? null;
          // If the place record only has a placeId but no coords, fetch detail
          if ((!latitude || !longitude) && first.placeId) {
            const detailRes = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/places/${first.placeId}`, { headers: getHeaders() });
            if (detailRes.ok) {
              const detail = await detailRes.json();
              const d = detail.data;
              latitude = d?.latitude ?? d?.lat ?? null;
              longitude = d?.longitude ?? d?.lng ?? null;
            }
          }
        }
      }
    }

    if (!latitude || !longitude) {
      console.error('[searchHotels] Could not resolve coordinates for:', destination, placeId);
      return { data: [] };
    }

    // Step 2: Get hotel IDs in a 5 km radius
    const hotelsRes = await fetchLiteApi(
      `${LITEAPI_BASE_URL}/data/hotels?latitude=${latitude}&longitude=${longitude}&radius=5000&limit=50`,
      { headers: getHeaders() }
    );
    if (!hotelsRes.ok) {
      console.error('[searchHotels] /data/hotels failed:', hotelsRes.status);
      return { data: [] };
    }
    const hotelsJson = await hotelsRes.json();
    let hotelIds: string[] = [];
    if (hotelsJson.data?.HotelIds) {
      hotelIds = hotelsJson.data.HotelIds.split(',').map((id: string) => id.trim()).filter(Boolean);
    } else if (Array.isArray(hotelsJson.data)) {
      hotelIds = hotelsJson.data.map((h: any) => h.id || h.hotelId).filter(Boolean);
    }

    if (hotelIds.length === 0) {
      console.warn('[searchHotels] No hotel IDs found near', latitude, longitude);
      return { data: [] };
    }

    // Step 3: Get rates for those IDs
    const result = await liteApi.getFullRates({
      hotelIds: hotelIds.slice(0, 50),
      checkin: checkInDate,
      checkout: checkOutDate,
      currency: 'USD',
      guestNationality: 'US',
      occupancies: mapOccupancies(occupancies),
      includeHotelData: true,
    });

    const hotels = result.data?.hotels?.map((hotel: any, index: number) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      star_rating: hotel.starRating,
      photo: hotel.main_photo || hotel.thumbnail || '',
      vibe: VIBES[index % VIBES.length],
      minPrice: hotel.roomTypes?.[0]?.rates?.[0]?.net_rate
        ? Math.ceil(hotel.roomTypes[0].rates[0].net_rate * LUXURY_MARGIN)
        : null,
    })) || [];

    return { data: hotels };
  } catch (e) {
    console.error('[searchHotels] Failed:', e);
    return { data: [] };
  }
}

export async function getHotelDetails(hotelId: string): Promise<{ data: HotelData }> {
  // Check curated collection first
  const curated = COLLECTION_2026.find(h => h.id === hotelId);
  if (curated) {
    return {
      data: {
        id: curated.id,
        name: curated.name,
        city: curated.location.split(',')[0],
        address: curated.location,
        star_rating: 5,
        photo: curated.image,
        description: curated.description,
        latitude: 0,
        longitude: 0
      }
    };
  }

  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/hotel?hotelId=${hotelId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get hotel details');
  const result = await response.json();
  const hotel = result.data;
  if (!hotel) throw new Error('Hotel not found');

  return {
    data: {
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      star_rating: hotel.starRating,
      photo: hotel.hotelImages?.[0]?.url || '',
      description: hotel.hotelDescription,
      latitude: hotel.location?.latitude,
      longitude: hotel.location?.longitude,
    }
  };
}

export async function getHotelRates(hotelId: string, checkInDate: string, checkOutDate: string, occupancies: any[]) {
  const curated = COLLECTION_2026.find(h => h.id === hotelId);
  if (curated) {
    return {
      data: [{
        room_id: 'curated-suite',
        room_name: 'Maison Sanctuary Suite',
        rates: [{
          rate_id: `rate-${curated.id}`,
          net_rate: curated.price,
          selling_rate: curated.price,
          currency: 'USD',
          board_type: 'Ultra All Inclusive'
        }]
      }]
    };
  }

  try {
    const result = await liteApi.getFullRates({
      hotelIds: [hotelId],
      checkin: checkInDate,
      checkout: checkOutDate,
      guestNationality: 'US',
      currency: 'USD',
      occupancies: mapOccupancies(occupancies)
    });

    const hotel = result.data?.hotels?.[0];
    return {
      data: hotel?.roomTypes?.map((room: any) => ({
        room_id: room.roomTypeId,
        room_name: room.roomType,
        rates: room.rates?.map((rate: any) => ({
          rate_id: rate.offerId || rate.rateId,
          net_rate: rate.net_rate,
          selling_rate: Math.ceil(rate.net_rate * LUXURY_MARGIN),
          currency: 'USD',
          board_type: rate.mealPlan || 'Room Only'
        }))
      })) || []
    };
  } catch (e) {
    console.error('SDK Rates Failed:', e);
    throw e;
  }
}

// Reviews & Sentiment
export async function getReviews(hotelId: string, getSentiment: boolean = false) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/reviews?hotelId=${hotelId}&getSentiment=${getSentiment}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get reviews');
  const result = await response.json();
  return result.data || [];
}

// Currency
export async function getCurrencies(): Promise<Currency[]> {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/currencies`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get currencies');
  const result = await response.json();
  return result.data?.map((c: any) => ({
    code: c.code,
    name: c.currency,
    symbol: '' // v3.0 doesn't provide symbol in this endpoint
  })) || [];
}

// Facilities & Hotel Types
export async function getFacilities(): Promise<Facility[]> {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/facilities`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get facilities');
  const result = await response.json();
  return result.data?.map((f: any) => ({
    id: f.facility_id.toString(),
    name: f.facility,
    category: ''
  })) || [];
}

export async function getHotelTypes() {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/hotelTypes`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get hotel types');
  const result = await response.json();
  return result.data || [];
}

// Semantic Search
export async function semanticSearch(vibe: string, destination: string) {
  const checkin = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
  const checkout = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
  const results = await searchHotels(destination, checkin, checkout, [{ adults: 2 }]);
  return {
    hotels: results.data.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      star_rating: hotel.star_rating,
      photo: hotel.photo,
    }))
  };
}

// Bookings
export async function prebook(rateId: string) {
  const body = { offerId: rateId };
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}/rates/prebook`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to prebook rate');
  const result = await response.json();
  return result.data;
}

export async function createPaymentIntent(prebookId: string, type: 'hotel' | 'flight' = 'hotel') {
  const endpoint = type === 'hotel' ? '/payments/intent' : '/flights/payments/intent';
  const body = { prebookId };
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to create payment intent');
  const result = await response.json();
  return result.data;
}

export async function book(
  prebookId: string,
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  },
  paymentIntentId?: string
) {
  const [firstName, ...rest] = (guestDetails.name || '').trim().split(' ');
  const lastName = rest.join(' ') || firstName;
  const body = {
    prebookId,
    guestInfo: {
      guestFirstName: firstName,
      guestLastName: lastName,
      guestEmail: guestDetails.email,
      guestPhone: guestDetails.phone,
    },
    paymentIntentId,
  };
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}/rates/book`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to complete booking');
  const result = await response.json();
  return result.data;
}

export async function listBookings() {
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}/bookings`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to list bookings');
  const result = await response.json();
  return result.data || [];
}

export async function getBooking(bookingId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}/bookings/${bookingId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get booking');
  const result = await response.json();
  return result.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status: 'cancelled' }),
  });
  if (!response.ok) throw new Error('Failed to cancel booking');
  const result = await response.json();
  return result.data;
}

export async function amendBooking(bookingId: string, guestName: string, guestEmail: string) {
  const body = { guest_name: guestName, guest_email: guestEmail };
  const response = await fetchLiteApi(`${LITEAPI_BOOK_URL}/bookings/${bookingId}/amend`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to amend booking');
  const result = await response.json();
  return result.data;
}

// Places & Search
export async function searchPlaces(query: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/places?textQuery=${encodeURIComponent(query)}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to search places');
  const result = await response.json();
  return result.data || [];
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/places/${placeId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get place details');
  const result = await response.json();
  return result.data;
}

// Explore/Discovery
export async function getCountries(): Promise<Country[]> {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/countries`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get countries');
  const result = await response.json();
  return result.data || [];
}

export async function getCities(countryCode: string): Promise<City[]> {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/data/cities?countryCode=${countryCode}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get cities');
  const result = await response.json();
  return result.data?.map((c: any) => ({
    id: c.city,
    name: c.city,
    country_code: countryCode
  })) || [];
}

export async function getMinRates(hotelIds: string[]) {
  const body = {
    hotelIds,
    checkin: new Date().toISOString().split('T')[0],
    checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guestNationality: 'US',
    currency: 'USD',
    occupancies: [{ adults: 2 }]
  };
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to get min rates');
  const result = await response.json();
  return (result.data?.hotels || result.hotels || []).map((h: any) => ({
    hotelId: h.id,
    minRate: h.roomTypes?.[0]?.rates?.[0]?.net_rate || null
  }));
}

// Vouchers
export async function getVouchers() {
  const response = await fetchLiteApi(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get vouchers');
  return response.json();
}

export async function getGuestVouchers(guestId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/guests/${guestId}/vouchers`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get guest vouchers');
  const result = await response.json();
  return result.data;
}

export async function applyVoucher(voucherCode: string) {
  const response = await fetchLiteApi(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers/${voucherCode}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to apply voucher');
  return response.json();
}

// Loyalty
export async function getLoyaltyInfo(guestId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get loyalty info');
  const result = await response.json();
  return result.data;
}

export async function redeemLoyaltyPoints(guestId: string, points: number) {
  const body = { points };
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points/redeem`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to redeem points');
  const result = await response.json();
  return result.data;
}

// Flights
export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency?: string;
}) {
  const body = {
    ...params,
    cabinClass: params.cabinClass || 'ECONOMY',
    currency: params.currency || 'USD'
  };
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/rates`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to search flights');
  const result = await response.json();
  return result.data || [];
}

export async function prebookFlight(flightOfferId: string) {
  const body = { flightOfferId };
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/prebooks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to prebook flight');
  const result = await response.json();
  return result.data;
}

export async function getFlightAncillaries(flightOfferId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/ancillaries?flightOfferId=${flightOfferId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch flight ancillaries');
  const result = await response.json();
  return result.data;
}

export async function bookFlight(prebookId: string, passengers: any[], ancillaries?: any) {
  const body = { prebookId, passengers, ancillaries };
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to book flight');
  const result = await response.json();
  return result.data;
}

export async function cancelFlight(bookingId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to cancel flight');
  const result = await response.json();
  return result.data;
}

export async function listFlightBookings() {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/bookings`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to list flight bookings');
  const result = await response.json();
  return result.data || [];
}

export async function getFlightBooking(bookingId: string) {
  const response = await fetchLiteApi(`${LITEAPI_BASE_URL}/flights/bookings/${bookingId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get flight booking');
  const result = await response.json();
  return result.data;
}

export async function getSmartRecommendations(context?: string) {
  const destination = context || 'Paris';
  const checkin = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
  const checkout = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
  const results = await searchHotels(destination, checkin, checkout, [{ adults: 2 }]);
  return results.data.slice(0, 4);
}
