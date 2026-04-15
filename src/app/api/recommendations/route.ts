import { getSmartRecommendations } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { context } = await request.json();
    const recommendations = await getSmartRecommendations(context);
    return Response.json(recommendations);
  } catch (error) {
    console.error('Recommendations error:', error);
    return Response.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
