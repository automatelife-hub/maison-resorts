'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { StarRating } from '@/components/StarRating';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import { FavoriteButton } from '@/components/FavoriteButton';
import { CategoryBar } from '@/components/CategoryBar';
import { Map, List } from 'lucide-react';
import Link from 'next/link';

interface Hotel {
  id: string;
  name: string;
  city: string;
  star_rating: number;
  photo: string;
  minPrice?: number;
  vibe?: string;
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const { currency } = usePreferences();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const destination = searchParams.get('destination') || '';
  const checkInDate = searchParams.get('checkInDate') || '';
  const checkOutDate = searchParams.get('checkOutDate') || '';
  const occupanciesParam = searchParams.get('occupancies');

  const occupancies = useMemo(() => {
    if (occupanciesParam) {
      try {
        return JSON.parse(occupanciesParam);
      } catch (e) {
        return [{ adults: 2 }];
      }
    }
    return [{ adults: 2 }];
  }, [occupanciesParam]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/hotels/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: destination || 'Europe',
            checkInDate: checkInDate || new Date().toISOString().split('T')[0],
            checkOutDate: checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
            occupancies,
            currency,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setHotels(data.hotels || []);
        setFilteredHotels(data.hotels || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search properties');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, currency]);

  // Category filtering
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter(h => h.vibe === activeCategory));
    }
  }, [activeCategory, hotels]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
             <div key={i} className="border border-gray-150 p-4 rounded-lg">
               <Skeleton className="h-48 w-full mb-4 rounded bg-gray-100" />
               <Skeleton className="h-6 w-3/4 mb-2 rounded bg-gray-100" />
               <Skeleton className="h-4 w-1/2 rounded bg-gray-100" />
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-805">
      <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-xs font-semibold text-gray-500">
            {filteredHotels.length} Properties Found
          </p>
          
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {viewMode === 'grid' ? <><Map size={13} /> Show Map</> : <><List size={13} /> Show Grid</>}
          </button>
        </div>

        {filteredHotels.length === 0 ? (
          <EmptyState title="No results in this category" description="Try selecting 'All' to see our full collection." icon="🔍" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
                <Link href={`/hotel/${hotel.id}`} className="group block flex-1 flex flex-col justify-between">
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img 
                        src={hotel.photo} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      
                      <div className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
                         <FavoriteButton 
                           hotelId={hotel.id} 
                           hotelName={hotel.name} 
                           hotelPhoto={hotel.photo} 
                         />
                      </div>

                      {hotel.star_rating > 4 && (
                        <div className="absolute top-3 left-3">
                           <div className="bg-gray-900/90 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border border-gray-700">
                             Premium
                           </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-2 gap-2">
                         <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                           {hotel.name}
                         </h3>
                         <div className="shrink-0">
                           <StarRating rating={hotel.star_rating} size="xs" />
                         </div>
                       </div>
                       <p className="text-xs text-gray-500 mb-2">{hotel.city}</p>
                       {hotel.vibe && (
                         <span className="inline-block bg-gray-50 border border-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded">
                           {hotel.vibe}
                         </span>
                       )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                       <div>
                         <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Rate per night</span>
                         <PriceDisplay price={hotel.minPrice || 0} currency={currency} className="text-sm font-semibold text-gray-900" />
                       </div>
                       <span className="text-xs text-gray-900 font-semibold group-hover:underline">View details</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
