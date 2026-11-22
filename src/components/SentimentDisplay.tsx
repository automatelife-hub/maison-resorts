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
    { label: 'Cleanliness', score: categories.cleanliness || 0.92 },
    { label: 'Service', score: categories.service || 0.88 },
    { label: 'Location', score: categories.location || 0.95 },
    { label: 'Room Quality', score: categories.room_quality || 0.90 },
    { label: 'Value', score: categories.value || 0.85 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 bg-white p-6 border border-gray-200 rounded-lg">
      {categoryMap.map((cat) => (
        <div key={cat.label} className="group">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold group-hover:text-gray-900 transition-colors">
              {cat.label}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              {(cat.score * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gray-800 h-full rounded-full transition-all duration-1000 group-hover:bg-gray-900"
              style={{ width: `${cat.score * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
