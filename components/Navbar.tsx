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
    <>
      <nav className="fixed top-0 w-full bg-[#0D0D0D]/90 backdrop-blur-xl z-50 px-4 md:px-8 py-3 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('landing')}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#B9FF66]/10 flex items-center justify-center group-hover:bg-[#B9FF66]/20 transition-colors">
              <i className="fas fa-headset text-brand-green text-lg md:text-xl"></i>
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tight">VoiceCode.ai</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-gray-300 hover:text-brand-green transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1 items-center font-medium">
            <button onClick={() => handleNavigation('courses')} className="px-4 py-2 hover:text-brand-green transition-colors rounded-lg hover:bg-white/5">Courses</button>
            <button onClick={() => handleNavigation('pricing')} className="px-4 py-2 hover:text-brand-green transition-colors rounded-lg hover:bg-white/5">Pricing</button>
            
            {!isAuthPage && (
                user ? (
                   <div className="flex items-center ml-4 pl-4 border-l border-[#262626] space-x-4">
                       <button onClick={() => handleNavigation('dashboard')} className="px-4 py-2 hover:text-brand-green transition-colors rounded-lg hover:bg-white/5">
                          Dashboard
                       </button>
                       <div className="flex items-center gap-3 px-4 py-1.5 bg-[#1A1A1A] rounded-full border border-[#262626]">
                           <span className="text-sm font-semibold text-gray-200 truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                           <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Sign Out">
                               <i className="fas fa-sign-out-alt"></i>
                           </button>
                       </div>
                   </div>
                ) : (
                  <div className="flex items-center space-x-3 ml-6">
                      <button onClick={() => handleNavigation('login')} className="btn-secondary px-5 py-2 rounded-lg text-sm">
                          Sign In
                      </button>
                      <button onClick={() => handleNavigation('signup')} className="btn-primary px-5 py-2 rounded-lg text-sm shadow-lg shadow-brand-green/10">
                          Get Started
                      </button>
                  </div>
                )
            )}
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#0D0D0D] border-b border-[#262626] shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-4">
            <button onClick={() => handleNavigation('courses')} className="block w-full text-left py-3 px-4 text-lg font-medium hover:bg-[#1A1A1A] rounded-xl transition-colors">Courses</button>
            <button onClick={() => handleNavigation('pricing')} className="block w-full text-left py-3 px-4 text-lg font-medium hover:bg-[#1A1A1A] rounded-xl transition-colors">Pricing</button>
            
            {user ? (
                <div className="pt-4 border-t border-[#262626] space-y-4">
                    <button onClick={() => handleNavigation('dashboard')} className="block w-full text-left py-3 px-4 text-lg font-medium hover:bg-[#1A1A1A] rounded-xl transition-colors text-brand-green">
                        <i className="fas fa-columns mr-3"></i> Dashboard
                    </button>
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] rounded-xl">
                        <span className="font-semibold text-gray-300">{user.name}</span>
                        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 px-3 py-1">Sign Out</button>
                    </div>
                </div>
            ) : (
                !isAuthPage && (
                    <div className="pt-4 border-t border-[#262626] grid grid-cols-2 gap-3">
                         <button onClick={() => handleNavigation('login')} className="btn-secondary py-3 rounded-xl font-semibold">
                            Sign In
                        </button>
                        <button onClick={() => handleNavigation('signup')} className="btn-primary py-3 rounded-xl font-semibold">
                            Get Started
                        </button>
                    </div>
                )
            )}
          </div>
        </div>
      </nav>
      
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
          <div 
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
          />
      )}
    </>
  );
};

export default Navbar;