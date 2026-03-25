'use client';

import { usePreferences } from '@/context/PreferencesContext';
import { useEffect, useState } from 'react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export function CurrencySelector() {
  const { currency, setCurrency } = usePreferences();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/data/currencies')
      .then((res) => res.json())
      .then((data) => setCurrencies(data))
      .catch(() => setCurrencies([{ code: 'USD', name: 'US Dollar', symbol: '$' }]));
  }, []);

  const selectedCurrency = currencies.find((c) => c.code === currency);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
      >
        {selectedCurrency?.symbol || '$'} {currency}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                setCurrency(curr.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                currency === curr.code ? 'bg-accent bg-opacity-10 font-bold' : ''
              }`}
            >
              {curr.symbol} {curr.code} - {curr.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
