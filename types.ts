
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export enum InteractionMode {
  Chat = 'CHAT',
  Voice = 'VOICE',
}

export interface Progress {
  completedLessons: string[];
  currentLessonId: string;
  aiMemory: string[];
}

export interface Transcript {
  user: string;
  ai: string;
  isFinal: boolean;
}

export interface ConsoleOutput {
    type: 'log' | 'error' | 'warn' | 'info';
    message: string;
}

export interface TestResult {
    test: string;
    passed: boolean;
    error?: string;
}

// --- Auth Types ---
export interface User {
    id: string;
    email: string;
    name: string;
}

// --- Standardized Curriculum Types (based on PDF Pages 13-15) ---

export interface Demo {
    code: string;
    explainByLine: boolean;
}

export interface Question {
    type: 'recall' | 'apply' | 'predict' | 'mcq' | 'output' | 'code';
    prompt: string;
    choices?: string[];
    answer?: string;
}

export interface DebuggingChallenge {
    buggyCode: string;
    hints: string[];
    solution: string;
}

export interface Exercise {
    prompt: string;
    tests: string[];
}

export interface Assessment {
    questions: Question[];
    passCriteria: {
        minCorrect: number;
    };
}

export interface LessonContent {
    explanations: string[];
    demos: Demo[];
    oralQuestions: Question[];
    debugging: DebuggingChallenge[];
    exercises: Exercise[];
    assessment: Assessment;
}

export interface MemoryUpdates {
    conceptsMastered: string[];
    mistakeWatchlist: string[];
}

export interface Lesson {
    id: string;
    title: string;
    objectives: string[];
    prerequisites: string[];
    timeEstimateMin: number;
    content: LessonContent;
    memoryUpdates: MemoryUpdates;
    nextLesson?: string | null;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string; // Mapped from 'name' in JSON for consistency with UI
    description: string;
    modules: Module[];
}

// Interface specifically for importing the raw JSON which might have slight naming diffs
export interface RawCurriculumDatabase {
    course: {
        id: string;
        name: string;
        description: string;
        modules: Module[];
    };
}
