import React, { useState } from 'react';
import { Transcript } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useUserNotes } from '../hooks/useUserNotes';

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
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
    const { notes, updateNotes, isLoading: isNotesLoading, isSaving } = useUserNotes();

    const handleMicClick = () => {
        if (isSessionActive) {
            stopSession();
        } else {
            startSession();
        }
    };

    let micButtonState = 'idle';
    if (isConnecting) micButtonState = 'connecting';
    else if (sessionError) micButtonState = 'error';
    else if (isSessionActive) {
        if (isSpeaking) micButtonState = 'speaking';
        else if (isListening) micButtonState = 'listening';
        else micButtonState = 'active';
    }

    const getStatusText = () => {
        if (sessionError) return sessionError;
        if (isConnecting) return 'Connecting...';
        if (isSpeaking) return 'AI Speaking...';
        if (isListening) return 'Listening...';
        if (isSessionActive) return 'Session Active';
        return 'Tap to Start';
    }

    return (
        <div className="bg-[#181818] rounded-xl flex flex-col h-full border border-[#262626] overflow-hidden shadow-sm">
            <header className="flex border-b border-[#262626] bg-[#131313] flex-shrink-0">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-2.5 text-xs md:text-sm font-semibold transition-colors ${activeTab === 'chat' ? 'text-brand-green bg-[#1A1A1A]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1A1A]/50'}`}
                >
                    <i className="fas fa-comment-alt mr-2"></i> Tutor
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-2.5 text-xs md:text-sm font-semibold transition-colors border-l border-[#262626] ${activeTab === 'notes' ? 'text-brand-green bg-[#1A1A1A]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1A1A]/50'}`}
                >
                    <i className="fas fa-sticky-note mr-2"></i> Notes
                    {isSaving && <span className="ml-2 opacity-50 animate-pulse"><i className="fas fa-sync fa-spin"></i></span>}
                </button>
            </header>

            {activeTab === 'chat' ? (
                <div className="flex-grow flex flex-col min-h-0">
                    {/* Transcription Area */}
                    <div className="flex-grow p-3 md:p-4 overflow-y-auto min-h-0 space-y-4 custom-scrollbar flex flex-col">
                        {transcript.user && (
                             <div className="self-end max-w-[85%]">
                                <p className="text-[10px] uppercase text-gray-500 mb-1 text-right font-bold tracking-wider">You</p>
                                <div className="bg-[#262626] text-gray-200 p-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm break-words">
                                    {transcript.user}
                                </div>
                            </div>
                        )}
                        {transcript.ai && (
                            <div className="self-start max-w-[85%]">
                                 <p className="text-[10px] uppercase text-brand-green mb-1 font-bold tracking-wider">AI Tutor</p>
                                 <div className="bg-[#B9FF66]/10 text-[#B9FF66] p-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm break-words border border-[#B9FF66]/20">
                                    {transcript.ai}
                                </div>
                            </div>
                        )}
                        {!transcript.user && !transcript.ai && !isSessionActive && (
                            <div className="flex-grow flex items-center justify-center text-gray-600 text-center p-6">
                                <div>
                                    <i className="fas fa-headset text-4xl mb-4 opacity-20"></i>
                                    <p className="text-sm">Start a session and just talk naturally.<br/>I'm ready to help you code.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls Area */}
                    <div className="p-3 md:p-4 border-t border-[#262626] bg-[#131313] flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleMicClick} 
                                disabled={isConnecting}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 flex-shrink-0 shadow-lg
                                    ${micButtonState === 'idle' && 'bg-[#262626] text-white hover:bg-[#333]'}
                                    ${micButtonState === 'connecting' && 'bg-[#262626] text-gray-500 cursor-not-allowed animate-pulse'}
                                    ${(micButtonState === 'active' || micButtonState === 'listening') && 'bg-brand-green text-black shadow-brand-green/20'}
                                    ${micButtonState === 'speaking' && 'bg-blue-500 text-white shadow-blue-500/20'}
                                    ${micButtonState === 'error' && 'bg-red-500/20 text-red-500 border border-red-500/50'}
                                `}
                            >
                                <i className={`fas ${isConnecting ? 'fa-spinner fa-spin' : micButtonState === 'speaking' ? 'fa-volume-up animate-pulse' : 'fa-microphone'}`}></i>
                            </button>
                            <div className="flex-grow min-w-0">
                                 <p className={`text-xs md:text-sm font-bold truncate mb-1 ${sessionError ? 'text-red-400' : isSessionActive ? 'text-brand-green' : 'text-gray-400'}`}>
                                     {getStatusText()}
                                 </p>
                                 <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                                     {isSessionActive && !sessionError && (
                                         <div className={`h-full rounded-full transition-all duration-500 ${isSpeaking ? 'w-full bg-blue-500' : isListening ? 'w-2/3 bg-brand-green animate-pulse' : 'w-full bg-brand-green'}`}></div>
                                     )}
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow p-0 min-h-0 relative">
                    {isNotesLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#181818]/80 z-10">
                            <i className="fas fa-spinner fa-spin text-brand-green text-2xl"></i>
                        </div>
                    )}
                    <textarea
                        className="w-full h-full bg-[#0D0D0D] border-0 p-4 text-gray-300 resize-none focus:ring-0 font-mono text-sm placeholder-gray-700 leading-relaxed"
                        placeholder={user ? "## My Notes\n- Jot down key concepts here..." : "Sign in to save your notes to the cloud."}
                        value={notes}
                        onChange={(e) => updateNotes(e.target.value)}
                        spellCheck={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ConversationPanel;