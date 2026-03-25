'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
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
    router.push(`/results?${params}`);
  };

  return (
    <div className="bg-gradient-to-br from-luxury via-gray-900 to-luxury text-white min-h-[600px] flex items-center">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Discover Luxury <span className="text-accent">Stays</span>
          </h1>
          <p className="text-xl text-gray-300">Find and book premium hotels worldwide</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm mb-2">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City or hotel name"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Check-in</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Check-out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:border-accent"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="bg-luxury">
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-accent text-luxury font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all">
            Search Hotels
          </button>
        </form>
      </div>
    </div>
  );
}
