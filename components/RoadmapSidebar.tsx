
import React from 'react';
import { Course } from '../types';

interface RoadmapSidebarProps {
  course: Course;
  completedLessons: string[];
  currentLessonId: string;
  onBack: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLessonClick: (lessonId: string) => void;
}

const RoadmapSidebar: React.FC<RoadmapSidebarProps> = ({ course, completedLessons, currentLessonId, onBack, isOpen, onLessonClick }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full w-80 bg-[#181818] border-r border-[#262626] flex flex-col p-4 z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <header className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
      </header>
      <div className="overflow-y-auto flex-grow">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">{course.title}</h2>
        {course.modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-6">
            <h3 className="font-semibold text-brand-green mb-3">{module.title}</h3>
            <ul>
              {module.lessons.map((lesson, lessonIndex) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = lesson.id === currentLessonId;

                return (
                  <li 
                    key={lesson.id} 
                    className={`flex items-center mb-3 cursor-pointer hover:bg-[#262626] p-2 rounded-md transition-colors ${isCurrent ? 'bg-[#262626]' : ''}`}
                    onClick={() => onLessonClick(lesson.id)}
                  >
                    <div className="flex flex-col items-center mr-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-brand-green border-brand-green' : isCurrent ? 'bg-[#B9FF66]/20 border-brand-green' : 'border-gray-600 bg-gray-700'}`}>
                           {isCompleted ? <i className="fas fa-check text-black text-xs font-bold"></i> : <span className={`text-xs ${isCurrent ? 'text-brand-green' : 'text-gray-400'}`}>{lessonIndex + 1 + module.lessons.slice(0, moduleIndex).length}</span>}
                        </div>
                        {(moduleIndex < course.modules.length -1 || lessonIndex < module.lessons.length - 1) && <div className="w-px h-6 bg-gray-600"></div>}
                    </div>
                    <span className={`text-sm ${isCurrent ? 'font-bold text-white' : 'text-gray-400'}`}>{lesson.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RoadmapSidebar;
