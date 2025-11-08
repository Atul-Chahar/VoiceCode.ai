import React from 'react';
import { View } from '../App';
import { JAVASCRIPT_COURSE } from '../constants';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useAuth } from '../contexts/AuthContext';

interface DashboardPageProps {
  navigateTo: (view: View) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigateTo }) => {
  const { user } = useAuth();
  const { progress } = useCourseProgress(JAVASCRIPT_COURSE.id);
  const totalLessons = JAVASCRIPT_COURSE.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessonsCount = progress.completedLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  return (
    <div className="pt-24 md:pt-28 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Welcome Back, <span className="text-brand-green">{user?.name.split(' ')[0] || 'Coder'}</span>!</h1>
          <p className="text-lg text-gray-400">Ready to continue your coding journey?</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center"><i className="fas fa-book-reader mr-3 text-brand-green"></i> My Courses</h2>
            <div className="dark-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-brand-green/30 transition-colors">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#B9FF66]/10 rounded-2xl flex items-center justify-center text-brand-green text-4xl sm:text-5xl font-bold flex-shrink-0">
                JS
              </div>
              <div className="flex-grow text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{JAVASCRIPT_COURSE.title}</h3>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">{completedLessonsCount}/{totalLessons} Lessons</span>
                </div>
                
                <div className="w-full bg-[#0D0D0D] rounded-full h-3 mb-4 border border-[#262626] overflow-hidden p-0.5">
                  <div className="bg-brand-green h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${Math.max(progressPercentage, 5)}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                     <button onClick={() => navigateTo('lesson')} className="btn-primary px-6 py-3 rounded-xl w-full sm:w-auto font-bold flex items-center justify-center">
                        {progressPercentage > 0 ? 'Continue Lesson' : 'Start Course'} 
                        <i className={`fas ${progressPercentage > 0 ? 'fa-play' : 'fa-rocket'} ml-2 text-sm`}></i>
                    </button>
                    <p className="text-sm text-gray-500">{progressPercentage === 0 ? 'Not started yet' : progressPercentage === 100 ? 'Course Completed! 🎉' : 'In Progress'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Achievements */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center"><i className="fas fa-trophy mr-3 text-yellow-500"></i> Achievements</h2>
            <div className="dark-card rounded-2xl p-6 space-y-5">
              <div className={`flex items-center gap-4 p-3 rounded-xl ${completedLessonsCount > 0 ? 'bg-[#B9FF66]/5' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${completedLessonsCount > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[#262626] text-gray-600'}`}>
                    <i className="fas fa-star"></i>
                </div>
                <div>
                  <h4 className={`font-bold ${completedLessonsCount > 0 ? 'text-white' : 'text-gray-500'}`}>First Steps</h4>
                  <p className="text-xs md:text-sm text-gray-400">Complete your first lesson</p>
                </div>
              </div>
               <div className={`flex items-center gap-4 p-3 rounded-xl ${completedLessonsCount >= 5 ? 'bg-[#B9FF66]/5' : ''}`}>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${completedLessonsCount >= 5 ? 'bg-blue-500/20 text-blue-400' : 'bg-[#262626] text-gray-600'}`}>
                    <i className="fas fa-compass"></i>
                </div>
                <div>
                  <h4 className={`font-bold ${completedLessonsCount >= 5 ? 'text-white' : 'text-gray-500'}`}>Code Explorer</h4>
                  <p className="text-xs md:text-sm text-gray-400">Complete 5 lessons</p>
                </div>
              </div>
               <div className={`flex items-center gap-4 p-3 rounded-xl`}>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-[#262626] text-gray-600`}>
                    <i className="fas fa-fire"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500">Code Novice</h4>
                  <p className="text-xs md:text-sm text-gray-400">Complete a full module</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;