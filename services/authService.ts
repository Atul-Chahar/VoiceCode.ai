
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export const authService = {
    async login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error: any) {
            console.error("Firebase Login Error:", error.code, error.message);
            throw new Error(mapFirebaseAuthErrorMessage(error.code));
        }
    },

    async signup(name: string, email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Standard Firebase doesn't allow setting display name during create, so we update it immediately after
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
            }
            return userCredential.user;
        } catch (error: any) {
            console.error("Firebase Signup Error:", error.code, error.message);
            throw new Error(mapFirebaseAuthErrorMessage(error.code));
        }
    },

    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error: any) {
            console.error("Firebase Google Auth Error:", error.code, error.message);
            throw new Error(mapFirebaseAuthErrorMessage(error.code));
        }
    },

    async logout() {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error("Firebase Logout Error:", error.message);
            throw new Error(error.message);
        }
    }
};

// Helper to make standard Firebase error codes more user-friendly
function mapFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed before completion.';
        case 'auth/operation-not-allowed':
             return 'This sign-in method is not enabled in Firebase Console.';
        case 'auth/unauthorized-domain':
             return 'This domain is not authorized in Firebase Console.';
        default:
            return 'An authentication error occurred. Please try again.';
    }
}
