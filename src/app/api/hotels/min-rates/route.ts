import { getMinRates } from '@/lib/api';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.hotelIds || !Array.isArray(body.hotelIds)) {
    return Response.json({ error: 'Hotel IDs required' }, { status: 400 });
  }

  try {
    const rates = await getMinRates(body.hotelIds);
    return Response.json(rates);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch min rates' }, { status: 500 });
  }
}
