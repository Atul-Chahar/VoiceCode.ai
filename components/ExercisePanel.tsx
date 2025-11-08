
import React, { useState } from 'react';
import { Exercise, TestResult } from '../types';

interface ExercisePanelProps {
    exercises: Exercise[];
    onRunTests: () => TestResult[];
}

const ExercisePanel: React.FC<ExercisePanelProps> = ({ exercises, onRunTests }) => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [hasRun, setHasRun] = useState(false);

    const handleRun = () => {
        const testResults = onRunTests();
        setResults(testResults);
        setHasRun(true);
    };

    if (!exercises || exercises.length === 0) {
        return (
            <div className="bg-[#181818] rounded-lg h-full border border-[#262626] p-4 flex items-center justify-center text-gray-500">
                No exercises for this lesson.
            </div>
        );
    }

    const currentExercise = exercises[0]; // Currently showing just the first one for simplicity, could add pagination later

    return (
        <div className="bg-[#181818] rounded-lg flex flex-col h-full border border-[#262626]">
            <header className="p-2 px-4 border-b border-[#262626] flex justify-between items-center">
                <h2 className="font-semibold text-white text-sm">Exercise</h2>
                <button 
                    onClick={handleRun} 
                    className="bg-brand-green text-black px-3 py-1 rounded text-xs font-bold hover:opacity-90 transition-opacity"
                >
                    <i className="fas fa-flask mr-1"></i> Run Tests
                </button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="mb-4">
                    <h3 className="text-gray-300 font-semibold mb-2">Task:</h3>
                    <p className="text-gray-400 text-sm">{currentExercise.prompt}</p>
                </div>

                {hasRun && (
                    <div>
                        <h3 className="text-gray-300 font-semibold mb-2">Results:</h3>
                        <ul className="space-y-2">
                            {results.map((result, index) => (
                                <li key={index} className={`p-2 rounded text-sm flex items-start gap-2 ${result.passed ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                    <i className={`fas ${result.passed ? 'fa-check-circle' : 'fa-times-circle'} mt-0.5`}></i>
                                    <div className="flex-1">
                                        <code className="text-xs opacity-80 block mb-1">{result.test}</code>
                                        {result.error && <span className="block font-semibold">{result.error}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {results.every(r => r.passed) && results.length > 0 && (
                            <div className="mt-4 text-center text-brand-green animate-pulse">
                                <i className="fas fa-trophy mr-2"></i> Great job! Exercise completed.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExercisePanel;
