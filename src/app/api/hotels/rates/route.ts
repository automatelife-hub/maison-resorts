import { getHotelRates } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const guests = parseInt(searchParams.get('guests') || '2');

    if (!hotelId || !checkInDate || !checkOutDate) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const occupancies = [{ adults: guests }];
    const rates = await getHotelRates(hotelId, checkInDate, checkOutDate, occupancies);
    return Response.json(rates);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}
