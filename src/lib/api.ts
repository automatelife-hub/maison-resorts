import type { HotelData, Rate, Review, Currency, Facility, SearchParams, SearchFilter, Country, City } from '@/types';
import { COLLECTION_2026 } from '@/data/collection';
import liteApiSdk from 'liteapi-node-sdk';

const LITEAPI_KEY = process.env.LITEAPI_KEY || '';
const LITEAPI_HMAC_SECRET = process.env.LITEAPI_HMAC_SECRET || '';
const LITEAPI_BASE_URL = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0';
const LITEAPI_VOUCHERS_BASE_URL = process.env.LITEAPI_VOUCHERS_BASE_URL || 'https://da.liteapi.travel';

const LUXURY_MARGIN = 1.15; // 15% Maison Markup

const liteApi = liteApiSdk(LITEAPI_KEY);

const getHeaders = (body?: any) => {
  const headers: any = {
    'X-API-Key': LITEAPI_KEY,
    'Content-Type': 'application/json',
  };

  if (LITEAPI_HMAC_SECRET && body) {
     headers['X-Timestamp'] = Math.floor(Date.now() / 1000).toString();
  }

  return headers;
};

// Map occupancies to SDK format
const mapOccupancies = (occupancies: any[]) => {
  return occupancies.map(occ => ({
    rooms: occ.rooms || 1,
    adults: occ.adults,
    children: occ.childrenAges || occ.children || []
  }));
};

// Hotel Search & Details
export async function searchHotels(
  destination: string, 
  checkInDate: string, 
  checkOutDate: string, 
  occupancies: any[],
  placeId?: string
) {
  try {
    const sdkParams: any = {
      checkin: checkInDate,
      checkout: checkOutDate,
      currency: 'USD',
      guestNationality: 'US',
      occupancies: mapOccupancies(occupancies),
      includeHotelData: true
    };

    if (placeId) {
      sdkParams.placeId = placeId;
    } else {
      sdkParams.aiSearch = destination;
    }

    const result = await liteApi.getFullRates(sdkParams);
    
    const hotels = result.hotels?.map((hotel: any, index: number) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      star_rating: hotel.starRating,
      photo: hotel.main_photo || hotel.thumbnail || '',
      vibe: ['Quiet Luxury', 'Barefoot Luxury', 'Slow Mode', 'Heritage Heritage'][index % 4], 
      minPrice: hotel.roomTypes?.[0]?.rates?.[0]?.net_rate 
        ? Math.ceil(hotel.roomTypes[0].rates[0].net_rate * LUXURY_MARGIN)
        : null
    })) || [];

    return { data: hotels };
  } catch (e) {
    console.error('SDK Search Failed:', e);
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

  // SDK doesn't have a direct getHotelDetails, use data endpoint via fetch (secured with getHeaders)
  const response = await fetch(`${LITEAPI_BASE_URL}/data/hotels?hotelIds=${hotelId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get hotel details');
  const result = await response.json();
  const hotel = result.data?.[0];
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

    const hotel = result.hotels?.[0];
    return {
      data: hotel?.roomTypes?.map((room: any) => ({
        room_id: room.roomTypeId,
        room_name: room.roomType,
        rates: room.rates?.map((rate: any) => ({
          rate_id: rate.rateId,
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
  const response = await fetch(`${LITEAPI_BASE_URL}/data/reviews?hotelId=${hotelId}&getSentiment=${getSentiment}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get reviews');
  const result = await response.json();
  return result.data || [];
}

// Currency
export async function getCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/currencies`, { headers: getHeaders() });
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
  const response = await fetch(`${LITEAPI_BASE_URL}/data/facilities`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get facilities');
  const result = await response.json();
  return result.data?.map((f: any) => ({
    id: f.facility_id.toString(),
    name: f.facility,
    category: ''
  })) || [];
}

export async function getHotelTypes() {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/hotelTypes`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get hotel types');
  const result = await response.json();
  return result.data || [];
}

