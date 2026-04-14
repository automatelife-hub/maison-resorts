import { searchFlights } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const params = await request.json();
    
    if (!params.origin || !params.destination || !params.departureDate) {
      return Response.json({ error: 'Origin, destination, and departure date are required' }, { status: 400 });
    }

    const flightOffers = await searchFlights(params);
    return Response.json({ flights: flightOffers });
  } catch (error) {
    console.error('Flight search error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to search flights' },
      { status: 500 }
    );
  }
}
