
import React from 'react';

interface LearningFooterProps {
    onComplete: () => void;
    isCompleting?: boolean;
}

const LearningFooter: React.FC<LearningFooterProps> = ({ onComplete, isCompleting = false }) => {
    return (
        <footer className="h-auto md:h-20 p-4 border-t border-[#262626] bg-[#131313] flex-shrink-0 flex items-center justify-end">
            <button
                onClick={onComplete}
                disabled={isCompleting}
                className={`btn-primary px-6 py-3 rounded-xl font-bold text-sm md:text-base flex items-center whitespace-nowrap shadow-lg shadow-brand-green/10 transition-all ${isCompleting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
            >
                {isCompleting ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Saving Progress...</>
                ) : (
                    <>Complete & Continue <i className="fas fa-arrow-right ml-3"></i></>
                )}
            </button>
        </footer>
    );
};

export default LearningFooter;
