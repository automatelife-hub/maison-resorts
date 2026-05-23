import { prebook } from '@/lib/api';
import { COLLECTION_2026 } from '@/data/collection';

export async function POST(request: Request) {
  try {
    const { rateId } = await request.json();
    if (!rateId) {
      return Response.json({ error: 'rateId is required' }, { status: 400 });
    }

    // Curated collection hotels have synthetic rate IDs — handle locally
    if (rateId.startsWith('rate-')) {
      const hotelId = rateId.replace('rate-', '');
      const curated = COLLECTION_2026.find(h => h.id === hotelId);
      if (curated) {
        const checkin = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
        const checkout = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
        return Response.json({
          prebookId: `curated-prebook-${hotelId}-${Date.now()}`,
          hotelId,
          hotelName: curated.name,
          checkin,
          checkout,
          roomType: 'Maison Sanctuary Suite',
          boardBasis: 'Ultra All Inclusive',
          selling_rate: curated.price,
          net_rate: curated.price,
          currency: 'USD',
          address: curated.location,
          cancellationPolicies: [],
        });
      }
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
