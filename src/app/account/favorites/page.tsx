'use client';

import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FavoriteItem {
  hotelId: string;
  hotelName: string;
  hotelPhoto?: string;
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 rounded bg-gray-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your saved wishlist." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-800">
      <div>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 block">Curated Wishlist</span>
        <h1 className="text-3xl font-serif text-gray-900 font-normal">Saved Properties</h1>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.hotelId} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                  <img
                    src={fav.hotelPhoto || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"} 
                    alt={fav.hotelName}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => handleRemoveFavorite(fav.hotelId)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:scale-105 transition-transform"
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                    {fav.hotelName}
                  </h3>
                  <p className="text-xs text-gray-400">Added to Wishlist</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/hotel/${fav.hotelId}`}
                  className="block text-center bg-gray-900 hover:bg-gray-800 text-white text-xs uppercase tracking-wider font-semibold py-2 rounded transition-colors"
                >
                  View Property
                </Link>
              </div>
            </div>
          ))}
          
          <Link href="/explore" className="border-2 border-dashed border-gray-250 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:border-gray-400 transition-colors min-h-[250px] group">
            <span className="text-2xl text-gray-400 group-hover:text-gray-600 transition-colors mb-2">+</span>
            <p className="text-xs font-semibold text-gray-500 group-hover:text-gray-700">Add More Properties</p>
            <span className="mt-2 text-[10px] text-gray-400 uppercase tracking-wider underline">Browse Collection</span>
          </Link>
        </div>
      ) : (
        <div className="py-16 bg-gray-50 rounded border-2 border-dashed border-gray-200 text-center p-8 max-w-xl mx-auto">
          <p className="text-gray-500 mb-6 font-light">Your wishlist is currently empty.</p>
          <Link 
            href="/explore" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
          >
            Explore Sanctuaries
          </Link>
        </div>
      )}
    </div>
  );
}
