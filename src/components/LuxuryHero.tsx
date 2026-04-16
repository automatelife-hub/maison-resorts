'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@remotion/player';
import { CinematicBackground } from '../remotion/CinematicBackground';
import { Plane, Building2, Calendar, Users, Search, ChevronRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceAutocomplete } from './PlaceAutocomplete';

export const LuxuryHero: React.FC = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState<'hotels' | 'flights'>('hotels');
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [placeId, setPlaceId] = useState<string | undefined>();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [occupancies, setOccupancies] = useState<any[]>([{ adults: 1, childrenAges: [] }]);
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkInDate,
      checkOutDate,
      occupancies: JSON.stringify(occupancies),
    });
    
    if (searchType === 'flights') {
      params.append('origin', origin);
      params.append('guests', occupancies.reduce((acc, curr) => acc + curr.adults + (curr.childrenAges?.length || 0), 0).toString());
      router.push(`/flights?${params}`);
    } else {
      if (placeId) params.append('placeId', placeId);
      router.push(`/results?${params}`);
    }
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Remotion Background Player */}
      <div className="absolute inset-0 z-0 opacity-60">
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
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
        {/* Tagline (BMW/Vogue Aesthetic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-4 block">
            Niche Collection 2026
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-white italic font-serif tracking-tighter leading-tight">
            The Precision of <br />
            <span className="text-accent">Escape</span>
          </h1>
        </motion.div>

        {/* The Cockpit (Search Bar) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-5xl"
        >
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-[3rem] shadow-2xl overflow-hidden relative group">
            {/* Mode Switcher */}
            <div className="flex gap-2 p-2 mb-2 relative z-10">
              <button
                onClick={() => setSearchType('hotels')}
                className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-500 text-[10px] uppercase tracking-widest font-bold ${
                  searchType === 'hotels' ? 'bg-white text-luxury shadow-xl' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Building2 size={14} className={searchType === 'hotels' ? 'text-accent' : ''} />
                Sanctuaries
              </button>
              <button
                onClick={() => setSearchType('flights')}
                className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-500 text-[10px] uppercase tracking-widest font-bold ${
                  searchType === 'flights' ? 'bg-white text-luxury shadow-xl' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Plane size={14} className={searchType === 'flights' ? 'text-accent' : ''} />
                Voyages
              </button>
            </div>

            {/* Search Form Fields */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-1 p-2 relative z-10">
              <div className="md:col-span-1 bg-white/5 p-6 rounded-[2rem] border border-transparent focus-within:border-accent/30 transition-all">
                <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-bold flex items-center gap-2">
                  <ChevronRight size={8} className="text-accent" />
                  Destination
                </p>
                <PlaceAutocomplete
                  value={destination}
                  onChange={(val, pId) => {
                    setDestination(val);
                    if (pId) setPlaceId(pId);
                  }}
                  placeholder={searchType === 'hotels' ? 'Where to?' : 'Going where?'}
                  className="bg-transparent border-none p-0 text-white text-sm focus:ring-0 placeholder:text-gray-600 font-medium"
                />
              </div>

              {searchType === 'flights' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 p-6 rounded-[2rem] border border-transparent focus-within:border-accent/30 transition-all"
                >
                  <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-bold flex items-center gap-2">
                    <ChevronRight size={8} className="text-accent" />
                    Origin
                  </p>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="From where?"
                    className="w-full bg-transparent border-none p-0 text-white text-sm focus:ring-0 placeholder:text-gray-600 font-medium"
                  />
                </motion.div>
              )}

              <div className="bg-white/5 p-6 rounded-[2rem] border border-transparent focus-within:border-accent/30 transition-all">
                <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-bold flex items-center gap-2">
                  <Calendar size={10} className="text-accent" />
                  Check In
                </p>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-white text-sm focus:ring-0 invert dark:invert-0 font-medium"
                />
              </div>

              <div className="bg-white/5 p-6 rounded-[2rem] border border-transparent focus-within:border-accent/30 transition-all relative">
                <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-bold flex items-center gap-2">
                  <Users size={10} className="text-accent" />
                  Voyagers
                </p>
                <button 
                  type="button"
                  className="w-full text-left text-white text-sm font-medium"
                >
                  {occupancies[0].adults} Adult
                </button>
                
                {/* The Ignition Trigger (Ferrari Style) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className="w-16 h-16 bg-accent text-luxury rounded-full flex items-center justify-center shadow-lg group/btn overflow-hidden relative"
                  >
                    <AnimatePresence mode="wait">
                      {isHovered ? (
                        <motion.div
                          key="zap"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                        >
                          <Zap size={24} fill="currentColor" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="search"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                        >
                          <Search size={24} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Glowing Ring */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping opacity-20" />
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Scroll Indicator (Apple Minimalism) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-24 text-[8px] uppercase tracking-[0.4em] text-gray-500 flex flex-col items-center gap-4"
        >
          <span>Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};
