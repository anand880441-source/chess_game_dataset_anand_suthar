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

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Welcome to Chess Match Analytics Platform
                    </p>
                </div>

                {/* Stats Cards */}
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

                {/* Recent Matches Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Matches
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Latest chess games from the database
                        </p>
                    </div>
                    <div className="p-6">
                        <RecentMatchesTable 
                            matches={recentMatches} 
                            loading={loading.matches} 
                        />
                    </div>
                </div>

                {/* Top Players Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Top Rated Players
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Highest ELO rated chess players
                        </p>
                    </div>
                    <div className="p-6">
                        <TopPlayersTable 
                            players={topPlayers} 
                            loading={loading.players} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
