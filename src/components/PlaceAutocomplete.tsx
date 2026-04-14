'use client';

import { useState, useEffect, useRef } from 'react';

interface Place {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  types: string[];
}

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string, placeId?: string) => void;
  placeholder?: string;
  className?: string;
}

export function PlaceAutocomplete({ value, onChange, placeholder, className }: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/data/places?q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {loading && suggestions.length === 0 ? (
            <div className="p-4 text-center">
              <div className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-2">
              {suggestions.map((place) => (
                <li
                  key={place.placeId}
                  onClick={() => {
                    onChange(place.displayName, place.placeId);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-accent mt-1">📍</span>
                    <div>
                      <div className="font-bold text-luxury group-hover:text-black">{place.displayName}</div>
                      <div className="text-xs text-gray-400">{place.formattedAddress}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
