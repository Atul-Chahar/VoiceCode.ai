
import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserNotes } from '../types';

export const useUserNotes = () => {
    const { user, loading: authLoading } = useAuth();
    const [notes, setNotes] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    
    // Use 'any' for the timeout ref to avoid dependency on @types/node
    const saveTimeoutRef = useRef<any>(null);

    // Helper to log permission errors clearly (duplicated slightly to avoid circular deps, keep hooks independent)
    const logPermissionError = (err: any) => {
      if (err.code === 'permission-denied') {
           console.warn(
              "%cFIREBASE SETUP REQUIRED: Missing Security Rules\n" +
              "%cYour app cannot access Firestore. Go to Firebase Console > Firestore Database > Rules and set:\n" +
              "match /users/{userId}/{document=**} { allow read, write: if request.auth != null && request.auth.uid == userId; }",
              "font-weight: bold; color: red; font-size: 12px;",
              "color: orange;"
          );
          return "Database permissions missing (see console)";
      }
      return "Failed to sync notes";
  };

    // Real-time subscription
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            // Demo mode: LocalStorage
            const localNotes = window.localStorage.getItem('voicecode_notes');
            setNotes(localNotes || '');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = onSnapshot(
            doc(db, 'users', user.id, 'data', 'notes'),
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserNotes;
                    // Only update state from DB if we aren't actively typing/saving to avoid cursor jumps
                    if (!isSaving) {
                        setNotes(data.content || '');
                    }
                } else {
                    setNotes('');
                }
                setIsLoading(false);
                setError(null);
            },
            (err: any) => {
                console.error("Error syncing notes:", err);
                setError(logPermissionError(err));
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, authLoading]);

    // Debounced save function
    const updateNotes = useCallback((newContent: string) => {
        setNotes(newContent);

        if (!user) {
            window.localStorage.setItem('voicecode_notes', newContent);
            return;
        }

        setIsSaving(true);

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await setDoc(doc(db, 'users', user.id, 'data', 'notes'), {
                    content: newContent,
                    updatedAt: serverTimestamp()
                }, { merge: true });
                setIsSaving(false);
            } catch (err: any) {
                console.error("Failed to save notes:", err);
                setError(logPermissionError(err));
                setIsSaving(false);
            }
        }, 1000); // 1 second debounce
    }, [user]);

    return { notes, updateNotes, isLoading, isSaving, error };
};