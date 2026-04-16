'use client';

import { FEATURED_DESTINATIONS } from '@/data/destinations';
import Link from 'next/link';
import { RecentSearches } from '@/components/RecentSearches';
import { Recommendations } from '@/components/Recommendations';
import { TopDealsCarousel } from '@/components/TopDealsCarousel';
import { LuxuryHero } from '@/components/LuxuryHero';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Luxury Remotion-Powered Hero */}
      <LuxuryHero />

      {/* Philosophy Section */}
      <main className="flex-1 bg-white">
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">The Manifesto</span>
                <h2 className="text-5xl md:text-6xl font-bold text-luxury leading-[1.1] tracking-tighter italic font-serif">
                  A Shift Toward <br/>
                  <span className="text-accent not-italic">Conscious Authenticity</span>
                </h2>
              </div>
              <p className="text-gray-500 leading-relaxed text-xl font-light">
                For 2026, we are redefining the luxury landscape. Move away from generic opulence 
                and embrace narrative-driven experiences. We feature niche vacation spots across Europe 
                that prioritize silence, heritage reimagined, and cultural immersion.
              </p>
              <Link 
                href="/explore" 
                className="inline-block border-b border-accent pb-2 text-luxury font-bold tracking-[0.2em] text-[10px] uppercase hover:text-accent transition-all"
              >
                Explore Collection 2026 →
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" 
                  className="rounded-[2.5rem] h-80 w-full object-cover mt-12 shadow-2xl" 
                  alt="Luxury interior" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" 
                  className="rounded-[2.5rem] h-80 w-full object-cover shadow-2xl shadow-accent/5" 
                  alt="Coastal view" 
                />
              </div>
              {/* BMW-style decorative element */}
              <div className="absolute -bottom-12 -right-12 w-64 h-64 border-r border-b border-accent/20 rounded-[4rem] z-0" />
            </div>
          </div>
        </section>

        {/* Top Deals Secondary Hero */}
        <TopDealsCarousel />

        {/* Recommendations Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <Recommendations />
          </div>
        </section>

        {/* Featured Niche Spots */}
        <section className="py-32 bg-luxury text-white rounded-[4rem] mx-4 md:mx-12 overflow-hidden shadow-2xl">
          <div className="max-w-7xl mx-auto px-12">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Discovery</h3>
                <h2 className="text-5xl font-bold italic font-serif tracking-tighter">Featured <span className="text-accent">Niche Spots</span></h2>
              </div>
              <Link href="/explore" className="text-gray-400 hover:text-accent transition-colors text-[10px] uppercase tracking-widest border-b border-white/10 pb-1">View Full Collection</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {FEATURED_DESTINATIONS.slice(0, 3).map((dest) => (
                <Link key={dest.id} href="/explore" className="group">
                  <div className="relative h-[500px] overflow-hidden rounded-[3rem] mb-6 shadow-2xl border border-white/5 transition-all duration-700 group-hover:scale-[0.98]">
                    <img 
                      src={dest.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] opacity-80 group-hover:opacity-100" 
                      alt={dest.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-10 left-10 text-white">
                      <p className="text-[10px] uppercase tracking-[0.3em] mb-4 text-accent font-bold">{dest.vibe}</p>
                      <h4 className="text-3xl font-bold tracking-tighter mb-2 italic font-serif">{dest.name}</h4>
                      <div className="w-0 group-hover:w-full h-[1px] bg-accent transition-all duration-700" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Searches / Social Proof */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
             <RecentSearches />
          </div>
        </section>
      </main>
    </div>
  );
}
