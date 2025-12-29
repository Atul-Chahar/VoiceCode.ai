import React from 'react';
import { UserAchievement } from '../types';
import { Award, Zap, Code, Shield, Flame, Target } from 'lucide-react';

interface AchievementsGridProps {
    achievements: UserAchievement[];
}

// Mock definitions for all possible achievements
const ALL_ACHIEVEMENTS: Record<string, { title: string, description: string, icon: React.ReactNode, color: string }> = {
    'first_code': { title: 'First Blood', description: 'Wrote your first line of code', icon: <Code size={24} />, color: 'text-blue-500' },
    'streak_7': { title: 'On Fire', description: '7 Day Streak', icon: <Flame size={24} />, color: 'text-orange-500' },
    'streak_30': { title: 'Unstoppable', description: '30 Day Streak', icon: <Zap size={24} />, color: 'text-yellow-500' },
    'algo_master': { title: 'Algo Master', description: 'Solved 50 Algorithm problems', icon: <Target size={24} />, color: 'text-red-500' },
    'voice_commander': { title: 'Voice Commander', description: 'Issued 100 Voice Commands', icon: <Award size={24} />, color: 'text-purple-500' },
    'bug_slayer': { title: 'Bug Slayer', description: 'Fixed 50 errors without hints', icon: <Shield size={24} />, color: 'text-green-500' },
};

const AchievementsGrid: React.FC<AchievementsGridProps> = ({ achievements }) => {
    // In a real app, we might map unlocked IDs to the definition
    // For now, we'll just display what's unlocked, or maybe show placeholders for locked ones

    // Let's show a mix of unlocked and grayed out locked ones for visual appeal
    const achievementKeys = Object.keys(ALL_ACHIEVEMENTS);

    return (
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-zinc-400 mb-4 font-semibold">Achievements</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementKeys.map(key => {
                    const def = ALL_ACHIEVEMENTS[key];
                    const isUnlocked = achievements.some(a => a.achievementId === key);

                    return (
                        <div
                            key={key}
                            className={`flex items-center gap-3 p-3 rounded-md border transition-all ${isUnlocked ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950/50 border-zinc-800 opacity-50'}`}
                        >
                            <div className={`p-2 rounded-full bg-zinc-800 ${isUnlocked ? def.color : 'text-zinc-600'}`}>
                                {def.icon}
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium ${isUnlocked ? 'text-zinc-200' : 'text-zinc-500'}`}>{def.title}</h4>
                                <p className="text-xs text-zinc-500 truncate max-w-[120px]">{def.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsGrid;
