'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
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

  const signIn = async (email: string, pass: string) => {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const auth = await getFirebaseAuth();
    return await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const auth = await getFirebaseAuth();
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await updateProfile(result.user, { displayName: name });
    }
    return result;
  };

  const signOutUser = async () => {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const auth = await getFirebaseAuth();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signIn, signUp, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
