import React, { useState, useEffect, useRef } from 'react';
import { View } from '../App';

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
    const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageIndexRef = useRef(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSession = () => {
        navigateTo('dashboard');
    };

    const simulateVoiceChat = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const addMessage = () => {
            if (messageIndexRef.current >= demoMessagesData.length) {
                return; 
            }
            
            const message = demoMessagesData[messageIndexRef.current];
            setDemoMessages(prev => [...prev, message]);
            
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

    useEffect(() => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId) {
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [demoMessages]);

    return (
    <>
    {/* Hero Section */}
    <section className="min-h-[90vh] flex items-center justify-center relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#B9FF66]/20 bg-[#B9FF66]/5 text-[#B9FF66] text-sm font-medium mb-8 animate-fade-in">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9FF66] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B9FF66]"></span>
                </span>
                Introducing AI Voice Tutoring
            </div>

             <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                Master Coding Through
                <br />
                <span className="text-brand-green relative">
                    Natural Conversation
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#B9FF66]/30" viewBox="0 0 300 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 9C50 1.5 150 1.5 300 9C300 9 250 12 150 12C50 12 0.5 9 0.5 9Z" />
                    </svg>
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Stop staring at documentation. Just talk to your AI mentor while you code. 
                Get instant verbal explanations, live debugging help, and pair-programming guidance 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={startSession} className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center shadow-lg shadow-brand-green/20">
                    <i className="fas fa-microphone mr-3"></i>
                    Start Learning Now
                </button>
                <button className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center">
                    <i className="fas fa-play-circle mr-3 text-brand-green"></i>
                    See it in Action
                </button>
            </div>
        </div>
    </section>

    {/* Features Grid */}
    <section id="features" className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Why Learn with <span className="text-brand-green">Voice?</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Traditional tutorials are passive. VoiceCode makes learning active, engaging, and twice as fast.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                    { icon: 'comments', title: 'Natural Dialogue', desc: '"Why isn\'t this working?" Just ask. No complex prompts needed—talk naturally like you would to a human mentor.' },
                    { icon: 'desktop', title: 'Context Aware', desc: 'AI sees your editor in real-time. It knows exactly which line you\'re struggling with without you having to copy-paste.' },
                    { icon: 'bug', title: 'Voice Debugging', desc: 'Walk through errors step-by-step verbally. It\'s like having a senior developer looking over your shoulder.' },
                    { icon: 'brain', title: 'Adaptive Learning', desc: '"Explain it simpler." The AI adjusts its vocabulary and analogies instantly based on your understanding.' },
                    { icon: 'code', title: 'Live Code Injection', desc: 'Watch as the AI types examples directly into your editor while explaining them to you verbally.' },
                    { icon: 'rocket', title: 'Instant Feedback', desc: 'Get immediate verbal corrections on your syntax and logic before you even run the code.' }
                ].map((feature, i) => (
                    <div key={i} className="dark-card rounded-2xl p-8 hover:bg-[#1A1A1A] transition-colors group">
                        <div className="w-14 h-14 bg-[#B9FF66]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <i className={`fas fa-${feature.icon} text-brand-green text-2xl`}></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>

    {/* How It Works */}
    <section id="how" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold">
                    From Confusion to <span className="text-brand-green">Clarity</span>
                </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="space-y-12">
                    {[
                        { step: 1, title: 'Open the Workspace', desc: 'Enter our integrated browser-based IDE. No setup required—just start coding immediately.' },
                        { step: 2, title: 'Activate Voice Mode', desc: 'Click the mic. The AI instantly connects and greets you, ready to help with your specific lesson.' },
                        { step: 3, title: 'Talk While You Type', desc: 'Stuck? Just ask "How do I do a loop here?" The AI guides you verbally while you type the solution.' },
                        { step: 4, title: 'Master the Concept', desc: 'Get tested with quick verbal questions to ensure you truly understand before moving on.' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#1A1A1A] border border-[#B9FF66]/30 rounded-full flex items-center justify-center text-brand-green font-bold text-xl mr-6 shadow-[0_0_15px_rgba(185,255,102,0.1)]">
                                {item.step}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="dark-card rounded-2xl p-1 border-[#333] bg-[#0A0A0A] shadow-2xl overflow-hidden">
                    <div className="bg-[#111] px-4 py-2 flex items-center border-b border-[#262626]">
                        <div className="flex space-x-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="text-xs text-gray-500 flex-grow text-center font-mono">bubble_sort.js — VoiceCode</div>
                    </div>
                    <div className="p-6 relative">
                        <pre className="text-sm md:text-base text-gray-300 font-mono leading-relaxed overflow-x-auto">
<code>
<span className="text-purple-400">function</span> <span className="text-blue-400">bubbleSort</span>(arr) {'{\n'}
{'    '}<span className="text-gray-500 italic">{'// AI: "Start with the outer loop to make passes..."'}</span>{'\n'}
{'    '}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; arr.length; i++) {'{\n'}
{'        '}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> j = 0; j &lt; arr.length - i - 1; j++) {'{\n'}
{'            '}<span className="text-gray-500 italic">{'// AI: "Perfect! Now compare adjacent items."'}</span>{'\n'}
{'            '}<span className="text-purple-400">if</span> (arr[j] &gt; arr[j + 1]) {'{\n'}
{'                '}<span className="text-gray-500 italic">{'// User: "Wait, how do I swap them again?"'}</span>{'\n'}
{'                '}<span className="border-b-2 border-brand-green animate-pulse">[Cursor]</span>{'\n'}
{'            '}{'}\n        }\n    }\n}'}
</code>
</pre>
                        <div className="absolute bottom-6 right-6 bg-[#1A1A1A]/90 backdrop-blur-md p-4 rounded-xl border border-brand-green/30 shadow-2xl max-w-xs animate-fade-in">
                            <div className="flex items-center mb-2 text-brand-green">
                                <i className="fas fa-wave-square mr-2"></i>
                                <span className="text-xs font-bold uppercase tracking-wider">AI Mentor Speaking</span>
                            </div>
                            <p className="text-sm text-white">"To swap them, you'll need a temporary variable to hold one value while you overwrite it. Try creating a 'temp' variable first."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Interactive Demo */}
    <section id="demo" className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Experience the <span className="text-brand-green">Conversation</span>
                </h2>
                <p className="text-gray-400">Try a simulated session to feel the difference.</p>
            </div>
            
            <div className="dark-card rounded-3xl p-4 md:p-8 md:pb-10 border-[#262626] bg-[#111]">
                <div ref={chatContainerRef} className="space-y-6 mb-8 max-h-[500px] overflow-y-auto p-4 md:p-6 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] custom-scrollbar">
                    {demoMessages.length === 0 && (
                        <div className="h-64 flex items-center justify-center text-gray-600">
                            <p>Tap "Start Demo Chat" to begin simulation...</p>
                        </div>
                    )}
                    {demoMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`flex items-start gap-4 max-w-[90%] md:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${message.type === 'user' ? 'bg-gray-700' : 'bg-[#B9FF66] text-black'}`}>
                                    <i className={`fas ${message.type === 'user' ? 'fa-user' : 'fa-robot'} text-sm`}></i>
                                </div>
                                <div className={`rounded-2xl p-4 shadow-sm ${message.type === 'user' ? 'bg-[#262626] text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'}`}>
                                    <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={simulateVoiceChat} disabled={demoMessages.length > 0 && messageIndexRef.current < demoMessagesData.length} className="btn-primary px-8 py-4 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-bold">
                        <i className="fas fa-microphone mr-3"></i>
                        {demoMessages.length > 0 ? 'Simulating...' : 'Start Demo Chat'}
                    </button>
                    <button onClick={resetDemo} className="btn-secondary px-8 py-4 rounded-xl flex items-center justify-center font-semibold">
                        <i className="fas fa-redo mr-3"></i>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </section>
    </>
    );
};

export default LandingPage;