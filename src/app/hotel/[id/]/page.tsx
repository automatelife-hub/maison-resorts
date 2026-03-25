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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currency } = usePreferences();

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotel');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

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

        {/* Booking Sidebar */}
        <div className="card sticky top-4 h-fit">
          <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>
          <div className="space-y-4">
            <button className="w-full bg-accent text-luxury font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all">
              Check Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
