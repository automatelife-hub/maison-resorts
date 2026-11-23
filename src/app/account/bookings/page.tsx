'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/Badge';
import { PriceDisplay } from '@/components/PriceDisplay';

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { getFirebaseFirestore } = await import('@/lib/firebase');
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
        const db = await getFirebaseFirestore();
        
        const bookingsRef = collection(db, `users/${user.uid}/bookings`);
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedBookings: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBookings.push({ id: doc.id, ...doc.data() });
        });
        
        setBookings(fetchedBookings);
      } catch (err) {
        console.error('Failed to fetch bookings from Firestore', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 rounded bg-gray-100" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your booking history." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-800">
      <div>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 block">Account Dashboard</span>
        <h1 className="text-3xl font-serif text-gray-900 font-normal">Your Bookings</h1>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-36 md:h-auto overflow-hidden rounded bg-gray-50 flex items-center justify-center shrink-0">
                {booking.type === 'flight' ? (
                  <div className="text-3xl opacity-20">✈️</div>
                ) : (
                  <img 
                    src={booking.hotelPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
                    className="w-full h-full object-cover"
                    alt={booking.hotelName || 'Property'}
                  />
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                    {(booking.status || 'confirmed').toUpperCase()}
                  </Badge>
                </div>
                {booking.type === 'flight' && (
                  <div className="absolute bottom-3 right-3 bg-white/90 border border-gray-200 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider text-gray-700">
                    FLIGHT
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {booking.type === 'flight' 
                        ? `${booking.origin} to ${booking.destination}`
                        : (booking.hotelName || 'Deluxe Room')
                      }
                    </h2>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {booking.type === 'flight'
                        ? booking.airline
                        : `${booking.city || 'Undisclosed'}, ${booking.countryCode || 'Region'}`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Total Paid</p>
                    <PriceDisplay price={booking.total_amount || booking.totalPrice || 0} currency={booking.currency || 'USD'} className="text-base font-semibold text-gray-950" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                      {booking.type === 'flight' ? 'Departure' : 'Check-in'}
                    </p>
                    <p className="text-xs font-semibold text-gray-800">
                      {booking.type === 'flight' ? booking.departureTime : booking.check_in_date || booking.checkin || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                      {booking.type === 'flight' ? 'Arrival' : 'Check-out'}
                    </p>
                    <p className="text-xs font-semibold text-gray-800">
                      {booking.type === 'flight' ? booking.arrivalTime : booking.check_out_date || booking.checkout || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                      {booking.type === 'flight' ? 'Details' : 'Room'}
                    </p>
                    <div className="text-xs text-gray-650 truncate max-w-[150px]">
                      {booking.type === 'flight' ? (
                        <div className="flex flex-col">
                          <span>{booking.cabinClass}</span>
                          {booking.duration && <span className="text-[9px] text-gray-405">{booking.duration}</span>}
                        </div>
                      ) : (
                        booking.roomType || 'Maison Room'
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Reference</p>
                    <p className="text-xs font-mono text-gray-500">{booking.bookingId || booking.id}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors">
                    View Receipt
                  </button>
                  <button className="bg-gray-950 hover:bg-gray-850 text-white px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors">
                    Manage Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 bg-gray-50 rounded border-2 border-dashed border-gray-200 text-center p-8 max-w-xl mx-auto">
          <p className="text-gray-500 mb-6">Your booking history is currently empty.</p>
          <a 
            href="/explore" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
          >
            Find a Property
          </a>
        </div>
      )}
    </div>
  );
}
