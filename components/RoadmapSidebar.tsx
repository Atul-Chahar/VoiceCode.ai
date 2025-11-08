
import React from 'react';
import { Course } from '../types';

interface RoadmapSidebarProps {
    course: Course;
    currentLessonId: string;
    completedLessons: string[];
    onSelectLesson: (lessonId: string) => void;
    isOpen: boolean;
}

const RoadmapSidebar: React.FC<RoadmapSidebarProps> = ({
    course,
    currentLessonId,
    completedLessons,
    onSelectLesson,
    isOpen
}) => {
    if (!isOpen) return null;

    return (
        <div className="w-64 md:w-72 bg-[#131313] border-r border-[#262626] flex flex-col h-full flex-shrink-0 transition-all">
            <div className="p-4 border-b border-[#262626]">
                <h2 className="font-bold text-white">{course.title}</h2>
                <div className="mt-2 w-full bg-[#0D0D0D] rounded-full h-1.5">
                    <div
                        className="bg-brand-green h-1.5 rounded-full transition-all duration-500"
                        style={{
                            width: `${Math.max(5, (completedLessons.length / course.modules.reduce((acc, m) => acc + m.lessons.length, 0)) * 100)}%`
                        }}
                    ></div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-6">
                {course.modules.map(module => (
                    <div key={module.id}>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                            {module.title}
                        </h3>
                        <div className="space-y-1">
                            {module.lessons.map((lesson, index) => {
                                const isCompleted = completedLessons.includes(lesson.id);
                                const isCurrent = lesson.id === currentLessonId;
                                const isLocked = !isCompleted && !isCurrent && index > 0 && !completedLessons.includes(module.lessons[index - 1].id);

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => !isLocked && onSelectLesson(lesson.id)}
                                        disabled={isLocked}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                                            isCurrent
                                                ? 'bg-[#B9FF66]/10 text-brand-green font-medium'
                                                : isLocked
                                                ? 'text-gray-600 cursor-not-allowed opacity-50'
                                                : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                                            isCompleted
                                                ? 'bg-brand-green text-black'
                                                : isCurrent
                                                ? 'border-2 border-brand-green text-transparent'
                                                : isLocked
                                                ? 'bg-[#262626] text-gray-500'
                                                : 'border-2 border-gray-600'
                                        }`}>
                                            {isCompleted && <i className="fas fa-check"></i>}
                                            {isLocked && <i className="fas fa-lock text-[8px]"></i>}
                                        </div>
                                        <span className="truncate text-sm">{lesson.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapSidebar;
