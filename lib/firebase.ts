
import * as firebaseApp from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  type Firestore
} from 'firebase/firestore';

// Your web app's Firebase configuration
// Use (import.meta as any).env to avoid TypeScript errors if Vite types aren't strictly loaded.
const firebaseConfig = {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyDdEk0fQ0JqUilEFKYQk4OczhkhpqNFwNw",
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "voicecode-ai-c143f.firebaseapp.com",
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "voicecode-ai-c143f",
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "voicecode-ai-c143f.firebasestorage.app",
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "242245066171",
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:242245066171:web:085e1e765eaa06baa0389e",
    measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || "G-K994KG7TQT"
};

// Initialize Firebase singleton.
// Prevents re-initialization errors during hot-reloads in development.
// Using namespace import to avoid potential issues with named exports in some environments.
const app: firebaseApp.FirebaseApp = firebaseApp.getApps().length > 0 ? firebaseApp.getApp() : firebaseApp.initializeApp(firebaseConfig);

// Initialize and export services
export const auth: Auth = getAuth(app);

// Initialize Firestore with persistent local cache for offline support
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const googleProvider = new GoogleAuthProvider();
