'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // High-end placeholder based on our Emerald/Gold theme
  const fallbackSrc = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className={`relative overflow-hidden bg-emerald/20 ${className}`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-emerald/10 flex items-center justify-center">
           <div className="w-12 h-[1px] bg-accent/20" />
        </div>
      )}
      <motion.img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {/* Subtle branding overlay for all images */}
      <div className="absolute inset-0 bg-emerald/5 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
