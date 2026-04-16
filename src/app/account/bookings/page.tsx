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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-12 w-1/3 mb-12" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your Maison voyage history." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Member Dashboard</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">Your <span className="text-accent">Voyages</span></h1>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-8">
              <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
                {booking.type === 'flight' ? (
                  <div className="text-4xl text-accent opacity-20">✈️</div>
                ) : (
                  <img 
                    src={booking.hotelPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
                    className="w-full h-full object-cover"
                    alt={booking.hotelName || 'Sanctuary'}
                  />
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                    {(booking.status || 'confirmed').toUpperCase()}
                  </Badge>
                </div>
                {booking.type === 'flight' && (
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[8px] font-bold tracking-widest text-luxury">
                    VOYAGE
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-luxury mb-1">
                      {booking.type === 'flight' 
                        ? `${booking.origin} to ${booking.destination}`
                        : (booking.hotelName || 'Maison Sanctuary')
                      }
                    </h2>
                    <p className="text-gray-500 text-sm uppercase tracking-widest">
                      {booking.type === 'flight'
                        ? booking.airline
                        : `${booking.city || 'Undisclosed'}, ${booking.countryCode || 'Region'}`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
                    <PriceDisplay price={booking.total_amount || booking.totalPrice || 0} currency={booking.currency || 'USD'} className="text-xl font-bold text-luxury" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-gray-50">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      {booking.type === 'flight' ? 'Departure' : 'Check-in'}
                    </p>
                    <p className="font-bold text-luxury">
                      {booking.type === 'flight' ? booking.departureTime : booking.check_in_date || booking.checkin || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      {booking.type === 'flight' ? 'Arrival' : 'Check-out'}
                    </p>
                    <p className="font-bold text-luxury">
                      {booking.type === 'flight' ? booking.arrivalTime : booking.check_out_date || booking.checkout || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      {booking.type === 'flight' ? 'Details' : 'Room'}
                    </p>
                    <div className="text-sm text-gray-600 truncate">
                      {booking.type === 'flight' ? (
                        <div className="flex flex-col">
                          <span>{booking.cabinClass}</span>
                          {booking.duration && <span className="text-[10px] text-gray-400">{booking.duration} • {booking.stops === 0 ? 'Non-stop' : `${booking.stops} stops`}</span>}
                          {booking.aircraft && <span className="text-[10px] text-gray-400 italic">{booking.aircraft}</span>}
                        </div>
                      ) : (
                        booking.roomType || 'Maison Suite'
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Reference</p>
                    <p className="text-sm font-mono text-gray-600">{booking.bookingId || booking.id}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="text-[10px] uppercase tracking-widest font-bold text-luxury border border-luxury/10 px-6 py-2 rounded-xl hover:bg-gray-50 transition-all">
                    View Receipt
                  </button>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-accent px-6 py-2 rounded-xl hover:bg-accent/5 transition-all">
                    Manage Voyage →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 bg-gray-50 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 mb-8 italic">Your voyage history is currently a blank canvas.</p>
          <a 
            href="/explore" 
            className="bg-luxury text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-luxury/10"
          >
            Start Your Journey
          </a>
        </div>
      )}
    </div>
  );
}
