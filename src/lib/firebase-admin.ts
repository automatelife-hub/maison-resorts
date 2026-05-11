import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

function createFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp(firebaseAdminConfig);
}

const app = createFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
