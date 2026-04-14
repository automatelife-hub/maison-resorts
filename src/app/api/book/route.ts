import { book } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { prebookId, guestDetails } = await request.json();
    
    if (!prebookId || !guestDetails) {
      return Response.json({ error: 'prebookId and guestDetails are required' }, { status: 400 });
    }

    const bookingResult = await book(prebookId, guestDetails);
    return Response.json(bookingResult);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to complete booking' },
      { status: 500 }
    );
  }
}
