import { getBooking, cancelBooking, amendBooking } from '@/lib/api';

export async function GET(request: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await params;
    const booking = await getBooking(bookingId);
    return Response.json(booking);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await params;
    const body = await request.json();

    if (body.status === 'cancelled') {
      const result = await cancelBooking(bookingId);
      return Response.json(result);
    }

    return Response.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}
