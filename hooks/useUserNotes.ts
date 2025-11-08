
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
    
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            },
            (err) => {
                console.error("Error syncing notes:", err);
                setError("Failed to sync notes.");
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
            } catch (err) {
                console.error("Failed to save notes:", err);
                setError("Failed to save latest changes.");
                setIsSaving(false);
            }
        }, 1000); // 1 second debounce
    }, [user]);

    return { notes, updateNotes, isLoading, isSaving, error };
};
