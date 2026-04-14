import { searchPlaces } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return Response.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const places = await searchPlaces(query);
    return Response.json(places);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
