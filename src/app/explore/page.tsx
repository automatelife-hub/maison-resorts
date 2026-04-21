'use client';

import { useState } from 'react';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { SanctuaryPortal } from '@/components/SanctuaryPortal';
import { HeritageGlobe } from '@/components/HeritageGlobe';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplorePage() {
  const [activeVibe, setActiveVibe] = useState('All');
  const vibes = ['All', 'Barefoot Luxury', 'Quiet Luxury', 'Intentional Travel', 'Slow Mode'];

  const filteredDestinations = activeVibe === 'All' 
    ? FEATURED_DESTINATIONS 
    : FEATURED_DESTINATIONS.filter(d => d.vibe === activeVibe);

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      {/* 3D Discovery Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent mb-6 font-bold">
               Discovery Interface v3.0
            </h3>
            <h1 className="text-6xl md:text-8xl font-bold italic font-serif tracking-tighter leading-tight mb-8">
               Explore the <br />
               <span className="text-accent">Collection</span>
            </h1>
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-xl mb-12">
               Our 2026 collection is a curated map of "Conscious Authenticity." 
               Spin the heritage globe to locate niche sanctuaries across the European frontier.
            </p>
            
            <div className="flex flex-wrap gap-4">
               {vibes.map((v) => (
                 <button 
                   key={v}
                   onClick={() => setActiveVibe(v)}
                   className={`px-6 py-3 rounded-full border text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${
                     activeVibe === v 
                       ? 'bg-accent text-luxury border-accent shadow-lg shadow-accent/20' 
                       : 'border-white/10 hover:border-accent hover:text-accent'
                   }`}
                 >
                   {v}
                 </button>
               ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeritageGlobe />
          </motion.div>
        </div>
      </section>

      {/* Masonry Collection */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex justify-between items-end mb-16 px-4">
           <div>
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2 font-bold">{activeVibe} Collection</h3>
             <h2 className="text-4xl font-bold text-white italic font-serif tracking-tighter italic">Niche <span className="text-accent">Sanctuaries</span></h2>
           </div>
           <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold hidden md:block">
             {filteredDestinations.length} Sanctuaries Found
           </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <SanctuaryPortal destination={dest} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 md:p-24 relative overflow-hidden group border border-white/10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px] animate-pulse" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 italic font-serif tracking-tighter">
                   The Maison <br /><span className="text-accent">Philosophy</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-light mb-12">
                   At Maison, we don't just book rooms; we facilitate voyages. Our 2026 collection is rooted in 
                   "conscious authenticity"—moving away from generic opulence toward narrative-driven sanctuaries 
                   that feel like private homes. Discover the soul of the Mediterranean, the silence of the Arctic, 
                   and the heritage of the Alps.
                </p>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { val: '01', label: 'Heritage' },
                    { val: '02', label: 'Seclusion' },
                    { val: '03', label: 'Narrative' }
                  ].map((item) => (
                    <div key={item.val} className="group/item">
                       <div className="text-accent text-4xl font-bold mb-2 italic font-serif group-hover/item:translate-y-[-4px] transition-transform duration-500">{item.val}</div>
                       <div className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-bold">{item.label}</div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
                  alt="Philosophy" 
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2000ms]"
                />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
