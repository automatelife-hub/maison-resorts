'use client';

import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { DestinationCard } from '@/components/DestinationCard';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-12 w-1/3 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your curated collection of Maison favorites." 
          icon="🔒" 
        />
      </div>
    );
  }

  // For now, we'll show featured destinations as placeholders for favorites
  const favorites = FEATURED_DESTINATIONS.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Curated Wishlist</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">Your <span className="text-accent">Favorites</span></h1>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {favorites.map((dest) => (
            <div key={dest.id} className="space-y-4">
              <DestinationCard
                countryCode={dest.countryCode}
                countryName={dest.name}
                image={dest.image}
              />
              <div className="px-2 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-luxury italic font-serif">{dest.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{dest.vibe}</p>
                </div>
                <button className="text-accent text-lg">❤️</button>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center group hover:border-accent transition-colors min-h-[300px]">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-all text-xl font-light">+</div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Discover more to save</p>
            <a href="/explore" className="mt-4 text-[10px] font-bold text-luxury border-b border-luxury/10 hover:border-accent transition-all pb-1">EXPLORE COLLECTION</a>
          </div>
        </div>
      ) : (
        <div className="py-24 bg-gray-50 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 mb-8 italic">Your curated collection is currently a blank canvas.</p>
          <a 
            href="/explore" 
            className="bg-luxury text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-luxury/10"
          >
            Discover Sanctuaries
          </a>
        </div>
      )}
    </div>
  );
}
