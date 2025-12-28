
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'bug' | 'feature' | 'general'>('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        if (!user) {
            setError("You must be logged in to submit feedback.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await dbService.submitFeedback(user.id, message, type);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setMessage('');
                onClose();
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary mb-4">
                    Send Feedback
                </h2>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-check text-green-400 text-2xl"></i>
                        </div>
                        <p className="text-white font-medium">Feedback Sent!</p>
                        <p className="text-gray-400 text-sm mt-2">Thank you for helping us improve.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <div className="flex gap-2">
                                {(['general', 'bug', 'feature'] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${type === t
                                            ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe the bug found or feature requested..."
                                className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary min-h-[120px] resize-none"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                                <i className="fas fa-exclamation-circle text-red-400 shrink-0"></i>
                                <span className="text-red-400 text-sm">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-xl font-medium bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''
                                }`}
                        >
                            {isSubmitting ? (
                                <i className="fas fa-circle-notch fa-spin"></i>
                            ) : (
                                <i className="fas fa-paper-plane"></i>
                            )}
                            {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
