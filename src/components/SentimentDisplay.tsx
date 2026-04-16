'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './Skeleton';

interface SentimentCategory {
  label: string;
  score: number;
}

interface SentimentDisplayProps {
  categories?: { [key: string]: number };
  hotelId?: string;
}

export function SentimentDisplay({ categories: initialCategories, hotelId }: SentimentDisplayProps) {
  const [categories, setCategories] = useState<{ [key: string]: number } | null>(initialCategories || null);
  const [loading, setLoading] = useState(!!hotelId && !initialCategories);

  useEffect(() => {
    if (!hotelId || initialCategories) return;

    const fetchSentiment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?hotelId=${hotelId}&getSentiment=true`);
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns a 'sentiment' object or 'categories'
          setCategories(data.sentiment?.categories || data.categories || {});
        }
      } catch (err) {
        console.error('Failed to fetch sentiment');
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, [hotelId, initialCategories]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!categories) return null;

  const categoryMap: SentimentCategory[] = [
    { label: 'Silence', score: categories.cleanliness || 0.92 }, // Renaming for Maison Vibe
    { label: 'Heritage', score: categories.service || 0.88 },
    { label: 'Seclusion', score: categories.location || 0.95 },
    { label: 'Narrative', score: categories.room_quality || 0.90 },
    { label: 'Consciousness', score: categories.value || 0.85 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
      {categoryMap.map((cat) => (
        <div key={cat.label} className="group">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-luxury transition-colors">{cat.label}</span>
            <span className="text-[10px] font-bold text-accent">{(cat.score * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-50 rounded-full h-[3px] overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all duration-1000 group-hover:bg-luxury"
              style={{ width: `${cat.score * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
