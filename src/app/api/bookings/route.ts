import { listBookings } from '@/lib/api';

export async function GET() {
  try {
    const bookings = await listBookings();
    return Response.json(bookings);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
