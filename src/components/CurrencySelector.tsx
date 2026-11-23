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
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors py-2"
      >
        <span className="text-gray-400 font-normal">Currency:</span> {currency}
        <svg 
          className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[180px] overflow-hidden">
          <div className="p-1 max-h-60 overflow-y-auto">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded text-xs transition-all flex justify-between items-center ${
                  currency === curr.code 
                    ? 'bg-gray-100 text-gray-900 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex flex-col">
                  <span>{curr.code}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {curr.name}
                  </span>
                </div>
                {currency === curr.code && <span className="text-gray-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
