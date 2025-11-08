import React, { useState, useEffect, useCallback } from 'react';
import { FunctionCall, FunctionResponse } from "@google/genai";
import { Course, Lesson, Transcript, ConsoleOutput, TestResult } from '../types';
import RoadmapSidebar from './RoadmapSidebar';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useLiveTutor } from '../hooks/useLiveTutor';
import LearningHeader from './LearningHeader';
import ConversationPanel from './ConversationPanel';
import CodeWorkspace from './CodeWorkspace';
import LearningFooter from './LearningFooter';
import { executeCodeSafely, executeTests } from '../utils/codeExecutor';
import { View } from '../App';

interface LearningViewProps {
  course: Course;
  navigateTo: (view: View) => void;
}

const LearningView: React.FC<LearningViewProps> = ({ course, navigateTo }) => {
  const { progress, updateProgress, completeLesson } = useCourseProgress(course.id);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  // Initialize sidebar closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const [editorCode, setEditorCode] = useState('// Your AI tutor will write code here...');
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
  const [transcript, setTranscript] = useState<Transcript>({ user: '', ai: '', isFinal: false });

  // Handle window resize to auto-manage sidebar state
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth >= 768) {
              setIsSidebarOpen(true);
          } else {
              setIsSidebarOpen(false);
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const typeCode = (code: string) => {
    setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < code.length) {
                setEditorCode(prev => code.substring(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 15);
    }, 50);
  };

  const handleRunCode = useCallback(() => {
    setConsoleOutput([]); 
    executeCodeSafely(editorCode, (output) => {
        setConsoleOutput(prev => [...prev, output]);
    });
  }, [editorCode]);

  const handleRunTests = useCallback((): TestResult[] => {
      if (!currentLesson || !currentLesson.content.exercises || currentLesson.content.exercises.length === 0) {
          return [];
      }
      return executeTests(editorCode, currentLesson.content.exercises[0].tests);
  }, [editorCode, currentLesson]);

  const handleToolCall = async (functionCalls: FunctionCall[]): Promise<FunctionResponse[]> => {
      const responses: FunctionResponse[] = [];
      for (const fc of functionCalls) {
          switch (fc.name) {
              case 'writeCode':
                  setEditorCode('');
                  typeCode((fc.args?.code as string) || '');
                  responses.push({ id: fc.id, name: fc.name, response: { result: "Code written successfully." } });
                  break;
              case 'executeCode':
                  handleRunCode();
                  responses.push({ id: fc.id, name: fc.name, response: { result: "Code executed." } });
                  break;
              case 'readCode':
                  responses.push({ id: fc.id, name: fc.name, response: { result: editorCode } });
                  break;
          }
      }
      return responses;
  };

  const onStreamMessage = useCallback((newTranscript: Transcript) => {
    setTranscript(newTranscript);
  }, []);
  
  useEffect(() => {
    if (progress.currentLessonId) {
        const lesson = course.modules
          .flatMap(m => m.lessons)
          .find(l => l.id === progress.currentLessonId);
        setCurrentLesson(lesson || null);
    } else {
         const firstLesson = course.modules[0]?.lessons[0];
         if (firstLesson) {
             updateProgress({ currentLessonId: firstLesson.id });
         }
    }
  }, [progress.currentLessonId, course, updateProgress]);

  const { 
    isSessionActive, 
    isConnecting,
    isSpeaking, 
    isListening, 
    startSession, 
    stopSession,
    sessionError
  } = useLiveTutor(onStreamMessage, handleToolCall, progress, currentLesson);
  
  const getNextLesson = (): Lesson | null => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if(currentIndex !== -1 && currentIndex < allLessons.length - 1){
        return allLessons[currentIndex + 1];
    }
    return null;
  }

  const handleCompleteLesson = async () => {
      if (!currentLesson) return;
      const nextLesson = getNextLesson();
      if (nextLesson) {
        await completeLesson(currentLesson.id, nextLesson.id);
      } else {
         await completeLesson(currentLesson.id, currentLesson.id);
         alert(`Congratulations! You've completed the ${course.title} course!`);
         navigateTo('dashboard');
      }
  }
  
  const handleLessonClick = async (lessonId: string) => {
      await updateProgress({ currentLessonId: lessonId });
      if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] text-gray-200 font-sans flex overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
          <div 
              className="md:hidden fixed inset-0 bg-black/80 z-30 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
          />
      )}

      <RoadmapSidebar
        course={course}
        completedLessons={progress.completedLessons}
        currentLessonId={progress.currentLessonId}
        onBack={() => navigateTo('dashboard')}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLessonClick={handleLessonClick}
      />

      <main className={`flex flex-col flex-grow relative h-full transition-all duration-300 ${isSidebarOpen ? 'md:ml-80' : ''} w-full`}>
        <LearningHeader 
            lessonTitle={currentLesson?.title || 'Loading...'} 
            courseTitle={course.title}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            navigateTo={navigateTo}
        />
        
        {/* Main Content Area - Flex col on mobile, Grid on desktop */}
        <div className="flex-grow flex flex-col md:grid md:grid-cols-2 gap-4 p-2 md:p-4 overflow-hidden min-h-0">
          {/* On mobile, give chat ~35% height, code ~65% height. On desktop, they are equal columns. */}
          <div className="h-[35%] md:h-auto min-h-0 flex-shrink-0 md:flex-shrink">
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
          <div className="flex-1 md:h-auto min-h-0">
              <CodeWorkspace 
                code={editorCode}
                onCodeChange={(val) => setEditorCode(val || '')}
                output={consoleOutput}
                exercises={currentLesson?.content.exercises || []}
                onRunTests={handleRunTests}
              />
          </div>
        </div>

        <LearningFooter 
            onComplete={handleCompleteLesson}
            onRun={handleRunCode}
            onReset={() => {
                setEditorCode('// Code has been reset.');
                setConsoleOutput([]);
            }}
        />
      </main>
    </div>
  );
};

export default LearningView;