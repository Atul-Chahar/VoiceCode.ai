import React, { useState, useEffect, useRef } from 'react';
import { View } from '../App';
import Hero3D from './Hero3D';

interface DemoMessage {
    type: 'user' | 'ai';
    text: string;
}

const demoMessagesData: DemoMessage[] = [
    { type: 'user', text: "I'm trying to understand how async/await works in JavaScript" },
    { type: 'ai', text: "Great question! Think of async/await like ordering food delivery. When you place an order (call an async function), you don't wait by the door - you get a tracking number (promise) and do other things. When the food arrives (await), you're notified. Want to see a practical example?" },
    { type: 'user', text: "Yes, show me with a real API call" },
    { type: 'ai', text: "Perfect! Let me show you how to fetch user data. First, mark your function as async, then use await before the fetch call. This pauses execution until the data arrives, but doesn't block other code. Try typing: async function getUser() { const response = await fetch('/api/user'); }" },
    { type: 'user', text: "What about error handling?" },
    { type: 'ai', text: "Excellent follow-up! Wrap your await calls in try-catch blocks. This catches any rejected promises or network errors. It's like having a backup plan if the delivery fails. Want me to show you the complete pattern with error handling?" }
];

interface LandingPageProps {
  navigateTo: (view: View) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigateTo }) => {
    // --- Interactive Demo State ---
    const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageIndexRef = useRef(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSession = () => {
        navigateTo('dashboard');
    };

    const scrollToDemo = () => {
        document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Demo Logic ---
    const simulateVoiceChat = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const addMessage = () => {
            if (messageIndexRef.current >= demoMessagesData.length) return;
            setDemoMessages(prev => [...prev, demoMessagesData[messageIndexRef.current]]);
            messageIndexRef.current++;
            if (messageIndexRef.current < demoMessagesData.length) {
                timeoutRef.current = setTimeout(addMessage, 2500);
            }
        };
        addMessage();
    };
    
    const resetDemo = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        messageIndexRef.current = 0;
        setDemoMessages([]);
    }

    // --- Effects ---
    useEffect(() => {
        // Auto-scroll chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [demoMessages]);

    return (
        <div className="bg-[#050A14] min-h-screen w-full overflow-x-hidden">
            {/* 1. HERO SECTION (3D Only) */}
            <Hero3D />

            {/* 2. FEATURES GRID */}
            <section id="features" className="py-24 px-4 relative z-10 bg-[#050A14]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Why Learn with <span className="text-brand-green">Voice?</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Traditional tutorials are passive. VoiceCode makes learning active, engaging, and twice as fast by mimicking real pair programming.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: 'comments', title: 'Natural Dialogue', desc: 'Just ask "Why isn\'t this working?" No complex prompts needed—talk naturally like you would to a human mentor.' },
                            { icon: 'desktop', title: 'Context Aware', desc: 'AI sees your editor in real-time. It knows exactly which line you\'re struggling with without you having to copy-paste.' },
                            { icon: 'bug', title: 'Voice Debugging', desc: 'Walk through errors step-by-step verbally. It\'s like having a senior developer looking over your shoulder.' },
                            { icon: 'brain', title: 'Adaptive Learning', desc: '"Explain it simpler." The AI adjusts its vocabulary, analogies, and pacing instantly based on your feedback.' },
                            { icon: 'code', title: 'Live Code Injection', desc: 'Watch as the AI types examples directly into your editor while explaining them to you verbally.' },
                            { icon: 'rocket', title: 'Instant Feedback', desc: 'Get immediate verbal corrections on your syntax, logic, and best practices before you even run the code.' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-[#0d1224] border border-[#1e293b] rounded-2xl p-8 hover:border-brand-green/30 transition-all group">
                                <div className="w-14 h-14 bg-[#B9FF66]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <i className={`fas fa-${feature.icon} text-brand-green text-2xl`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section id="how" className="py-24 px-4 bg-[#03060A] border-t border-[#1e293b]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            From Confusion to <span className="text-brand-green">Clarity</span>
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Steps List */}
                        <div className="space-y-10">
                            {[
                                { step: 1, title: 'Open the Workspace', desc: 'Enter our integrated browser-based IDE. No complicated setup required—just start coding immediately.' },
                                { step: 2, title: 'Activate Voice Mode', desc: 'Click the mic. The AI instantly connects, greets you by name, and is ready to help with your specific lesson.' },
                                { step: 3, title: 'Talk While You Type', desc: 'Stuck? Just ask "How do I do a loop here?" The AI guides you verbally while you type the solution yourself.' },
                                { step: 4, title: 'Master the Concept', desc: 'Get tested with quick verbal questions to ensure you truly understand the "why" before moving on.' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#0f172a] border border-brand-green/20 rounded-full flex items-center justify-center text-brand-green font-bold text-xl mr-6 group-hover:bg-brand-green/10 transition-colors">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-brand-green transition-colors">{item.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Code Mockup */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-green/20 blur-[100px] opacity-30 rounded-full"></div>
                            <div className="relative bg-[#050A14] rounded-2xl border border-[#1e293b] shadow-2xl overflow-hidden">
                                <div className="bg-[#0f172a] px-4 py-3 flex items-center border-b border-[#1e293b]">
                                    <div className="flex space-x-2 mr-4">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">learning_session.js</div>
                                </div>
                                <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
                                    <div className="text-gray-500 italic mb-2">// AI: "Let's try implementing that sort function now."</div>
                                    <div><span className="text-purple-400">function</span> <span className="text-blue-400">bubbleSort</span>(arr) {'{'}</div>
                                    <div className="pl-4"><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; arr.length; i++) {'{'}</div>
                                    <div className="pl-8 text-gray-500 italic">// AI: "Good start. Now, what do we need inside this loop?"</div>
                                    <div className="pl-8"><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> j = 0; j &lt; arr.length - i - 1; j++) {'{'}</div>
                                    <div className="pl-12"><span className="text-purple-400">if</span> (arr[j] &gt; arr[j+1]) {'{'}</div>
                                    <div className="pl-16 flex items-center">
                                        <span className="text-gray-300">let temp = arr[j];</span>
                                        <span className="ml-2 w-2 h-5 bg-brand-green animate-pulse"></span>
                                    </div>
                                    <div className="pl-12">{'}'}</div>
                                    <div className="pl-8">{'}'}</div>
                                    <div className="pl-4">{'}'}</div>
                                    <div>{'}'}</div>
                                </div>
                                
                                {/* Floating AI Message */}
                                <div className="absolute bottom-8 right-8 max-w-xs bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-xl border border-brand-green/30 shadow-2xl animate-fade-in">
                                    <div className="flex items-center mb-2 text-brand-green">
                                        <i className="fas fa-waveform mr-2"></i>
                                        <span className="text-xs font-bold uppercase tracking-wider">AI Speaking</span>
                                    </div>
                                    <p className="text-sm text-white">"Exactly! You need that temporary variable to hold the value before you overwrite it. Keep going!"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. INTERACTIVE DEMO */}
            <section id="demo" className="py-24 px-4 bg-[#050A14] border-t border-[#1e293b]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                            Experience the <span className="text-brand-green">Conversation</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Don't just take our word for it. Try a simulated session right now.
                        </p>
                    </div>
                    
                    <div className="bg-[#080c1a] rounded-3xl border border-[#1e293b] p-4 md:p-8 shadow-2xl">
                        {/* Chat Window */}
                        <div 
                            ref={chatContainerRef} 
                            className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 bg-[#03060A] rounded-2xl border border-[#0f172a] mb-8 space-y-4 custom-scrollbar"
                        >
                            {demoMessages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                                    <i className="fas fa-comments text-6xl opacity-20"></i>
                                    <p className="text-lg">Tap "Start Demo Chat" to see how it works</p>
                                </div>
                            )}
                            {demoMessages.map((message, index) => (
                                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                    <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-gray-700' : 'bg-brand-green text-black'}`}>
                                            <i className={`fas ${message.type === 'user' ? 'fa-user' : 'fa-robot'} text-xs`}></i>
                                        </div>
                                        {/* Bubble */}
                                        <div className={`p-4 rounded-2xl ${message.type === 'user' ? 'bg-[#1e293b] text-white rounded-tr-none' : 'bg-[#B9FF66]/10 text-[#B9FF66] border border-[#B9FF66]/20 rounded-tl-none'}`}>
                                            <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={simulateVoiceChat} 
                                disabled={demoMessages.length > 0 && messageIndexRef.current < demoMessagesData.length} 
                                className="btn-primary h-14 px-8 rounded-xl font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {demoMessages.length > 0 && messageIndexRef.current < demoMessagesData.length ? (
                                    <><i className="fas fa-circle-notch fa-spin mr-3"></i> Simulating...</>
                                ) : (
                                    <><i className="fas fa-comment-alt mr-3"></i> Start Demo Chat</>
                                )}
                            </button>
                            <button 
                                onClick={resetDemo} 
                                className="btn-secondary h-14 px-8 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-[#0f172a] transition-all"
                            >
                                <i className="fas fa-redo-alt mr-3"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;