import { getLoyaltyInfo } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get('guestId');

  if (!guestId) {
    return Response.json({ error: 'Guest ID required' }, { status: 400 });
  }

  try {
    const info = await getLoyaltyInfo(guestId);
    return Response.json(info);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch loyalty info' }, { status: 500 });
  }
}
