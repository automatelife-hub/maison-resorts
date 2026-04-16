import { NextRequest, NextResponse } from 'next/server';
import { getLoyaltyInfo } from '@/lib/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get('guestId');

  if (!guestId) {
    return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
  }

  try {
    const data = await getLoyaltyInfo(guestId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Loyalty API error:', error);
    return NextResponse.json({ error: 'Failed to fetch loyalty info' }, { status: 500 });
  }
}
