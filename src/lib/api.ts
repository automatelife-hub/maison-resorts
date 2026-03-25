import type { HotelData, Rate, Review, Currency, Facility, SearchParams, SearchFilter } from '@/types';

const LITEAPI_KEY = process.env.LITEAPI_KEY || '';
const LITEAPI_BASE_URL = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v1';
const LITEAPI_VOUCHERS_BASE_URL = process.env.LITEAPI_VOUCHERS_BASE_URL || 'https://da.liteapi.travel';

const headers = {
  'X-API-Key': LITEAPI_KEY,
  'Content-Type': 'application/json',
};

// Hotel Search & Details
export async function searchHotels(destination: string, checkInDate: string, checkOutDate: string, guests: number) {
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/search?q=${destination}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guestNationality=US&currency=USD`, {
    headers,
  });
  if (!response.ok) throw new Error('Failed to search hotels');
  return response.json();
}

export async function getHotelDetails(hotelId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/${hotelId}`, { headers });
  if (!response.ok) throw new Error('Failed to get hotel details');
  return response.json();
}

export async function getHotelRates(hotelId: string, checkInDate: string, checkOutDate: string, guests: number) {
  const response = await fetch(`${LITEAPI_BASE_URL}/rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ hotelId, checkInDate, checkOutDate, guestNationality: 'US', currency: 'USD' }),
  });
  if (!response.ok) throw new Error('Failed to get hotel rates');
  return response.json();
}

// Reviews & Sentiment
export async function getReviews(hotelId: string, getSentiment: boolean = false) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/reviews?hotelId=${hotelId}&getSentiment=${getSentiment}`, { headers });
  if (!response.ok) throw new Error('Failed to get reviews');
  return response.json();
}

// Currency
export async function getCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/currencies`, { headers });
  if (!response.ok) throw new Error('Failed to get currencies');
  return response.json();
}

// Facilities & Hotel Types
export async function getFacilities(): Promise<Facility[]> {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/facilities`, { headers });
  if (!response.ok) throw new Error('Failed to get facilities');
  return response.json();
}

export async function getHotelTypes() {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/hotelTypes`, { headers });
  if (!response.ok) throw new Error('Failed to get hotel types');
  return response.json();
}

// Semantic Search
export async function semanticSearch(vibe: string, destination: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/hotels/semantic-search?vibe=${vibe}&destination=${destination}`, { headers });
  if (!response.ok) throw new Error('Failed to perform semantic search');
  return response.json();
}

// Bookings
export async function listBookings() {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings`, { headers });
  if (!response.ok) throw new Error('Failed to list bookings');
  return response.json();
}

export async function getBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}`, { headers });
  if (!response.ok) throw new Error('Failed to get booking');
  return response.json();
}

export async function cancelBooking(bookingId: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status: 'cancelled' }),
  });
  if (!response.ok) throw new Error('Failed to cancel booking');
  return response.json();
}

export async function amendBooking(bookingId: string, guestName: string, guestEmail: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/bookings/${bookingId}/amend`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ guest_name: guestName, guest_email: guestEmail }),
  });
  if (!response.ok) throw new Error('Failed to amend booking');
  return response.json();
}

// Explore/Discovery
export async function getCountries() {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/countries`, { headers });
  if (!response.ok) throw new Error('Failed to get countries');
  return response.json();
}

export async function getCities(countryCode: string) {
  const response = await fetch(`${LITEAPI_BASE_URL}/data/cities?countryCode=${countryCode}`, { headers });
  if (!response.ok) throw new Error('Failed to get cities');
  return response.json();
}

export async function getMinRates(hotelIds: string[]) {
  const response = await fetch(`${LITEAPI_BASE_URL}/hotels/min-rates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ hotelIds }),
  });
  if (!response.ok) throw new Error('Failed to get min rates');
  return response.json();
}

// Vouchers
export async function getVouchers() {
  const response = await fetch(`${LITEAPI_VOUCHERS_BASE_URL}/vouchers`, { headers });
  if (!response.ok) throw new Error('Failed to get vouchers');
  return response.json();
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
  return response.json();
}

export async function redeemLoyaltyPoints(guestId: string, points: number) {
  const response = await fetch(`${LITEAPI_BASE_URL}/guests/${guestId}/loyalty-points/redeem`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ points }),
  });
  if (!response.ok) throw new Error('Failed to redeem points');
  return response.json();
}
