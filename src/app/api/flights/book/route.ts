import { bookFlight } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { prebookId, passengers } = await request.json();
    if (!prebookId || !passengers) {
      return Response.json({ error: 'Prebook ID and passengers are required' }, { status: 400 });
    }

    const booking = await bookFlight(prebookId, passengers);
    return Response.json(booking);
  } catch (error) {
    console.error('Flight booking error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to book flight' },
      { status: 500 }
    );
  }
}
