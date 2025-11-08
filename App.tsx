import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './components/CourseSelection';
import DashboardPage from './pages/DashboardPage';
import LearningView from './components/LearningView';
import { JAVASCRIPT_COURSE } from './constants';
import PricingPage from './pages/PricingPage';
import CoursesPage from './pages/CoursesPage';
import ExplanationsPage from './pages/ExplanationsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type View = 'landing' | 'pricing' | 'courses' | 'dashboard' | 'lesson' | 'explanations' | 'login' | 'signup';

const VIEW_STORAGE_KEY = 'voicecode_current_view';

const MainApp: React.FC = () => {
  // Initialize view from localStorage if available, otherwise default to 'landing'
  const [currentView, setCurrentView] = useState<View>(() => {
      const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
      // Basic validation to ensure the saved string is actually a valid View type
      const validViews: View[] = ['landing', 'pricing', 'courses', 'dashboard', 'lesson', 'explanations', 'login', 'signup'];
      return (savedView && validViews.includes(savedView as View)) ? (savedView as View) : 'landing';
  });

  const { user, loading } = useAuth();

  // Persist view changes to localStorage
  useEffect(() => {
      localStorage.setItem(VIEW_STORAGE_KEY, currentView);
  }, [currentView]);

  const navigateTo = useCallback((view: View) => {
    // Protected routes logic handled in the effect below, 
    // but we can also do a quick check here for immediate feedback
    const protectedViews: View[] = ['dashboard', 'lesson', 'explanations'];
    if (protectedViews.includes(view) && !user && !loading) {
       setCurrentView('login');
       window.scrollTo(0, 0);
       return;
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, [user, loading]);

  // Effect to handle initial load redirection and protected routes
  useEffect(() => {
      if (!loading) {
          const protectedViews: View[] = ['dashboard', 'lesson', 'explanations'];
          
          // If on a protected view but not logged in, redirect to login
          if (protectedViews.includes(currentView) && !user) {
              setCurrentView('login');
          }
          // If on auth pages but already logged in, redirect to dashboard
          if ((currentView === 'login' || currentView === 'signup') && user) {
              setCurrentView('dashboard');
          }
      }
  }, [currentView, user, loading]);

  const renderContent = () => {
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
                 <div className="flex flex-col items-center">
                    <i className="fas fa-circle-notch fa-spin text-brand-green text-4xl mb-4"></i>
                    <p className="text-gray-500 animate-pulse">Loading VoiceCode...</p>
                 </div>
            </div>
        );
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage navigateTo={navigateTo} />;
      case 'pricing':
        return <PricingPage navigateTo={navigateTo} />;
      case 'courses':
        return <CoursesPage navigateTo={navigateTo} />;
      case 'dashboard':
        return <DashboardPage navigateTo={navigateTo} />;
      case 'lesson':
        return <LearningView course={JAVASCRIPT_COURSE} navigateTo={navigateTo} />;
      case 'explanations':
        return <ExplanationsPage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'signup':
        return <SignupPage navigateTo={navigateTo} />;
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };
  
  // Views that don't need standard Nav/Footer
  if (currentView === 'lesson') {
      if (loading) return renderContent(); // Ensure loader shows even for lesson view
      return renderContent();
  }

  return (
    <>
      <Navbar navigateTo={navigateTo} currentView={currentView} />
      <main>{renderContent()}</main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
};

export default App;