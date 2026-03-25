'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchItem {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  id: string;
}

export function RecentSearches() {
  const [searches, setSearches] = useState<SearchItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('maison_recent_searches');
    if (saved) {
      try {
        setSearches(JSON.parse(saved).slice(0, 5));
      } catch {}
    }
  }, []);

  if (searches.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
      <div className="flex gap-3 flex-wrap">
        {searches.map((search) => (
          <Link
            key={search.id}
            href={`/results?destination=${search.destination}&checkInDate=${search.checkInDate}&checkOutDate=${search.checkOutDate}`}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
          >
            {search.destination} • {search.checkInDate}
          </Link>
        ))}
      </div>
    </div>
  );
}
