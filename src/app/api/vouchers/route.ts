import { getVouchers, getGuestVouchers } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    let vouchers;
    if (guestId) {
      vouchers = await getGuestVouchers(guestId);
    } else {
      vouchers = await getVouchers();
    }
    
    return Response.json(vouchers);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}
