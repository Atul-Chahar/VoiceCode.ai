
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { Progress } from '../types';
import { INITIAL_PROGRESS, JAVASCRIPT_COURSE } from '../constants';

export const useCourseProgress = (courseId: string) => {
    const { user, loading: authLoading } = useAuth();
    const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            // Demo mode: use localStorage
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

        const loadProgress = async () => {
            setLoading(true);
            try {
                const data = await dbService.getUserProgress(user.id, courseId);
                setProgress(data || INITIAL_PROGRESS);
            } catch (error) {
                console.error("Failed to load progress:", error);
                // Fallback to initial if DB fails
                setProgress(INITIAL_PROGRESS);
            } finally {
                setLoading(false);
            }
        };

        loadProgress();
    }, [user, courseId, authLoading]);

    const updateProgress = useCallback(async (newProgress: Progress) => {
        setProgress(newProgress);
        if (user) {
            await dbService.saveUserProgress(user.id, courseId, newProgress);
        } else {
            localStorage.setItem(`voicecode_progress_${courseId}`, JSON.stringify(newProgress));
        }
    }, [user, courseId]);

    const completeLesson = useCallback(async (lessonId: string, aiMemoryUpdate?: string[]) => {
        setProgress(prev => {
            const completedLessons = prev.completedLessons.includes(lessonId)
                ? prev.completedLessons
                : [...prev.completedLessons, lessonId];
            
            const nextLessonId = findNextLessonId(lessonId) || lessonId;
            const newMemory = aiMemoryUpdate ? [...prev.aiMemory, ...aiMemoryUpdate] : prev.aiMemory;

            const newProgress = {
                completedLessons,
                currentLessonId: nextLessonId,
                aiMemory: [...new Set(newMemory)] // Deduplicate memory
            };

            // Fire and forget save
            if (user) {
                dbService.saveUserProgress(user.id, courseId, newProgress);
            } else {
                localStorage.setItem(`voicecode_progress_${courseId}`, JSON.stringify(newProgress));
            }

            return newProgress;
        });
    }, [user, courseId]);

    const setCurrentLesson = useCallback(async (lessonId: string) => {
        setProgress(prev => {
             const newProgress = { ...prev, currentLessonId: lessonId };
              if (user) {
                dbService.saveUserProgress(user.id, courseId, newProgress);
            } else {
                localStorage.setItem(`voicecode_progress_${courseId}`, JSON.stringify(newProgress));
            }
            return newProgress;
        });
    }, [user, courseId]);

    return { progress, loading, updateProgress, completeLesson, setCurrentLesson };
};
