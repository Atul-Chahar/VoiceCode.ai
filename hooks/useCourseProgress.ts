
import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp, updateDoc, arrayUnion, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CourseProgress } from '../types';
import { INITIAL_PROGRESS, JAVASCRIPT_COURSE } from '../constants';

export const useCourseProgress = (courseId: string) => {
    const { user, loading: authLoading } = useAuth();
    const [progress, setProgress] = useState<CourseProgress>(INITIAL_PROGRESS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper to find the next lesson ID
    const findNextLessonId = (currentId: string): string | null => {
        let foundCurrent = false;
        for (const module of JAVASCRIPT_COURSE.modules) {
            for (const lesson of module.lessons) {
                if (foundCurrent) return lesson.id;
                if (lesson.id === currentId) foundCurrent = true;
            }
        }
        return null;
    };

    // Real-time subscription to progress
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            // Demo mode: LocalStorage
            const local = localStorage.getItem(`voicecode_progress_${courseId}`);
            if (local) {
                try {
                    setProgress(JSON.parse(local));
                } catch (e) {
                    console.error("Failed to parse local progress", e);
                    setProgress(INITIAL_PROGRESS);
                }
            } else {
                setProgress(INITIAL_PROGRESS);
            }
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = onSnapshot(
            doc(db, 'users', user.id, 'progress', courseId),
            (docSnap) => {
                if (docSnap.exists()) {
                    setProgress(docSnap.data() as CourseProgress);
                } else {
                    // Initialize if it doesn't exist
                    setDoc(doc(db, 'users', user.id, 'progress', courseId), {
                        ...INITIAL_PROGRESS,
                        updatedAt: serverTimestamp()
                    }, { merge: true });
                    setProgress(INITIAL_PROGRESS);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error syncing progress:", err);
                setError("Failed to sync progress.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, courseId, authLoading]);

    const updateProgress = useCallback(async (newProgress: Partial<CourseProgress>) => {
        // Optimistic update
        setProgress(prev => ({ ...prev, ...newProgress }));

        if (!user) {
             localStorage.setItem(`voicecode_progress_${courseId}`, JSON.stringify({ ...progress, ...newProgress }));
             return;
        }

        try {
            await setDoc(doc(db, 'users', user.id, 'progress', courseId), {
                ...newProgress,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error("Failed to save progress to Firestore:", err);
            // Could revert optimistic update here if strictly necessary, 
            // but usually we want to keep user moving and retry later.
            setError("Failed to save progress online.");
        }
    }, [user, courseId, progress]);

    const completeLesson = useCallback(async (lessonId: string, aiMemoryUpdate?: string[]) => {
        // 1. Calculate new state based on current state (optimistic)
        setProgress(prev => {
            // A. Update completed lessons
            const completedLessonIds = prev.completedLessonIds.includes(lessonId)
                ? prev.completedLessonIds
                : [...prev.completedLessonIds, lessonId];
            
            // B. Check for completed modules
            let completedModuleIds = [...(prev.completedModuleIds || [])];
            
            JAVASCRIPT_COURSE.modules.forEach(module => {
                // If module is not already marked complete
                if (!completedModuleIds.includes(module.id)) {
                    // Check if ALL lessons in this module are now in the completedLessonIds array
                    const allLessonsComplete = module.lessons.every(l => completedLessonIds.includes(l.id));
                    if (allLessonsComplete) {
                        completedModuleIds.push(module.id);
                    }
                }
            });

            // C. Calculate next lesson and memory
            const nextLessonId = findNextLessonId(lessonId) || lessonId;
            const newMemory = aiMemoryUpdate ? [...(prev.aiMemory || []), ...aiMemoryUpdate] : (prev.aiMemory || []);

            const newProgress: CourseProgress = {
                ...prev,
                completedLessonIds,
                completedModuleIds,
                currentLessonId: nextLessonId,
                aiMemory: [...new Set(newMemory)] // Deduplicate memory
            };

            // 2. Persist to DB or LocalStorage
            if (user) {
                setDoc(doc(db, 'users', user.id, 'progress', courseId), {
                    ...newProgress,
                    updatedAt: serverTimestamp()
                }, { merge: true }).catch(err => {
                     console.error("Failed to save completion to Firestore:", err);
                     setError("Failed to save progress online.");
                });
            } else {
                localStorage.setItem(`voicecode_progress_${courseId}`, JSON.stringify(newProgress));
            }

            return newProgress;
        });
    }, [user, courseId]);

    const setCurrentLesson = useCallback(async (lessonId: string) => {
        updateProgress({ currentLessonId: lessonId });
    }, [updateProgress]);

    return { progress, loading, error, updateProgress, completeLesson, setCurrentLesson };
};
