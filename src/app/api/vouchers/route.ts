import { NextResponse } from 'next/server';
import { getVouchers } from '@/lib/api';

export async function GET() {
  try {
    const data = await getVouchers();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Vouchers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}
