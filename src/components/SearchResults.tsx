'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { StarRating } from '@/components/StarRating';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import { SearchFilters } from '@/components/SearchFilters';
import { FavoriteButton } from '@/components/FavoriteButton';
import type { SearchFilter } from '@/types';
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
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SearchFilter | null>(null);

  const destination = searchParams.get('destination') || '';
  const placeId = searchParams.get('placeId') || undefined;
  const checkInDate = searchParams.get('checkInDate') || '';
  const checkOutDate = searchParams.get('checkOutDate') || '';
  const guestsParam = searchParams.get('guests');
  const occupanciesParam = searchParams.get('occupancies');

  const occupancies = useMemo(() => {
    if (occupanciesParam) {
      try {
        return JSON.parse(occupanciesParam);
      } catch (e) {
        return [{ adults: 1 }];
      }
    } else if (guestsParam) {
      return [{ adults: parseInt(guestsParam) }];
    }
    return [{ adults: 1 }];
  }, [occupanciesParam, guestsParam]);

  const totalGuests = useMemo(() => {
    return occupancies.reduce((acc: number, curr: any) => acc + curr.adults + (curr.childrenAges?.length || 0), 0);
  }, [occupancies]);

  useEffect(() => {
    if ((!destination && !placeId) || !checkInDate || !checkOutDate) {
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
            placeId,
            checkInDate,
            checkOutDate,
            occupancies,
            currency,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        setHotels(data.hotels || []);
        setFilteredHotels(data.hotels || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search hotels');
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, placeId, checkInDate, checkOutDate, occupancies, currency]);

  useEffect(() => {
    if (!filters) {
      setFilteredHotels(hotels);
      return;
    }

    let results = [...hotels];

    if (filters.minPrice !== undefined) {
      results = results.filter(h => (h.minPrice || 0) >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(h => (h.minPrice || 0) <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      results = results.filter(h => h.star_rating >= filters.minRating!);
    }

    if (filters.sortBy === 'price_asc') {
      results.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (filters.sortBy === 'price_desc') {
      results.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.star_rating - a.star_rating);
    } else if (filters.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredHotels(results);
  }, [hotels, filters]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 italic font-serif text-luxury">Finding Your <span className="text-accent">Sanctuaries</span></h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-4">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState
          title="Search Error"
          description={error}
          icon="⚠️"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Available Sanctuaries</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">Destinations in <span className="text-accent">{destination || 'the region'}</span></h1>
        <p className="text-gray-500 mt-4 uppercase tracking-widest text-[10px]">{checkInDate} — {checkOutDate} • {totalGuests} {totalGuests === 1 ? 'Voyager' : 'Voyagers'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-80 shrink-0">
          <SearchFilters onFilterChange={setFilters} />
        </aside>

        <div className="flex-1">
          {filteredHotels.length === 0 ? (
            <EmptyState
              title="No Sanctuaries Found"
              description="Refine your filters to find your perfect niche spot."
              icon="🔍"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredHotels.map((hotel) => (
                <Link key={hotel.id} href={`/hotel/${hotel.id}`} className="group">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col h-full">
                    <div className="h-64 bg-gray-100 overflow-hidden relative">
                      {hotel.photo ? (
                        <img
                          src={hotel.photo}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">🏨</div>
                      )}
                      <div className="absolute top-6 left-6">
                         <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                           <StarRating rating={hotel.star_rating} size="xs" />
                         </div>
                      </div>
                      <div className="absolute top-6 right-6">
                         <div className="bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm">
                           <FavoriteButton 
                             hotelId={hotel.id} 
                             hotelName={hotel.name} 
                             hotelPhoto={hotel.photo} 
                           />
                         </div>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1 justify-between">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-accent mb-2">{hotel.city}</p>
                        <h3 className="text-xl font-bold text-luxury mb-4 line-clamp-1">{hotel.name}</h3>
                      </div>
                      <div className="flex justify-between items-end pt-6 border-t border-gray-50">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">From</p>
                          <PriceDisplay price={hotel.minPrice || 0} currency={currency} className="text-xl font-bold text-luxury" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
                          Discover →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
