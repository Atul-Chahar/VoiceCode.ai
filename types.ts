
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

// New strictly typed Firestore models
export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface CourseProgress {
    completedLessonIds: string[];
    currentLessonId: string | null;
    aiMemory?: string[];
    updatedAt?: any; // generic for Firestore Timestamp or Date
}

export interface UserNotes {
    content: string;
    updatedAt?: any;
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
    avatar?: string;
}

// --- Standardized Curriculum Types ---
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
    title: string;
    description: string;
    outcomes?: string[];
    prerequisites?: string[];
    level?: string;
    totalDuration?: string;
    modules: Module[];
}

export interface RawCurriculumDatabase {
    course: {
        id: string;
        name: string;
        description: string;
        modules: Module[];
    };
}

// ==========================================
// Gamification & Analytics Types
// ==========================================

export interface UserStats {
    userId: string;
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    joinedAt: string;
    lessonsCompleted: number;

    // Profile Bio
    tagline?: string;
    bio?: string;
    location?: string;
    githubHandle?: string;
    linkedinHandle?: string;
    websiteUrl?: string;

    // Skills
    skillJs: number;
    skillPython: number;
    skillVoice: number;
    skillLogic: number;
    skillSpeed: number;
}

export interface ActivityLog {
    id: string;
    date: string; // YYYY-MM-DD
    xpEarned: number;
    lessonsCompleted: number;
    minutesSpent: number;
}

export interface UserAchievement {
    id: string;
    achievementId: string;
    unlockedAt: string;
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    fullName: string;
    avatarUrl?: string;
    xp: number;
    level: number;
}

// Shop & Economy
export interface ShopItem {
    id: string;
    name: string;
    description: string;
    costGems: number;
    sellPriceGems: number;
    maxQuantity: number;
    iconName: string;
    category: 'powerup' | 'theme' | 'cosmetic' | 'misc';
}

export interface InventoryItem {
    id: string;
    itemId: string;
    quantity: number;
}

export interface Transaction {
    id: string;
    itemId?: string;
    amount: number;
    type: 'buy' | 'sell' | 'reward' | 'adjustment' | 'quest_reward';
    description?: string;
    createdAt: string;
}

export interface Notification {
    id: string;
    type: 'system' | 'quest' | 'achievement' | 'social' | 'shop';
    title: string;
    message: string;
    isRead: boolean;
    linkUrl?: string;
    createdAt: string;
}

