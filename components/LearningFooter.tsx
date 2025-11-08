import React from 'react';

interface LearningFooterProps {
    onRun: () => void;
    onReset: () => void;
    onComplete: () => void;
}

const LearningFooter: React.FC<LearningFooterProps> = ({ onRun, onReset, onComplete }) => {
    return (
        <footer className="h-auto md:h-20 p-3 md:p-4 border-t border-[#262626] bg-[#181818] flex-shrink-0 flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <button onClick={onRun} className="btn-secondary px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm font-medium">
                    <i className="fas fa-play text-brand-green"></i> <span className="hidden sm:inline">Run</span>
                </button>
                <button onClick={onReset} className="btn-secondary px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm font-medium text-gray-400 hover:text-white">
                    <i className="fas fa-undo"></i> <span className="hidden sm:inline">Reset</span>
                </button>
            </div>
            <button
                onClick={onComplete}
                className="btn-primary px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-bold text-xs md:text-sm flex items-center whitespace-nowrap shadow-lg shadow-brand-green/10"
            >
                Next Lesson <i className="fas fa-arrow-right ml-2"></i>
            </button>
        </footer>
    );
};

export default LearningFooter;