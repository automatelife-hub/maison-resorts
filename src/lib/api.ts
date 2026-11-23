import type { HotelData, Rate, Review, Currency, Facility, SearchParams, SearchFilter, Country, City } from '@/types/index.ts';
import { COLLECTION_2026 } from '@/data/collection.ts';
import liteApiSdk from 'liteapi-node-sdk';

const LITEAPI_KEY = process.env.LITEAPI_KEY || '';
const LITEAPI_HMAC_SECRET = process.env.LITEAPI_HMAC_SECRET || '';
const LITEAPI_BASE_URL = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0';
const LITEAPI_BOOK_URL = 'https://book.liteapi.travel/v3.0';
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

// Adjust checkin and checkout dates safely
function adjustDates(checkin?: string, checkout?: string): { checkin: string, checkout: string } {
  const today = new Date();
  
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  let checkinDate: Date;
  if (checkin) {
    checkinDate = new Date(checkin);
    if (isNaN(checkinDate.getTime())) {
      checkinDate = tomorrow;
    }
  } else {
    checkinDate = tomorrow;
  }

  const minCheckin = new Date();
  minCheckin.setDate(today.getDate() + 1);
  minCheckin.setHours(0, 0, 0, 0);
  
  const checkinCompare = new Date(checkinDate);
  checkinCompare.setHours(0, 0, 0, 0);

  if (checkinCompare < minCheckin) {
    checkinDate = minCheckin;
  }

  let checkoutDate: Date;
  if (checkout) {
    checkoutDate = new Date(checkout);
    if (isNaN(checkoutDate.getTime())) {
      checkoutDate = new Date(checkinDate);
      checkoutDate.setDate(checkinDate.getDate() + 2); // Default 2 nights stay
    }
  } else {
    checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkinDate.getDate() + 2);
  }

  const checkoutCompare = new Date(checkoutDate);
  checkoutCompare.setHours(0, 0, 0, 0);
  const checkinCompareFinal = new Date(checkinDate);
  checkinCompareFinal.setHours(0, 0, 0, 0);

  if (checkoutCompare <= checkinCompareFinal) {
    checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkinDate.getDate() + 1);
  }

  return {
    checkin: formatDate(checkinDate),
    checkout: formatDate(checkoutDate)
  };
}

// Map occupancies to SDK format safely
const mapOccupancies = (occupancies?: any[]): any => {
  if (!occupancies || !Array.isArray(occupancies) || occupancies.length === 0) {
    return [{ rooms: 1, adults: 2, children: [] }];
  }
  return occupancies.map(occ => {
    if (!occ || typeof occ !== 'object') {
      return { rooms: 1, adults: 2, children: [] };
    }
    const adults = typeof occ.adults === 'number' ? occ.adults : parseInt(occ.adults || occ.guests || '2', 10) || 2;
    const rawChildren = occ.childrenAges || occ.children || [];
    const children = Array.isArray(rawChildren) 
      ? rawChildren.map((c: any) => typeof c === 'number' ? c : parseInt(c, 10)).filter((c: number) => !isNaN(c))
      : [];
    return { rooms: occ.rooms || 1, adults, children };
  });
};

