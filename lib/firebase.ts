
import * as firebaseApp from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';

// Your web app's Firebase configuration
// Using standard process.env as defined in vite.config.ts define block
const firebaseConfig = {
    apiKey: process.env.API_KEY || "AIzaSyDdEk0fQ0JqUilEFKYQk4OczhkhpqNFwNw",
    authDomain: "voicecode-ai-c143f.firebaseapp.com",
    projectId: "voicecode-ai-c143f",
    storageBucket: "voicecode-ai-c143f.firebasestorage.app",
    messagingSenderId: "242245066171",
    appId: "1:242245066171:web:085e1e765eaa06baa0389e",
    measurementId: "G-K994KG7TQT"
};

// Initialize Firebase
// using namespace import to avoid potential 'no exported member' TS issues in some setups
const app = firebaseApp.initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);

// Initialize Firestore with persistent local cache for offline support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const googleProvider = new GoogleAuthProvider();
