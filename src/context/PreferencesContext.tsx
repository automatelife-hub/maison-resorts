'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PreferencesContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  guestNationality: string;
  setGuestNationality: (nationality: string) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState('USD');
  const [guestNationality, setGuestNationality] = useState('US');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedCurrency = localStorage.getItem('maison_currency') || 'USD';
    const savedNationality = localStorage.getItem('maison_nationality') || 'US';
    setCurrency(savedCurrency);
    setGuestNationality(savedNationality);
    setMounted(true);
  }, []);

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (mounted) localStorage.setItem('maison_currency', newCurrency);
  };

  const handleSetNationality = (newNationality: string) => {
    setGuestNationality(newNationality);
    if (mounted) localStorage.setItem('maison_nationality', newNationality);
  };

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        guestNationality,
        setGuestNationality: handleSetNationality,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
