import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { LeaderboardEntry } from '../types';
import { Trophy, RefreshCcw, Crown, Activity } from 'lucide-react';

interface LeaderboardPageProps {
    navigateTo: (view: any) => void;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ navigateTo }) => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await dbService.getLeaderboard(100);
            setLeaderboard(data);
        } catch (error) {
            console.error("Failed to load leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    // Simulated Live Feed Data
    const liveFeed = [
        { user: 'Alex', action: 'completed', item: 'Variables Lesson', time: '2m ago' },
        { user: 'Sarah', action: 'earned', item: 'Bug Slayer Badge', time: '5m ago' },
        { user: 'Mike', action: 'joined', item: 'VoiceCode Guild', time: '12m ago' },
        { user: 'Jessica', action: 'completed', item: 'Python Basics', time: '15m ago' },
        { user: 'David', action: 'reached', item: 'Level 5', time: '22m ago' },
    ];

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><i className="fas fa-circle-notch fa-spin text-orange-500 text-3xl"></i></div>;

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Global Leaderboard</h1>
                        <p className="text-zinc-400">See where you stack up against other developers.</p>
                    </div>
                    <button
                        onClick={loadLeaderboard}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg border border-zinc-700 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCcw size={16} /> Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Leaderboard Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Podium Section */}
                        {topThree.length >= 3 && (
                            <div className="grid grid-cols-3 gap-4 items-end mb-12 h-64">
                                {/* 2nd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-zinc-400 overflow-hidden mb-4 relative shadow-lg shadow-zinc-500/10">
                                        <img src={topThree[1].avatarUrl || `https://ui-avatars.com/api/?name=${topThree[1].fullName}&background=d4d4d8&color=000`} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 w-full bg-zinc-400 text-black text-xs font-bold text-center py-0.5">#2</div>
                                    </div>
                                    <div className="text-white font-bold text-lg">{topThree[1].fullName}</div>
                                    <div className="text-orange-500 font-mono font-bold">{topThree[1].xp.toLocaleString()} XP</div>
                                    <div className="w-full h-32 bg-gradient-to-t from-zinc-800 to-zinc-900 rounded-t-lg mt-4 border-t border-x border-zinc-700"></div>
                                </div>

                                {/* 1st Place */}
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-2">
                                        <Crown size={32} className="text-yellow-500 animate-bounce" style={{ animationDuration: '3s' }} />
                                    </div>
                                    <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden mb-4 relative shadow-xl shadow-yellow-500/20 z-10">
                                        <img src={topThree[0].avatarUrl || `https://ui-avatars.com/api/?name=${topThree[0].fullName}&background=eab308&color=000`} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 w-full bg-yellow-500 text-black text-xs font-bold text-center py-0.5">#1</div>
                                    </div>
                                    <div className="text-white font-bold text-xl">{topThree[0].fullName}</div>
                                    <div className="text-orange-500 font-mono font-bold text-lg">{topThree[0].xp.toLocaleString()} XP</div>
                                    <div className="w-full h-40 bg-gradient-to-t from-zinc-800 to-zinc-900 rounded-t-lg mt-4 border-t border-x border-zinc-700 shadow-lg relative overflow-hidden">
                                        <div className="absolute inset-0 bg-yellow-500/5 blur-xl"></div>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden mb-4 relative shadow-lg shadow-orange-900/10">
                                        <img src={topThree[2].avatarUrl || `https://ui-avatars.com/api/?name=${topThree[2].fullName}&background=c2410c&color=fff`} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 w-full bg-orange-700 text-white text-xs font-bold text-center py-0.5">#3</div>
                                    </div>
                                    <div className="text-white font-bold text-lg">{topThree[2].fullName}</div>
                                    <div className="text-orange-500 font-mono font-bold">{topThree[2].xp.toLocaleString()} XP</div>
                                    <div className="w-full h-24 bg-gradient-to-t from-zinc-800 to-zinc-900 rounded-t-lg mt-4 border-t border-x border-zinc-700"></div>
                                </div>
                            </div>
                        )}

                        {/* List Section */}
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 w-16 text-center">Rank</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4 text-right">Level</th>
                                        <th className="p-4 text-right">Total XP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {rest.map((entry) => (
                                        <tr
                                            key={entry.userId}
                                            className={`
                                                group transition-colors 
                                                ${entry.userId === user?.id
                                                    ? 'bg-orange-500/10 hover:bg-orange-500/20 border-l-2 border-orange-500'
                                                    : 'hover:bg-zinc-800/50'}
                                            `}
                                        >
                                            <td className={`p-4 text-center font-mono font-bold ${entry.rank <= 10 ? 'text-white' : 'text-zinc-500'}`}>#{entry.rank}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={entry.avatarUrl || `https://ui-avatars.com/api/?name=${entry.fullName}&background=random`}
                                                        className="w-8 h-8 rounded-full bg-zinc-800 object-cover"
                                                    />
                                                    <span className={`font-medium ${entry.userId === user?.id ? 'text-orange-400' : 'text-zinc-300'}`}>
                                                        {entry.fullName}
                                                        {entry.userId === user?.id && <span className="ml-2 text-[10px] bg-orange-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">You</span>}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-zinc-400 font-mono">Lvl {entry.level}</td>
                                            <td className="p-4 text-right text-white font-bold font-mono">{entry.xp.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-zinc-500">No active users found yet. Be the first!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Live Feed */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sticky top-28">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-green-500" /> Live Updates
                            </h3>
                            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                                {liveFeed.map((item, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-zinc-900 border-2 border-green-500 rounded-full z-10"></div>
                                        <div className="text-sm">
                                            <span className="font-bold text-white">{item.user}</span>{' '}
                                            <span className="text-zinc-500">{item.action}</span>{' '}
                                            <span className="text-green-400">{item.item}</span>
                                        </div>
                                        <div className="text-xs text-zinc-600 mt-1">{item.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
