import { getLoyaltyInfo } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
      return Response.json({ error: 'guestId is required' }, { status: 400 });
    }

    const loyaltyData = await getLoyaltyInfo(guestId);
    return Response.json(loyaltyData);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch loyalty info' },
      { status: 500 }
    );
  }
}
