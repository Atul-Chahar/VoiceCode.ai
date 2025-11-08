
import React, { useState } from 'react';
import { View } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  navigateTo: (view: View) => void;
  currentView?: View;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleNavigation = (view: View) => {
    navigateTo(view);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
      await logout();
      handleNavigation('landing');
  };

  // Hide auth buttons on login/signup pages for cleaner UI
  const isAuthPage = currentView === 'login' || currentView === 'signup';

  return (
    <nav className="fixed top-0 w-full bg-[#0D0D0D]/80 backdrop-blur-md z-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => handleNavigation('landing')}
        >
          <div className="w-10 h-10 rounded-full bg-[#B9FF66]/10 flex items-center justify-center">
            <i className="fas fa-headset text-brand-green"></i>
          </div>
          <span className="text-lg md:text-xl font-bold">VoiceCode AI</span>
        </div>
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          <i className="fas fa-bars text-xl"></i>
        </button>
        
        <div className="hidden md:flex space-x-8 items-center">
          <a onClick={() => handleNavigation('courses')} className="cursor-pointer hover:text-brand-green transition">Courses</a>
          <a onClick={() => handleNavigation('pricing')} className="cursor-pointer hover:text-brand-green transition">Pricing</a>
          
          {!isAuthPage && (
              user ? (
                 <div className="flex items-center space-x-6">
                     <button onClick={() => handleNavigation('dashboard')} className="hover:text-brand-green transition">
                        Dashboard
                     </button>
                     <div className="flex items-center gap-3 pl-6 border-l border-[#262626]">
                         <div className="text-sm text-right">
                             <p className="font-semibold text-white">{user.name}</p>
                         </div>
                         <button onClick={handleLogout} className="text-gray-400 hover:text-white transition" title="Sign Out">
                             <i className="fas fa-sign-out-alt"></i>
                         </button>
                     </div>
                 </div>
              ) : (
                <div className="flex items-center space-x-4 ml-4">
                    <button onClick={() => handleNavigation('login')} className="btn-secondary px-6 py-2 rounded-md">
                        Sign In
                    </button>
                    <button onClick={() => handleNavigation('signup')} className="btn-primary px-6 py-2 rounded-md">
                        Get Started
                    </button>
                </div>
              )
          )}
        </div>
      </div>
      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} mobile-menu absolute top-full left-0 w-full py-4 px-4 md:hidden`}>
        <a onClick={() => handleNavigation('courses')} className="block py-3 border-b border-[#262626] cursor-pointer hover:text-brand-green">Courses</a>
        <a onClick={() => handleNavigation('pricing')} className="block py-3 border-b border-[#262626] cursor-pointer hover:text-brand-green">Pricing</a>
        
        {user ? (
            <>
                <a onClick={() => handleNavigation('dashboard')} className="block py-3 border-b border-[#262626] cursor-pointer hover:text-brand-green">Dashboard</a>
                <div className="py-4 flex items-center justify-between">
                    <span className="font-semibold">{user.name}</span>
                    <button onClick={handleLogout} className="text-gray-400">Sign Out</button>
                </div>
            </>
        ) : (
            <div className="pt-4 flex flex-col gap-3">
                 <button onClick={() => handleNavigation('login')} className="w-full btn-secondary px-6 py-3 rounded-md">
                    Sign In
                </button>
                <button onClick={() => handleNavigation('signup')} className="w-full btn-primary px-6 py-3 rounded-md">
                    Get Started
                </button>
            </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
