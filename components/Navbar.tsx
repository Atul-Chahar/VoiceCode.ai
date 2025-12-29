import React, { useState, useEffect } from 'react';
import { View } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import NotificationDropdown from './NotificationDropdown';
import ShopModal from './ShopModal';
import { Coins, LogOut, User as UserIcon, LayoutDashboard, Map, Trophy, Target } from 'lucide-react';

interface NavbarProps {
    navigateTo: (view: View) => void;
    currentView: View;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentView }) => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [gems, setGems] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) loadUserStats();
    }, [user, isShopOpen]); // Reload when shop closes to update balance

    const loadUserStats = async () => {
        if (!user) return;
        const stats = await dbService.getUserStats(user.id);
        if (stats) setGems(stats.xp); // Using XP as Gems for now per backend logic
    };

    const handleNavigation = (view: View) => {
        navigateTo(view);
    };

    const activeLinkClass = "text-white bg-white/10 px-3 py-1.5 rounded-full";
    const inactiveLinkClass = "text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all";

    return (
        <>
            <div className="fixed flex w-full z-50 pt-6 pr-4 pl-4 top-0 left-0 justify-center">
                <nav
                    className="shadow-black/50 flex md:gap-8 md:w-auto bg-[#0D0D0D]/80 w-full max-w-6xl rounded-full p-2 pl-6 shadow-2xl backdrop-blur-xl items-center justify-between border border-white/10"
                >
                    <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => handleNavigation('landing')}>
                        <span className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 box-shadow-[0_0_10px_orange]"></div>
                            VoiceCode
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <button onClick={() => handleNavigation('landing')} className={`text-xs font-bold transition-all ${currentView === 'landing' ? activeLinkClass : inactiveLinkClass}`}>Product</button>
                        <button onClick={() => handleNavigation('courses')} className={`text-xs font-bold transition-all ${currentView === 'courses' ? activeLinkClass : inactiveLinkClass}`}>Courses</button>

                        {user && (
                            <>
                                <button onClick={() => handleNavigation('dashboard')} className={`text-xs font-bold transition-all flex items-center gap-1.5 ${currentView === 'dashboard' ? activeLinkClass : inactiveLinkClass}`}>
                                    <LayoutDashboard size={14} /> Dashboard
                                </button>
                                <button onClick={() => handleNavigation('training')} className={`text-xs font-bold transition-all flex items-center gap-1.5 ${currentView === 'training' ? activeLinkClass : inactiveLinkClass}`}>
                                    <Target size={14} /> Training
                                </button>
                                <button onClick={() => handleNavigation('leaderboard')} className={`text-xs font-bold transition-all flex items-center gap-1.5 ${currentView === 'leaderboard' ? activeLinkClass : inactiveLinkClass}`}>
                                    <Trophy size={14} /> Leaderboard
                                </button>
                            </>
                        )}

                        <button onClick={() => handleNavigation('pricing')} className={`text-xs font-bold transition-all ${currentView === 'pricing' ? activeLinkClass : inactiveLinkClass}`}>Pricing</button>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        {!user ? (
                            <>
                                <button onClick={() => handleNavigation('login')} className="hidden md:block text-xs font-bold text-zinc-300 hover:text-white transition-colors">Sign in</button>
                                <button onClick={() => handleNavigation('signup')} className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-full text-xs font-bold transition-colors">
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                                {/* Gems / Shop Trigger */}
                                <button
                                    onClick={() => setIsShopOpen(true)}
                                    className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-500/20 transition-all group"
                                >
                                    <Coins size={14} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-white">{gems.toLocaleString()}</span>
                                </button>

                                {/* Notifications */}
                                <NotificationDropdown />

                                {/* Profile & Logout */}
                                <div className="flex items-center gap-2 group relative">
                                    <button onClick={() => handleNavigation('profile')} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-orange-500 transition-all border border-white/5">
                                        <UserIcon size={16} />
                                    </button>

                                    {/* Mini Logout Dropdown on hover could go here, for now just a separate button if spacing allows, or keep it simple */}
                                    <button onClick={logout} className="text-zinc-500 hover:text-red-400" title="Logout">
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Global Shop Modal */}
            <ShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                currentGems={gems}
                onTransactionComplete={loadUserStats}
            />
        </>
    );
};

export default Navbar;