'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (u: any) => {
        setUser(u ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } : null);
        setLoading(false);
      });
    })();
    return () => unsubscribe?.();
  }, []);

  const signInWithGoogle = async () => {
    const { getFirebaseAuth, getGoogleProvider } = await import('@/lib/firebase');
    const { signInWithPopup } = await import('firebase/auth');
    const [auth, provider] = await Promise.all([getFirebaseAuth(), getGoogleProvider()]);
    await signInWithPopup(auth, provider);
  };

  const signOutUser = async () => {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const { signOut } = await import('firebase/auth');
    const auth = await getFirebaseAuth();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
