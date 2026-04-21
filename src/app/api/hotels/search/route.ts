import { searchHotels } from '@/lib/api';
import { COLLECTION_2026 } from '@/data/collection';

export async function POST(request: Request) {
  try {
    const { destination, checkInDate, checkOutDate, guests, occupancies, placeId } = await request.json();

    console.log(`[SEARCH] Initiating search for: ${destination || placeId}`);

    // Handle both legacy guests and new occupancies format
    const searchOccupancies = occupancies || [{ adults: guests || 1 }];

    try {
      // Search for hotels using unified v3.0 search
      const searchResults = await searchHotels(destination || 'Europe', checkInDate || '2026-06-01', checkOutDate || '2026-06-05', searchOccupancies, placeId);
      
      console.log(`[SEARCH] Success. Found ${searchResults.data.length} total hotels (including curated).`);
      return Response.json({ hotels: searchResults.data || [] });
    } catch (apiError) {
      console.error('[SEARCH] LiteAPI Fetch Failed, falling back to curated collection only:', apiError);
      
      // FALLBACK: Return only curated collection if API is down or Key is missing
      const fallback = COLLECTION_2026.map(item => ({
        id: item.id,
        name: item.name,
        city: item.location.split(',')[0],
        address: item.location,
        star_rating: 5,
        photo: item.image,
        vibe: item.vibe,
        minPrice: item.price
      }));

      return Response.json({ hotels: fallback, note: 'Showing curated collection only' });
    }
  } catch (error) {
    console.error('[SEARCH] Critical Route Error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to search hotels' },
      { status: 500 }
    );
  }
}
