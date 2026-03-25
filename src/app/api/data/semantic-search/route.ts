import { semanticSearch } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vibe = searchParams.get('vibe');
  const destination = searchParams.get('destination');

  if (!vibe || !destination) {
    return Response.json({ error: 'Vibe and destination required' }, { status: 400 });
  }

  try {
    const results = await semanticSearch(vibe, destination);
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: 'Failed to perform semantic search' }, { status: 500 });
  }
}