// Semantic Search
export async function semanticSearch(vibe: string, destination: string) {
  // v3.0 might use aiSearch in /hotels/rates for this
  const body = {
    aiSearch: `${vibe} hotels in ${destination}`,
    checkin: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], // 14 days out
    checkout: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], // 15 days out
    currency: 'USD',
    guestNationality: 'US',
    occupancies: [{ adults: 2 }],
    includeHotelData: true
  };
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to perform semantic search');
  const result = await response.json();
  return {
    hotels: result.hotels?.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      star_rating: hotel.starRating,
      photo: hotel.main_photo || '',
    })) || []
  };
}

// Bookings
export async function prebook(rateId: string) {
  const body = { rateId };
  const response = await fetch(`${LITEAPI_BASE_URL}/rates/prebook`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to prebook rate');
  const result = await response.json();
  return result.data;
}

export async function createPaymentIntent(prebookId: string, type: 'hotel' | 'flight' = 'hotel') {
  const endpoint = type === 'hotel' ? '/payments/intent' : '/flights/payments/intent';
  const body = { prebookId };
  const response = await fetch(`${LITEAPI_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to create payment intent');
  const result = await response.json();
  return result.data; // Should contain clientSecret
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
  const body = {
    prebookId,
    guest_name: guestDetails.name,
    guest_email: guestDetails.email,
    guest_phone: guestDetails.phone,
    payment_intent_id: paymentIntentId, // Explicitly using snake_case as expected by many MoR APIs
  };
  const response = await fetch(`${LITEAPI_BASE_URL}/rates/book`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to complete booking');
  const result = await response.json();
  return result.data;
}
export async function listBookings() {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to list bookings');
  const result = await response.json();
  return result.data || [];
}

export async function getBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get booking');
  const result = await response.json();
  return result.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}`, {
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
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}/amend`, {
    method: 'PUT',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to amend booking');
  const result = await response.json();
  return result.data;
}

// Places & Search
export async function searchPlaces(query: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/places?textQuery=${encodeURIComponent(query)}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to search places');
  const result = await response.json();
  return result.data || [];
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/places/${placeId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get place details');
  const result = await response.json();
  return result.data;
}

// Explore/Discovery
export async function getCountries(): Promise<Country[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/countries`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get countries');
  const result = await response.json();
  return result.data || [];
}

export async function getCities(countryCode: string): Promise<City[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/cities?countryCode=${countryCode}`, { headers: getHeaders() });
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
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to get min rates');
  const result = await response.json();
  return result.hotels?.map((h: any) => ({
    hotelId: h.id,
    minRate: h.roomTypes?.[0]?.rates?.[0]?.net_rate || null
  })) || [];
}

// Vouchers
export async function getVouchers() {
  const response = await fetch(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get vouchers');
  return response.json();
}

export async function getGuestVouchers(guestId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/vouchers`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get guest vouchers');
  const result = await response.json();
  return result.data;
}

export async function applyVoucher(voucherCode: string) {
  const response = await fetch(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers/${voucherCode}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to apply voucher');
  return response.json();
}

// Loyalty
export async function getLoyaltyInfo(guestId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get loyalty info');
  const result = await response.json();
  return result.data;
}

export async function redeemLoyaltyPoints(guestId: string, points: number) {
  const body = { points };
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points/redeem`, {
    method: 'POST',
    headers: getHeaders(body),
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
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/rates`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to search flights');
  const result = await response.json();
  return result.data || [];
}

export async function prebookFlight(flightOfferId: string) {
  const body = { flightOfferId };
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/prebooks`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to prebook flight');
  const result = await response.json();
  return result.data;
}

export async function getFlightAncillaries(flightOfferId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/ancillaries?flightOfferId=${flightOfferId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch flight ancillaries');
  const result = await response.json();
  return result.data;
}

export async function bookFlight(prebookId: string, passengers: any[], ancillaries?: any) {
  const body = { prebookId, passengers, ancillaries };
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/bookings`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to book flight');
  const result = await response.json();
  return result.data;
}

export async function cancelFlight(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to cancel flight');
  const result = await response.json();
  return result.data;
}

export async function listFlightBookings() {
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/bookings`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to list flight bookings');
  const result = await response.json();
  return result.data || [];
}

export async function getFlightBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/bookings/${bookingId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get flight booking');
  const result = await response.json();
  return result.data;
}

export async function getSmartRecommendations(context?: string) {
  const body = { context, limit: 4 };
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/recommendations`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  const result = await response.json();
  return result.data || [];
}
