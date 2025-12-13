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
        <header className="h-16 px-4 md:px-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40 backdrop-blur-md flex-shrink-0 relative z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5"
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <i className={`fas ${isSidebarOpen && window.innerWidth >= 768 ? 'fa-outdent' : 'fa-indent'} text-lg`}></i>
                </button>
                <div>
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest hidden md:block mb-0.5">{courseTitle}</p>
                    <h1 className="font-bold text-sm md:text-lg text-white font-manrope">{lessonTitle}</h1>
                </div>
            </div>
            <button
                onClick={() => navigateTo('explanations')}
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs md:text-sm font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-2"
            >
                <i className="fas fa-book-open text-orange-500"></i>
                <span className="hidden sm:inline">Reference Guide</span>
            </button>
        </header>
    );
};

export default LearningHeader;