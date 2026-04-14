'use client';

import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { DestinationCard } from '@/components/DestinationCard';
import { VibeTag } from '@/components/VibeTag';
import { InteractiveMap } from '@/components/InteractiveMap';

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-luxury">
          Curated <span className="text-accent">Destinations</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          For the discerning traveler seeking conscious authenticity and hidden heritage. 
          Discover the European niche vacation spots defining the 2026 travel landscape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {FEATURED_DESTINATIONS.map((dest) => (
          <div key={dest.id} className="space-y-6">
            <DestinationCard
              countryCode={dest.countryCode}
              countryName={dest.name}
              image={dest.image}
            />
            <div className="px-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-luxury">{dest.name}</h3>
                <VibeTag vibe={dest.vibe} />
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {dest.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {dest.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-accent text-lg">✦</span>
                    {highlight}
                  </div>
                ))}
              </div>
              
              {/* SEO Meta Section (Visual for now) */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {dest.seoKeywords.map((keyword) => (
                  <span key={keyword} className="text-[10px] uppercase tracking-wider text-gray-400">
                    #{keyword.replace(/\s+/g, '-')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-luxury rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
            alt="Background pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">The MAISON Philosophy</h2>
          <p className="max-w-3xl mx-auto text-gray-300 mb-8 leading-relaxed">
            At Maison, we don't just book rooms; we facilitate voyages. Our 2026 collection is rooted in 
            "conscious authenticity"—moving away from generic opulence toward narrative-driven sanctuaries 
            that feel like private homes. Discover the soul of the Mediterranean, the silence of the Arctic, 
            and the heritage of the Alps.
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-accent text-3xl font-bold mb-1">01</div>
              <div className="text-sm uppercase tracking-widest">Heritage</div>
            </div>
            <div className="text-center">
              <div className="text-accent text-3xl font-bold mb-1">02</div>
              <div className="text-sm uppercase tracking-widest">Seclusion</div>
            </div>
            <div className="text-center">
              <div className="text-accent text-3xl font-bold mb-1">03</div>
              <div className="text-sm uppercase tracking-widest">Narrative</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-luxury mb-4">Discovery Map</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Explore our sanctuary collection geographically.</p>
        </div>
        <InteractiveMap />
      </div>
    </div>
  );
}
