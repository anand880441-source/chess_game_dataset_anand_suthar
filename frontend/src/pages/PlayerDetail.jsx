import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import playerService from '../services/playerService';
import toast from 'react-hot-toast';

function PlayerDetail() {
    const { username } = useParams();
    const [player, setPlayer] = useState(null);
    const [ratingHistory, setRatingHistory] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetchPlayerData();
    }, [username]);

    const fetchPlayerData = async () => {
        setLoading(true);
        setNotFound(false);
        try {
            // Fetch player details
            try {
                const playerRes = await playerService.getByUsername(username);
                if (playerRes.success && playerRes.data) {
                    setPlayer(playerRes.data);
                } else {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                throw err;
            }

            // Fetch player stats
            try {
                const statsRes = await playerService.getStats(username);
                if (statsRes.success) {
                    setStats(statsRes.data);
                }
            } catch (e) {
                console.log('Stats not available');
            }

            // Fetch rating history
            try {
                const historyRes = await playerService.getRatingHistory(username);
                if (historyRes.success && historyRes.ratingHistory) {
                    const formatted = historyRes.ratingHistory.map(r => ({
                        date: new Date(r.date).toLocaleDateString(),
                        rating: r.rating,
                        opponent: r.opponent,
                        result: r.result
                    }));
                    setRatingHistory(formatted);
                }
            } catch (e) {
                console.log('Rating history not available');
            }

            // Fetch recent matches
            try {
                const matchesRes = await playerService.getHistory(username, 10);
                if (matchesRes.success && matchesRes.data) {
                    setRecentMatches(matchesRes.data);
                }
            } catch (e) {
                console.log('Matches history not available');
            }

        } catch (error) {
            console.error('Error fetching player data:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const getResultColor = (result) => {
        if (result === 'Win') return 'text-green-600 font-semibold';
        if (result === 'Loss') return 'text-red-600 font-semibold';
        return 'text-yellow-600 font-semibold';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (notFound || !player) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">👤</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Player Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    The player "{username}" does not exist in the database.
                </p>
                <Link to="/players" className="text-primary-600 hover:underline mt-4 inline-block">
                    ← Back to Players
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{player.username} | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="/players" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl text-white font-bold">
                                {player.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {player.username}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                                        Rating: {player.currentRating}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Games: {player.totalGames}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.winRate || player?.winRate || 0}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Win Rate</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stats?.wins || 0} wins</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.lossRate || player?.lossRate || 0}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Loss Rate</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stats?.losses || 0} losses</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.drawRate || player?.drawRate || 0}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Draw Rate</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stats?.draws || 0} draws</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{player.currentRating}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Rating</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">ELO</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50">
                        <div className="flex gap-6 px-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                                    activeTab === 'overview'
                                        ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border-transparent'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('rating-history')}
                                className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                                    activeTab === 'rating-history'
                                        ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border-transparent'
                                }`}
                            >
                                Rating History
                            </button>
                            <button
                                onClick={() => setActiveTab('matches')}
                                className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                                    activeTab === 'matches'
                                        ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border-transparent'
                                }`}
                            >
                                Recent Matches
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Player Statistics</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Total Games</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{player.totalGames}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Wins / Losses / Draws</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{stats?.wins || 0} / {stats?.losses || 0} / {stats?.draws || 0}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Last Active</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{player.lastPlayedAt ? new Date(player.lastPlayedAt).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Member Since</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{new Date(player.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rating-history' && (
                            <div>
                                {ratingHistory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={ratingHistory}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                                            <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                            <Line type="monotone" dataKey="rating" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="ELO Rating" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No rating history available</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'matches' && (
                            <div className="overflow-x-auto -mx-6">
                                {recentMatches.length > 0 ? (
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-800">
                                            <tr>
                                                <th className="table-header text-left">Opponent</th>
                                                <th className="table-header text-left">Result</th>
                                                <th className="table-header text-left">Moves</th>
                                                <th className="table-header text-left">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {recentMatches.map((match) => {
                                                let result = 'Loss';
                                                if (match.result === 'Win' || match.resultForPlayer === 'Win') {
                                                    result = 'Win';
                                                } else if (match.result === 'Draw' || match.resultForPlayer === 'Draw') {
                                                    result = 'Draw';
                                                } else if (match.winner === 'draw') {
                                                    result = 'Draw';
                                                } else if ((match.white?.username === username && match.winner === 'white') ||
                                                           (match.black?.username === username && match.winner === 'black')) {
                                                    result = 'Win';
                                                }
                                                
                                                const opponent = match.opponent || (match.white?.username === username ? match.black?.username : match.white?.username);
                                                const moves = match.turns || match.moves?.length;
                                                const date = match.createdAt ? new Date(match.createdAt).toLocaleDateString() : 'Unknown';
                                                
                                                // Skip if opponent is the same as current user (self-reference)
                                                if (opponent === username) return null;
                                                
                                                return (
                                                    <tr key={match._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold">
                                                            <Link to={`/players/${opponent}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                                                                {opponent}
                                                            </Link>
                                                         </td>
                                                        <td className={`px-6 py-4.5 whitespace-nowrap text-sm font-bold ${getResultColor(result)}`}>{result}</td>
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-300">{moves}</td>
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">{date}</td>
                                                     </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No recent matches available</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PlayerDetail;
