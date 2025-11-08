import React, { useState, useCallback } from 'react';
import LandingPage from './components/CourseSelection';
import DashboardPage from './pages/DashboardPage';
import LearningView from './components/LearningView';
import { JAVASCRIPT_COURSE } from './constants';
import PricingPage from './pages/PricingPage';
import CoursesPage from './pages/CoursesPage';
import ExplanationsPage from './pages/ExplanationsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export type View = 'landing' | 'pricing' | 'courses' | 'dashboard' | 'lesson' | 'explanations';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

  const navigateTo = useCallback((view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, []);

  const renderContent = () => {
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
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };
  
  // The lesson view is full-screen and doesn't need the standard Navbar/Footer
  if (currentView === 'lesson') {
    return renderContent();
  }

  return (
    <>
      <Navbar navigateTo={navigateTo} />
      <main>{renderContent()}</main>
      <Footer />
    </>
  );
};

export default App;