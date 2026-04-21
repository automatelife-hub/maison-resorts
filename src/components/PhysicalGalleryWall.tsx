'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { PriceDisplay } from './PriceDisplay';
import { ImageWithFallback } from './ImageWithFallback';

interface GalleryHotel {
  id: string;
  name: string;
  location: string;
  image: string;
  vibe: string;
  description: string;
}

export function PhysicalGalleryWall({ hotels }: { hotels: GalleryHotel[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-85%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#051612]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Background Decorative Color */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-[#062c21] rounded-full blur-[150px]" />
        </div>

        {/* Gallery Title Overlay */}
        <div className="absolute top-24 left-12 z-20">
           <h3 className="text-[10px] uppercase tracking-[1em] text-accent/60 font-bold mb-4">Maison Collection</h3>
           <h2 className="text-5xl md:text-7xl font-bold text-white italic font-serif tracking-tighter leading-tight">The 2026 <br/><span className="text-accent">Gallery</span></h2>
        </div>

        <motion.div style={{ x }} className="flex gap-16 pl-[10%]">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              className="group relative h-[75vh] w-[500px] flex-shrink-0 overflow-hidden rounded-[4rem] shadow-2xl border border-white/5 bg-luxury"
            >
              <ImageWithFallback
                src={hotel.image}
                alt={hotel.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[4s] group-hover:scale-105"
              />
              
              {/* Refined Color Overlay - No more blackout */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#051612] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-16 left-12 right-12 text-white z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-8 h-[1px] bg-accent" />
                   <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">{hotel.vibe}</p>
                </div>
                <h3 className="text-5xl font-bold tracking-tighter italic font-serif mb-6 leading-tight">
                  {hotel.name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-10 group-hover:text-white transition-colors duration-500">
                  {hotel.location}
                </p>
                
                <div className="inline-block bg-accent/10 backdrop-blur-xl border border-accent/20 px-10 py-4 rounded-full text-[8px] uppercase tracking-[0.3em] font-bold text-accent cursor-default">
                  Collective Inspiration
                </div>
              </div>

              {/* Numbering (Gallery Style) */}
              <div className="absolute top-12 right-12 opacity-10">
                 <span className="text-6xl font-serif italic text-white font-bold leading-none">{(index + 1).toString().padStart(2, '0')}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        <div className="absolute bottom-24 right-24 flex items-center gap-6">
           <span className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-bold">Slide to Reveal</span>
           <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                 style={{ scaleX: scrollYProgress }} 
                 className="absolute inset-0 bg-accent origin-left" 
              />
           </div>
        </div>
      </div>
    </section>
  );
}