// Hotel Search & Details
export async function searchHotels(
  destination: string, 
  checkInDate: string, 
  checkOutDate: string, 
  occupancies: any[],
  placeId?: string,
  currency: string = 'USD'
) {
  const { checkin, checkout } = adjustDates(checkInDate, checkOutDate);
  const mappedOccupancies = mapOccupancies(occupancies);
  
  const lowerDest = (destination || '').toLowerCase();
  const matchingCurated = COLLECTION_2026.filter(item => {
    if (lowerDest === 'europe' || lowerDest === 'all' || !destination) {
      return true;
    }
    return item.location.toLowerCase().includes(lowerDest) ||
           item.name.toLowerCase().includes(lowerDest) ||
           (item.vibe && item.vibe.toLowerCase().includes(lowerDest));
  }).map(item => ({
    id: item.id,
    name: item.name,
    city: item.location.split(',')[0],
    address: item.location,
    star_rating: 5,
    photo: item.image,
    vibe: item.vibe || 'Quiet Luxury',
    minPrice: item.price
  }));

  try {
    const sdkParams: any = {
      checkin,
      checkout,
      currency,
      guestNationality: 'US',
      occupancies: mappedOccupancies,
      includeHotelData: true
    };

    if (placeId) {
      sdkParams.placeId = placeId;
    } else if (destination && destination.toLowerCase() !== 'europe' && destination.toLowerCase() !== 'all') {
      try {
        const places = await searchPlaces(destination);
        if (places && places.length > 0) {
          sdkParams.placeId = places[0].id || places[0].placeId;
        }
      } catch (err) {
        console.warn('[SDK] Place resolution failed:', err);
      }
    }
    
    if (!sdkParams.placeId) {
      sdkParams.aiSearch = destination || 'Europe';
    }

    const result = await Promise.race([
      liteApi.getFullRates(sdkParams),
      new Promise((_, reject) => setTimeout(() => reject(new Error('LiteAPI search request timed out')), 6000))
    ]) as any;
    
    if (result.status !== 'success' || !result.data) {
      console.warn('[SDK] searchHotels API returned failure:', result.error || result.errors);
      return { data: matchingCurated.length > 0 ? matchingCurated : getAllCurated() };
    }

    const ratesMap = new Map();
    if (Array.isArray(result.data.data)) {
      for (const item of result.data.data) {
        ratesMap.set(item.hotelId, item.roomTypes);
      }
    }

    const hotels = result.data.hotels?.map((hotel: any, index: number) => {
      const roomTypes = ratesMap.get(hotel.id) || [];
      const minPrice = roomTypes[0]?.rates?.[0]?.net_rate 
        ? Math.ceil(roomTypes[0].rates[0].net_rate * LUXURY_MARGIN)
        : null;

      return {
        id: hotel.id,
        name: hotel.name,
        city: hotel.city || hotel.address?.split(',')[1]?.trim() || '',
        address: hotel.address,
        star_rating: hotel.rating ? Math.round(hotel.rating / 2) : 5,
        photo: hotel.main_photo || hotel.thumbnail || '',
        vibe: ['Luxury Boutique', 'Beachfront', 'Mountain & Ski', 'Country & Nature', 'Arctic & Winter', 'Desert Retreat', 'Historic & Coast', 'Wellness & Spa', 'Alpine'][index % 9], 
        minPrice
      };
    }) || [];

    const mergedHotels = [...matchingCurated, ...hotels];

    if (mergedHotels.length === 0) {
      return { data: getAllCurated() };
    }

    return { data: mergedHotels };
  } catch (e) {
    console.error('SDK Search Failed, returning curated collection:', e);
    return { data: matchingCurated.length > 0 ? matchingCurated : getAllCurated() };
  }
}

