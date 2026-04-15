import { prebookFlight } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { flightOfferId } = await request.json();
    if (!flightOfferId) {
      return Response.json({ error: 'Flight Offer ID is required' }, { status: 400 });
    }

    const prebookData = await prebookFlight(flightOfferId);
    return Response.json(prebookData);
  } catch (error) {
    console.error('Flight prebook error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to prebook flight' },
      { status: 500 }
    );
  }
}
