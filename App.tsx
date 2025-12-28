
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

import { Analytics } from '@vercel/analytics/react';
import { analytics } from './services/analytics';

export type View = 'landing' | 'pricing' | 'courses' | 'dashboard' | 'lesson' | 'explanations' | 'login' | 'signup';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const { user, loading } = useAuth();

  const navigateTo = useCallback((view: View) => {
    // Protected routes
    const protectedViews: View[] = ['dashboard', 'lesson', 'explanations'];
    if (protectedViews.includes(view) && !user && !loading) {
      setCurrentView('login');
      window.scrollTo(0, 0);
      return;
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, [user, loading]);

  // Effect to handle initial load, auth redirects, and Analytics
  useEffect(() => {
    // Track Page View whenever currentView changes
    analytics.pageView();
  }, [currentView]);

  useEffect(() => {
    if (!loading) {
      const protectedViews: View[] = ['dashboard', 'lesson', 'explanations'];
      if (protectedViews.includes(currentView) && !user) {
        setCurrentView('login');
      }
      // Redirect from auth pages if already logged in
      if ((currentView === 'login' || currentView === 'signup') && user) {
        setCurrentView('dashboard');
      }

      // Identify user in analytics if logged in
      if (user) {
        analytics.identify(user.id, { email: user.email, name: user.name });
      }
    }
  }, [currentView, user, loading]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <i className="fas fa-circle-notch fa-spin text-brand-green text-4xl"></i>
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

import FeedbackModal from './components/FeedbackModal';

const App: React.FC = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    // Initialize Analytics once on mount
    analytics.init();
  }, []);

  return (
    <AuthProvider>
      <MainApp />
      <Analytics />

      {/* Feedback Trigger Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 z-[9000] w-12 h-12 bg-[#1E1E1E] border border-white/10 rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-primary hover:scale-110 transition-all group"
        title="Send Feedback"
      >
        <i className="fas fa-comment-alt group-hover:text-brand-primary transition-colors"></i>
      </button>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </AuthProvider>
  );
};

export default App;
