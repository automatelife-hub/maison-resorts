'use client';

import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'framer-motion';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { useRouter } from 'next/navigation';

export function HeritageGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [activeDestination, setActiveDestination] = useState<any>(null);
  
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  
  const r = useSpring(0, {
    stiffness: 280,
    damping: 40,
    mass: 1,
    restDelta: 0.001,
  });

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const markers = FEATURED_DESTINATIONS.map(dest => ({
      location: [dest.latitude, dest.longitude] as [number, number],
      size: 0.1,
    }));

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.03, 0.03, 0.03],
      markerColor: [0.83, 0.68, 0.21], // Gold (#d4af37)
      glowColor: [0.1, 0.1, 0.1],
      markers: markers,
      onRender: (state: any) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + r.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    } as any);

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[800px] mx-auto flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 200);
          }
        }}
        className="w-full h-full cursor-grab opacity-0 transition-opacity duration-1000"
        style={{ width: '100%', height: '100%', maxWidth: '100%', aspectRatio: '1' }}
      />

      {/* Floating Labels (Simulated Polaroids) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className="text-center">
            <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent mb-4 font-bold animate-pulse">
               Global Collection
            </h3>
            <p className="text-[8px] uppercase tracking-[0.3em] text-gray-600 font-bold max-w-[200px] mx-auto leading-relaxed">
               Spin to discover hidden heritage sanctuaries
            </p>
         </div>
      </div>

      {/* Quick Navigation UI */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
        {FEATURED_DESTINATIONS.slice(0, 3).map((dest) => (
          <button
            key={dest.id}
            onClick={() => router.push(`/explore?dest=${dest.id}`)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-[8px] uppercase tracking-widest text-white hover:bg-accent hover:text-luxury transition-all pointer-events-auto"
          >
            {dest.name}
          </button>
        ))}
      </div>
    </div>
  );
}
