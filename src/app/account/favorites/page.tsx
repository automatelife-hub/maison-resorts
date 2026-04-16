'use client';

import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { DestinationCard } from '@/components/DestinationCard';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FavoriteItem {
  hotelId: string;
  hotelName: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { getFirebaseFirestore } = await import('@/lib/firebase');
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
        const db = await getFirebaseFirestore();
        const favsRef = collection(db, `users/${user.uid}/favorites`);
        const q = query(favsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedFavs: FavoriteItem[] = [];
        querySnapshot.forEach((doc) => {
          fetchedFavs.push({ ...doc.data() } as FavoriteItem);
        });
        
        setFavorites(fetchedFavs);
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (hotelId: string) => {
    if (!user) return;
    try {
      const { getFirebaseFirestore } = await import('@/lib/firebase');
      const { doc, deleteDoc } = await import('firebase/firestore');
      const db = await getFirebaseFirestore();
      const docRef = doc(db, `users/${user.uid}/favorites`, hotelId);
      await deleteDoc(docRef);
      setFavorites((prev) => prev.filter((f) => f.hotelId !== hotelId));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  if (authLoading || loading) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Curated Wishlist</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">Your <span className="text-accent">Favorites</span></h1>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {favorites.map((fav) => (
            <div key={fav.hotelId} className="space-y-4">
              <DestinationCard
                countryCode=""
                countryName={fav.hotelName}
                image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" // Placeholder image for now
              />
              <div className="px-2 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-luxury italic font-serif line-clamp-1">{fav.hotelName}</h3>
                  <Link href={`/hotel/${fav.hotelId}`} className="text-[10px] uppercase tracking-widest text-accent mt-1 hover:text-luxury transition-colors">View Sanctuary</Link>
                </div>
                <button 
                  onClick={() => handleRemoveFavorite(fav.hotelId)}
                  className="text-accent text-lg hover:opacity-75 transition-opacity"
                  title="Remove from favorites"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center group hover:border-accent transition-colors min-h-[300px]">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-all text-xl font-light">+</div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Discover more to save</p>
            <Link href="/explore" className="mt-4 text-[10px] font-bold text-luxury border-b border-luxury/10 hover:border-accent transition-all pb-1">EXPLORE COLLECTION</Link>
          </div>
        </div>
      ) : (
        <div className="py-24 bg-gray-50 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 mb-8 italic">Your curated collection is currently a blank canvas.</p>
          <Link 
            href="/explore" 
            className="bg-luxury text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-luxury/10"
          >
            Discover Sanctuaries
          </Link>
        </div>
      )}
    </div>
  );
}
