// No top-level imports — Firebase loaded lazily at runtime only
let _auth: any = null;
let _googleProvider: any = null;
let _analytics: any = null;
let _firestore: any = null;

const getFirebaseConfig = () => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export async function getFirebaseApp() {
  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const firebaseConfig = getFirebaseConfig();
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

export async function getFirebaseAuth() {
  if (_auth) return _auth;
  const { getAuth } = await import('firebase/auth');
  const app = await getFirebaseApp();
  _auth = getAuth(app);
  return _auth;
}

export async function getFirebaseFirestore() {
  if (_firestore) return _firestore;
  const { getFirestore } = await import('firebase/firestore');
  const app = await getFirebaseApp();
  _firestore = getFirestore(app);
  return _firestore;
}

export async function getGoogleProvider() {
  if (_googleProvider) return _googleProvider;
  const { GoogleAuthProvider } = await import('firebase/auth');
  _googleProvider = new GoogleAuthProvider();
  _googleProvider.setCustomParameters({ prompt: 'select_account' });
  return _googleProvider;
}

export async function getFirebaseAnalytics() {
  if (typeof window === 'undefined') return null;
  if (_analytics) return _analytics;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  const app = await getFirebaseApp();
  const supported = await isSupported();
  if (supported) {
    _analytics = getAnalytics(app);
  }
  return _analytics;
}
