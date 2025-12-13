import React, { useState } from 'react';

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, courseName }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    // ⚠️ REPLACE THIS WITH YOUR ACTUAL MAKE.COM WEBHOOK URL
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/YOUR_WEBHOOK_URL_HERE';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: name,
                    email: email,
                    courseName: courseName,
                    completionDate: new Date().toLocaleDateString()
                })
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setName('');
                setEmail('');
            }, 3000);
        } catch (error) {
            console.error('Certificate error:', error);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                        <i className="fas fa-certificate text-3xl text-white"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-manrope">Get Your Certificate</h2>
                    <p className="text-zinc-400 text-sm mt-2">
                        Congratulations on your progress! Enter your details to receive your official {courseName} certificate.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <i className="fas fa-check-circle text-5xl text-green-500 mb-4 animate-bounce"></i>
                        <h3 className="text-xl font-bold text-white">Sent!</h3>
                        <p className="text-zinc-400 text-sm">Check your inbox for your certificate.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="e.g. Alex Chen"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="e.g. alex@example.com"
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-xs text-center">Something went wrong. Please check your Webhook URL.</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'sending' ? (
                                <><i className="fas fa-spinner fa-spin mr-2"></i> Sending...</>
                            ) : (
                                'Send Certificate Now'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CertificateModal;
