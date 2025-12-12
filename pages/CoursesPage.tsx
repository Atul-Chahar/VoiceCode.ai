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
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      level: 'Beginner',
      duration: '4 Weeks',
      gradient: 'from-orange-600 to-orange-400'
    },
    {
      id: 'python-coming-soon',
      title: 'Python for Everybody',
      description: 'From scripts to data science. Master the world\'s most popular versatile programming language.',
      icon: 'PY',
      isActive: false,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      level: 'Intermediate',
      duration: '6 Weeks',
      gradient: 'from-blue-600 to-blue-400'
    },
    {
      id: 'go-coming-soon',
      title: 'Go: Scalable Systems',
      description: 'Learn Google\'s high-performance language designed for modern cloud infrastructure and concurrency.',
      icon: 'GO',
      isActive: false,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      level: 'Advanced',
      duration: '8 Weeks',
      gradient: 'from-cyan-600 to-cyan-400'
    }
  ];

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-[#0D0D0D] text-white selection:bg-orange-500/30 selection:text-orange-200">
      <div className="max-w-7xl mx-auto relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <header className="text-center mb-20 relative">
          <span className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
            Level Up Your Skills
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-manrope tracking-tight leading-none animate-fade-in-up delay-100">
            Expand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Potential</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Choose a path and let our AI-powered platform guide you from your first line of code to building complex applications.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map((course, index) => (
            <div
              key={course.id}
              className={`group relative perspective-1000 ${!course.isActive ? 'opacity-80' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`
                    h-full bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 flex flex-col transition-all duration-500 
                    ${course.isActive ? 'hover:-translate-y-2 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/20' : ''}
                    backdrop-blur-sm relative overflow-hidden
                `}>
                {/* Decorative Gradient Blob */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${course.gradient} opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity duration-500 rounded-full`}></div>

                <div className="flex-grow mb-8 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${course.bgColor} ${course.iconColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {course.icon}
                    </div>
                    {course.isActive ? (
                      <span className="px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        {course.level}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <i className="fas fa-hammer"></i> Building
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold font-manrope mb-3 group-hover:text-white transition-colors">{course.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm mb-6">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5"><i className="fas fa-clock"></i> {course.duration}</span>
                    <span className="flex items-center gap-1.5"><i className="fas fa-video"></i> AI Tutor Support</span>
                  </div>
                </div>

                {course.isActive ? (
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="w-full py-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg hover:shadow-orange-500/25 transform hover:scale-[1.02] transition-all flex items-center justify-center group/btn relative z-10"
                  >
                    Start Learning Now
                    <i className="fas fa-arrow-right ml-2 group-hover/btn:translate-x-1 transition-transform"></i>
                  </button>
                ) : (
                  <button disabled className="w-full py-4 rounded-xl font-bold text-sm tracking-wide bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed flex items-center justify-center relative z-10">
                    Join Waitlist
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Human/Tutor Section */}
        <div className="mt-32 relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-white/5 p-12 md:p-24 text-center">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-orange-500/30">
              <i className="fas fa-microphone-alt text-4xl text-orange-500"></i>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-manrope mb-6">More Than Just Code. <br /> A <span className="text-orange-500">Conversation.</span></h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Unlike other platforms where you stare at text, VoiceCode allows you to talk through problems. It's like having a senior engineer sitting right next to you, 24/7.
            </p>
            <button onClick={() => navigateTo('dashboard')} className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all font-bold text-sm uppercase tracking-widest">
              Experience the Difference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;