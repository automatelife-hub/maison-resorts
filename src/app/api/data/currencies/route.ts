import { getCurrencies } from '@/lib/api';

export async function GET() {
  try {
    const currencies = await getCurrencies();
    return Response.json(currencies);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch currencies' }, { status: 500 });
  }
}
