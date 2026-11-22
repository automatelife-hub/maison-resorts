'use client';

import React from 'react';
import { 
  Palmtree, 
  Mountain, 
  Wind, 
  Waves, 
  Flame, 
  Snowflake, 
  Compass, 
  Anchor,
  Cloud,
  Sun
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: Compass },
  { label: 'Beachfront', icon: Palmtree },
  { label: 'Luxury Boutique', icon: Wind },
  { label: 'Mountain & Ski', icon: Mountain },
  { label: 'Country & Nature', icon: Waves },
  { label: 'Arctic & Winter', icon: Snowflake },
  { label: 'Desert Retreat', icon: Sun },
  { label: 'Historic & Coast', icon: Anchor },
  { label: 'Wellness & Spa', icon: Flame },
  { label: 'Alpine', icon: Cloud },
];

interface CategoryBarProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryBar({ activeCategory, onSelect }: CategoryBarProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.label;
            const Icon = cat.icon;
            
            return (
              <button
                key={cat.label}
                onClick={() => onSelect(cat.label)}
                className="flex flex-col items-center gap-1.5 min-w-fit transition-all group focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-50 text-gray-500 group-hover:text-gray-900 group-hover:bg-gray-100'
                }`}>
                  <Icon size={16} strokeWidth={2} />
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
