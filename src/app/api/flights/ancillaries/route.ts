import { getFlightAncillaries } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightOfferId = searchParams.get('flightOfferId');

    if (!flightOfferId) {
      return Response.json({ error: 'Flight Offer ID is required' }, { status: 400 });
    }

    const ancillaries = await getFlightAncillaries(flightOfferId);
    return Response.json(ancillaries);
  } catch (error) {
    console.error('Flight ancillaries error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch flight ancillaries' },
      { status: 500 }
    );
  }
}
