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
        <header className="h-16 p-4 border-b border-[#262626] flex items-center justify-between bg-[#181818] flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700 transition-colors" aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
                    <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
                <div>
                    <p className="text-sm text-gray-400">{courseTitle}</p>
                    <h1 className="font-bold text-lg text-white">{lessonTitle}</h1>
                </div>
            </div>
            <button 
                onClick={() => navigateTo('explanations')}
                className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:text-brand-green hover:border-brand-green transition-all"
            >
                <i className="fas fa-book-open"></i> Explanations
            </button>
        </header>
    );
};

export default LearningHeader;