
import React, { useState } from 'react';
import EditorPanel from './EditorPanel';
import ConsolePanel from './ConsolePanel';
import ExercisePanel from './ExercisePanel';
import { ConsoleOutput, Exercise, TestResult } from '../types';

interface CodeWorkspaceProps {
    code: string;
    onCodeChange: (value: string | undefined) => void;
    output: ConsoleOutput[];
    exercises: Exercise[];
    onRunTests: () => TestResult[];
    onRunCode: () => void;
    onResetCode: () => void;
}

type Tab = 'console' | 'exercises';

const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({ 
    code, 
    onCodeChange, 
    output, 
    exercises, 
    onRunTests,
    onRunCode,
    onResetCode
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('console');

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex-[3] min-h-0">
                <EditorPanel code={code} onCodeChange={onCodeChange} />
            </div>
            <div className="flex-[2] min-h-0 flex flex-col">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('console')}
                            className={`px-4 py-1.5 text-sm rounded-t-lg font-medium transition-colors ${activeTab === 'console' ? 'bg-[#181818] text-brand-green border-t border-l border-r border-[#262626]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <i className="fas fa-terminal mr-2"></i> Console
                        </button>
                        <button 
                            onClick={() => setActiveTab('exercises')}
                            className={`px-4 py-1.5 text-sm rounded-t-lg font-medium transition-colors ${activeTab === 'exercises' ? 'bg-[#181818] text-brand-green border-t border-l border-r border-[#262626]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                             <i className="fas fa-dumbbell mr-2"></i> Exercises
                             {exercises.length > 0 && <span className="ml-2 bg-[#262626] text-xs px-1.5 rounded-full text-gray-400">{exercises.length}</span>}
                        </button>
                    </div>
                    
                    {/* Action Buttons moved here from footer */}
                    <div className="flex items-center gap-2">
                        <button onClick={onResetCode} className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#262626] transition-colors" title="Reset Code">
                            <i className="fas fa-undo"></i>
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                        <button onClick={onRunCode} className="bg-brand-green/10 text-brand-green hover:bg-brand-green/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors" title="Run Code">
                            <i className="fas fa-play"></i>
                            <span className="hidden sm:inline">Run</span>
                        </button>
                    </div>
                </div>

                <div className="flex-grow relative">
                    {activeTab === 'console' ? (
                        <ConsolePanel output={output} />
                    ) : (
                        <ExercisePanel exercises={exercises} onRunTests={onRunTests} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeWorkspace;
