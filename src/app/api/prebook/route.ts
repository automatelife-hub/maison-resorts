import { prebook } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { rateId } = await request.json();
    if (!rateId) {
      return Response.json({ error: 'rateId is required' }, { status: 400 });
    }

    const prebookData = await prebook(rateId);
    return Response.json(prebookData);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to prebook' },
      { status: 500 }
    );
  }
}
