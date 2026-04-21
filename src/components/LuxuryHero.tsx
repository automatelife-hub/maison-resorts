'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Player } from '@remotion/player';
import { CinematicBackground } from '../remotion/CinematicBackground';
import { Search, ChevronRight, MapPin, Zap, Building2, Plane, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IntentionGallery } from './IntentionGallery';
import { SanctuaryPlanner } from './SanctuaryPlanner';

export const LuxuryHero: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* 3D Parallax Video Background */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 z-0"
      >
        <Player
          component={CinematicBackground}
          durationInFrames={300}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          loop
          autoPlay
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#051612]/40 via-transparent to-[#051612] z-10" />
        <div className="absolute inset-0 bg-[#062c21]/20 mix-blend-overlay z-10" />
      </motion.div>

      {/* Floating Brand Mark */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 z-30"
      >
        <p className="text-[10px] uppercase tracking-[1em] text-accent/60 font-bold">Maison Resorts</p>
      </motion.div>

      {/* The Main Narrative */}
      <div className="relative z-20 text-center px-6">
        <motion.div
          style={{ y: y1, opacity }}
          className="space-y-8"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-bold block mb-4">
            EST. 2026 — COLLECTIVE NO. 01
          </span>
          <h1 className="text-7xl md:text-[12rem] font-bold text-white italic font-serif tracking-tighter leading-[0.8] transition-all">
            The <span className="text-accent italic">Art</span> of <br />
            <span className="relative inline-block">
              Arrival
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                className="absolute -bottom-4 left-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
              />
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-2xl font-light leading-relaxed pt-12 italic">
            "We don't just book rooms; we locate a frequency."
          </p>
        </motion.div>
      </div>

      {/* The Floating Prism (Search) */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-24 z-40 w-full max-w-lg px-6"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-1 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] group/prism">
           <div className="relative flex items-center p-2">
              <div className="flex-1 pl-8">
                 <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-2 font-bold">Intention</p>
                 <IntentionGallery 
                    value={destination}
                    onChange={(val) => setDestination(val)}
                 />
              </div>
              
              <button
                onClick={() => destination && router.push(`/results?destination=${encodeURIComponent(destination)}`)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-16 h-16 bg-accent text-luxury rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-accent/20 relative overflow-hidden"
              >
                 <AnimatePresence mode="wait">
                    {isHovered ? (
                      <motion.div key="zap" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                        <Zap size={22} fill="currentColor" />
                      </motion.div>
                    ) : (
                      <motion.div key="arrow" initial={{ x: -20 }} animate={{ x: 0 }} exit={{ x: 20 }}>
                        <ChevronRight size={28} strokeWidth={3} />
                      </motion.div>
                    )}
                 </AnimatePresence>
              </button>
           </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-12 text-[8px] uppercase tracking-[0.3em] text-gray-600 font-bold">
           <div className="flex items-center gap-2"><MapPin size={10} className="text-accent/40" /> 12 Sanctuaries</div>
           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-accent animate-pulse" /> Verified 2026</div>
        </div>
      </motion.div>

      {/* Decorative Side Elements (Vogue Style) */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-24 items-center">
         <div className="w-[1px] h-32 bg-gradient-to-t from-white/20 to-transparent" />
         <p className="rotate-90 text-[8px] uppercase tracking-[0.8em] text-gray-600 whitespace-nowrap origin-center">Precision Escape</p>
         <div className="w-[1px] h-32 bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      <div className="absolute right-12 bottom-12 hidden md:block">
         <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-2xl max-w-[200px]">
            <p className="text-[10px] text-white font-bold italic font-serif mb-2">Featured Collection</p>
            <p className="text-[8px] text-gray-500 leading-relaxed uppercase tracking-widest">
               Handpicked sanctuaries defining the European frontier.
            </p>
         </div>
      </div>
    </section>
  );
};
