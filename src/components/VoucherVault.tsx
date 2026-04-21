'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PriceDisplay } from './PriceDisplay';

interface Voucher {
  id: string;
  name: string;
  code: string;
  value: number;
  discountType: string;
  description: string;
}

interface VoucherVaultProps {
  vouchers: Voucher[];
}

export function VoucherVault({ vouchers }: VoucherVaultProps) {
  return (
    <div className="relative h-[500px] w-full flex items-center justify-center perspective-[1200px]">
      {vouchers.map((v, i) => (
        <VoucherCard key={v.id} voucher={v} index={i} total={vouchers.length} />
      ))}
    </div>
  );
}

function VoucherCard({ voucher, index, total }: { voucher: Voucher, index: number, total: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });

  // Stacked offset
  const initialZ = -index * 40;
  const initialY = index * 10;
  
  return (
    <motion.div
      layout
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - (rect.left + rect.width / 2));
        mouseY.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, z: initialZ, y: initialY }}
      animate={{ 
        opacity: 1, 
        z: isExpanded ? 100 : initialZ, 
        y: isExpanded ? -50 : initialY,
        scale: isExpanded ? 1.1 : 1
      }}
      style={{ 
        rotateX, 
        rotateY,
        zIndex: isExpanded ? 50 : total - index,
        transformStyle: 'preserve-3d'
      }}
      className={`absolute w-full max-w-sm aspect-[1.6/1] cursor-pointer transition-shadow duration-500 ${isExpanded ? 'shadow-[0_50px_100px_rgba(212,175,55,0.2)]' : 'shadow-2xl'}`}
    >
      <div className="w-full h-full bg-[#111] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group">
         {/* Metallic Shimmer */}
         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
            <div className="absolute inset-[-100%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 animate-[shimmer_3s_infinite]" />
         </div>

         {/* Card Content */}
         <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-auto">
               <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent italic font-serif text-xl">
                  M
               </div>
               <div className="text-right">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-1">Maison Heritage</p>
                  <p className="text-[10px] text-white font-mono tracking-tighter">{voucher.code}</p>
               </div>
            </div>

            <div className="mb-6">
               <h3 className="text-2xl font-bold text-white italic font-serif tracking-tight mb-2">
                  {voucher.name}
               </h3>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-accent">
                    {voucher.discountType === 'percentage' ? `${voucher.value}%` : <PriceDisplay price={voucher.value} currency="USD" />}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Reduction</span>
               </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
               <p className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">Limited Edition 2026</p>
               <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-accent/30" />)}
               </div>
            </div>
         </div>

         {/* Embossed Texture (SVG Overlay) */}
         <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
            <svg width="100%" height="100%">
               <filter id="noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
               </filter>
               <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
         </div>
      </div>
    </motion.div>
  );
}
