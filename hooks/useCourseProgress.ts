
import { useState, useEffect, useCallback } from 'react';
import { Progress } from '../types';
import { INITIAL_PROGRESS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';

export const useCourseProgress = (courseId: string) => {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [loading, setLoading] = useState(true);

  // Load progress from DB when user or courseId changes
  useEffect(() => {
    let mounted = true;

    const loadProgress = async () => {
        if (authLoading) return; // Wait for auth to initialize

        if (!user) {
            // Fallback to localStorage for non-logged in users (demo mode)
            try {
                const item = window.localStorage.getItem(`progress-${courseId}`);
                if (mounted) {
                     setProgress(item ? JSON.parse(item) : INITIAL_PROGRESS);
                     setLoading(false);
                }
            } catch (e) {
                 if (mounted) {
                     setProgress(INITIAL_PROGRESS);
                     setLoading(false);
                 }
            }
            return;
        }

        try {
            setLoading(true);
            const dbProgress = await dbService.getUserProgress(user.id, courseId);
            if (mounted) {
                setProgress(dbProgress);
            }
        } catch (error) {
            console.error("Failed to load progress from DB", error);
            // Keep default progress on error
        } finally {
            if (mounted) setLoading(false);
        }
    };

    loadProgress();

    return () => { mounted = false; };
  }, [user, courseId, authLoading]);

  const saveProgress = useCallback(async (newProgress: Progress) => {
      if (!user) {
          // Fallback save to localStorage
          window.localStorage.setItem(`progress-${courseId}`, JSON.stringify(newProgress));
          return;
      }
      // Save to standard Firestore
      await dbService.saveUserProgress(user.id, courseId, newProgress);
  }, [user, courseId]);

  const updateProgress = useCallback((newProgressData: Partial<Progress>) => {
    setProgress(prev => {
        const updated = { ...prev, ...newProgressData };
        saveProgress(updated); // Fire and forget save
        return updated;
    });
  }, [saveProgress]);

  const completeLesson = useCallback((lessonId: string, nextLessonId: string) => {
    setProgress(prev => {
        const newCompleted = prev.completedLessons.includes(lessonId) ? prev.completedLessons : [...prev.completedLessons, lessonId];
        const updated = {
            ...prev,
            completedLessons: newCompleted,
            currentLessonId: nextLessonId,
            aiMemory: [...prev.aiMemory, `User has successfully completed the lesson on ${lessonId}.`]
        };
        saveProgress(updated);
        return updated;
    });
  }, [saveProgress]);

  return { progress, updateProgress, completeLesson, loading };
};
