
import React, { useState, useEffect, useRef } from 'react';
import { View } from '../App';
import Hero3D from './Hero3D';

interface DemoMessage {
    type: 'user' | 'ai';
    text: string;
}

// Fix: Add explicit type to demoMessagesData to avoid type inference issues.
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
        // Smooth scrolling for anchor links on this page
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
  <div className="bg-[rgb(0,0,0)]">


    {/* Hero Section with Spline Animation */}
    <Hero3D />

    {/* Features Grid */}
    <section id="features" className="py-20 px-4 relative z-10 bg-[rgb(0,0,0)]">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                Coding Education <span className="text-brand-green">Reimagined</span>
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Natural conversation meets intelligent code analysis for the ultimate learning experience
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="dark-card rounded-xl p-6">
                    <div className="w-14 h-14 bg-[#262626] rounded-xl flex items-center justify-center mb-4">
                        <i className="fas fa-comments text-brand-green text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Natural Dialogue</h3>
                    <p className="text-gray-400">
                        "Why isn't this working?" Get instant, conversational help. No typing - just talk naturally about your code.
                    </p>
                </div>
                
                <div className="dark-card rounded-xl p-6">
                    <div className="w-14 h-14 bg-[#262626] rounded-xl flex items-center justify-center mb-4">
                        <i className="fas fa-desktop text-brand-green text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Context Aware</h3>
                    <p className="text-gray-400">
                        AI sees your screen and understands your entire project context for relevant, specific guidance.
                    </p>
                </div>
                
                <div className="dark-card rounded-xl p-6">
                    <div className="w-14 h-14 bg-[#262626] rounded-xl flex items-center justify-center mb-4">
                        <i className="fas fa-bug text-brand-green text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Voice Debugging</h3>
                    <p className="text-gray-400">
                        "Walk me through this error" - Debug through conversation with step-by-step verbal guidance.
                    </p>
                </div>
                
                <div className="dark-card rounded-xl p-6">
                    <div className="w-14 h-14 bg-[#262626] rounded-xl flex items-center justify-center mb-4">
                        <i className="fas fa-brain text-brand-green text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Adaptive Learning</h3>
                    <p className="text-gray-400">
                        "Explain it simpler" - AI adapts explanations to your level, from beginner to advanced.
                    </p>
                </div>
                
                <div className="dark-card rounded-xl p-6">
                    <div className="w-14 h-14 bg-[#262626] rounded-xl flex items-center justify-center mb-4">
                        <i className="fas fa-code text-brand-green text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Live Reviews</h3>
                    <p className="text-gray-400">
                        Get real-time verbal feedback on code quality, patterns, and best practices as you type.
                    </p>
                </div>
                
                <div className="dark-card rounded-xl p-6">
                    <div className="w-14 h-14 bg-[#262626] rounded-xl flex items-center justify-center mb-4">
                        <i className="fas fa-rocket text-brand-green text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
                    <p className="text-gray-400">
                        "Try running it now" - Immediate verbal feedback helps you learn from mistakes faster.
                    </p>
                </div>
            </div>
        </div>
    </section>

    {/* How It Works */}
    <section id="how" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
                How <span className="text-brand-green">VoiceCode</span> Works
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#B9FF66]/10 rounded-full flex items-center justify-center text-brand-green font-bold text-lg">
                            1
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Connect Your Workspace</h3>
                            <p className="text-gray-400">Share your Replit screen - AI instantly sees your code and project structure.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#B9FF66]/10 rounded-full flex items-center justify-center text-brand-green font-bold text-lg">
                            2
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Just Start Talking</h3>
                            <p className="text-gray-400">Describe your problem naturally - "This function should sort but it's not working."</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#B9FF66]/10 rounded-full flex items-center justify-center text-brand-green font-bold text-lg">
                            3
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Get Conversational Help</h3>
                            <p className="text-gray-400">AI responds verbally with explanations, debugging steps, and encouragement.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#B9FF66]/10 rounded-full flex items-center justify-center text-brand-green font-bold text-lg">
                            4
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Learn & Improve</h3>
                            <p className="text-gray-400">Build skills through natural dialogue and immediate, personalized feedback.</p>
                        </div>
                    </div>
                </div>
                
                <div className="dark-card rounded-xl p-4">
                    <div className="flex items-center mb-4">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="ml-4 text-sm text-gray-400">main.js</span>
                    </div>
                    <pre className="text-sm text-gray-300 font-mono p-4 bg-[#0D0D0D] rounded-md">
<code>
<span className="text-purple-400">function</span> <span className="text-cyan-300">bubbleSort</span>(arr) {'{\n'}
{'    '}<span className="text-gray-500">{'// Having trouble here...'}</span>{'\n'}
{'    '}<span className="text-purple-400">for</span> (let i = 0; i &lt; arr.length; i++) {'{\n'}
{'        '}<span className="text-gray-500">{'// Not sure what\'s next'}</span>{'\n'}
{'    '}{'}\n}'}
</code>
</pre>
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center mb-2">
                             <div className="w-6 h-6 rounded-full bg-[#B9FF66]/10 flex items-center justify-center flex-shrink-0 mr-2">
                                <i className="fas fa-robot text-brand-green text-sm"></i>
                            </div>
                            <span className="text-brand-green text-xs font-semibold">AI Speaking...</span>
                        </div>
                        <p className="text-sm text-gray-300">"I see you're implementing bubble sort! You've got the outer loop started. Now you need an inner loop to compare adjacent elements. Want me to walk you through the comparison logic?"</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Interactive Demo */}
    <section id="demo" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
                Try a <span className="text-brand-green">Live Conversation</span>
            </h2>
            
            <div className="dark-card rounded-xl p-6 md:p-8">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-3">Interactive Demo Session</h3>
                    <p className="text-gray-400">Experience how natural coding conversations feel</p>
                </div>
                
                <div ref={chatContainerRef} className="space-y-4 mb-8 max-h-96 overflow-y-auto p-4 bg-[#0D0D0D] rounded-lg">
                    {demoMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`flex items-start gap-3 max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-gray-700' : 'bg-[#B9FF66]/10'}`}>
                                    <i className={`fas ${message.type === 'user' ? 'fa-user' : 'fa-robot'} ${message.type === 'user' ? 'text-white' : 'text-brand-green'} text-sm`}></i>
                                </div>
                                <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-[#B9FF66] text-black' : 'bg-[#262626]'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={simulateVoiceChat} className="btn-primary px-6 py-3 rounded-lg">
                        <i className="fas fa-microphone mr-2"></i>
                        Start Demo Chat
                    </button>
                    <button onClick={resetDemo} className="btn-secondary px-6 py-3 rounded-lg">
                        <i className="fas fa-redo mr-2"></i>
                        Reset Demo
                    </button>
                </div>
            </div>
        </div>
    </section>
    </div>
    );
};

export default LandingPage;
