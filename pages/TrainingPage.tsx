import React, { useState } from 'react';
import { View } from '../App';
import { Search, Sparkles, Code, Bug, Keyboard, Filter, Play } from 'lucide-react';

interface TrainingPageProps {
    navigateTo: (view: View) => void;
}

interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    type: 'Algorithm' | 'Debugging' | 'Refactor';
    xp: number;
    tags: string[];
}

const TrainingPage: React.FC<TrainingPageProps> = ({ navigateTo }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

    // Mock Data
    const challenges: Challenge[] = [
        {
            id: '1', title: 'Two Sum', description: 'Find indices of the two numbers such that they add up to target.', difficulty: 'Easy', type: 'Algorithm', xp: 50, tags: ['Arrays', 'Hash Map']
        },
        {
            id: '2', title: 'Fix the Infinite Loop', description: 'Debug this React component that causes the browser to crash.', difficulty: 'Medium', type: 'Debugging', xp: 120, tags: ['React', 'Hooks']
        },
        {
            id: '3', title: 'Valid Palindrome', description: 'Determine if a string is a palindrome, considering only alphanumeric characters.', difficulty: 'Easy', type: 'Algorithm', xp: 40, tags: ['Strings']
        },
        {
            id: '4', title: 'Optimize API Call', description: 'Refactor this function to reduce redundant network requests.', difficulty: 'Hard', type: 'Refactor', xp: 250, tags: ['Performance', 'Async']
        },
        {
            id: '5', title: 'Merge K Sorted Lists', description: 'Merge k linked lists and return it as one sorted list.', difficulty: 'Expert', type: 'Algorithm', xp: 500, tags: ['Linked List', 'Heap']
        },
    ];

    const filteredChallenges = challenges.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
        return matchesSearch && matchesDiff;
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Hard': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'Expert': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-zinc-400';
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-[#0D0D0D] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">

                {/* Header & AI Generation */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold font-manrope text-white mb-2">Training Grounds</h1>
                        <p className="text-zinc-400">Hone your skills with infinite coding challenges.</p>
                    </div>

                    {/* AI Generator Card */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full transition-all group-hover:bg-indigo-500/20" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-indigo-300 font-bold text-sm uppercase tracking-wide">
                                <Sparkles size={16} /> AI Forge
                            </div>
                            <p className="text-sm text-zinc-300 mb-4">
                                Generate a custom challenge based on your weak spots.
                            </p>
                            <button
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                                onClick={() => navigateTo('lesson')}
                            >
                                <Sparkles size={16} /> Generate Challenge
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="sticky top-20 z-30 bg-[#0D0D0D]/95 backdrop-blur-md py-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        {['All', 'Easy', 'Medium', 'Hard', 'Expert'].map(diff => (
                            <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff)}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap
                  ${selectedDifficulty === diff
                                        ? 'bg-zinc-100 text-black border-zinc-100'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'}
                `}
                            >
                                {diff}
                            </button>
                        ))}
                        <button className="px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                {/* Challenge Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {filteredChallenges.map(challenge => (
                        <div
                            key={challenge.id}
                            className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                            onClick={() => navigateTo('lesson')}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(challenge.difficulty)}`}>
                                    {challenge.difficulty}
                                </span>
                                <span className="text-orange-500 font-mono text-xs font-bold">+{challenge.xp} XP</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{challenge.title}</h3>
                            <p className="text-zinc-400 text-sm mb-6 line-clamp-2 flex-grow">{challenge.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                    {challenge.type === 'Algorithm' && <Code size={14} />}
                                    {challenge.type === 'Debugging' && <Bug size={14} />}
                                    {challenge.type === 'Refactor' && <Keyboard size={14} />}
                                    <span>{challenge.type}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                    <Play size={14} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TrainingPage;
