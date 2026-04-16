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
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-10 sticky top-24">
      <div>
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury mb-6 border-b border-gray-50 pb-2">Refine Search</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 mb-4">
              <span>Price Range</span>
              <span className="text-luxury font-bold">${minPrice} — ${maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-accent h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Minimum Standard</p>
            <div className="flex gap-2">
              {[0, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                    minRating === rating 
                      ? 'bg-luxury text-accent border-luxury shadow-lg shadow-luxury/10' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-accent hover:text-accent'
                  }`}
                >
                  {rating === 0 ? 'ALL' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Sort Sanctuaries</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold text-luxury focus:outline-none focus:border-accent appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23d4af37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
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
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury mb-6 border-b border-gray-50 pb-2">Amenities</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {facilities.slice(0, 15).map((facility) => (
            <label key={facility.id} className="flex items-center gap-3 cursor-pointer group">
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
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-100 transition-all checked:border-accent checked:bg-accent"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 text-[10px]">
                  ✓
                </span>
              </div>
              <span className="text-xs text-gray-500 group-hover:text-luxury transition-colors">{facility.name}</span>
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
        className="w-full text-[8px] uppercase tracking-[0.3em] text-gray-400 hover:text-accent transition-colors font-bold text-center"
      >
        Reset All Filters
      </button>
    </div>
  );
}
