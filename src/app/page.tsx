'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import Link from 'next/link';
import { RecentSearches } from '@/components/RecentSearches';
import { PlaceAutocomplete } from '@/components/PlaceAutocomplete';

export default function Home() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<'hotels' | 'flights'>('hotels');
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [placeId, setPlaceId] = useState<string | undefined>();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkInDate,
      checkOutDate,
      guests: guests.toString(),
    });
    
    if (searchType === 'flights') {
      params.append('origin', origin);
      router.push(`/flights?${params}`);
    } else {
      if (placeId) params.append('placeId', placeId);
      router.push(`/results?${params}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[0.3]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-and-swimming-pool-4258-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-luxury bg-opacity-60 z-10" />
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => setSearchType('hotels')}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all ${searchType === 'hotels' ? 'bg-accent text-luxury' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Sanctuaries
            </button>
            <button 
              onClick={() => setSearchType('flights')}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all ${searchType === 'flights' ? 'bg-accent text-luxury' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Voyages
            </button>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white tracking-tighter">
            MAISON <span className="text-accent italic font-light">Resorts</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {searchType === 'hotels' 
              ? 'faciliating the voyage, honoring the heritage.' 
              : 'the art of arrival, refined air travel.'}
            <br/>
            experience conscious authenticity in every stay.
          </p>

          <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-5xl mx-auto">
            {searchType === 'flights' && (
              <div className="flex-1 px-4 py-2 border-r border-gray-100 last:border-0">
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="From where?"
                  className="w-full text-luxury focus:outline-none font-medium bg-transparent"
                  required
                />
              </div>
            )}
            <div className="flex-1 px-4 py-2 border-r border-gray-100 last:border-0">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                {searchType === 'hotels' ? 'Destination' : 'Arrival'}
              </label>
              <PlaceAutocomplete
                value={destination}
                onChange={(val, id) => {
                  setDestination(val);
                  setPlaceId(id);
                }}
                placeholder={searchType === 'hotels' ? 'Where to?' : 'Going where?'}
                className="w-full text-luxury focus:outline-none font-medium bg-transparent"
              />
            </div>
            <div className="px-4 py-2 border-r border-gray-100 last:border-0">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                {searchType === 'hotels' ? 'Check-in' : 'Departure'}
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full text-luxury focus:outline-none font-medium"
                required
              />
            </div>
            {searchType === 'hotels' && (
              <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full text-luxury focus:outline-none font-medium"
                  required
                />
              </div>
            )}
            <button type="submit" className="bg-luxury text-accent px-8 py-4 rounded-xl font-bold hover:bg-black transition-all uppercase tracking-widest text-xs">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-luxury leading-tight">
              A Shift Toward <br/>
              <span className="text-accent italic font-serif">Conscious Authenticity</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              For 2026, we are redefining the luxury landscape. Move away from generic opulence 
              and embrace narrative-driven experiences. We feature niche vacation spots across Europe 
              that prioritize silence, heritage reimagined, and cultural immersion.
            </p>
            <Link 
              href="/explore" 
              className="inline-block border-b-2 border-accent pb-1 text-luxury font-bold tracking-widest text-sm hover:text-accent transition-colors"
            >
              EXPLORE OUR 2026 COLLECTION →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" 
              className="rounded-2xl h-64 w-full object-cover mt-8" 
              alt="Luxury interior" 
            />
            <img 
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" 
              className="rounded-2xl h-64 w-full object-cover" 
              alt="Coastal view" 
            />
          </div>
        </div>
      </section>

      {/* Featured Niche Spots */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Discovery</h3>
              <h2 className="text-4xl font-bold text-luxury">Featured Niche Spots</h2>
            </div>
            <Link href="/explore" className="text-gray-400 hover:text-luxury transition-colors text-sm">View all destinations</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_DESTINATIONS.slice(0, 3).map((dest) => (
              <Link key={dest.id} href="/explore" className="group">
                <div className="relative h-[400px] overflow-hidden rounded-3xl mb-4 shadow-xl">
                  <img 
                    src={dest.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={dest.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-[10px] uppercase tracking-widest mb-2 opacity-80">{dest.vibe}</p>
                    <h4 className="text-2xl font-bold">{dest.name}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Searches / Social Proof */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
           <RecentSearches />
        </div>
      </section>
    </div>
  );
}
