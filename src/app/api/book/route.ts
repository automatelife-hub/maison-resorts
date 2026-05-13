import { book } from '@/lib/api';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { prebookId, guestDetails, hotelName, checkin, checkout, sellingRate, currency, paymentIntentId } = await request.json();
    
    if (!prebookId || !guestDetails) {
      return Response.json({ error: 'prebookId and guestDetails are required' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    let uid = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        uid = decodedToken.uid;
      } catch (authErr) {
        console.error('Failed to verify ID token:', authErr);
        // If token is invalid, we proceed as unauthenticated but don't save to Firestore
      }
    }

    const bookingResult = await book(prebookId, guestDetails, paymentIntentId);

    // Save to Firestore if user is authenticated
    if (uid) {
      try {
        const bookingId = bookingResult.bookingId || `CONF-${Date.now()}`;
        
        await adminDb.doc(`users/${uid}/bookings/${bookingId}`).set({
          bookingId,
          type: 'hotel',
          hotelName: hotelName || 'Maison Retreat',
          check_in_date: checkin || '',
          check_out_date: checkout || '',
          guest_name: guestDetails.name,
          guest_email: guestDetails.email,
          total_amount: sellingRate || 0,
          currency: currency || 'USD',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        });
      } catch (firestoreErr) {
        console.error('Failed to save booking to Firestore:', firestoreErr);
        // We still return the successful booking result even if Firestore fails
      }
    }

    return Response.json(bookingResult);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to complete booking' },
      { status: 500 }
    );
  }
}
