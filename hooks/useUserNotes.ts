
import { useState, useEffect, useCallback, useRef } from 'react';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';

export const useUserNotes = () => {
    const { user, loading: authLoading } = useAuth();
    const [notes, setNotes] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Use 'any' for the timeout ref to avoid dependency on @types/node
    const saveTimeoutRef = useRef<any>(null);

    // Sync Notes
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            const localNotes = window.localStorage.getItem('voicecode_notes');
            setNotes(localNotes || '');
            setIsLoading(false);
            return;
        }

        const fetchNotes = async () => {
            setIsLoading(true);
            try {
                const content = await dbService.getUserNotes(user.id);
                setNotes(content);
                setError(null);
            } catch (err) {
                console.error("Error fetching notes:", err);
                setError("Failed to load notes");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
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
                await dbService.saveUserNotes(user.id, newContent);
                setIsSaving(false);
            } catch (err: any) {
                console.error("Failed to save notes:", err);
                setError("Failed to save notes");
                setIsSaving(false);
            }
        }, 1000); // 1 second debounce
    }, [user]);

    return { notes, updateNotes, isLoading, isSaving, error };
};
