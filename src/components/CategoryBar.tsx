'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  { label: 'Barefoot Luxury', icon: Palmtree },
  { label: 'Quiet Luxury', icon: Wind },
  { label: 'Intentional Travel', icon: Mountain },
  { label: 'Slow Mode', icon: Waves },
  { label: 'Arctic frontier', icon: Snowflake },
  { label: 'Desert Dune', icon: Sun },
  { label: 'Coastal Heritage', icon: Anchor },
  { label: 'Volcanic Peak', icon: Flame },
  { label: 'High Altitude', icon: Cloud },
];

interface CategoryBarProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryBar({ activeCategory, onSelect }: CategoryBarProps) {
  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border-b border-white/5 sticky top-24 z-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-10 overflow-x-auto no-scrollbar py-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.label;
            const Icon = cat.icon;
            
            return (
              <button
                key={cat.label}
                onClick={() => onSelect(cat.label)}
                className={`flex flex-col items-center gap-3 min-w-fit transition-all group relative`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-accent text-luxury shadow-lg shadow-accent/20' 
                    : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                }`}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'
                }`}>
                  {cat.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="category-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-[2px] bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
