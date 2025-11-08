
import React, { useState, useEffect } from 'react';
import { Transcript } from '../types';

interface ConversationPanelProps {
    isSessionActive: boolean;
    isConnecting: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    startSession: () => void;
    stopSession: () => void;
    transcript: Transcript;
    sessionError: string | null;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
    isSessionActive,
    isConnecting,
    isListening,
    isSpeaking,
    startSession,
    stopSession,
    transcript,
    sessionError
}) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
    const [notes, setNotes] = useState(() => {
        try {
            return localStorage.getItem('voicecode_notes') || '';
        } catch {
            return '';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('voicecode_notes', notes);
        } catch (e) {
            console.error('Failed to save notes', e);
        }
    }, [notes]);

    const handleMicClick = () => {
        if (isSessionActive) {
            stopSession();
        } else {
            startSession();
        }
    };

    let micButtonState = 'idle';
    let micButtonText = 'Start Session';

    if (isConnecting) {
        micButtonState = 'connecting';
        micButtonText = 'Connecting...';
    } else if (sessionError) {
        micButtonState = 'error';
        micButtonText = 'Retry Session';
    } else if (isSessionActive) {
        if (isSpeaking) {
            micButtonState = 'speaking';
            micButtonText = "AI is speaking...";
        } else if (isListening) {
            micButtonState = 'listening';
            micButtonText = 'Listening...';
        } else {
            micButtonState = 'active';
            micButtonText = 'Session Active';
        }
    }

    const statusText = sessionError || micButtonText;

    return (
        <div className="bg-[#181818] rounded-lg flex flex-col h-full border border-[#262626] overflow-hidden">
            <header className="flex border-b border-[#262626] bg-[#0D0D0D]">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'chat' ? 'bg-[#181818] text-brand-green' : 'text-gray-400 hover:text-gray-200 hover:bg-[#181818]/50'}`}
                >
                    <i className="fas fa-comment-alt mr-2"></i> Conversational Tutor
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors border-l border-[#262626] ${activeTab === 'notes' ? 'bg-[#181818] text-brand-green' : 'text-gray-400 hover:text-gray-200 hover:bg-[#181818]/50'}`}
                >
                    <i className="fas fa-sticky-note mr-2"></i> My Notes
                </button>
            </header>

            {activeTab === 'chat' ? (
                <div className="flex-grow flex flex-col min-h-0">
                    {/* Transcription Area */}
                    <div className="flex-grow p-4 overflow-y-auto min-h-0">
                        <div className="text-gray-400 mb-4 h-1/2 overflow-y-auto p-2 rounded-md bg-[#0D0D0D]">
                            <p className="font-semibold text-gray-200 mb-2">You said:</p>
                            <p className="italic">{transcript.user || '...'}</p>
                        </div>
                        <div className="text-brand-green h-1/2 overflow-y-auto p-2 rounded-md bg-[#0D0D0D]">
                            <p className="font-semibold text-gray-200 mb-2">AI said:</p>
                            <p>{transcript.ai || '...'}</p>
                        </div>
                    </div>

                    {/* Controls Area */}
                    <div className="p-4 border-t border-[#262626] flex flex-col items-center justify-center bg-[#181818]">
                        <div className="mb-4">
                            <button 
                                onClick={handleMicClick} 
                                disabled={isConnecting}
                                className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-brand-green/50
                                    ${micButtonState === 'idle' && 'bg-gray-600 hover:bg-gray-500'}
                                    ${micButtonState === 'connecting' && 'bg-gray-500 cursor-not-allowed animate-pulse'}
                                    ${(micButtonState === 'active' || micButtonState === 'listening') && 'bg-brand-green shadow-lg shadow-brand-green/20'}
                                    ${micButtonState === 'speaking' && 'bg-blue-500 shadow-lg shadow-blue-500/20'}
                                    ${micButtonState === 'error' && 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'}
                                `}
                                aria-label={isSessionActive ? "Stop voice session" : "Start voice session"}
                            >
                                <i className={`fas ${isConnecting ? 'fa-spinner fa-spin' : 'fa-microphone'}`}></i>
                            </button>
                             <p className={`mt-3 text-center text-sm h-5 ${sessionError ? 'text-red-400' : 'text-gray-400'}`}>{statusText}</p>
                        </div>

                        <div className="w-full flex space-x-2">
                            <input
                                type="text"
                                placeholder="Or type your message here..."
                                className="flex-grow bg-[#262626] border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                                disabled={isSessionActive}
                            />
                            <button
                                disabled={isSessionActive}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow p-4 min-h-0 bg-[#181818]">
                    <textarea
                        className="w-full h-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-4 text-gray-300 resize-none focus:outline-none focus:border-brand-green transition-colors font-mono text-sm placeholder-gray-600"
                        placeholder="Type your notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        spellCheck={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ConversationPanel;
