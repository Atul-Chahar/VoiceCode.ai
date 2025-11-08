
import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Progress, CourseProgress } from '../types';
import { INITIAL_PROGRESS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

export const useCourseProgress = (courseId: string) => {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time subscription to Firestore
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
        // DEMO MODE: Load from localStorage once on mount
        try {
            const localData = window.localStorage.getItem(`progress-${courseId}`);
            if (localData) {
                setProgress(JSON.parse(localData));
            } else {
                setProgress(INITIAL_PROGRESS);
            }
        } catch (e) {
            console.error("Local storage error", e);
            setProgress(INITIAL_PROGRESS);
        }
        setLoading(false);
        return;
    }

    setLoading(true);
    const docRef = doc(db, 'users', user.id, 'progress', courseId);

    const unsubscribe = onSnapshot(docRef, {
        next: (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as CourseProgress;
                // Map Firestore data model back to app internal Progress model
                setProgress({
                    completedLessons: data.completedLessonIds || [],
                    currentLessonId: data.currentLessonId || INITIAL_PROGRESS.currentLessonId,
                    aiMemory: data.aiMemory || INITIAL_PROGRESS.aiMemory
                });
            } else {
                // If doc doesn't exist yet for authed user, use defaults (don't auto-create until they do something)
                setProgress(INITIAL_PROGRESS);
            }
            setLoading(false);
            setError(null);
        },
        error: (err) => {
            console.error("Firestore progress sync error:", err);
            setError("Failed to sync progress.");
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, [user, courseId, authLoading]);

  // Helper to save to localStorage for demo users
  const saveToLocal = (newProgress: Progress) => {
      try {
        window.localStorage.setItem(`progress-${courseId}`, JSON.stringify(newProgress));
      } catch (e) {
          console.error("Failed to save to localStorage", e);
      }
  };

  const updateProgress = useCallback(async (newProgressData: Partial<Progress>) => {
    if (!user) {
        setProgress(prev => {
            const updated = { ...prev, ...newProgressData };
            saveToLocal(updated);
            return updated;
        });
        return;
    }

    try {
        const docRef = doc(db, 'users', user.id, 'progress', courseId);
        // We need to map our internal Progress type to the Firestore CourseProgress type for saving
        const updatePayload: any = { updatedAt: serverTimestamp() };
        
        if (newProgressData.currentLessonId !== undefined) updatePayload.currentLessonId = newProgressData.currentLessonId;
        if (newProgressData.completedLessons !== undefined) updatePayload.completedLessonIds = newProgressData.completedLessons;
        if (newProgressData.aiMemory !== undefined) updatePayload.aiMemory = newProgressData.aiMemory;

        // setDoc with merge: true acts as both create-if-missing and update
        await setDoc(docRef, updatePayload, { merge: true });
    } catch (err) {
        console.error("Failed to update progress:", err);
        setError("Failed to save progress.");
        // Optional: Revert local state if we were doing optimistic updates here purely manually
    }
  }, [user, courseId]);

  const completeLesson = useCallback(async (lessonId: string, nextLessonId: string) => {
    if (!user) {
         setProgress(prev => {
            const newCompleted = prev.completedLessons.includes(lessonId) ? prev.completedLessons : [...prev.completedLessons, lessonId];
            const updated = {
                ...prev,
                completedLessons: newCompleted,
                currentLessonId: nextLessonId,
                aiMemory: [...prev.aiMemory, `User completed lesson ${lessonId}.`]
            };
            saveToLocal(updated);
            return updated;
        });
        return;
    }

    try {
        const docRef = doc(db, 'users', user.id, 'progress', courseId);
        // Atomic update using arrayUnion to prevent race conditions when adding completed lessons
        await setDoc(docRef, {
            completedLessonIds: arrayUnion(lessonId),
            currentLessonId: nextLessonId,
            aiMemory: arrayUnion(`User completed lesson ${lessonId}.`),
            updatedAt: serverTimestamp()
        }, { merge: true });

    } catch (err) {
        console.error("Failed to complete lesson:", err);
        setError("Failed to save lesson completion.");
    }
  }, [user, courseId]);

  return { progress, updateProgress, completeLesson, loading, error };
};
