'use client';

import { useRef, useEffect, useState } from 'react';
import { PriceDisplay } from './PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import { Skeleton } from './Skeleton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function TopDealsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = usePreferences();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/top-deals');
        if (response.ok) {
          const data = await response.json();
          setDeals(data);
        }
      } catch (err) {
        console.error('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-32 bg-emerald overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <Skeleton className="h-10 w-64 mb-4 bg-white/5" />
          <Skeleton className="h-16 w-full max-w-xl bg-white/5" />
        </div>
        <div className="flex gap-8 px-12 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="flex-shrink-0 w-[400px] h-[600px] rounded-[3.5rem] bg-white/5" />
          ))}
        </div>
      </section>
    );
  }

  if (deals.length === 0) return null;

  return (
    <section className="py-48 bg-luxury relative overflow-hidden">
      {/* Background Decorative Color */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-emerald rounded-full blur-[150px]" />
         <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-[1px] bg-accent/40" />
             <h3 className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold">Limited Offerings</h3>
          </div>
          <h2 className="text-6xl md:text-8xl font-bold text-white italic font-serif tracking-tighter leading-none">
            Top <span className="text-accent">Sanctuary</span> <br/>Reductions
          </h2>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-luxury hover:border-accent transition-all duration-500 shadow-2xl"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-luxury hover:border-accent transition-all duration-500 shadow-2xl"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-10 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 md:px-[calc((100vw-min(1280px,100vw-2rem))/2)]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {deals.map((deal) => (
          <motion.div 
            key={deal.id} 
            whileHover={{ y: -10 }}
            className="flex-shrink-0 w-[85vw] md:w-[450px] snap-start group"
          >
            <Link href={`/hotel/${deal.id}`} className="block">
              <div className="relative h-[650px] rounded-[4rem] overflow-hidden mb-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-1000 group-hover:border-accent/30">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                
                {/* Emerald/Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                
                <div className="absolute top-10 left-10">
                  <div className="bg-accent/90 backdrop-blur-md text-luxury px-6 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
                    <Sparkles size={12} />
                    {deal.discount}
                  </div>
                </div>

                <div className="absolute bottom-12 left-10 right-10">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                     {deal.location}
                  </p>
                  <h4 className="text-4xl font-bold text-white mb-8 line-clamp-2 italic font-serif leading-tight">{deal.name}</h4>
                  
                  <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-2 font-bold">{deal.vibe}</p>
                      <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-1">{deal.description}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-luxury group-hover:border-accent transition-all duration-500">
                       <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex items-center gap-12 opacity-20">
          <div className="flex-1 h-[1px] bg-white" />
          <p className="text-[10px] uppercase tracking-[0.8em] text-white font-bold whitespace-nowrap">Maison Elite Series</p>
          <div className="flex-1 h-[1px] bg-white" />
        </div>
      </div>
    </section>
  );
}
