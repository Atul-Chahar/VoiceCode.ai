import React, { useState } from 'react';
import { View } from '../App';
import { JAVASCRIPT_COURSE } from '../constants';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useAuth } from '../contexts/AuthContext';
import LinearPath from '../components/LinearPath';
import { DailyGoalsWidget } from '../components/DashboardWidgets';
import CertificateModal from '../components/CertificateModal';
import { Play, Sparkles, Flame } from 'lucide-react';

interface DashboardPageProps {
  navigateTo: (view: View) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigateTo }) => {
  const { user } = useAuth();
  const { progress } = useCourseProgress(JAVASCRIPT_COURSE.id);
  const [showCertificate, setShowCertificate] = useState(false);

  // Calculate Progress
  const totalLessons = JAVASCRIPT_COURSE.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessonsCount = progress.completedLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  // Mock Goals
  const [goals, setGoals] = useState([
    { id: '1', title: 'Complete next lesson', completed: false },
    { id: '2', title: 'Use voice command', completed: true },
    { id: '3', title: 'Earn 50 XP', completed: false },
  ]);

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleLessonSelect = (lessonId: string) => {
    // Navigate to lesson (in real app, would set specific lesson ID/Slug)
    navigateTo('lesson');
  };

  return (
    <div className="pt-24 min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">

        {/* HEADER: Current Path Overview */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-10 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
                  Current Path
                </span>
                <span className="text-zinc-500 text-sm flex items-center gap-1">
                  <Flame size={14} className="text-orange-500" /> 5 Day Streak
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{JAVASCRIPT_COURSE.title}</h1>
              <p className="text-zinc-400 max-w-xl">
                Continue your journey to becoming a full-stack developer. Master the fundamentals of JavaScript.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col items-end gap-3">
              <div className="text-right">
                <span className="text-3xl font-bold text-white">{Math.round(progressPercentage)}%</span>
                <span className="text-zinc-500 text-sm ml-2">COMPLETED</span>
              </div>
              <button
                onClick={() => navigateTo('lesson')}
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <Play size={18} fill="currentColor" /> Resume Learning
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 relative h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </section>

        {/* MAIN LAYOUT: Linear Path + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">

          {/* Left Column: Linear Path (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <h2 className="text-xl font-bold text-zinc-200">Course Roadmap</h2>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded border border-zinc-700 transition-colors"
                >
                  Get Certificate
                </button>
              </div>
              <LinearPath
                course={JAVASCRIPT_COURSE}
                progress={progress}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Daily Goals */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-500" /> Daily Quests
              </h3>
              <DailyGoalsWidget goals={goals} onToggle={toggleGoal} />
            </div>

            {/* AI Promo */}
            <div className="bg-gradient-to-b from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
              <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Your AI voice tutor is available 24/7 to explain complex topics.
              </p>
              <button
                onClick={() => navigateTo('lesson')}
                className="w-full bg-zinc-800 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Start Voice Session
              </button>
            </div>

          </div>
        </div>

      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        courseName={JAVASCRIPT_COURSE.title}
      />
    </div>
  );
};

export default DashboardPage;