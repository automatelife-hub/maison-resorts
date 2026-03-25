import { getVouchers } from '@/lib/api';

export async function GET() {
  try {
    const vouchers = await getVouchers();
    return Response.json(vouchers);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}
