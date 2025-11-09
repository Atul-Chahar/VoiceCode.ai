import React from 'react';
import { View } from '../App';

interface LearningHeaderProps {
    lessonTitle: string;
    courseTitle: string;
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    navigateTo: (view: View) => void;
}

const LearningHeader: React.FC<LearningHeaderProps> = ({ lessonTitle, courseTitle, toggleSidebar, isSidebarOpen, navigateTo }) => {
    return (
        <header className="h-14 md:h-16 px-3 md:px-4 border-b border-[#262626] flex items-center justify-between bg-[#181818] flex-shrink-0">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <button 
                    onClick={toggleSidebar} 
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#262626] text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <i className={`fas ${isSidebarOpen && window.innerWidth >= 768 ? 'fa-outdent' : 'fa-indent'} text-lg`}></i>
                </button>
                <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 truncate hidden md:block">{courseTitle}</p>
                    <h1 className="font-bold text-sm md:text-lg text-white truncate">{lessonTitle}</h1>
                </div>
            </div>
            <button 
                onClick={() => navigateTo('explanations')}
                className="flex-shrink-0 btn-secondary px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm flex items-center gap-2 hover:text-brand-green hover:border-brand-green transition-all"
            >
                <i className="fas fa-book-open"></i> 
                <span className="hidden sm:inline">Study Material</span>
            </button>
        </header>
    );
};

export default LearningHeader;