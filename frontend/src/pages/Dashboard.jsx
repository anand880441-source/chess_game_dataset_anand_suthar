import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import StatCard from '../components/dashboard/StatCard';
import RecentMatchesTable from '../components/dashboard/RecentMatchesTable';
import TopPlayersTable from '../components/dashboard/TopPlayersTable';
import gameService from '../services/gameService';
import playerService from '../services/playerService';
import analyticsService from '../services/analyticsService';
import toast from 'react-hot-toast';

function Dashboard() {
    const [stats, setStats] = useState({
        totalGames: 0,
        totalPlayers: 0,
        totalOpenings: 365,
        averageRating: 0,
    });
    const [recentMatches, setRecentMatches] = useState([]);
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoadingState] = useState({
        stats: true,
        matches: true,
        players: true,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch total matches
            const matchesRes = await gameService.getAll({ page: 1, limit: 1 });
            setStats(prev => ({ ...prev, totalGames: matchesRes.total || 0 }));

            // Fetch total players
            const playersRes = await playerService.getAll({ page: 1, limit: 1 });
            setStats(prev => ({ ...prev, totalPlayers: playersRes.total || 0 }));

            // Fetch average rating
            try {
                const ratingRes = await analyticsService.getAverageRating();
                setStats(prev => ({ ...prev, averageRating: ratingRes.averageRating || 0 }));
            } catch (e) {
                console.log('Rating API not ready yet');
            }

            // Fetch recent matches
            const recentRes = await gameService.getLatest(10);
            setRecentMatches(recentRes.data || []);

            // Fetch top players
            const topRes = await playerService.getTopRated(10);
            setTopPlayers(topRes.data || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoadingState({ stats: false, matches: false, players: false });
        }
    };

    return (
        <>
            <Helmet>
                <title>Dashboard | Chess Analytics</title>
            </Helmet>

            <div className="space-y-8 animate-fade-in">
                {/* Welcome Hero Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-primary-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                    {/* Background Graphic Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl translate-y-12"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-3 text-center md:text-left max-w-xl">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                ♟️ Match Database & Analytics
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                Elevate Your Chess Strategy
                            </h1>
                            <p className="text-sm sm:text-base text-gray-300">
                                Gain competitive insights, analyze opening variations, track player performance, and dissect thousands of chess matches.
                            </p>
                        </div>
                        
                        {/* Interactive/Animated visual element */}
                        <div className="hidden md:flex items-center justify-center w-36 h-36 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-glass animate-float flex-shrink-0">
                            <span className="text-7xl select-none">👑</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Section */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Database Summary
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Games"
                            value={stats.totalGames}
                            icon="♟️"
                            color="blue"
                        />
                        <StatCard
                            title="Total Players"
                            value={stats.totalPlayers}
                            icon="👥"
                            color="green"
                        />
                        <StatCard
                            title="Chess Openings"
                            value={stats.totalOpenings}
                            icon="📚"
                            color="purple"
                        />
                        <StatCard
                            title="Average Rating"
                            value={stats.averageRating}
                            icon="⭐"
                            color="orange"
                        />
                    </div>
                </div>

                {/* Main Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Matches Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 overflow-hidden transition-all duration-300 hover:shadow-card-hover">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>🎮</span> Recent Matches
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Latest chess games recorded in the system
                                </p>
                            </div>
                            <button 
                                onClick={fetchDashboardData}
                                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors"
                                title="Refresh"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <RecentMatchesTable 
                                matches={recentMatches} 
                                loading={loading.matches} 
                            />
                        </div>
                    </div>

                    {/* Top Players Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 overflow-hidden transition-all duration-300 hover:shadow-card-hover">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>🏆</span> Top Rated Players
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Highest rating achievements in the database
                                </p>
                            </div>
                            <button 
                                onClick={fetchDashboardData}
                                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors"
                                title="Refresh"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <TopPlayersTable 
                                players={topPlayers} 
                                loading={loading.players} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
