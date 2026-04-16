'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface FavoriteButtonProps {
  hotelId: string;
  hotelName: string;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({ hotelId, hotelName, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const checkFavorite = async () => {
      try {
        const { getFirebaseFirestore } = await import('@/lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const db = await getFirebaseFirestore();
        const docRef = doc(db, `users/${user.uid}/favorites`, hotelId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsFavorite(true);
        }
      } catch (err) {
        console.error('Failed to check favorite status', err);
      }
    };
    checkFavorite();
  }, [user, hotelId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // In a real app, you might want to redirect to login or show a toast
      return;
    }
    
    setLoading(true);
    const newState = !isFavorite;
    
    try {
      const { getFirebaseFirestore } = await import('@/lib/firebase');
      const { doc, setDoc, deleteDoc } = await import('firebase/firestore');
      const db = await getFirebaseFirestore();
      const docRef = doc(db, `users/${user.uid}/favorites`, hotelId);
      
      if (newState) {
        await setDoc(docRef, { hotelId, hotelName, createdAt: new Date().toISOString() });
      } else {
        await deleteDoc(docRef);
      }
      
      setIsFavorite(newState);
      onToggle?.(newState);
    } catch (err) {
      console.error('Failed to update favorite', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !user}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${loading || !user ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!user ? 'Login to save favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
