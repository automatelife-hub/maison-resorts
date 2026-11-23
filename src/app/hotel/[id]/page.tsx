'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { StarRating } from '@/components/StarRating';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import { SentimentDisplay } from '@/components/SentimentDisplay';
import { FavoriteButton } from '@/components/FavoriteButton';
import { SanctuaryPlanner } from '@/components/SanctuaryPlanner';

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
  const [occupancies, setOccupancies] = useState<any[]>([{ adults: 2, childrenAges: [] }]);
  const { currency } = usePreferences();
  const router = useRouter();

  const fetchRates = async (currentOccupancies: any[]) => {
    try {
      setRatesLoading(true);
      const checkIn = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      const checkOut = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
      const response = await fetch('/api/hotels/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          occupancies: currentOccupancies
        }),
      });
      if (response.ok) {
        const ratesData = await response.json();
        setRates(ratesData.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch rates', err);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hotels/${hotelId}`);
        if (!response.ok) throw new Error('Failed to fetch hotel property');
        const data = await response.json();
        setHotel(data);
        await fetchRates(occupancies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const handleOccupancyChange = (newOccupancies: any[]) => {
    setOccupancies(newOccupancies);
    fetchRates(newOccupancies);
  };

  const handleBookRate = (rateId: string) => {
    const params = new URLSearchParams({
      hotelId: hotelId,
      rateId: rateId,
      occupancies: JSON.stringify(occupancies)
    });
    router.push(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Skeleton className="h-[45vh] w-full mb-8 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-1/2 rounded" />
            <Skeleton className="h-24 w-full rounded" />
            <Skeleton className="h-48 w-full rounded" />
          </div>
          <Skeleton className="h-[350px] w-full rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <EmptyState title="Failed to Load Page" description={error} icon="⚠️" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <EmptyState title="Hotel Not Found" description="The requested hotel could not be found. Please search again." icon="🔍" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-gray-800 bg-white min-h-screen">
      {/* Hero Image Section */}
      <div className="relative mb-8 rounded-lg overflow-hidden h-[45vh] bg-gray-100">
        {hotel.photo ? (
          <img src={hotel.photo} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-serif">MAISON</div>
        )}
      </div>

      {/* Hotel Title & Details */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12 pb-8 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={hotel.star_rating} size="sm" />
            <span className="text-xs text-gray-500">• {hotel.city}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 font-normal">{hotel.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
        </div>
        <div className="flex items-center gap-4">
          <FavoriteButton 
            hotelId={hotel.id} 
            hotelName={hotel.name} 
            hotelPhoto={hotel.photo} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Sentiment / AI Review Summary */}
          <section>
             <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-4 font-bold">Guest Sentiment Analysis</h3>
             <SentimentDisplay hotelId={hotelId} />
          </section>

          {/* About Section */}
          <section>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">About the Property</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {hotel.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-4 font-bold">Amenities</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {hotel.amenities?.slice(0, 10).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-400">•</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-bold">Property Highlight</h4>
                  <p className="text-sm text-gray-500 leading-relaxed italic">
                    "{hotel.name} is situated in {hotel.city}, presenting a unique and memorable stay that prioritizes guest comfort, excellent amenities, and convenient access to local attractions."
                  </p>
               </div>
            </div>
          </section>
        </div>

        {/* Booking Sidebar / Rates */}
        <aside className="relative">
          <div className="sticky top-24 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Select a Room</h2>
            
            <div className="mb-6 pb-6 border-b border-gray-200">
               <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">Guests</h3>
               <SanctuaryPlanner 
                 occupancies={occupancies} 
                 onChange={handleOccupancyChange} 
               />
            </div>

            {ratesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded" />
                <Skeleton className="h-20 w-full rounded" />
              </div>
            ) : rates.length > 0 ? (
              <div className="space-y-6">
                {rates.map((room: any) => (
                  <div key={room.room_id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{room.room_name}</p>
                    {room.rates?.map((rate: any) => (
                      <div key={rate.rate_id} className="flex flex-col gap-4 mt-3">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs text-gray-500 uppercase">{rate.board_type}</p>
                          <PriceDisplay price={rate.net_rate} currency={rate.currency} className="text-2xl font-bold text-gray-900" />
                        </div>
                        <button 
                          onClick={() => handleBookRate(rate.rate_id)}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors"
                        >
                          Book Room
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">No rooms are available for these dates.</p>
                <button className="text-gray-900 hover:text-gray-700 text-xs font-semibold underline">Change Dates</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
