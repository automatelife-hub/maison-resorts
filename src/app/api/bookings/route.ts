import { listBookings, listFlightBookings } from '@/lib/api';

export async function GET() {
  try {
    const [hotelBookings, flightBookings] = await Promise.all([
      listBookings(),
      listFlightBookings()
    ]);

    const formattedHotels = (hotelBookings || []).map((b: any) => ({
      ...b,
      type: 'hotel'
    }));

    const formattedFlights = (flightBookings || []).map((b: any) => ({
      ...b,
      type: 'flight'
    }));

    return Response.json([...formattedHotels, ...formattedFlights]);
  } catch (error) {
    console.error('Failed to fetch bookings', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
