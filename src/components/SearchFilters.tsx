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
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8 sticky top-24 shadow-sm text-gray-800">
      <div>
        <h3 className="text-xs uppercase tracking-wider font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Refine Search</h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Price Range</span>
              <span className="text-gray-900 font-semibold">${minPrice} — ${maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-gray-900 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Minimum Standard</p>
            <div className="flex gap-1.5">
              {[0, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all border ${
                    minRating === rating 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  {rating === 0 ? 'ALL' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Sort Properties</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-gray-400 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Amenities</h3>
        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
          {facilities.slice(0, 15).map((facility) => (
            <label key={facility.id} className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
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
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-gray-900 checked:bg-gray-900"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 text-[9px] pointer-events-none">
                  ✓
                </span>
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{facility.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={() => {
          setMinPrice(0);
          setMaxPrice(10000);
          setMinRating(0);
          setAmenities([]);
          setSortBy('price_asc');
        }}
        className="w-full text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors text-center border-t border-gray-100 pt-4"
      >
        Reset All Filters
      </button>
    </div>
  );
}
