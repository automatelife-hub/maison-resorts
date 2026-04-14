import { searchHotels } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { destination, checkInDate, checkOutDate, guests, placeId } = await request.json();

    if (!destination && !placeId) {
      return Response.json({ error: 'Destination or Place ID is required' }, { status: 400 });
    }

    if (!checkInDate || !checkOutDate) {
      return Response.json({ error: 'Check-in and check-out dates are required' }, { status: 400 });
    }

    // Search for hotels using unified v3.0 search
    const searchResults = await searchHotels(destination, checkInDate, checkOutDate, guests, placeId);

    return Response.json({ hotels: searchResults.data || [] });
  } catch (error) {
    console.error('Hotel search error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to search hotels' },
      { status: 500 }
    );
  }
}
