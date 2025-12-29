import React, { useEffect, useRef } from 'react';
import { Course, Progress, Module, Lesson } from '../types';
import { Check, Lock, Play, ChevronDown, ChevronRight } from 'lucide-react';

interface LinearPathProps {
    course: Course;
    progress: Progress;
    onLessonSelect: (lessonId: string) => void;
}

const LinearPath: React.FC<LinearPathProps> = ({ course, progress, onLessonSelect }) => {
    // Flatten modules to find indices for path rendering
    const currentLessonId = progress.currentLessonId;
    const completedSet = new Set(progress.completedLessons);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current lesson
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentLessonId]);

    const isLessonLocked = (lesson: Lesson, index: number, allLessons: Lesson[]) => {
        // If it's the first lesson, unlocked
        if (index === 0) return false;
        // If previous lesson is completed, unlocked
        const prevLesson = allLessons[index - 1];
        return !completedSet.has(prevLesson.id);
    };

    // Flatten for simplified index logic
    const allLessons = course.modules.flatMap(m => m.lessons);

    return (
        <div className="relative pl-8 md:pl-16 py-8 space-y-12">
            {/* Vertical Path Line */}
            <div className="absolute left-6 md:left-14 top-0 bottom-0 w-0.5 bg-zinc-800 -z-10" />

            {course.modules.map((module, modIndex) => (
                <div key={module.id} className="relative">
                    {/* Module Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 rounded-xl z-10 shadow-xl">
                            <span className="text-zinc-500 font-mono text-lg font-bold">{(modIndex + 1).toString().padStart(2, '0')}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{module.title}</h3>
                            <p className="text-zinc-500 text-sm">{module.lessons.length} Lessons • {module.lessons.reduce((acc, l) => acc + l.timeEstimateMin, 0)} min</p>
                        </div>
                    </div>

                    {/* Lessons List in Module */}
                    <div className="space-y-4 ml-4 md:ml-6">
                        {module.lessons.map((lesson) => {
                            const isCompleted = completedSet.has(lesson.id);
                            const isCurrent = lesson.id === currentLessonId;
                            // Simplify locked logic: strictly based on previous completion or being current
                            // Real app might have more complex logic with prerequisites
                            const glIndex = allLessons.findIndex(l => l.id === lesson.id);
                            const isLocked = !isCompleted && !isCurrent && glIndex > 0 && !completedSet.has(allLessons[glIndex - 1].id);

                            return (
                                <div
                                    key={lesson.id}
                                    ref={isCurrent ? scrollRef : null}
                                    onClick={() => !isLocked && onLessonSelect(lesson.id)}
                                    className={`
                                        group relative flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer
                                        ${isCurrent
                                            ? 'bg-zinc-900 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] scale-[1.02]'
                                            : isLocked
                                                ? 'bg-zinc-950/50 border-zinc-800 opacity-60 cursor-not-allowed'
                                                : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}
                                    `}
                                >
                                    {/* Connection Line to main path */}
                                    <div className="absolute -left-[26px] md:-left-[34px] top-1/2 w-6 md:w-8 h-0.5 bg-zinc-800" />

                                    {/* Status Icon */}
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors
                                        ${isCompleted
                                            ? 'bg-orange-500 border-orange-500 text-black'
                                            : isCurrent
                                                ? 'bg-zinc-900 border-orange-500 text-orange-500 animate-pulse-slow'
                                                : 'bg-zinc-950 border-zinc-700 text-zinc-600'}
                                    `}>
                                        {isCompleted ? <Check size={20} strokeWidth={3} /> : isLocked ? <Lock size={18} /> : <Play size={18} fill="currentColor" />}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${isLocked ? 'text-zinc-500' : 'text-zinc-200 group-hover:text-white'}`}>
                                            {lesson.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                                            <span>{lesson.timeEstimateMin} min</span>
                                            {isCurrent && <span className="text-orange-500 font-semibold">• Current Lesson</span>}
                                        </div>
                                    </div>

                                    {/* Right Arrow for Action */}
                                    {!isLocked && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500">
                                            <ChevronRight size={20} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* End of Path */}
            <div className="flex items-center gap-4 ml-0 md:ml-2 opacity-50">
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-900/50 rounded-full border border-zinc-800 text-zinc-600">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                </div>
                <span className="text-zinc-600 text-sm italic">More content coming soon...</span>
            </div>
        </div>
    );
};

export default LinearPath;
