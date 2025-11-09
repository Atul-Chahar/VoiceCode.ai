import React, { useState, useEffect } from 'react';
import { View } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    navigateTo: (view: View) => void;
    currentView: View;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentView }) => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (view: View) => {
        navigateTo(view);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigateTo('landing');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0D0D0D]/90 backdrop-blur-md py-4 border-b border-[#262626]' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <button onClick={() => handleNavigation('landing')} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#B9FF66]/10 flex items-center justify-center group-hover:bg-[#B9FF66] transition-all duration-300">
                        <i className="fas fa-code text-brand-green group-hover:text-black transition-colors"></i>
                    </div>
                    <span className="text-2xl font-bold text-white">Voice<span className="text-brand-green">Code</span></span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {!user ? (
                        <>
                            <button onClick={() => handleNavigation('landing')} className={`text-sm font-medium transition-colors hover:text-brand-green ${currentView === 'landing' ? 'text-brand-green' : 'text-gray-300'}`}>Home</button>
                            <button onClick={() => handleNavigation('courses')} className={`text-sm font-medium transition-colors hover:text-brand-green ${currentView === 'courses' ? 'text-brand-green' : 'text-gray-300'}`}>Courses</button>
                            <button onClick={() => handleNavigation('pricing')} className={`text-sm font-medium transition-colors hover:text-brand-green ${currentView === 'pricing' ? 'text-brand-green' : 'text-gray-300'}`}>Pricing</button>
                            <button onClick={() => handleNavigation('login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</button>
                            <button onClick={() => handleNavigation('signup')} className="btn-primary px-6 py-2.5 rounded-lg font-bold text-sm">Get Started</button>
                        </>
                    ) : (
                        <>
                             <button onClick={() => handleNavigation('dashboard')} className={`text-sm font-medium transition-colors hover:text-brand-green ${currentView === 'dashboard' ? 'text-brand-green' : 'text-gray-300'}`}>Dashboard</button>
                             <button onClick={() => handleNavigation('courses')} className={`text-sm font-medium transition-colors hover:text-brand-green ${currentView === 'courses' ? 'text-brand-green' : 'text-gray-300'}`}>Courses</button>
                             <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#262626]">
                                <span className="text-sm text-gray-400">Hi, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </button>
                             </div>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#0D0D0D] border-b border-[#262626] py-4 px-4 flex flex-col space-y-4 animate-fade-in shadow-2xl">
                    {!user ? (
                        <>
                            <button onClick={() => handleNavigation('landing')} className={`text-left py-2 font-medium ${currentView === 'landing' ? 'text-brand-green' : 'text-gray-300'}`}>Home</button>
                            <button onClick={() => handleNavigation('courses')} className={`text-left py-2 font-medium ${currentView === 'courses' ? 'text-brand-green' : 'text-gray-300'}`}>Courses</button>
                            <button onClick={() => handleNavigation('pricing')} className={`text-left py-2 font-medium ${currentView === 'pricing' ? 'text-brand-green' : 'text-gray-300'}`}>Pricing</button>
                            <div className="h-px bg-[#262626] my-2"></div>
                            <button onClick={() => handleNavigation('login')} className="text-left py-2 font-medium text-gray-300">Sign In</button>
                            <button onClick={() => handleNavigation('signup')} className="btn-primary py-3 rounded-lg font-bold text-center">Get Started</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleNavigation('dashboard')} className={`text-left py-2 font-medium ${currentView === 'dashboard' ? 'text-brand-green' : 'text-gray-300'}`}>Dashboard</button>
                            <button onClick={() => handleNavigation('courses')} className={`text-left py-2 font-medium ${currentView === 'courses' ? 'text-brand-green' : 'text-gray-300'}`}>Courses</button>
                            <div className="h-px bg-[#262626] my-2"></div>
                            <div className="flex items-center justify-between py-2 text-gray-400">
                                <span>Signed in as <span className="text-white font-bold">{user.name}</span></span>
                            </div>
                            <button onClick={handleLogout} className="text-left py-2 font-medium text-red-400 hover:text-red-300 flex items-center gap-2">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;