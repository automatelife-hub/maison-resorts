import { getFacilities } from '@/lib/api';

export async function GET() {
  try {
    const facilities = await getFacilities();
    return Response.json(facilities);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch facilities' }, { status: 500 });
  }
}
