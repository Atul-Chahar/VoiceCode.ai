
import { useState, useEffect, useCallback } from 'react';
import { dbService } from '../services/dbService';
import { Progress } from '../types';
import { INITIAL_PROGRESS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

export const useCourseProgress = (courseId: string) => {
    const { user, loading: authLoading } = useAuth();
    const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sync Data on mount/user-change
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            // DEMO MODE: Load from localStorage
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

        const fetchProgress = async () => {
            setLoading(true);
            try {
                const data = await dbService.getUserProgress(user.id, courseId);
                setProgress(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to sync progress:", err);
                setError("Failed to sync data");
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
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

        // Optimistic Update
        setProgress(prev => ({ ...prev, ...newProgressData }));

        try {
            // We know 'prev' state here might be stale in a callback if not careful,
            // but typically mapped progress is safe to merge.
            // Better: re-fetch or use state-updater pattern if we had the full object.
            // For simplicity: construct full object from current state (which is 'progress' in closure? slightly risky if rapid updates)
            // dbService.saveUserProgress merges/upserts, so we send the FULL object if possible.
            // But we only have Partial here.
            // FIX: user_states table stores the blob. We should probably fetch-modify-save or just save the latest state we have locally.
            // Let's rely on setProgress to update local state, then save that *full* local state.
            // CAUTION: 'progress' in this callback closure is stale.
            // We should use the functional update to get clean state, then save THAT.

            let updatedState: Progress = INITIAL_PROGRESS;
            setProgress(prev => {
                updatedState = { ...prev, ...newProgressData };
                return updatedState;
            });

            // Wait a tick for state to settle? No, we have the variable 'updatedState'
            await dbService.saveUserProgress(user.id, courseId, updatedState);

        } catch (err: any) {
            console.error("Failed to update progress:", err);
            setError("Failed to save progress");
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
            // Calculate new state
            let updatedState: Progress = INITIAL_PROGRESS;
            setProgress(prev => {
                const newCompleted = prev.completedLessons.includes(lessonId) ? prev.completedLessons : [...prev.completedLessons, lessonId];
                updatedState = {
                    ...prev,
                    completedLessons: newCompleted,
                    currentLessonId: nextLessonId,
                    aiMemory: [...prev.aiMemory, `User completed lesson ${lessonId}.`]
                };
                return updatedState;
            });

            await dbService.saveUserProgress(user.id, courseId, updatedState);

        } catch (err: any) {
            console.error("Failed to complete lesson:", err);
            setError("Failed to complete lesson");
        }
    }, [user, courseId]);

    return { progress, updateProgress, completeLesson, loading, error };
};

