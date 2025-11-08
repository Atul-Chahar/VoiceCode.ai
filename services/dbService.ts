
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Progress } from '../types';
import { INITIAL_PROGRESS } from '../constants';

export const dbService = {
    // --- Course Progress ---
    async getUserProgress(userId: string, courseId: string): Promise<Progress> {
        try {
            const docRef = doc(db, 'users', userId, 'progress', courseId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as Progress;
            } else {
                // If no progress exists in DB, return initial and optionally save it
                return INITIAL_PROGRESS;
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
            return INITIAL_PROGRESS;
        }
    },

    async saveUserProgress(userId: string, courseId: string, progress: Progress): Promise<void> {
        try {
            const docRef = doc(db, 'users', userId, 'progress', courseId);
            // merge: true ensures we don't overwrite other fields if we add them later
            await setDoc(docRef, progress, { merge: true });
        } catch (error) {
            console.error("Error saving progress:", error);
            throw error;
        }
    },

    // --- User Notes ---
    async getUserNotes(userId: string): Promise<string> {
        try {
            const docRef = doc(db, 'users', userId, 'data', 'notes');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().content || '';
            }
            return '';
        } catch (error) {
            console.error("Error fetching notes:", error);
            return '';
        }
    },

    async saveUserNotes(userId: string, content: string): Promise<void> {
         try {
            const docRef = doc(db, 'users', userId, 'data', 'notes');
            await setDoc(docRef, { content }, { merge: true });
        } catch (error) {
            console.error("Error saving notes:", error);
             throw error;
        }
    }
};
