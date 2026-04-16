'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { StarRating } from '@/components/StarRating';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import { SentimentDisplay } from '@/components/SentimentDisplay';

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
  const { id: hotelId } = use(params);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [error, setError] = useState('');
  const { currency } = usePreferences();
  const router = useRouter();

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hotels/${hotelId}`);
        if (!response.ok) throw new Error('Failed to fetch hotel sanctuary');
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
        setError(err instanceof Error ? err.message : 'Failed to load sanctuary');
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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-[60vh] w-full mb-12 rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-1/2 rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-[500px] w-full rounded-[3rem]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState title="Voyage Interrupted" description={error} icon="⚠️" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState title="Sanctuary Not Found" description="The requested heritage spot could not be located in our 2026 collection." icon="🔍" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero Image Section */}
      <div className="relative mb-16 rounded-[3rem] overflow-hidden h-[60vh] shadow-2xl group">
        {hotel.photo ? (
          <img src={hotel.photo} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-5xl font-serif italic">MAISON</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 text-white">
          <div className="flex items-center gap-4 mb-4">
             <div className="bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full border border-accent/30 shadow-sm">
                <StarRating rating={hotel.star_rating} size="xs" color="#d4af37" />
             </div>
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Heritage Sanctuaries</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 italic font-serif tracking-tighter">{hotel.name}</h1>
          <p className="text-xl text-gray-200 font-light tracking-wide">{hotel.city} — European Niche Collection 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Sentiment / AI Review Summary */}
          <section>
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-6 font-bold">Conscious Sentiment</h3>
             <SentimentDisplay hotelId={hotelId} />
          </section>

          {/* About Section */}
          <section>
            <h2 className="text-3xl font-bold text-luxury mb-6 italic font-serif">The <span className="text-accent">Experience</span></h2>
            <p className="text-gray-600 text-lg leading-relaxed font-light mb-8">
              {hotel.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-6 font-bold">In-Sanctuary Amenities</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {hotel.amenities?.slice(0, 10).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm text-gray-600 group">
                        <span className="text-accent font-bold">✦</span>
                        <span className="group-hover:text-luxury transition-colors">{amenity}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-6 font-bold">Location Heritage</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 italic">
                    "{hotel.name} is nestled in the heart of {hotel.city}, offering a narrative-driven stay that prioritizes silence, heritage reimagined, and cultural immersion."
                  </p>
                  <p className="text-[10px] font-bold text-luxury uppercase tracking-widest">{hotel.address}</p>
               </div>
            </div>
          </section>
        </div>

        {/* Booking Sidebar / Rates */}
        <aside className="relative">
          <div className="sticky top-24 bg-luxury text-white p-10 rounded-[3rem] shadow-2xl border border-white/5">
            <h2 className="text-2xl font-bold mb-8 italic font-serif">Reserved <span className="text-accent">Living</span></h2>
            
            {ratesLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-24 w-full bg-white/5 rounded-2xl" />
                <Skeleton className="h-24 w-full bg-white/5 rounded-2xl" />
              </div>
            ) : rates.length > 0 ? (
              <div className="space-y-8">
                {rates.map((room: any) => (
                  <div key={room.room_id} className="border-b border-white/10 pb-8 last:border-0 last:pb-0 group">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-bold group-hover:translate-x-1 transition-transform">{room.room_name}</p>
                    {room.rates?.map((rate: any) => (
                      <div key={rate.rate_id} className="flex flex-col gap-6 mt-4">
                        <div className="flex justify-between items-baseline">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{rate.board_type}</p>
                          <PriceDisplay price={rate.net_rate} currency={rate.currency} className="text-3xl font-bold text-white tracking-tighter" />
                        </div>
                        <button 
                          onClick={() => handleBookRate(rate.rate_id)}
                          className="w-full bg-accent text-luxury py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-accent/10"
                        >
                          Confirm Voyage
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="text-accent">!</span>
                </div>
                <p className="text-xs text-gray-400 mb-8 font-light leading-relaxed">No sanctuaries are currently available for these dates in our 2026 collection.</p>
                <button className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold border-b border-accent/20 pb-1 hover:border-accent transition-all">Change Voyage Dates</button>
              </div>
            )}

            <div className="mt-12 pt-12 border-t border-white/5">
               <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>Verified 2026 Rate Guarantee</span>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
