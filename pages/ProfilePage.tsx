import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { UserStats, ActivityLog, UserAchievement, UserProfile } from '../types';
import ActivityHeatmap from '../components/ActivityHeatmap';
import SkillRadarChart from '../components/SkillRadarChart';
import XPGrowthChart from '../components/XPGrowthChart';
import AchievementsGrid from '../components/AchievementsGrid';
import CourseHistoryGrid from '../components/CourseHistoryGrid';
import { MapPin, Link as LinkIcon, Github, Linkedin, Calendar, Trophy, Zap, Heart } from 'lucide-react';

interface ProfilePageProps {
    navigateTo: (view: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigateTo }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
    const [achievements, setAchievements] = useState<UserAchievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                try {
                    const [statsData, activityData] = await Promise.all([
                        dbService.getUserStats(user.id),
                        dbService.getActivityLog(user.id)
                    ]);
                    setStats(statsData);
                    setActivityLog(activityData);
                    // Mock achievements for now until backend method exists
                    setAchievements([]);
                } catch (error) {
                    console.error("Failed to load profile data", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [user]);

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><i className="fas fa-circle-notch fa-spin text-orange-500 text-3xl"></i></div>;
    if (!user || !stats) return <div className="min-h-screen pt-24 text-center text-zinc-500">User not found</div>;

    return (
        <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* TOP SECTION: Header Cards */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* 1. Profile Identity Card */}
                    <div className="md:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-2 border-orange-500 p-1">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-zinc-950 border border-zinc-700 text-xs px-2 py-1 rounded-full text-zinc-300">
                                Lvl {stats.level}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                            <p className="text-zinc-500">@{stats.githubHandle || user.email.split('@')[0]}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-zinc-800 text-xs rounded-full text-zinc-400 border border-zinc-700">
                                {stats.tagline || 'Aspiring Developer'}
                            </span>
                        </div>
                    </div>

                    {/* 2. Info & Socials Card */}
                    <div className="md:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <MapPin size={16} />
                            <span>{stats.location || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <LinkIcon size={16} />
                            <a href={stats.websiteUrl || '#'} className="hover:text-orange-500 transition-colors">{stats.websiteUrl || 'No personal site'}</a>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <a href={`https://github.com/${stats.githubHandle || ''}`} className="text-zinc-500 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href={`https://linkedin.com/in/${stats.linkedinHandle || ''}`} className="text-zinc-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* 3. Key Stats Card */}
                    <div className="md:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col justify-center space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 flex items-center gap-2"><Trophy size={16} /> Lessons Solved</span>
                            <span className="text-white font-mono font-bold text-lg">{stats.lessonsCompleted}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 flex items-center gap-2"><Zap size={16} /> Total XP</span>
                            <span className="text-orange-500 font-mono font-bold text-lg">{stats.xp.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500 flex items-center gap-2"><Calendar size={16} /> Joined</span>
                            <span className="text-zinc-300">{new Date(stats.joinedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* MIDDLE SECTION: Bio & Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Bio */}
                    <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <h3 className="text-zinc-400 mb-4 font-semibold text-sm uppercase tracking-wider">About Me</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            {stats.bio || "No bio added yet. Tell the world about your coding journey!"}
                        </p>
                    </div>

                    {/* Heatmap */}
                    <div className="lg:col-span-3">
                        <ActivityHeatmap activityLog={activityLog} />
                    </div>
                </div>

                {/* ADVANCED ANALYTICS (Differentiator) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                    <SkillRadarChart stats={stats} />
                    <XPGrowthChart activityLog={activityLog} />
                </div>

                {/* BOTTOM SECTION: Achievements & History */}
                <div className="grid grid-cols-1 gap-6">
                    <AchievementsGrid achievements={achievements} />
                    <CourseHistoryGrid />
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
