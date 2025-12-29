import React from 'react';
import { ActivityLog } from '../types';

interface ActivityHeatmapProps {
    activityLog: ActivityLog[];
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activityLog }) => {
    // Helper to generate last 365 days
    const generateYearDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const days = generateYearDays();

    // Helper to get color based on XP/Intensity
    const getColor = (dateStr: string) => {
        const activity = activityLog.find(a => a.date === dateStr);
        if (!activity) return 'bg-zinc-800'; // Empty state

        const xp = activity.xpEarned;
        if (xp > 100) return 'bg-orange-500';
        if (xp > 50) return 'bg-orange-600';
        if (xp > 20) return 'bg-orange-700';
        if (xp > 0) return 'bg-orange-900';
        return 'bg-zinc-800';
    };

    const getTooltip = (dateStr: string) => {
        const activity = activityLog.find(a => a.date === dateStr);
        if (!activity) return `${dateStr}: No activity`;
        return `${dateStr}: ${activity.xpEarned} XP`;
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 text-sm">
            <h3 className="text-zinc-400 mb-4 font-semibold">Activity (Last 365 Days)</h3>

            {/* Months Header (simplified approximation) */}
            <div className="flex justify-between mb-2 text-xs text-zinc-500 px-1">
                {months.map(m => <span key={m}>{m}</span>)}
            </div>

            <div className="flex flex-wrap gap-1 h-32 content-start">
                {days.map((dateStr) => (
                    <div
                        key={dateStr}
                        className={`w-3 h-3 rounded-sm ${getColor(dateStr)} hover:ring-1 ring-white/50 transition-all cursor-default relative group`}
                    >
                        {/* Simple Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                            {getTooltip(dateStr)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end items-center gap-2 mt-2 text-xs text-zinc-500">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-zinc-800"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-900"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-700"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-600"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
