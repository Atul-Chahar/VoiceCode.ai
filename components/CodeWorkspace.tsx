
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
}

type Tab = 'console' | 'exercises';

const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({ code, onCodeChange, output, exercises, onRunTests }) => {
    const [activeTab, setActiveTab] = useState<Tab>('console');

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex-[3] min-h-0">
                <EditorPanel code={code} onCodeChange={onCodeChange} />
            </div>
            <div className="flex-[2] min-h-0 flex flex-col">
                 <div className="flex gap-2 mb-2">
                    <button 
                        onClick={() => setActiveTab('console')}
                        className={`px-3 py-1.5 text-sm rounded-t-lg font-medium transition-colors ${activeTab === 'console' ? 'bg-[#181818] text-brand-green border-t border-l border-r border-[#262626]' : 'bg-[#0D0D0D] text-gray-500 hover:text-gray-300'}`}
                    >
                        <i className="fas fa-terminal mr-2"></i> Console
                    </button>
                    <button 
                        onClick={() => setActiveTab('exercises')}
                        className={`px-3 py-1.5 text-sm rounded-t-lg font-medium transition-colors ${activeTab === 'exercises' ? 'bg-[#181818] text-brand-green border-t border-l border-r border-[#262626]' : 'bg-[#0D0D0D] text-gray-500 hover:text-gray-300'}`}
                    >
                         <i className="fas fa-dumbbell mr-2"></i> Exercises
                         {exercises.length > 0 && <span className="ml-2 bg-gray-700 text-xs px-1.5 rounded-full text-gray-300">{exercises.length}</span>}
                    </button>
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
