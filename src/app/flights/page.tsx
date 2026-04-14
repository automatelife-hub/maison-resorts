'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PriceDisplay } from '@/components/PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const { currency } = usePreferences();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const guests = searchParams.get('guests') || '1';

  useEffect(() => {
    if (!origin || !destination || !departureDate) {
      setLoading(false);
      return;
    }

    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/flights/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin,
            destination,
            departureDate,
            adults: parseInt(guests),
            currency,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch flight voyages');
        const data = await response.json();
        setFlights(data.flights || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search voyages');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, departureDate, guests, currency]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 italic font-serif text-luxury">Finding Your <span className="text-accent">Voyage</span></h1>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || flights.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <EmptyState 
          title="No Voyages Found" 
          description={error || `No flights available from ${origin} to ${destination} on ${departureDate}.`} 
          icon="✈️" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Available Voyages</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">From {origin} to <span className="text-accent">{destination}</span></h1>
        <p className="text-gray-500 mt-4 uppercase tracking-widest text-[10px]">{departureDate} • {guests} {parseInt(guests) === 1 ? 'Voyager' : 'Voyagers'}</p>
      </div>

      <div className="space-y-6">
        {flights.map((flight, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8 flex-1 w-full">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-3">
                <img src={`https://logo.clearbit.com/${flight.airline?.toLowerCase()}.com`} alt={flight.airline} className="max-w-full grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="grid grid-cols-3 flex-1 gap-4 text-center md:text-left">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Departure</p>
                  <p className="text-xl font-bold text-luxury">{flight.departureTime}</p>
                  <p className="text-xs text-gray-500">{flight.origin}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full h-[1px] bg-gray-200 relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-accent font-bold italic">VOYAGE</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">{flight.duration || 'Direct'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Arrival</p>
                  <p className="text-xl font-bold text-luxury">{flight.arrivalTime}</p>
                  <p className="text-xs text-gray-500">{flight.destination}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-center md:items-end gap-6 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8">
              <div className="text-right flex-1 md:flex-initial">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{flight.cabinClass || 'ECONOMY'}</p>
                <PriceDisplay price={flight.price} currency={currency} className="text-2xl font-bold text-luxury" />
              </div>
              <button className="bg-luxury text-accent px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-luxury/10">
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
