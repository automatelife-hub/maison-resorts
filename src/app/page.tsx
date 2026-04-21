'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecentSearches } from '@/components/RecentSearches';
import { Recommendations } from '@/components/Recommendations';
import { TopDealsCarousel } from '@/components/TopDealsCarousel';
import { LuxuryHero } from '@/components/LuxuryHero';
import { Skeleton } from '@/components/Skeleton';
import { ArrowRight } from 'lucide-react';
import { PhysicalGalleryWall } from '@/components/PhysicalGalleryWall';
import { ConciergeSearch } from '@/components/ConciergeSearch';
import { Plane, Building2, ShieldCheck, Globe } from 'lucide-react';

export default function Home() {
  const [featuredSpots, setFeaturedSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/featured-hotels');
        if (response.ok) {
          const data = await response.json();
          setFeaturedSpots(data);
        }
      } catch (err) {
        console.error('Failed to load featured spots');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Luxury Remotion-Powered Hero */}
      <LuxuryHero />

      {/* Philosophy Section */}
      <main className="flex-1 bg-white">
        <section className="py-32 bg-white text-luxury">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            {/* Manifesto Content */}
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
            {/* Visuals */}
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
              <div className="absolute -bottom-12 -right-12 w-64 h-64 border-r border-b border-accent/20 rounded-[4rem] z-0" />
            </div>
          </div>
        </section>

        {/* Logistics of Luxury - NEW SECTION */}
        <section className="py-48 bg-emerald text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px]" />
          </div>
          
          <div className="max-w-7xl mx-auto px-12 relative z-10">
            <div className="text-center mb-32">
               <h3 className="text-[10px] uppercase tracking-[0.6em] text-accent mb-6 font-bold">Comprehensive Capabilities</h3>
               <h2 className="text-6xl md:text-8xl font-bold italic font-serif tracking-tighter leading-none">
                 The Logistics of <br/><span className="text-accent">Luxury</span>
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Voyages (Flights) */}
               <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-16 group hover:border-accent/40 transition-all duration-700">
                  <div className="w-20 h-20 rounded-[2rem] bg-accent/20 flex items-center justify-center text-accent mb-12 group-hover:scale-110 transition-transform">
                     <Plane size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-4xl font-bold italic font-serif mb-6 tracking-tight">Celestial <span className="text-accent">Voyages</span></h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light mb-12">
                    Access 1.5M+ global flight routes including elite commercial cabins and 
                    private heritage charters. Every connection is monitored by the Maison 
                    logistics center.
                  </p>
                  <ul className="space-y-4 mb-16">
                    {['Global Route Intelligence', 'Lounge Sanctuary Access', 'Baggage Concierge'].map(item => (
                      <li key={item} className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-500">
                         <div className="w-1 h-1 rounded-full bg-accent" />
                         {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/flights" className="inline-block bg-white text-luxury px-12 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-2xl">
                     Book Voyage
                  </Link>
               </div>

               {/* Sanctuaries (Hotels) */}
               <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-16 group hover:border-accent/40 transition-all duration-700">
                  <div className="w-20 h-20 rounded-[2rem] bg-accent/20 flex items-center justify-center text-accent mb-12 group-hover:scale-110 transition-transform">
                     <Building2 size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-4xl font-bold italic font-serif mb-6 tracking-tight">Terrestrial <span className="text-accent">Sanctuaries</span></h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light mb-12">
                    Our 2026 collection features over 2 million hand-vetted properties. 
                    From private islands to high-altitude retreats, we locate the 
                    precise frequency of your intention.
                  </p>
                  <ul className="space-y-4 mb-16">
                    {['Conscious Vibe Vetting', 'Heritage Verified Rates', 'Elite Status Recognition'].map(item => (
                      <li key={item} className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-500">
                         <div className="w-1 h-1 rounded-full bg-accent" />
                         {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/results" className="inline-block border border-white/20 text-white px-12 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-luxury transition-all">
                     Enter Collection
                  </Link>
               </div>
            </div>

            <div className="mt-32 flex justify-center">
               <div className="flex flex-col md:flex-row items-center gap-12 bg-luxury/50 backdrop-blur-xl px-12 py-8 rounded-[3rem] border border-white/5">
                  <div className="flex items-center gap-4">
                     <ShieldCheck className="text-accent" size={20} />
                     <span className="text-[10px] uppercase tracking-widest font-bold">Maison Unified Protection</span>
                  </div>
                  <div className="w-px h-6 bg-white/10 hidden md:block" />
                  <div className="flex items-center gap-4">
                     <Globe className="text-accent" size={20} />
                     <span className="text-[10px] uppercase tracking-widest font-bold">24/7 Global Oversight</span>
                  </div>
               </div>
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

        {/* Heritage Stories */}
        <section className="py-32 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
              <h3 className="text-[10px] uppercase tracking-[0.6em] text-accent mb-6 font-bold">The Heritage Series</h3>
              <h2 className="text-5xl md:text-7xl font-bold text-luxury italic font-serif tracking-tighter">Stories of <span className="text-accent">Arrival</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="relative group cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden rounded-[3rem] shadow-2xl mb-8">
                  <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Coastal Story" />
                </div>
                <div className="px-4">
                  <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-4">Volume 01: Mediterranean Silence</p>
                  <h4 className="text-3xl font-bold text-luxury italic font-serif mb-4 tracking-tight">The Unspoken Beauty of the Albanian Riviera</h4>
                  <p className="text-gray-500 font-light leading-relaxed">How a return to primitive luxury is reshaping the southern coast of Europe.</p>
                </div>
              </div>
              <div className="relative group cursor-pointer mt-12 md:mt-24">
                <div className="aspect-[16/9] overflow-hidden rounded-[3rem] shadow-2xl mb-8">
                  <img src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Mountain Story" />
                </div>
                <div className="px-4">
                  <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-4">Volume 02: High-Altitude Recovery</p>
                  <h4 className="text-3xl font-bold text-luxury italic font-serif mb-4 tracking-tight">Bohinj: The Glacial Answer to Digital Fatigue</h4>
                  <p className="text-gray-500 font-light leading-relaxed">Why the Julian Alps have become the primary destination for nervous-system restoration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 2026 Collection (Horizontal Scroll) */}
        {!loading && featuredSpots.length > 0 && (
          <PhysicalGalleryWall hotels={featuredSpots} />
        )}

        {/* Member Testimonials */}
        <section className="py-48 bg-white overflow-hidden">
           <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="relative">
                    <div className="w-full aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10">
                       <img src="https://images.unsplash.com/photo-1522333323-32663f133d62?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale" alt="Member" />
                       <div className="absolute inset-0 bg-accent/20 mix-blend-overlay" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent rounded-[2rem] flex items-center justify-center p-8 z-20 shadow-2xl">
                       <p className="text-luxury font-serif italic text-2xl font-bold text-center leading-tight">Member Verified 2026</p>
                    </div>
                 </div>
                 <div className="space-y-12">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">The Member Voice</span>
                    <h2 className="text-6xl font-bold text-luxury italic font-serif leading-tight tracking-tighter">"A return to the <br/>essence of <span className="text-accent">escape.</span>"</h2>
                    <p className="text-gray-500 text-xl font-light leading-relaxed italic">
                       "The Maison concierge didn't just find me a room; they located a frequency. 
                       My stay in Pantelleria was the first time in a decade I've truly felt 
                       unconnected from the noise and reconnected to the Earth."
                    </p>
                    <div>
                       <p className="text-luxury font-bold uppercase tracking-widest text-[10px]">Elena Von Heritage</p>
                       <p className="text-gray-400 uppercase tracking-[0.2em] text-[8px] mt-2">Maison Elysium Member</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
