import { NextRequest, NextResponse } from 'next/server';
import { TOP_DEALS } from '@/data/collection';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(TOP_DEALS);
  } catch (error) {
    console.error('Top Deals API error:', error);
    return NextResponse.json({ error: 'Failed to fetch top deals' }, { status: 500 });
  }
}
