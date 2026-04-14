'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { StarRating } from '@/components/StarRating';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';

interface HotelData {
  id: string;
  name: string;
  city: string;
  star_rating: number;
  photo: string;
  description: string;
  amenities: string[];
  address: string;
}

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [hotelId, setHotelId] = useState('');
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [error, setError] = useState('');
  const { currency } = usePreferences();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setHotelId(id);
    })();
  }, [params]);

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hotels/${hotelId}`);
        if (!response.ok) throw new Error('Failed to fetch hotel');
        const data = await response.json();
        setHotel(data);
        
        // Also fetch rates (using dummy dates for now, in prod these come from search)
        setRatesLoading(true);
        const ratesRes = await fetch(`/api/hotels/rates?hotelId=${hotelId}&checkInDate=2026-06-01&checkOutDate=2026-06-05&guests=2`);
        if (ratesRes.ok) {
          const ratesData = await ratesRes.json();
          setRates(ratesData.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotel');
      } finally {
        setLoading(false);
        setRatesLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const handleBookRate = (rateId: string) => {
    router.push(`/checkout?hotelId=${hotelId}&rateId=${rateId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState title="Error" description={error} icon="⚠️" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState title="Hotel Not Found" description="This hotel could not be found" icon="🔍" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hotel Image */}
      <div className="mb-8 rounded-2xl overflow-hidden h-96 bg-gray-200">
        {hotel.photo ? (
          <img src={hotel.photo} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">🏨</div>
        )}
      </div>

      {/* Hotel Info */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <p className="text-gray-600 mb-4">{hotel.city}</p>
              <StarRating rating={hotel.star_rating} showLabel={true} size="lg" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600 mb-4">{hotel.description}</p>
          </div>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-600">
                    <span className="mr-2">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Sidebar / Rates */}
        <div className="card sticky top-4 h-fit bg-luxury text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold mb-8 italic font-serif">Available <span className="text-accent">Sanctuaries</span></h2>
          
          {ratesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full bg-white/10" />
              <Skeleton className="h-20 w-full bg-white/10" />
            </div>
          ) : rates.length > 0 ? (
            <div className="space-y-6">
              {rates.map((room: any) => (
                <div key={room.room_id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                  <p className="text-[10px] uppercase tracking-widest text-accent mb-1">{room.room_name}</p>
                  {room.rates?.map((rate: any) => (
                    <div key={rate.rate_id} className="flex justify-between items-end mt-2">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">{rate.board_type}</p>
                        <PriceDisplay price={rate.net_rate} currency={rate.currency} className="text-xl font-bold text-white" />
                      </div>
                      <button 
                        onClick={() => handleBookRate(rate.rate_id)}
                        className="bg-accent text-luxury px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-accent/20"
                      >
                        Reserve
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-4">No sanctuaries available for these dates.</p>
              <button className="text-accent text-[10px] uppercase tracking-widest font-bold">Change Dates →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
