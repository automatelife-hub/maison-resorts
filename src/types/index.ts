// Hotel Data Types
export interface HotelData {
  id: string;
  name: string;
  city: string;
  address: string;
  star_rating: number;
  photo: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

// Rate Types
export interface Rate {
  rate_id: string;
  rate_name: string;
  net_rate: number;
  selling_rate: number;
  currency: string;
  board_type: string;
  rate_type?: string;
}

// Room Types
export interface RoomType {
  room_id: string;
  room_name: string;
  room_occupancy: number;
  rates: Rate[];
}

// Review Types
export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  date: string;
  sentiment?: SentimentData;
}

export interface SentimentData {
  categories?: {
    cleanliness?: number;
    service?: number;
    location?: number;
    room_quality?: number;
    value?: number;
    [key: string]: number | undefined;
  };
}

// Booking Types
export interface BookingData {
  id: string;
  hotel_id: string;
  hotel_name: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  guest_name: string;
  guest_email: string;
  created_at: string;
  cancelled_at?: string;
}

// Prebook Data
export interface PrebookData {
  id: string;
  hotel_id: string;
  rate_id: string;
  check_in_date: string;
  check_out_date: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  number_of_guests: number;
  currency: string;
  net_rate: number;
  selling_rate: number;
  board_type: string;
}

// Currency Types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  category?: string;
}

// Loyalty Types
export interface LoyaltyAccount {
  guest_id: string;
  points_balance: number;
  tier: 'silver' | 'gold' | 'platinum';
  vouchers: LoyaltyVoucher[];
}

export interface LoyaltyVoucher {
  id: string;
  code: string;
  discount_amount: number;
  currency: string;
  expiry_date: string;
  status: 'available' | 'redeemed' | 'expired';
}

// Country/City Types
export interface Country {
  code: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  country_code: string;
}

export interface RoomOccupancy {
  adults: number;
  childrenAges?: number[];
}

// Search Types
export interface SearchParams {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  occupancies: RoomOccupancy[];
  guests?: number; // legacy support
  currency?: string;
  mode?: 'standard' | 'vibe';
  vibe?: string;
}

export interface SearchFilter {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  amenities?: string[];
  hotelTypes?: string[];
  boardTypes?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'name';
}

// Flight Types
export interface FlightOffer {
  id: string;
  airline: string;
  airlineLogo?: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  duration: string;
  price: number;
  currency: string;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  segments: FlightSegment[];
}

export interface FlightSegment {
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  airline: string;
  flightNumber: string;
}

export interface Passenger {
  title: 'Mr' | 'Ms' | 'Mrs' | 'Miss';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  nationality: string;
  passportNumber: string;
  passportExpiry?: string;
}

export interface FlightBookingData {
  id: string;
  flightOfferId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  passengers: Passenger[];
  totalAmount: number;
  currency: string;
  createdAt: string;
}

// Flight Ancillary Types
export interface FlightAncillaries {
  baggage: BaggageOption[];
  seats: SeatMap[];
}

export interface BaggageOption {
  id: string;
  type: 'CHECKED' | 'CARRY_ON';
  weight: number;
  unit: 'KG' | 'LB';
  price: number;
  currency: string;
}

export interface SeatMap {
  segmentId: string;
  rows: SeatRow[];
}

export interface SeatRow {
  number: number;
  seats: Seat[];
}

export interface Seat {
  number: string;
  type: 'WINDOW' | 'AISLE' | 'MIDDLE';
  isAvailable: boolean;
  price: number;
  currency: string;
}
