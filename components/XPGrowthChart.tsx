import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityLog } from '../types';

interface XPGrowthChartProps {
    activityLog: ActivityLog[];
}

const XPGrowthChart: React.FC<XPGrowthChartProps> = ({ activityLog }) => {
    // Process data to get cumulative XP
    const processData = () => {
        let cumulativeXP = 0;
        // Take last 30 days for better visibility, or all if less
        const sortedLog = [...activityLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const recentLog = sortedLog.slice(-30);

        return recentLog.map(entry => {
            cumulativeXP += entry.xpEarned;
            return {
                date: entry.date, // Format date if needed e.g., 'MM/DD'
                xp: cumulativeXP
            };
        });
    };

    const data = processData();

    if (data.length === 0) {
        return (
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 h-full flex flex-col items-center justify-center text-zinc-500">
                <p>Not enough data for growth chart</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 h-full relative">
            <h3 className="text-zinc-400 mb-4 font-semibold absolute top-6 left-6">XP Growth (Last 30 Days)</h3>
            <div className="w-full h-[250px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            tickFormatter={(val) => val.substring(5)} // Show MM-DD
                        />
                        <YAxis tick={{ fill: '#71717a', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                            itemStyle={{ color: '#f97316' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="xp"
                            stroke="#f97316"
                            fillOpacity={1}
                            fill="url(#colorXp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default XPGrowthChart;
