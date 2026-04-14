import type { HotelData, Rate, Review, Currency, Facility, SearchParams, SearchFilter, Country, City } from '@/types';

const LITEAPI_KEY = process.env.LITEAPI_KEY || '';
const LITEAPI_BASE_URL = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0';
const LITEAPI_VOUCHERS_BASE_URL = process.env.LITEAPI_VOUCHERS_BASE_URL || 'https://da.liteapi.travel';

const headers = {
  'X-API-Key': LITEAPI_KEY,
  'Content-Type': 'application/json',
};

// Hotel Search & Details
export async function searchHotels(
  destination: string, 
  checkInDate: string, 
  checkOutDate: string, 
  guests: number,
  placeId?: string
) {
  const body: any = {
    checkin: checkInDate,
    checkout: checkOutDate,
    currency: 'USD',
    guestNationality: 'US',
    occupancies: [{ adults: guests }],
    includeHotelData: true
  };

  if (placeId) {
    body.placeId = placeId;
  } else {
    body.aiSearch = destination;
  }

  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to search hotels');
  const result = await response.json();
  
  // Map v3.0 response to expected frontend structure
  return {
    data: result.hotels?.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      star_rating: hotel.starRating,
      photo: hotel.main_photo || hotel.thumbnail || '',
      minPrice: hotel.roomTypes?.[0]?.rates?.[0]?.net_rate || null
    })) || []
  };
}

export async function getHotelDetails(hotelId: string): Promise<{ data: HotelData }> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/hotels?hotelIds=${hotelId}`, { headers });
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

export async function getHotelRates(hotelId: string, checkInDate: string, checkOutDate: string, guests: number) {
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      hotelIds: [hotelId],
      checkin: checkInDate,
      checkout: checkOutDate,
      guestNationality: 'US',
      currency: 'USD',
      occupancies: [{ adults: guests }]
    }),
  });
  if (!response.ok) throw new Error('Failed to get hotel rates');
  const result = await response.json();
  
  // Map v3.0 response to expected structure
  const hotel = result.hotels?.[0];
  return {
    data: hotel?.roomTypes?.map((room: any) => ({
      room_id: room.roomTypeId,
      room_name: room.roomType,
      rates: room.rates?.map((rate: any) => ({
        rate_id: rate.rateId,
        net_rate: rate.net_rate,
        selling_rate: rate.net_rate, // v3.0 might not have selling_rate directly
        currency: 'USD',
        board_type: rate.mealPlan || 'Room Only'
      }))
    })) || []
  };
}

// Reviews & Sentiment
export async function getReviews(hotelId: string, getSentiment: boolean = false) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/reviews?hotelId=${hotelId}&getSentiment=${getSentiment}`, { headers });
  if (!response.ok) throw new Error('Failed to get reviews');
  const result = await response.json();
  return result.data || [];
}

// Currency
export async function getCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/currencies`, { headers });
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
  const response = await fetch(`${LITEAPI_BASE_URL}/data/facilities`, { headers });
  if (!response.ok) throw new Error('Failed to get facilities');
  const result = await response.json();
  return result.data?.map((f: any) => ({
    id: f.facility_id.toString(),
    name: f.facility,
    category: ''
  })) || [];
}

export async function getHotelTypes() {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/hotelTypes`, { headers });
  if (!response.ok) throw new Error('Failed to get hotel types');
  const result = await response.json();
  return result.data || [];
}

// Semantic Search
export async function semanticSearch(vibe: string, destination: string) {
  // v3.0 might use aiSearch in /hotels/rates for this
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      aiSearch: `${vibe} hotels in ${destination}`,
      checkin: new Date().toISOString().split('T')[0], // dummy dates for search
      checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      currency: 'USD',
      guestNationality: 'US',
      occupancies: [{ adults: 2 }],
      includeHotelData: true
    }),
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
  const response = await fetch(`${LITEAPI_BASE_URL}/rates/prebook`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ rateId }),
  });
  if (!response.ok) throw new Error('Failed to prebook rate');
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
  paymentInfo?: any
) {
  const response = await fetch(`${LITEAPI_BASE_URL}/rates/book`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prebookId,
      guest_name: guestDetails.name,
      guest_email: guestDetails.email,
      guest_phone: guestDetails.phone,
      // payment info would go here in production
    }),
  });
  if (!response.ok) throw new Error('Failed to complete booking');
  const result = await response.json();
  return result.data;
}

export async function listBookings() {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings`, { headers });
  if (!response.ok) throw new Error('Failed to list bookings');
  const result = await response.json();
  return result.data || [];
}

export async function getBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}`, { headers });
  if (!response.ok) throw new Error('Failed to get booking');
  const result = await response.json();
  return result.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status: 'cancelled' }),
  });
  if (!response.ok) throw new Error('Failed to cancel booking');
  const result = await response.json();
  return result.data;
}

export async function amendBooking(bookingId: string, guestName: string, guestEmail: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}/amend`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ guest_name: guestName, guest_email: guestEmail }),
  });
  if (!response.ok) throw new Error('Failed to amend booking');
  const result = await response.json();
  return result.data;
}

// Places & Search
export async function searchPlaces(query: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/places?textQuery=${encodeURIComponent(query)}`, { headers });
  if (!response.ok) throw new Error('Failed to search places');
  const result = await response.json();
  return result.data || [];
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/places/${placeId}`, { headers });
  if (!response.ok) throw new Error('Failed to get place details');
  const result = await response.json();
  return result.data;
}

// Explore/Discovery
export async function getCountries(): Promise<Country[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/countries`, { headers });
  if (!response.ok) throw new Error('Failed to get countries');
  const result = await response.json();
  return result.data || [];
}

export async function getCities(countryCode: string): Promise<City[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/cities?countryCode=${countryCode}`, { headers });
  if (!response.ok) throw new Error('Failed to get cities');
  const result = await response.json();
  return result.data?.map((c: any) => ({
    id: c.city,
    name: c.city,
    country_code: countryCode
  })) || [];
}

export async function getMinRates(hotelIds: string[]) {
  // v3.0 doesn't have a direct /hotels/min-rates, use /hotels/rates
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      hotelIds,
      checkin: new Date().toISOString().split('T')[0],
      checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guestNationality: 'US',
      currency: 'USD',
      occupancies: [{ adults: 2 }]
    }),
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
  const response = await fetch(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers`, { headers });
  if (!response.ok) throw new Error('Failed to get vouchers');
  return response.json();
}

export async function getGuestVouchers(guestId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/vouchers`, { headers });
  if (!response.ok) throw new Error('Failed to get guest vouchers');
  const result = await response.json();
  return result.data;
}

export async function applyVoucher(voucherCode: string) {
  const response = await fetch(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers/${voucherCode}`, { headers });
  if (!response.ok) throw new Error('Failed to apply voucher');
  return response.json();
}

// Loyalty
export async function getLoyaltyInfo(guestId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points`, { headers });
  if (!response.ok) throw new Error('Failed to get loyalty info');
  const result = await response.json();
  return result.data;
}

export async function redeemLoyaltyPoints(guestId: string, points: number) {
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points/redeem`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ points }),
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
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...params,
      cabinClass: params.cabinClass || 'ECONOMY',
      currency: params.currency || 'USD'
    }),
  });
  if (!response.ok) throw new Error('Failed to search flights');
  const result = await response.json();
  return result.data || [];
}

export async function prebookFlight(flightOfferId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/flights/prebooks`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ flightOfferId }),
  });
  if (!response.ok) throw new Error('Failed to prebook flight');
  const result = await response.json();
  return result.data;
}
