import { getReviews } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotelId');
  const getSentiment = searchParams.get('getSentiment') === 'true';

  if (!hotelId) {
    return Response.json({ error: 'Hotel ID required' }, { status: 400 });
  }

  try {
    const reviews = await getReviews(hotelId, getSentiment);
    return Response.json(reviews);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
