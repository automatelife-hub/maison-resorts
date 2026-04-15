'use client';

import { FlightAncillaries, BaggageOption, SeatMap } from '@/types';
import { PriceDisplay } from './PriceDisplay';
import { usePreferences } from '@/context/PreferencesContext';

interface AncillarySelectionProps {
  ancillaries: FlightAncillaries;
  selectedBaggage: string[];
  selectedSeats: Record<string, string>;
  onBaggageChange: (baggageIds: string[]) => void;
  onSeatChange: (segmentId: string, seatNumber: string) => void;
}

export function AncillarySelection({
  ancillaries,
  selectedBaggage,
  selectedSeats,
  onBaggageChange,
  onSeatChange,
}: AncillarySelectionProps) {
  const { currency } = usePreferences();

  return (
    <div className="space-y-12">
      {/* Baggage Selection */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Additional Baggage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ancillaries.baggage.map((option) => (
            <div 
              key={option.id}
              onClick={() => {
                const newSelection = selectedBaggage.includes(option.id)
                  ? selectedBaggage.filter(id => id !== option.id)
                  : [...selectedBaggage, option.id];
                onBaggageChange(newSelection);
              }}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                selectedBaggage.includes(option.id) ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-gray-200'
              }`}
            >
              <div>
                <p className="font-bold text-luxury">{option.type} ({option.weight}{option.unit})</p>
                <PriceDisplay price={option.price} currency={option.currency} className="text-sm text-gray-500" />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedBaggage.includes(option.id) ? 'border-accent bg-accent' : 'border-gray-200'
              }`}>
                {selectedBaggage.includes(option.id) && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      {ancillaries.seats.map((segment) => (
        <div key={segment.segmentId} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Seat Selection - Segment {segment.segmentId}</h3>
          <div className="space-y-4">
            {segment.rows.map((row) => (
              <div key={row.number} className="flex justify-center gap-2">
                <div className="w-8 flex items-center justify-center text-[10px] text-gray-400 font-mono">{row.number}</div>
                {row.seats.map((seat) => (
                  <button
                    key={seat.number}
                    disabled={!seat.isAvailable}
                    onClick={() => onSeatChange(segment.segmentId, seat.number)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      !seat.isAvailable 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : selectedSeats[segment.segmentId] === seat.number
                          ? 'bg-accent text-luxury shadow-lg shadow-accent/20'
                          : 'bg-luxury/5 text-luxury hover:bg-luxury/10'
                    }`}
                  >
                    {seat.number.slice(-1)}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-luxury/5" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Occupied</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
