'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { StarRating } from '@/components/StarRating';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import Link from 'next/link';

interface Hotel {
  id: string;
  name: string;
  city: string;
  star_rating: number;
  photo: string;
  minPrice?: number;
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const { currency } = usePreferences();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const destination = searchParams.get('destination') || '';
  const checkInDate = searchParams.get('checkInDate') || '';
  const checkOutDate = searchParams.get('checkOutDate') || '';
  const guests = searchParams.get('guests') || '1';

  useEffect(() => {
    if (!destination || !checkInDate || !checkOutDate) {
      setLoading(false);
      return;
    }

    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError('');

        // Call the hotel search API
        const response = await fetch('/api/hotels/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            checkInDate,
            checkOutDate,
            guests: parseInt(guests),
            currency,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        setHotels(data.hotels || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search hotels');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, checkInDate, checkOutDate, guests, currency]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Search Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          title="Search Error"
          description={error}
          icon="⚠️"
        />
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Search Results for {destination}</h1>
        <EmptyState
          title="No Hotels Found"
          description={`No available hotels in ${destination} for ${checkInDate} to ${checkOutDate}`}
          icon="🔍"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {destination} • {checkInDate} to {checkOutDate} • {guests} {parseInt(guests) === 1 ? 'guest' : 'guests'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
            <div className="card overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="h-48 bg-gray-200 overflow-hidden">
                {hotel.photo ? (
                  <img
                    src={hotel.photo}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">🏨</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{hotel.city}</p>
                <div className="flex justify-between items-center mb-3">
                  <StarRating rating={hotel.star_rating} showLabel={true} size="sm" />
                </div>
                {hotel.minPrice && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-1">From</p>
                    <PriceDisplay price={hotel.minPrice} currency={currency} />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
