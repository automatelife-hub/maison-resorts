declare module 'liteapi-node-sdk' {
  interface Occupancy {
    rooms: number;
    adults: number;
    children: number[];
  }

  interface FullRatesParams {
    checkin: string;
    checkout: string;
    currency: string;
    guestNationality: string;
    occupancies: Occupancy[];
    includeHotelData?: boolean;
    placeId?: string;
    aiSearch?: string;
    hotelIds?: string[];
  }

  interface Rate {
    rateId: string;
    net_rate: number;
    mealPlan?: string;
  }

  interface RoomType {
    roomTypeId: string;
    roomType: string;
    rates: Rate[];
  }

  interface Hotel {
    id: string;
    name: string;
    city: string;
    address: string;
    starRating: number;
    main_photo?: string;
    thumbnail?: string;
    roomTypes: RoomType[];
  }

  interface FullRatesResult {
    hotels: Hotel[];
  }

  interface LiteApi {
    getFullRates(params: FullRatesParams): Promise<FullRatesResult>;
  }

  function liteApiSdk(apiKey: string): LiteApi;

  export default liteApiSdk;
}