function getAllCurated() {
  return COLLECTION_2026.map(item => ({
    id: item.id,
    name: item.name,
    city: item.location.split(',')[0],
    address: item.location,
    star_rating: 5,
    photo: item.image,
    vibe: item.vibe || 'Quiet Luxury',
    minPrice: item.price
  }));
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

  const { checkin, checkout } = adjustDates(checkInDate, checkOutDate);
  const mappedOccupancies = mapOccupancies(occupancies);

  try {
    const result = await Promise.race([
      liteApi.getFullRates({
        hotelIds: [hotelId],
        checkin,
        checkout,
        guestNationality: 'US',
        currency: 'USD',
        occupancies: mappedOccupancies
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('LiteAPI rates request timed out')), 6000))
    ]) as any;

    if (result.status !== 'success' || !result.data) {
      console.warn('[API] getHotelRates failed:', result.error || result.errors);
      return { data: [] };
    }

    const hotel = result.data?.data?.[0];
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
    return { data: [] };
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
  try {
    const result = await (liteApi as any).preBook({ offerId: rateId }) as any;
    if (result.status !== 'success' || !result.data) {
      throw new Error(result.error || 'Failed to prebook rate via SDK');
    }
    return result.data;
  } catch (e) {
    console.warn('SDK Prebook Failed, falling back to manual fetch:', e);
    const body = { offerId: rateId };
    const response = await fetch(`${LITEAPI_BOOK_URL}/rates/prebook`, {
      method: 'POST',
      headers: getHeaders(body),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Failed to prebook rate');
    const result = await response.json();
    return result.data;
  }
}

export async function createPaymentIntent(prebookId: string, type: 'hotel' | 'flight' = 'hotel') {
  const endpoint = type === 'hotel' ? '/payments/intent' : '/flights/payments/intent';
  const body = { prebookId };
  const response = await fetch(`${LITEAPI_BOOK_URL}${endpoint}`, {
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
  // Support both camelCase and snake_case flat parameters AND nested guestDetails object for schema flexibility
  const body = {
    prebookId,
    prebook_id: prebookId,
    guest_name: guestDetails.name,
    guestName: guestDetails.name,
    guest_email: guestDetails.email,
    guestEmail: guestDetails.email,
    guest_phone: guestDetails.phone,
    guestPhone: guestDetails.phone,
    payment_intent_id: paymentIntentId,
    paymentIntentId,
    guestDetails: {
      firstName: guestDetails.name.split(' ')[0] || '',
      lastName: guestDetails.name.split(' ').slice(1).join(' ') || guestDetails.name,
      email: guestDetails.email,
      phone: guestDetails.phone
    }
  };
  const response = await fetch(`${LITEAPI_BOOK_URL}/rates/book`, {
    method: 'POST',
    headers: getHeaders(body),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to complete booking');
  const result = await response.json();
  return result.data;
}
export async function listBookings() {
  const response = await fetch(`${LITEAPI_BOOK_URL}/bookings`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to list bookings');
  const result = await response.json();
  return result.data || [];
}

export async function getBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BOOK_URL}/bookings/${bookingId}`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to get booking');
  const result = await response.json();
  return result.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BOOK_URL}/bookings/${bookingId}`, {
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
  const response = await fetch(`${LITEAPI_BOOK_URL}/bookings/${bookingId}/amend`, {
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
  const { checkin, checkout } = adjustDates(undefined, undefined);
  try {
    const result = await Promise.race([
      (liteApi as any).getMinRates({
        hotelIds,
        checkin,
        checkout,
        guestNationality: 'US',
        currency: 'USD',
        occupancies: [{ rooms: 1, adults: 2, children: [] }]
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('LiteAPI min-rates request timed out')), 5000))
    ]) as any;

    if (result.status !== 'success' || !result.data || !Array.isArray(result.data.data)) {
      console.warn('[API] getMinRates failed or returned unexpected format, falling back to full rates');
      return await getMinRatesFallback(hotelIds, checkin, checkout);
    }

    return result.data.data.map((h: any) => ({
      hotelId: h.hotelId,
      minRate: h.price || null
    }));
  } catch (err) {
    console.error('[API] getMinRates error:', err);
    try {
      return await getMinRatesFallback(hotelIds, checkin, checkout);
    } catch (fallbackErr) {
      console.error('[API] getMinRates fallback failed:', fallbackErr);
      return hotelIds.map(id => ({ hotelId: id, minRate: null }));
    }
  }
}

async function getMinRatesFallback(hotelIds: string[], checkin: string, checkout: string) {
  const result = await liteApi.getFullRates({
    hotelIds,
    checkin,
    checkout,
    guestNationality: 'US',
    currency: 'USD',
    occupancies: [{ rooms: 1, adults: 2, children: [] }]
  }) as any;

  if (result.status !== 'success' || !result.data || !Array.isArray(result.data.data)) {
    return hotelIds.map(id => ({ hotelId: id, minRate: null }));
  }

  const ratesMap = new Map();
  for (const item of result.data.data) {
    const minPrice = item.roomTypes?.[0]?.rates?.[0]?.net_rate || null;
    ratesMap.set(item.hotelId, minPrice);
  }

  return hotelIds.map(id => ({
    hotelId: id,
    minRate: ratesMap.get(id) || null
  }));
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
  const legs = [
    {
      origin: params.origin,
      destination: params.destination,
      date: params.departureDate
    }
  ];

  if (params.returnDate) {
    legs.push({
      origin: params.destination,
      destination: params.origin,
      date: params.returnDate
    });
  }

  const body = {
    legs,
    adults: params.adults || 1,
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
  
  const resultObj = result.data?.['0'] || result.data;
  const mappedFlights: any[] = [];

  if (resultObj && Array.isArray(resultObj.journeys)) {
    for (const journey of resultObj.journeys) {
      if (!journey.offers || journey.offers.length === 0 || !journey.segments || journey.segments.length === 0) {
        continue;
      }

      const firstSegment = journey.segments[0];
      const lastSegment = journey.segments[journey.segments.length - 1];

      const totalMinutes = journey.totalDuration?.minutes || 0;
      const durationStr = totalMinutes 
        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` 
        : '';

      for (const offer of journey.offers) {
        const rawPrice = offer.pricing?.display?.total || 0;
        const price = Math.ceil(rawPrice * LUXURY_MARGIN);

        mappedFlights.push({
          id: offer.offerId,
          airline: firstSegment.carrier?.marketingName || firstSegment.carrier?.marketingCode || 'Unknown Airline',
          departureTime: firstSegment.departureTime?.replace('T', ' ').substring(0, 16) || '',
          arrivalTime: lastSegment.arrivalTime?.replace('T', ' ').substring(0, 16) || '',
          origin: firstSegment.originCode || '',
          destination: lastSegment.destinationCode || '',
          duration: durationStr || 'Direct',
          cabinClass: offer.fare?.family || params.cabinClass || 'ECONOMY',
          price: price
        });
      }
    }
  }

  return mappedFlights;
}

export async function prebookFlight(flightOfferId: string) {
  const body = { flightOfferId };
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/prebook`, {
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
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/book`, {
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
