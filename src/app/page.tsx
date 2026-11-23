'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, Search } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  // Search box state
  const [destination, setDestination] = useState('Amalfi Coast, Italy');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    setCheckIn(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);
    setCheckOut(new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const occupancies = JSON.stringify([{ adults: parseInt(guests) || 2 }]);
    router.push(`/results?destination=${encodeURIComponent(destination)}&checkInDate=${checkIn}&checkOutDate=${checkOut}&occupancies=${encodeURIComponent(occupancies)}`);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-gray-50 border-b border-gray-200 pt-32 pb-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-light leading-[1.05] tracking-tight mb-8 max-w-[950px] mx-auto text-monocle-fg italic">
            Simple and Reliable <br />Resort Bookings.
          </h1>
          <p className="text-base md:text-lg text-monocle-muted font-serif italic max-w-[650px] mx-auto mb-16 leading-relaxed">
            Find the perfect resort for your next trip. Browse top-rated properties, compare direct flight connections, and book instantly.
          </p>

          {/* Simple Booking Search Form */}
          <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row max-w-4xl mx-auto text-left overflow-hidden">
            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Destination</label>
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-full text-gray-800"
                  placeholder="Where are you going?"
                  required
                />
              </div>
            </div>

            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Check In</label>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-full text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Check Out</label>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-full text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="flex-1 p-5 border-b md:border-b-0 border-gray-200">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">Guests</label>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-full text-gray-800"
                  required
                />
              </div>
            </div>

            <button type="submit" className="bg-monocle-fg hover:bg-monocle-accent text-monocle-bg hover:text-white px-10 py-6 md:py-0 transition-colors uppercase tracking-[0.15em] text-[11px] font-bold">
              Find Resorts
            </button>
          </form>
        </div>
      </section>

      {/* Featured Destinations Grid */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-monocle-accent mb-6 font-bold block">
            WHY BOOK WITH US
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-monocle-fg italic mb-8">
            Seamless Booking for <br />Your Whole Trip.
          </h2>
          <p className="text-base text-monocle-muted font-serif italic mb-12 leading-relaxed">
            We take the hassle out of travel planning. Book both your flights and hotels in one place, with instant confirmations and guaranteed rates.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-monocle-fg font-bold mb-3">Global Search</h4>
              <p className="text-sm text-monocle-muted leading-relaxed font-light">
                Access direct live inventory from top-rated hotels and airlines worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-monocle-fg font-bold mb-3">Instant Confirmation</h4>
              <p className="text-sm text-monocle-muted leading-relaxed font-light">
                No waiting or hidden fees. Confirm your booking instantly with guaranteed rates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Santorini */}
          <Link href="/results?destination=Santorini" className="group block border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800"
                alt="Santorini, Greece"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Greece</span>
              <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                Santorini Private Estate
              </h3>
              <p className="text-sm text-gray-500 font-serif italic">From $1,200 / night</p>
            </div>
          </Link>

          {/* Tuscany */}
          <Link href="/results?destination=Tuscany" className="group block border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800"
                alt="Tuscany, Italy"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Italy</span>
              <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                Tuscan Vineyard Villa
              </h3>
              <p className="text-sm text-gray-500 font-serif italic">From $950 / night</p>
            </div>
          </Link>

          {/* Bali */}
          <Link href="/results?destination=Bali" className="group block border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"
                alt="Bali, Indonesia"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Indonesia</span>
              <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                Ubud Rainforest Retreat
              </h3>
              <p className="text-sm text-gray-500 font-serif italic">From $1,100 / night</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
