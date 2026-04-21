'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { Search, X, MapPin } from 'lucide-react';

interface IntentionGalleryProps {
  value: string;
  onChange: (value: string, placeId?: string) => void;
}

export function IntentionGallery({ value, onChange }: IntentionGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-left text-white text-sm font-medium hover:text-accent transition-colors truncate"
      >
        {value || 'Select Destination'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[70] bg-luxury/98 backdrop-blur-3xl p-6 md:p-24 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16 max-w-7xl mx-auto w-full">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent mb-4 font-bold">The Intention Gallery</h3>
                <h2 className="text-4xl md:text-6xl font-bold text-white italic font-serif tracking-tighter">Where shall we <span className="text-accent">arrive?</span></h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar pr-4">
              {FEATURED_DESTINATIONS.map((dest) => (
                <motion.div
                  key={dest.id}
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onChange(dest.name);
                    setIsOpen(false);
                  }}
                  className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden cursor-pointer group border border-white/5"
                >
                  <img src={dest.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={dest.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                     <p className="text-[8px] uppercase tracking-[0.3em] text-accent font-bold mb-2">{dest.vibe}</p>
                     <h4 className="text-2xl font-bold text-white italic font-serif tracking-tight leading-tight">{dest.name}</h4>
                     <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MapPin size={10} className="text-gray-500" />
                        <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Select Intention</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-12 border-t border-white/5 max-w-7xl mx-auto w-full flex justify-between items-center">
               <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-bold">Maison Niche Collection 2026</p>
               <div className="flex gap-4">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-widest">12 Sanctuaries Available</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
