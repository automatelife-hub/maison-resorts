'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PriceDisplay } from './PriceDisplay';
import { Skeleton } from './Skeleton';
import { usePreferences } from '@/context/PreferencesContext';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currency } = usePreferences();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context: 'luxury, beach, wellness' }),
        });
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
          <Skeleton key={i} className="h-80 w-full rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Curated for You</h3>
          <h2 className="text-4xl font-bold text-luxury italic font-serif">Smart <span className="text-accent">Selections</span></h2>
        </div>
        <Link href="/explore" className="text-[10px] font-bold uppercase tracking-widest text-luxury border-b border-luxury/20 pb-1 hover:text-accent hover:border-accent transition-all">
          Explore All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {recommendations.map((hotel) => (
          <Link 
            key={hotel.id} 
            href={`/hotel/${hotel.id}`}
            className="group relative h-96 overflow-hidden rounded-[2.5rem] bg-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <img 
              src={hotel.main_photo || hotel.thumbnail} 
              alt={hotel.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury/90 via-luxury/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-[8px] uppercase tracking-widest text-accent mb-2">{hotel.city}</p>
              <h3 className="text-xl font-bold mb-4 line-clamp-1">{hotel.name}</h3>
              <div className="flex justify-between items-center">
                <PriceDisplay price={hotel.minPrice} currency={currency} className="text-white font-bold" />
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  View Voyage
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
