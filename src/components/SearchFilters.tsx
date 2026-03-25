'use client';

import { useEffect, useState } from 'react';
import type { Facility, SearchFilter } from '@/types';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilter) => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'name'>('price_asc');

  useEffect(() => {
    fetch('/api/data/facilities')
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch(() => setFacilities([]));
  }, []);

  useEffect(() => {
    onFilterChange({
      minPrice,
      maxPrice,
      minRating,
      amenities,
      sortBy,
    });
  }, [minPrice, maxPrice, minRating, amenities, sortBy, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 max-w-sm">
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${minPrice}</span>
            <span>${maxPrice}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Minimum Rating</h3>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`px-3 py-1 rounded ${minRating === rating ? 'bg-accent text-luxury' : 'bg-gray-200'}`}
            >
              {rating}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Amenities</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {facilities.slice(0, 8).map((facility) => (
            <label key={facility.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={amenities.includes(facility.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAmenities([...amenities, facility.id]);
                  } else {
                    setAmenities(amenities.filter((id) => id !== facility.id));
                  }
                }}
              />
              <span className="text-sm">{facility.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
