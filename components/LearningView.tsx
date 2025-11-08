
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Course, Lesson, ConsoleOutput, Transcript, InteractionMode, TestResult } from '../types';
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

    // --- Tool Call Handlers for AI ---
    const handleToolCall = useCallback(async (functionCalls: FunctionCall[]): Promise<FunctionResponse[]> => {
        const responses: FunctionResponse[] = [];
        for (const call of functionCalls) {
            let result: any = { error: "Unknown tool" };
            try {
                switch (call.name) {
                    case 'writeCode':
                        const { code, explanation } = call.args as any;
                        // We append or replace depending on context, for now let's append with a newline if not empty
                        setEditorCode(prev => {
                            // Basic heuristic: if completely empty or just comments, replace. Otherwise append.
                            const isEffectiveEmpty = prev.trim().length === 0 || prev.split('\n').every(line => line.trim().startsWith('//'));
                            return isEffectiveEmpty ? code : `${prev}\n\n${code}`;
                        });
                        result = { success: true, message: "Code written to editor." };
                        break;
                    case 'readCode':
                        // We need the *current* state of editorCode here. 
                        // The useLiveTutor hook uses a ref to ensure it gets the latest version of this callback.
                        // We must ensure WE also have access to the latest state if we were using closures,
                        // but the setState callback pattern above helps for writeCode.
                        // For readCode, we might need a ref if this callback doesn't update with state changes in the hook.
                        // *Self-correction*: standard useState in standard callback might be stale if the callback isn't recreated.
                        // We'll trust React's state for now, but might need a Ref for editorCode if it reads stale data.
                        // Actually, let's USE A REF for editorCode to be safe in async callbacks.
                        result = { code: editorCodeRef.current };
                        break;
                    case 'executeCode':
                        handleRunCode();
                        result = { success: true, message: "Code execution triggered." };
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
    }, []); // Dependencies will be managed by the Ref in useLiveTutor, but we need to keep editorCode Ref updated.

    // Keep a ref for editor code to avoid stale closures in tool calls
    const editorCodeRef = useRef(editorCode);
    useEffect(() => {
        editorCodeRef.current = editorCode;
    }, [editorCode]);

    const onStreamMessage = useCallback((newTranscript: Transcript) => {
        setTranscript(newTranscript);
    }, []);

    const { 
        isSessionActive, isConnecting, isListening, isSpeaking, startSession, stopSession, sessionError 
    } = useLiveTutor(onStreamMessage, handleToolCall, progress, currentLesson);

    // --- Event Handlers ---

    const handleRunCode = () => {
        setConsoleOutput([]); // Clear previous output
        executeCodeSafely(editorCode, (log) => {
            setConsoleOutput(prev => [...prev, log]);
        });
    };

    const handleRunTests = (): TestResult[] => {
        if (!currentLesson || currentLesson.content.exercises.length === 0) return [];
        const exercise = currentLesson.content.exercises[0];
        return executeTests(editorCode, exercise.tests);
    }

    const handleResetCode = () => {
        if (confirm("Are you sure you want to reset your code?")) {
             setEditorCode(`// ${currentLesson?.title}\n// ${currentLesson?.objectives[0]}\n\n`);
             setConsoleOutput([]);
        }
    };

    const handleCompleteLesson = async () => {
        if (!currentLesson) return;
        setIsCompletingLesson(true);
        // In a real app, we'd might ask the AI to summarize memory updates here before completing.
        // For now, just use the static ones from the lesson.
        await completeLesson(currentLesson.id, currentLesson.memoryUpdates.conceptsMastered);
        
        // The effect above will switch the lesson, but let's clear output
        setConsoleOutput([]);
        setIsCompletingLesson(false);
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
                    completedLessons={progress.completedLessons}
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
                         />
                    </div>
                </main>
            </div>

            <LearningFooter 
                onRun={handleRunCode}
                onReset={handleResetCode}
                onComplete={handleCompleteLesson}
                isCompleting={isCompletingLesson}
            />
        </div>
    );
};

export default LearningView;
