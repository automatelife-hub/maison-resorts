'use client';

import { useState, useMemo } from 'react';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { Compass, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const [activeVibe, setActiveVibe] = useState('All');
  const [activeTier, setActiveTier] = useState('All');

  const vibes = ['All', 'Beachfront', 'Luxury Boutique', 'Arctic & Winter', 'Country & Nature', 'Alpine'];
  const tiers = [
    { id: 'All', label: 'All Tiers' },
    { id: 'Value', label: 'Value Stays (<$250)' },
    { id: 'Premium', label: 'Premium Resorts ($250-$600)' },
    { id: 'Elite', label: 'Luxury Estates (>$600)' }
  ];

  // Combined filter logic
  const filteredDestinations = useMemo(() => {
    return FEATURED_DESTINATIONS.filter(dest => {
      const matchVibe = activeVibe === 'All' || dest.vibe === activeVibe;
      const matchTier = activeTier === 'All' || dest.priceTier === activeTier;
      return matchVibe && matchTier;
    });
  }, [activeVibe, activeTier]);

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans antialiased">
      {/* Light Hero Section */}
      <section className="bg-gray-50 border-b border-gray-200 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-semibold block">
            Our Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
            Explore Destinations
          </h1>
          <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
            Explore our hand-picked collection of top-rated resorts and hotels. Use the filters below to find the perfect stay matching your preferred style and price range.
          </p>
        </div>
      </section>

      {/* Standard Filters */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="border-t border-b border-gray-100 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-500">
            <SlidersHorizontal size={14} />
            <span className="text-xs uppercase tracking-wider font-semibold">
              Filters
            </span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            {/* Vibes Selection */}
            <div className="flex flex-wrap gap-4 text-xs font-medium">
              {vibes.map((v) => {
                const isActive = activeVibe === v;
                return (
                  <button
                    key={v}
                    onClick={() => setActiveVibe(v)}
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>

            {/* Price Tiers Selection */}
            <div className="flex flex-wrap gap-4 text-xs font-medium">
              {tiers.map((t) => {
                const isActive = activeTier === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTier(t.id)}
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
              Showing {activeVibe !== 'All' ? activeVibe : 'All'} • {activeTier !== 'All' ? activeTier : 'All Tiers'}
            </span>
            <h2 className="text-xl font-serif text-gray-900 font-normal">
              Curated Properties
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {filteredDestinations.length} Properties Found
          </p>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div key={dest.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-sm transition-shadow flex flex-col bg-white">
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 text-gray-800 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold border border-gray-200">
                    {dest.vibe}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {dest.description}
                    </p>
                    
                    <div className="mb-6 flex flex-wrap gap-2">
                      {dest.highlights.map((h, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-600 text-[10px] px-2 py-0.5 rounded border border-gray-100">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Starting from</span>
                      <span className="text-base font-semibold text-gray-900">${dest.minPrice} / night</span>
                    </div>
                    
                    <Link
                      href={`/results?destination=${encodeURIComponent(dest.name)}`}
                      className="bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-gray-100 bg-gray-50 rounded-lg max-w-md mx-auto p-8">
            <p className="text-gray-900 text-lg font-serif mb-2">No Properties Found</p>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Adjust your filters to see other properties in different styles or tiers.
            </p>
            <button
              onClick={() => {
                setActiveVibe('All');
                setActiveTier('All');
              }}
              className="bg-gray-900 text-white px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
