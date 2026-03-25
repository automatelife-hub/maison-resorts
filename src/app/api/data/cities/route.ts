import { getCities } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('countryCode');

  if (!countryCode) {
    return Response.json({ error: 'Country code required' }, { status: 400 });
  }

  try {
    const cities = await getCities(countryCode);
    return Response.json(cities);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
