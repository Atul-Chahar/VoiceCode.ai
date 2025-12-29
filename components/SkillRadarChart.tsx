import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';

interface SkillRadarChartProps {
    stats: UserStats;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ stats }) => {
    const data = [
        { subject: 'JavaScript', A: stats.skillJs || 50, fullMark: 100 },
        { subject: 'Python', A: stats.skillPython || 30, fullMark: 100 },
        { subject: 'Voice Cmds', A: stats.skillVoice || 80, fullMark: 100 },
        { subject: 'Logic', A: stats.skillLogic || 40, fullMark: 100 },
        { subject: 'Speed', A: stats.skillSpeed || 60, fullMark: 100 },
    ];

    return (
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 h-full flex flex-col items-center justify-center relative overlow-hidden">
            <h3 className="text-zinc-400 mb-2 font-semibold self-start absolute top-6 left-6">Skill Analysis</h3>
            <div className="w-full h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#3f3f46" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                        <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="#f97316"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SkillRadarChart;
