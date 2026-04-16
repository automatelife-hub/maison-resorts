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

  const initializeUserInFirestore = async (uid: string, email: string | null, name: string | null) => {
    try {
      const { getFirebaseFirestore } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const db = await getFirebaseFirestore();
      
      // Initialize basic user profile
      await setDoc(doc(db, `users/${uid}`), {
        email,
        name,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Initialize loyalty account with 500 welcome points
      await setDoc(doc(db, `users/${uid}/loyalty`, 'status'), {
        points: 500,
        tier: 'Heritage Member',
        joinedAt: new Date().toISOString()
      }, { merge: true });

      // Give a welcome voucher
      await setDoc(doc(db, `users/${uid}/vouchers`, 'WELCOME2026'), {
        code: 'WELCOME2026',
        name: 'Welcome Voyage',
        description: 'Enjoy a special welcome discount on your first sanctuary booking in 2026.',
        discountType: 'fixed',
        value: 100,
        currency: 'USD',
        status: 'available',
        expiry: '2026-12-31'
      }, { merge: true });
    } catch (err) {
      console.error('Failed to initialize user in Firestore', err);
    }
  };

  const signInWithGoogle = async () => {
    const { getFirebaseAuth, getGoogleProvider } = await import('@/lib/firebase');
    const { signInWithPopup } = await import('firebase/auth');
    const [auth, provider] = await Promise.all([getFirebaseAuth(), getGoogleProvider()]);
    const result = await signInWithPopup(auth, provider);
    
    // Check if new user
    const { getAdditionalUserInfo } = await import('firebase/auth');
    const additionalInfo = getAdditionalUserInfo(result);
    if (additionalInfo?.isNewUser) {
      await initializeUserInFirestore(result.user.uid, result.user.email, result.user.displayName);
    }
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
      await initializeUserInFirestore(result.user.uid, email, name);
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
