'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Wind, Sparkles, Navigation } from 'lucide-react';
import { VibeTag } from './VibeTag';
import { InteractiveMap } from './InteractiveMap';
import { ImageWithFallback } from './ImageWithFallback';

interface SanctuaryPortalProps {
  destination: {
    id: string;
    name: string;
    description: string;
    image: string;
    vibe: string;
    highlights: string[];
    latitude: number;
    longitude: number;
  };
}

export function SanctuaryPortal({ destination }: SanctuaryPortalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative group">
      <motion.div
        layout
        onClick={() => setIsExpanded(true)}
        className="cursor-pointer bg-emerald/5 border border-white/10 rounded-[2.5rem] overflow-hidden group shadow-2xl hover:border-accent/40 transition-all duration-700"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <ImageWithFallback 
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          
          {/* Permanent Luxury Gradient (No more blackout hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051612]/90 via-[#051612]/20 to-transparent opacity-80" />
          
          <div className="absolute bottom-8 left-8 right-8 z-20">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-6 h-[1px] bg-accent" />
                   <h3 className="text-3xl font-bold text-white italic font-serif tracking-tighter">
                     {destination.name}
                   </h3>
                </div>
                <VibeTag label={destination.vibe} />
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 backdrop-blur-md flex items-center justify-center text-accent border border-accent/30 group-hover:bg-accent group-hover:text-luxury transition-all duration-500">
                <Navigation size={16} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-luxury/95 backdrop-blur-3xl"
          >
            <motion.div
              layoutId={destination.id}
              className="w-full max-w-7xl h-full bg-[#0a0a0a] rounded-[3.5rem] border border-white/10 overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
            >
              {/* Map Layer (The "Expanded Map") */}
              <div className="w-full md:w-1/2 h-[40vh] md:h-full relative bg-gray-900 border-r border-white/5">
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-luxury/40 to-transparent" />
                <InteractiveMap />
                <div className="absolute top-8 left-8 z-20">
                   <div className="bg-luxury/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                      <MapPin size={14} className="text-accent" />
                      <span className="text-[10px] text-white uppercase tracking-widest font-bold">
                        Coordinates: {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                      </span>
                   </div>
                </div>
              </div>

              {/* Content Layer (The "Heritage Notes") */}
              <div className="w-full md:w-1/2 p-12 md:p-20 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="flex justify-between items-start mb-12">
                   <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Sanctuary Details</h3>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setIsExpanded(false);
                     }}
                     className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                   >
                     <X size={20} />
                   </button>
                </div>

                <h2 className="text-5xl md:text-7xl font-bold text-white italic font-serif tracking-tighter mb-8">
                  {destination.name}
                </h2>

                <p className="text-gray-400 text-lg font-light leading-relaxed mb-12 italic">
                  "{destination.description}"
                </p>

                <div className="grid grid-cols-1 gap-8 mb-16">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-6 group/item">
                       <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-luxury transition-all">
                          {i === 0 ? <Sparkles size={20} /> : <Wind size={20} />}
                       </div>
                       <div>
                          <p className="text-white font-bold tracking-tight">{h}</p>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Heritage Priority</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="text-center md:text-left">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-1">Status</p>
                      <p className="text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Available 2026
                      </p>
                   </div>
                   <button className="bg-accent text-luxury px-12 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-accent/20 w-full md:w-auto">
                     Explore In-Person
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
