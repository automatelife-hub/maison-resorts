import { NextRequest, NextResponse } from 'next/server';
import { getSmartRecommendations } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context } = body;
    const data = await getSmartRecommendations(context);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recommendations API POST error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const context = searchParams.get('context') || undefined;

  try {
    const data = await getSmartRecommendations(context);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recommendations API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
