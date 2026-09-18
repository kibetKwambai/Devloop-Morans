import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// In-Memory Token Store for Google Meet OAuth scopes
// (MANDATORY: Tokens must NOT be saved in localStorage / sessionStorage)
let cachedGoogleAccessToken: string | null = null;

export const setCachedGoogleAccessToken = (token: string | null) => {
  cachedGoogleAccessToken = token;
};

export const getCachedGoogleAccessToken = (): string | null => {
  return cachedGoogleAccessToken;
};

// Google Auth Provider with Meet Scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/meetings.space.created');
googleProvider.addScope('https://www.googleapis.com/auth/meetings.space.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/meetings.space.settings');

export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  BATCH = 'batch'
}

export interface FirestoreErrorInfo {
  error: string;
  operation: OperationType;
  path: string;
  authUid?: string | null;
  timestamp: string;
  details?: any;
}

export function handleFirestoreError(
  error: any, 
  operation: OperationType, 
  path: string
): FirestoreErrorInfo {
  const currentUid = auth.currentUser ? auth.currentUser.uid : null;
  const errorInfo: FirestoreErrorInfo = {
    error: error?.message || String(error),
    operation,
    path,
    authUid: currentUid,
    timestamp: new Date().toISOString(),
    details: error
  };
  console.warn(`[Firestore Safe Fallback] ${operation.toUpperCase()} at ${path}:`, errorInfo);
  return errorInfo;
}

// Connection test utility
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, '_connection_test_', 'ping');
    await getDocFromServer(testDocRef);
    return true;
  } catch (err: any) {
    // A permission-denied or not-found still confirms we reached Firestore
    if (err?.code === 'permission-denied' || err?.code === 'not-found') {
      return true;
    }
    return false;
  }
}

export {
  app,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged
};
export type { FirebaseUser };
