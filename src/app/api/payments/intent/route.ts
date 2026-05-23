import { createPaymentIntent } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { prebookId, type } = await request.json();
    if (!prebookId) {
      return Response.json({ error: 'Prebook ID is required' }, { status: 400 });
    }

    // Curated hotels bypass Stripe — signal checkout to skip payment element
    if (prebookId.startsWith('curated-prebook-')) {
      return Response.json({ clientSecret: null, curated: true });
    }

    const intent = await createPaymentIntent(prebookId, type);
    return Response.json(intent);
  } catch (error) {
    console.error('Payment intent error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
