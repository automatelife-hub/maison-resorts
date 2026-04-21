import { NextRequest, NextResponse } from 'next/server';
import { getSmartRecommendations } from '@/lib/api';
import { COLLECTION_2026 } from '@/data/collection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context } = body;
    
    // For a high-density prototype, we combine curated mocks with real API potential
    const curated = COLLECTION_2026.map(item => ({
      id: item.id,
      name: item.name,
      city: item.location.split(',')[0],
      main_photo: item.image,
      minPrice: item.price,
      starRating: 5
    }));

    return NextResponse.json(curated);
  } catch (error) {
    console.error('Recommendations API POST error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const curated = COLLECTION_2026.map(item => ({
      id: item.id,
      name: item.name,
      city: item.location.split(',')[0],
      main_photo: item.image,
      minPrice: item.price,
      starRating: 5
    }));

    return NextResponse.json(curated);
  } catch (error) {
    console.error('Recommendations API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
