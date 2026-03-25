import { getHotelDetails } from '@/lib/api';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const hotel = await getHotelDetails(id);

    return Response.json({
      id: hotel.data?.id,
      name: hotel.data?.name,
      city: hotel.data?.city,
      star_rating: hotel.data?.star_rating || 4,
      photo: hotel.data?.photo || '',
      description: hotel.data?.description || 'Premium hotel offering world-class amenities and service',
      amenities: hotel.data?.amenities || [],
      address: hotel.data?.address || '',
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
}
