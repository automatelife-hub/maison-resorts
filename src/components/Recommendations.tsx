'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PriceDisplay } from './PriceDisplay';
import { Skeleton } from './Skeleton';
import { usePreferences } from '@/context/PreferencesContext';
import { StarRating } from './StarRating';
import { ImageWithFallback } from './ImageWithFallback';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currency } = usePreferences();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations');
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
        }
      } catch (err) {
        console.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-[2rem] bg-white/5" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-12 py-12">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold">Intelligent Curation</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-luxury italic font-serif tracking-tighter leading-tight">Handpicked <span className="text-accent">Sanctuaries</span></h2>
        </div>
        <Link href="/explore" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/10 pb-1 hover:text-accent hover:border-accent transition-all">
          Explore All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((hotel) => (
          <Link key={hotel.id} href={`/hotel/${hotel.id}`} className="group block">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl border border-white/5 group-hover:border-accent/30 transition-all duration-700 bg-luxury">
              <ImageWithFallback 
                src={hotel.main_photo} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt={hotel.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051612]/90 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-[8px] uppercase tracking-[0.3em] text-accent mb-2 font-bold">{hotel.city}</p>
                <h3 className="text-xl font-bold italic font-serif mb-4 leading-tight">{hotel.name}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                   <PriceDisplay price={hotel.minPrice} currency={currency} className="text-sm font-bold text-white" />
                   <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-luxury transition-all duration-500">
                      <StarRating rating={hotel.starRating} size="xs" />
                   </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
