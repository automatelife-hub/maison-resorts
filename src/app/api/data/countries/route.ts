import { getCountries } from '@/lib/api';

export async function GET() {
  try {
    const countries = await getCountries();
    return Response.json(countries);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
