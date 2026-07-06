import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import openingService from '../services/openingService';
import gameService from '../services/gameService';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

function OpeningDetail() {
    const { ecoCode } = useParams();
    const [opening, setOpening] = useState(null);
    const [sampleGames, setSampleGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchOpeningData();
    }, [ecoCode]);

    const fetchOpeningData = async () => {
        setLoading(true);
        try {
            // Fetch opening by ECO code
            const openingRes = await openingService.getByEco(ecoCode);
            if (openingRes.success) {
                setOpening(openingRes.data);
            }

            // Fetch sample games using this opening
            const gamesRes = await gameService.getByOpeningEco(ecoCode, 10);
            if (gamesRes.success) {
                setSampleGames(gamesRes.data || []);
            }

        } catch (error) {
            console.error('Error fetching opening data:', error);
            toast.error('Failed to load opening data');
        } finally {
            setLoading(false);
        }
    };

    // Calculate win rates for pie chart
    const winRateData = opening ? [
        { name: 'White Wins', value: opening.whiteWins || 0 },
        { name: 'Black Wins', value: opening.blackWins || 0 },
        { name: 'Draws', value: opening.draws || 0 }
    ] : [];

    const whiteWinPercent = opening && opening.totalGames > 0 
        ? ((opening.whiteWins / opening.totalGames) * 100).toFixed(1) 
        : 0;
    const blackWinPercent = opening && opening.totalGames > 0 
        ? ((opening.blackWins / opening.totalGames) * 100).toFixed(1) 
        : 0;
    const drawPercent = opening && opening.totalGames > 0 
        ? ((opening.draws / opening.totalGames) * 100).toFixed(1) 
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!opening) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Opening not found</h2>
                <Link to="/openings" className="text-primary-600 hover:underline mt-4 inline-block">
                    ← Back to Openings
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{opening.name} | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="/openings" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg font-mono text-lg">
                                {opening.eco}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {opening.name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-gray-500">
                                Total Games: {opening.totalGames?.toLocaleString()}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                opening.complexity === 'Beginner' ? 'bg-green-100 text-green-800' :
                                opening.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-purple-100 text-purple-800'
                            }`}>
                                {opening.complexity}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                                {opening.category}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{opening.totalGames?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Games</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{whiteWinPercent}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">White Win Rate</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opening.whiteWins?.toLocaleString()} wins</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{blackWinPercent}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Black Win Rate</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opening.blackWins?.toLocaleString()} wins</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{drawPercent}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Draw Rate</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opening.draws?.toLocaleString()} draws</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Win Distribution Pie Chart */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Win Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={winRateData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {winRateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Performance Statistics
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <span>White Wins</span>
                                    <span className="font-mono">{whiteWinPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${whiteWinPercent}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <span>Black Wins</span>
                                    <span className="font-mono">{blackWinPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${blackWinPercent}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <span>Draws</span>
                                    <span className="font-mono">{drawPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${drawPercent}%` }} />
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400 font-semibold">Average Moves</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{opening.averageTurns} moves</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sample Games Tab */}
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
                                onClick={() => setActiveTab('games')}
                                className={`py-4 text-sm font-semibold transition-colors border-b-2 ${
                                    activeTab === 'games'
                                        ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border-transparent'
                                }`}
                            >
                                Sample Games ({sampleGames.length})
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Opening Information</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">ECO Code</span>
                                            <span className="font-mono font-bold text-gray-900 dark:text-white">{opening.eco}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Opening Name</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{opening.name}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Complexity Level</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{opening.complexity}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Category</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{opening.category}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500 dark:text-gray-400 font-semibold">Average Game Length</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{opening.averageTurns} moves</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'games' && (
                            <div>
                                {sampleGames.length > 0 ? (
                                    <div className="overflow-x-auto -mx-6">
                                        <table className="w-full">
                                            <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-800">
                                                <tr>
                                                    <th className="table-header text-left">White</th>
                                                    <th className="table-header text-left">Black</th>
                                                    <th className="table-header text-left">Result</th>
                                                    <th className="table-header text-left">Moves</th>
                                                    <th className="table-header text-left">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                                {sampleGames.map((game) => (
                                                    <tr key={game._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold">
                                                            <Link to={`/players/${game.white?.username}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                                                                {game.white?.username}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold">
                                                            <Link to={`/players/${game.black?.username}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                                                                {game.black?.username}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold">
                                                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md ${
                                                                game.winner === 'white' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                                game.winner === 'black' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                                'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                            }`}>
                                                                {game.winner === 'white' ? 'White Wins' : game.winner === 'black' ? 'Black Wins' : 'Draw'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-300">{game.turns}</td>
                                                        <td className="px-6 py-4.5 whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">{new Date(game.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No sample games available for this opening</p>
                                        <p className="text-sm text-gray-400 mt-2">ECO Code: {ecoCode}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OpeningDetail;
