'use client';

import { useRef } from 'react';
import { TOP_DEALS, DealItem } from '@/data/deals';
import { PriceDisplay } from './PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';
import Link from 'next/link';

export function TopDealsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = usePreferences();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-luxury overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-between items-end">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold">Limited Voyages</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white italic font-serif">Top <span className="text-accent">25 Sanctuary</span> Deals</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-accent hover:text-accent transition-all"
          >
            ←
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-accent hover:text-accent transition-all"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[calc((100vw-min(1280px,100vw-2rem))/2)]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TOP_DEALS.map((deal) => (
          <div 
            key={deal.id} 
            className="flex-shrink-0 w-[300px] md:w-[400px] snap-start group"
          >
            <Link href={`/explore`} className="block">
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden mb-6 shadow-2xl transition-all group-hover:shadow-accent/5">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury/90 via-luxury/20 to-transparent" />
                
                <div className="absolute top-8 left-8">
                  <div className="bg-accent text-luxury px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {deal.discount}
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-2 font-bold">{deal.location}</p>
                  <h4 className="text-2xl font-bold text-white mb-6 line-clamp-1 italic font-serif">{deal.name}</h4>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-400 line-through mb-1">
                        <PriceDisplay price={deal.originalPrice} currency={currency} />
                      </p>
                      <PriceDisplay 
                        price={deal.dealPrice} 
                        currency={currency} 
                        className="text-2xl font-bold text-white" 
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase tracking-widest text-accent font-bold mb-2 animate-pulse">{deal.expiry}</p>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-accent transition-all">
                        Secure Deal →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center gap-8">
          <div className="flex-1 h-[1px] bg-white/5" />
          <p className="text-[8px] uppercase tracking-[0.5em] text-gray-600 font-bold">Scroll to discover all 25 sanctuaries</p>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
      </div>
    </section>
  );
}
