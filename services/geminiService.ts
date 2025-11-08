
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from "@google/genai";
import { Progress, Lesson } from "../types";

// Initialize strictly according to guidelines, but lazily to prevent top-level browser crashes
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (!aiClient) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY is missing. Please set it in your environment variables.");
        }
        aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
}

const writeCodeTool: FunctionDeclaration = {
    name: 'writeCode',
    parameters: {
        type: Type.OBJECT,
        description: 'Writes code into the user\'s editor. Use this to demonstrate concepts "live" as you explain them.',
        properties: {
            code: {
                type: Type.STRING,
                description: 'The complete JavaScript code to write to the editor.',
            },
            explanation: {
                type: Type.STRING,
                description: 'A brief, friendly, spoken explanation that synchronizes with the code appearing. E.g., "First, we declare the function..."',
            }
        },
        required: ['code', 'explanation'],
    },
};

const executeCodeTool: FunctionDeclaration = {
    name: 'executeCode',
    parameters: {
        type: Type.OBJECT,
        description: 'Executes the current code in the editor and displays the output in the console. Use this when the user wants to run their code or when you want to demonstrate an output.',
        properties: {},
        required: [],
    },
};

const readCodeTool: FunctionDeclaration = {
    name: 'readCode',
    parameters: {
        type: Type.OBJECT,
        description: 'Reads the current content of the code editor. ALWAYS use this before answering questions about the user\'s code or providing debugging help.',
        properties: {},
        required: [],
    },
};

// Helper type to get the return type of connect, handling the lazy client
type LiveSessionType = Awaited<ReturnType<GoogleGenAI['live']['connect']>>;
export type LiveSession = LiveSessionType;

export const startLiveSession = (
    progress: Progress,
    currentLesson: Lesson | null,
    callbacks: {
        onopen: () => void;
        onmessage: (message: LiveServerMessage) => void;
        onerror: (e: ErrorEvent) => void;
        onclose: (e: CloseEvent) => void;
    }
): Promise<LiveSession> => {
    const { currentLessonId, aiMemory } = progress;

    // Inject strict lesson protocols if a lesson is active
    const lessonProtocol = currentLesson ? `
**ACTIVE LESSON PROTOCOL (${currentLesson.title}):**
1. **Objectives:** Ensure the user masters: ${currentLesson.objectives.join(', ')}.
2. **Approved Explanations:** Use these conceptual analogies: ${JSON.stringify(currentLesson.content.explanations)}.
3. **Live Demos:** When asked for examples, prefer these approved standard demos (use 'writeCode' tool): ${JSON.stringify(currentLesson.content.demos)}.
4. **Debugging Drill:** If the user is ready for a challenge, propose this buggy code to fix: ${JSON.stringify(currentLesson.content.debugging[0])}.
` : 'NO ACTIVE LESSON. Guide user to select a lesson.';

    const systemInstruction = `
You are VoiceCode AI, a revolutionary conversational coding mentor.
Your goal is to teach programming through natural, human-like conversation, adhering strictly to the active lesson plan.

**YOUR PERSONA:**
- **Warm & Patient:** Celebrate small wins enthusiastically. Never get frustrated.
- **Socratic Tutor:** Ask guiding questions (e.g., "Why do you think that happened?") instead of giving direct answers.
- **Constructivist:** Connect new topics to what they already know.

**TEACHING TOOLS:**
- USE 'writeCode' FREQUENTLY to manifest examples on their screen while you talk.
- USE 'readCode' before debugging their work.

${lessonProtocol}

**SESSION CONTEXT:**
- User History Summary: ${aiMemory.length > 0 ? aiMemory.slice(-3).join('; ') : 'New user.'}
`;

    // Use the lazy getter here
    return getAiClient().live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction,
            outputAudioTranscription: {},
            inputAudioTranscription: {},
            tools: [{ functionDeclarations: [writeCodeTool, executeCodeTool, readCodeTool] }],
        },
    });
};

export function createPcmBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    const encode = (bytes: Uint8Array) => {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}
