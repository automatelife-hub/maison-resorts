import { getHotelDetails } from '@/lib/api';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await getHotelDetails(id);
    const hotel = result.data;

    if (!hotel) {
       return Response.json({ error: 'Sanctuary not found' }, { status: 404 });
    }

    return Response.json({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      star_rating: hotel.star_rating || 4,
      photo: hotel.photo || '',
      description: hotel.description || 'Premium hotel offering world-class amenities and service',
      amenities: hotel.amenities || [],
      address: hotel.address || '',
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
}
