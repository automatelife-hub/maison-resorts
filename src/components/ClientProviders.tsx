'use client';

import dynamic from 'next/dynamic';
import { PreferencesProvider } from '@/context/PreferencesContext';

// Firebase AuthProvider loaded only in the browser
const AuthProvider = dynamic(
  () => import('@/context/AuthContext').then((m) => m.AuthProvider),
  { ssr: false, loading: () => null }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PreferencesProvider>
        {children}
      </PreferencesProvider>
    </AuthProvider>
  );
}
