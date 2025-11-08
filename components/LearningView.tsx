
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Course, Lesson, ConsoleOutput, Transcript, TestResult } from '../types';
import { View } from '../App';
import RoadmapSidebar from './RoadmapSidebar';
import LearningHeader from './LearningHeader';
import LearningFooter from './LearningFooter';
import CodeWorkspace from './CodeWorkspace';
import ConversationPanel from './ConversationPanel';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useLiveTutor } from '../hooks/useLiveTutor';
import { executeCodeSafely, executeTests } from '../utils/codeExecutor';
import { FunctionCall, FunctionResponse } from "@google/genai";

interface LearningViewProps {
    course: Course;
    navigateTo: (view: View) => void;
}

const LearningView: React.FC<LearningViewProps> = ({ course, navigateTo }) => {
    const { progress, loading: progressLoading, completeLesson, setCurrentLesson } = useCourseProgress(course.id);
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [currentLesson, setLesson] = useState<Lesson | null>(null);
    const [editorCode, setEditorCode] = useState<string>('// Loading lesson...');
    const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
    const [transcript, setTranscript] = useState<Transcript>({ user: '', ai: '', isFinal: false });
    const [isCompletingLesson, setIsCompletingLesson] = useState(false);

    // Find current lesson object
    useEffect(() => {
        if (!progressLoading && progress.currentLessonId) {
            for (const module of course.modules) {
                const lesson = module.lessons.find(l => l.id === progress.currentLessonId);
                if (lesson) {
                    setLesson(lesson);
                    // Only reset code if it's a completely new lesson and empty (simple check)
                    if (editorCode === '// Loading lesson...' || editorCode.includes('// Previous lesson')) {
                         setEditorCode(`// ${lesson.title}\n// ${lesson.objectives[0]}\n\n`);
                    }
                    break;
                }
            }
        }
    }, [progress.currentLessonId, course, progressLoading]);

    // Keep a ref for editor code to avoid stale closures in tool calls
    const editorCodeRef = useRef(editorCode);
    useEffect(() => {
        editorCodeRef.current = editorCode;
    }, [editorCode]);

    // Keep a ref for currentLesson to avoid stale closures
    const currentLessonRef = useRef(currentLesson);
    useEffect(() => {
        currentLessonRef.current = currentLesson;
    }, [currentLesson]);

    // --- Event Handlers (Defined early for tool use) ---
    const handleRunCode = useCallback(() => {
        setConsoleOutput([]); // Clear previous output
        // Use ref to get latest code even if this closure is stale
        executeCodeSafely(editorCodeRef.current, (log) => {
            setConsoleOutput(prev => [...prev, log]);
        });
    }, []);

    const handleResetCode = useCallback(() => {
        const lesson = currentLessonRef.current;
        setEditorCode(`// ${lesson?.title}\n// ${lesson?.objectives[0]}\n\n`);
        setConsoleOutput([]);
    }, []);

    const handleCompleteLesson = useCallback(async () => {
        const lesson = currentLessonRef.current;
        if (!lesson) return;
        setIsCompletingLesson(true);
        await completeLesson(lesson.id, lesson.memoryUpdates.conceptsMastered);
        setConsoleOutput([]);
        setIsCompletingLesson(false);
    }, [completeLesson]);

    // --- Tool Call Handlers for AI ---
    const handleToolCall = useCallback(async (functionCalls: FunctionCall[]): Promise<FunctionResponse[]> => {
        const responses: FunctionResponse[] = [];
        for (const call of functionCalls) {
            let result: any = { error: "Unknown tool" };
            try {
                switch (call.name) {
                    case 'writeCode':
                        const { code } = call.args as any;
                        setEditorCode(prev => {
                            const isEffectiveEmpty = prev.trim().length === 0 || prev.split('\n').every(line => line.trim().startsWith('//'));
                            return isEffectiveEmpty ? code : `${prev}\n\n${code}`;
                        });
                        result = { success: true, message: "Code written to editor." };
                        break;
                    case 'readCode':
                        result = { code: editorCodeRef.current };
                        break;
                    case 'executeCode':
                        handleRunCode();
                        result = { success: true, message: "Code execution triggered." };
                        break;
                    case 'controlApp':
                        const { action } = call.args as any;
                        if (action === 'runCode') {
                            handleRunCode();
                            result = { success: true, message: "Code running." };
                        } else if (action === 'resetCode') {
                            handleResetCode();
                            result = { success: true, message: "Code reset to lesson default." };
                        } else if (action === 'nextLesson') {
                            handleCompleteLesson();
                            result = { success: true, message: "Advancing to next lesson." };
                        } else {
                             result = { error: `Unknown action: ${action}` };
                        }
                        break;
                    default:
                         result = { error: `Unknown tool: ${call.name}` };
                }
            } catch (e: any) {
                result = { error: e.message };
            }
            responses.push({ id: call.id, name: call.name, response: result });
        }
        return responses;
    }, [handleRunCode, handleResetCode, handleCompleteLesson]);

    const onStreamMessage = useCallback((newTranscript: Transcript) => {
        setTranscript(newTranscript);
    }, []);

    const { 
        isSessionActive, isConnecting, isListening, isSpeaking, startSession, stopSession, sessionError, isMuted, toggleMute
    } = useLiveTutor(onStreamMessage, handleToolCall, progress, currentLesson);

    // --- Event Handlers for UI Buttons ---
    const handleRunTests = (): TestResult[] => {
        if (!currentLesson || currentLesson.content.exercises.length === 0) return [];
        const exercise = currentLesson.content.exercises[0];
        return executeTests(editorCode, exercise.tests);
    }

    const handleResetCodeUI = () => {
        if (confirm("Are you sure you want to reset your code?")) {
             handleResetCode();
        }
    };

    const handleSelectLesson = (lessonId: string) => {
        setCurrentLesson(lessonId);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    if (!currentLesson) {
        return <div className="h-screen flex items-center justify-center bg-[#0D0D0D] text-brand-green"><i className="fas fa-circle-notch fa-spin text-4xl"></i></div>;
    }

    return (
        <div className="flex flex-col h-screen bg-[#0D0D0D] overflow-hidden">
            <LearningHeader 
                lessonTitle={currentLesson.title}
                courseTitle={course.title}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                navigateTo={navigateTo}
            />

            <div className="flex-grow flex overflow-hidden">
                <RoadmapSidebar 
                    course={course}
                    currentLessonId={currentLesson.id}
                    completedLessons={progress.completedLessonIds}
                    onSelectLesson={handleSelectLesson}
                    isOpen={isSidebarOpen}
                />

                <main className="flex-grow flex flex-col md:flex-row min-w-0">
                     {/* Left/Top: Code Area */}
                    <div className={`flex-grow md:flex-[5] lg:flex-[6] p-1 md:p-2 min-h-0 flex flex-col transition-all ${isSessionActive ? 'h-1/2 md:h-full' : 'h-2/3 md:h-full'}`}>
                         <CodeWorkspace 
                            code={editorCode} 
                            onCodeChange={(val) => setEditorCode(val || '')}
                            output={consoleOutput}
                            exercises={currentLesson.content.exercises}
                            onRunTests={handleRunTests}
                         />
                    </div>

                    {/* Right/Bottom: AI Interaction Area */}
                    <div className={`md:flex-[3] lg:flex-[3] p-1 md:p-2 border-t md:border-t-0 md:border-l border-[#262626] bg-[#111] flex flex-col min-h-0 transition-all ${isSessionActive ? 'h-1/2 md:h-full' : 'h-1/3 md:h-full'}`}>
                         <ConversationPanel
                            isSessionActive={isSessionActive}
                            isConnecting={isConnecting}
                            isListening={isListening}
                            isSpeaking={isSpeaking}
                            startSession={startSession}
                            stopSession={stopSession}
                            transcript={transcript}
                            sessionError={sessionError}
                            isMuted={isMuted}
                            toggleMute={toggleMute}
                         />
                    </div>
                </main>
            </div>

            <LearningFooter 
                onRun={handleRunCode}
                onReset={handleResetCodeUI}
                onComplete={handleCompleteLesson}
                isCompleting={isCompletingLesson}
            />
        </div>
    );
};

export default LearningView;
