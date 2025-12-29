import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { Notification } from '../types';
import { Bell, Check, Info, Trophy, Zap, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotificationDropdown: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user) loadNotifications();
    }, [user, isOpen]); // Reload on open to be fresh

    const loadNotifications = async () => {
        if (!user) return;
        const data = await dbService.getNotifications(user.id);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
    };

    const handleMarkRead = async (id: string) => {
        await dbService.markNotificationRead(id);
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'quest': return <Zap className="text-yellow-500" size={16} />;
            case 'achievement': return <Trophy className="text-orange-500" size={16} />;
            case 'social': return <MessageSquare className="text-blue-500" size={16} />;
            case 'system': default: return <Info className="text-zinc-500" size={16} />;
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[#0D0D0D]"></span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            <button className="text-xs text-orange-500 hover:text-orange-400 font-medium">Mark all read</button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors flex gap-3 ${n.isRead ? 'opacity-60' : 'bg-orange-500/5'}`}
                                        onClick={() => !n.isRead && handleMarkRead(n.id)}
                                    >
                                        <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                                        <div>
                                            <h4 className={`text-sm font-medium ${n.isRead ? 'text-zinc-400' : 'text-white'}`}>{n.title}</h4>
                                            <p className="text-xs text-zinc-500 mt-1 leading-snug">{n.message}</p>
                                            <span className="text-[10px] text-zinc-600 mt-2 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {!n.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;
