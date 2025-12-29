import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';

// Using a simplified Course type or just displaying static history for the MVP if data structure is complex
interface CompletedCourse {
    id: string;
    title: string;
    completedAt: string;
    thumbnailColor: string; // Tailwind class
}

const CourseHistoryGrid: React.FC = () => {
    // Mock data based on the screenshot provided (boot.dev visual style)
    const completedCourses: CompletedCourse[] = [
        { id: '1', title: 'Learn to Code in Python', completedAt: 'Dec 11, 2025', thumbnailColor: 'bg-yellow-600' },
        { id: '2', title: 'Learn Linux', completedAt: 'Dec 12, 2025', thumbnailColor: 'bg-stone-600' },
        { id: '3', title: 'Learn Functional Programming', completedAt: 'Dec 14, 2025', thumbnailColor: 'bg-blue-600' },
        { id: '4', title: 'Learn SQL', completedAt: 'Dec 29, 2025', thumbnailColor: 'bg-purple-600' },
        { id: '5', title: 'Learn Go', completedAt: 'Dec 24, 2025', thumbnailColor: 'bg-cyan-600' },
    ];

    return (
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 col-span-full">
            <h3 className="text-zinc-400 mb-4 font-semibold">Course History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {completedCourses.map(course => (
                    <div key={course.id} className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-all hover:border-zinc-600 hover:-translate-y-1">
                        {/* Banner Background */}
                        <div className={`h-16 w-full ${course.thumbnailColor} opacity-20 group-hover:opacity-30 transition-opacity`}></div>

                        <div className="p-4 relative">
                            {/* Icon centering trick */}
                            <div className="absolute -top-8 left-4 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-300">
                                <BookOpen size={20} />
                            </div>

                            <h4 className="mt-4 font-medium text-zinc-200 group-hover:text-orange-400 transition-colors">{course.title}</h4>
                            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                                <CheckCircle size={12} className="text-green-500" />
                                <span>Completed on {course.completedAt}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseHistoryGrid;
