
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
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome Back, <span className="text-brand-green">{user?.name.split(' ')[0] || 'Coder'}</span>!</h1>
          <p className="text-xl text-gray-400">Ready to continue your coding journey?</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">My Courses</h2>
            <div className="dark-card rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-[#B9FF66]/10 rounded-lg flex items-center justify-center text-brand-green text-5xl font-bold">
                JS
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold">{JAVASCRIPT_COURSE.title}</h3>
                <p className="text-gray-400 mb-4">{JAVASCRIPT_COURSE.description}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-brand-green h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{completedLessonsCount} of {totalLessons} lessons completed</p>
              </div>
              <button onClick={() => navigateTo('lesson')} className="btn-primary px-6 py-3 rounded-lg w-full md:w-auto flex-shrink-0">
                Continue Lesson
              </button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Achievements</h2>
            <div className="dark-card rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl text-yellow-400"><i className="fas fa-star"></i></div>
                <div>
                  <h4 className="font-semibold">First Steps</h4>
                  <p className="text-sm text-gray-400">Completed your first lesson</p>
                </div>
              </div>
               <div className="flex items-center gap-4 opacity-50">
                <div className="text-2xl text-gray-500"><i className="fas fa-compass"></i></div>
                <div>
                  <h4 className="font-semibold">Code Explorer</h4>
                  <p className="text-sm text-gray-400">Completed 5 lessons</p>
                </div>
              </div>
               <div className="flex items-center gap-4 opacity-50">
                <div className="text-2xl text-gray-500"><i className="fas fa-fire"></i></div>
                <div>
                  <h4 className="font-semibold">Code Novice</h4>
                  <p className="text-sm text-gray-400">Complete a full module</p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="text-2xl text-gray-500"><i className="fas fa-trophy"></i></div>
                <div>
                  <h4 className="font-semibold">JS Basics Graduate</h4>
                  <p className="text-sm text-gray-400">Finish the JS Basics course</p>
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
