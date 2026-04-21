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
import { motion, AnimatePresence } from 'framer-motion';
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
  const guestsParam = searchParams.get('guests');
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

        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        setHotels(data.hotels || []);
        setFilteredHotels(data.hotels || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, currency]);

  // Airbnb-style category filtering
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter(h => h.vibe === activeCategory));
    }
  }, [activeCategory, hotels]);

  if (loading) {
    return (
      <div className="bg-luxury min-h-screen">
        <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[1,2,3,4,5,6,7,8].map(i => (
             <Skeleton key={i} className="h-96 w-full rounded-[2rem] bg-white/5" />
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen">
      <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-12">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            {filteredHotels.length} Sanctuaries Found
          </p>
          
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            className="bg-accent text-luxury px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-accent/10"
          >
            {viewMode === 'grid' ? <><Map size={14} /> Show Map</> : <><List size={14} /> Show Grid</>}
          </button>
        </div>

        {filteredHotels.length === 0 ? (
          <EmptyState title="No results in this category" description="Try selecting 'All' to see our full 2026 collection." icon="🔍" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredHotels.map((hotel) => (
                <motion.div
                  layout
                  key={hotel.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/hotel/${hotel.id}`} className="group block">
                    <div className="flex flex-col h-full">
                      {/* Image Container */}
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4 shadow-2xl border border-white/5 group-hover:border-accent/30 transition-all duration-700">
                        <img 
                          src={hotel.photo} 
                          alt={hotel.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute top-4 right-4">
                           <FavoriteButton 
                             hotelId={hotel.id} 
                             hotelName={hotel.name} 
                             hotelPhoto={hotel.photo} 
                           />
                        </div>

                        {hotel.star_rating > 4 && (
                          <div className="absolute top-4 left-4">
                             <div className="bg-accent text-luxury px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest shadow-xl">
                               Collection Elite
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="px-1">
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-accent transition-colors truncate pr-4">
                             {hotel.name}
                           </h3>
                           <div className="flex items-center gap-1 shrink-0">
                             <StarRating rating={hotel.star_rating} size="xs" />
                           </div>
                         </div>
                         <p className="text-[10px] text-gray-500 font-medium mb-4 uppercase tracking-widest italic">{hotel.city}</p>
                         
                         <div className="flex items-baseline gap-2 pt-2 border-t border-white/5">
                            <PriceDisplay price={hotel.minPrice || 0} currency={currency} className="text-sm font-bold text-white" />
                            <span className="text-[10px] text-gray-600 font-medium uppercase tracking-tighter">/ Voyage</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
