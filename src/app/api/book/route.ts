import { book } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { prebookId, guestDetails, uid, hotelName, checkin, checkout, sellingRate, currency } = await request.json();
    
    if (!prebookId || !guestDetails) {
      return Response.json({ error: 'prebookId and guestDetails are required' }, { status: 400 });
    }

    const bookingResult = await book(prebookId, guestDetails);

    // Save to Firestore if user is authenticated
    if (uid) {
      try {
        const { getFirebaseFirestore } = await import('@/lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        const db = await getFirebaseFirestore();
        
        const bookingId = bookingResult.bookingId || `CONF-${Date.now()}`;
        
        await setDoc(doc(db, `users/${uid}/bookings`, bookingId), {
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
