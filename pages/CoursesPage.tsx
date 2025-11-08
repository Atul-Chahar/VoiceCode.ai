import React from 'react';
import { View } from '../App';
import { JAVASCRIPT_COURSE } from '../constants';

interface CoursesPageProps {
  navigateTo: (view: View) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ navigateTo }) => {
  // Combine real courses with placeholders for uniform rendering
  const allCourses = [
    {
      id: JAVASCRIPT_COURSE.id,
      title: JAVASCRIPT_COURSE.title,
      description: JAVASCRIPT_COURSE.description,
      icon: 'JS',
      isActive: true,
      iconColor: 'text-brand-green',
      bgColor: 'bg-[#B9FF66]/10'
    },
    {
      id: 'python-coming-soon',
      title: 'Python for Everybody',
      description: 'From scripts to data science. Master the world\'s most popular versatile programming language.',
      icon: 'PY',
      isActive: false,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 'go-coming-soon',
      title: 'Go: Building Scalable Systems',
      description: 'Learn Google\'s high-performance language designed for modern cloud infrastructure and concurrency.',
      icon: 'GO',
      isActive: false,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    }
  ];

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Explore Our <span className="text-brand-green">Courses</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find the perfect course to start your journey from beginner to expert, guided by your personal AI tutor.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map(course => (
            <div key={course.id} className={`dark-card rounded-xl p-6 flex flex-col transition-all ${!course.isActive ? 'opacity-75 hover:opacity-100' : 'hover:border-brand-green/50'}`}>
              <div className="flex-grow mb-8">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 ${course.bgColor} ${course.iconColor}`}>
                  {course.icon}
                </div>
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold leading-tight">{course.title}</h3>
                    {!course.isActive && (
                        <span className="flex-shrink-0 ml-2 px-2.5 py-1 bg-[#262626] text-gray-400 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Soon
                        </span>
                    )}
                </div>
                <p className="text-gray-400 leading-relaxed">{course.description}</p>
              </div>
              
              {course.isActive ? (
                  <button onClick={() => navigateTo('dashboard')} className="w-full btn-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center group">
                    Start Learning 
                    <i className="fas fa-arrow-right ml-3 transition-transform group-hover:translate-x-1"></i>
                  </button>
              ) : (
                  <button disabled className="w-full bg-[#262626] text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed border border-[#333] flex items-center justify-center">
                    <i className="fas fa-lock mr-3 opacity-50"></i> Join Waitlist
                  </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;