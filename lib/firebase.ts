
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdEk0fQ0JqUilEFKYQk4OczhkhpqNFwNw",
    authDomain: "voicecode-ai-c143f.firebaseapp.com",
    projectId: "voicecode-ai-c143f",
    storageBucket: "voicecode-ai-c143f.firebasestorage.app",
    messagingSenderId: "242245066171",
    appId: "1:242245066171:web:085e1e765eaa06baa0389e",
    measurementId: "G-K994KG7TQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();