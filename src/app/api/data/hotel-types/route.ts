import { getHotelTypes } from '@/lib/api';

export async function GET() {
  try {
    const hotelTypes = await getHotelTypes();
    return Response.json(hotelTypes);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch hotel types' }, { status: 500 });
  }
}
