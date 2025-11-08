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

const RoadmapSidebar: React.FC<RoadmapSidebarProps> = ({ course, completedLessons, currentLessonId, onBack, isOpen, setIsOpen, onLessonClick }) => {
  let globalLessonIndex = 0;

  return (
    <aside className={`fixed inset-y-0 left-0 w-4/5 max-w-xs md:w-80 bg-[#181818] border-r border-[#262626] flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <header className="p-4 border-b border-[#262626] flex items-center justify-between flex-shrink-0 h-16 bg-[#131313]">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium text-sm">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        {/* Mobile close button */}
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 p-2 hover:text-white transition-colors">
            <i className="fas fa-times"></i>
        </button>
      </header>
      
      <div className="overflow-y-auto flex-grow scrollbar-hide p-4">
        <h2 className="text-lg font-bold mb-6 text-white px-2">{course.title}</h2>
        {course.modules.map((module) => (
          <div key={module.id} className="mb-8">
            <h3 className="font-bold text-brand-green mb-3 uppercase text-xs tracking-wider px-2 opacity-80">{module.title}</h3>
            <ul className="space-y-1 relative"> 
              {module.lessons.map((lesson, lessonIndex) => {
                globalLessonIndex++;
                const displayIndex = globalLessonIndex;
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = lesson.id === currentLessonId;
                const isLastInModule = lessonIndex === module.lessons.length - 1;

                return (
                  <li key={lesson.id} className="relative">
                     {/* Connector Line - positioned absolutely relative to the ul/li but behind the button */}
                    {!isLastInModule && (
                         <div className="absolute left-[23px] top-8 bottom-[-4px] w-px bg-[#333] -z-10"></div>
                    )}
                    
                    <button 
                        onClick={() => onLessonClick(lesson.id)}
                        className={`w-full flex items-center p-2 rounded-lg transition-all cursor-pointer text-left group relative z-10 ${isCurrent ? 'bg-[#262626]' : 'hover:bg-[#262626]/50'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[2px] mr-3 flex-shrink-0 transition-all
                            ${isCompleted ? 'bg-brand-green border-brand-green text-black' : isCurrent ? 'bg-[#B9FF66]/10 border-brand-green text-brand-green' : 'border-[#333] bg-[#181818] text-gray-500 group-hover:border-gray-500'}`}>
                        {isCompleted ? <i className="fas fa-check text-xs font-bold"></i> : <span className="text-xs font-bold">{displayIndex}</span>}
                        </div>
                        <span className={`text-sm font-medium leading-tight ${isCurrent ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{lesson.title}</span>
                    </button>
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