'use client';

import { usePreferences } from '@/context/PreferencesContext';
import { useEffect, useState, useRef } from 'react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export function CurrencySelector() {
  const { currency, setCurrency } = usePreferences();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/data/currencies')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCurrencies(data);
        } else {
          setCurrencies([{ code: 'USD', name: 'US Dollar', symbol: '$' }, { code: 'EUR', name: 'Euro', symbol: '€' }, { code: 'GBP', name: 'Pound', symbol: '£' }]);
        }
      })
      .catch(() => setCurrencies([{ code: 'USD', name: 'US Dollar', symbol: '$' }]));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-white transition-colors py-2"
      >
        <span className="opacity-50 text-[8px]">Currency:</span> {currency}
        <svg 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 bg-luxury border border-white/10 rounded-2xl shadow-2xl z-50 min-w-[200px] overflow-hidden backdrop-blur-xl bg-opacity-95">
          <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 rounded-xl transition-all flex justify-between items-center group ${
                  currency === curr.code 
                    ? 'bg-accent text-luxury font-bold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs tracking-widest">{curr.code}</span>
                  <span className={`text-[8px] uppercase tracking-tighter opacity-60 ${currency === curr.code ? 'text-luxury' : 'text-gray-500'}`}>
                    {curr.name}
                  </span>
                </div>
                {currency === curr.code && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
