import { searchHotels, getHotelRates } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { destination, checkInDate, checkOutDate, guests, currency } = await request.json();

    if (!destination || !checkInDate || !checkOutDate) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Search for hotels by destination
    const searchResults = await searchHotels(destination, checkInDate, checkOutDate, guests);

    if (!searchResults.data || searchResults.data.length === 0) {
      return Response.json({ hotels: [] });
    }

    // Fetch rates for each hotel to get minimum prices
    const hotelsWithRates = await Promise.all(
      searchResults.data.slice(0, 10).map(async (hotel: any) => {
        try {
          const rates = await getHotelRates(hotel.id, checkInDate, checkOutDate, guests);
          const minPrice = rates.data?.[0]?.rates?.[0]?.net_rate || null;
          
          return {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            star_rating: hotel.star_rating || 4,
            photo: hotel.photo || '',
            minPrice,
          };
        } catch (err) {
          return {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            star_rating: hotel.star_rating || 4,
            photo: hotel.photo || '',
            minPrice: null,
          };
        }
      })
    );

    return Response.json({ hotels: hotelsWithRates });
  } catch (error) {
    console.error('Hotel search error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to search hotels' },
      { status: 500 }
    );
  }
}
