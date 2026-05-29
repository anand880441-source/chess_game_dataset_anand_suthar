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
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl font-bold text-blue-600">{opening.totalGames?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total Games</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl font-bold text-green-600">{whiteWinPercent}%</p>
                        <p className="text-sm text-gray-500">White Win Rate</p>
                        <p className="text-xs text-gray-400">{opening.whiteWins?.toLocaleString()} wins</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl font-bold text-red-600">{blackWinPercent}%</p>
                        <p className="text-sm text-gray-500">Black Win Rate</p>
                        <p className="text-xs text-gray-400">{opening.blackWins?.toLocaleString()} wins</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl font-bold text-yellow-600">{drawPercent}%</p>
                        <p className="text-sm text-gray-500">Draw Rate</p>
                        <p className="text-xs text-gray-400">{opening.draws?.toLocaleString()} draws</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Win Distribution Pie Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Performance Statistics
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600">White Wins</span>
                                    <span className="text-sm font-semibold">{whiteWinPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${whiteWinPercent}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600">Black Wins</span>
                                    <span className="text-sm font-semibold">{blackWinPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${blackWinPercent}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600">Draws</span>
                                    <span className="text-sm font-semibold">{drawPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${drawPercent}%` }} />
                                </div>
                            </div>
                            <div className="pt-4 mt-2 border-t">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Average Moves</span>
                                    <span className="font-semibold">{opening.averageTurns} moves</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sample Games Tab */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-3 text-sm font-medium transition-colors ${
                                    activeTab === 'overview'
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('games')}
                                className={`py-3 text-sm font-medium transition-colors ${
                                    activeTab === 'games'
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
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
                                    <h3 className="text-lg font-semibold mb-3">Opening Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">ECO Code</span>
                                            <span className="font-mono font-semibold">{opening.eco}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Opening Name</span>
                                            <span className="font-semibold">{opening.name}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Complexity Level</span>
                                            <span className="font-semibold">{opening.complexity}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Category</span>
                                            <span className="font-semibold">{opening.category}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Average Game Length</span>
                                            <span className="font-semibold">{opening.averageTurns} moves</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'games' && (
                            <div>
                                {sampleGames.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium">White</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium">Black</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium">Result</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium">Moves</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {sampleGames.map((game) => (
                                                    <tr key={game._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-2">
                                                            <Link to={`/players/${game.white?.username}`} className="text-primary-600 hover:underline">
                                                                {game.white?.username}
                                                            </Link>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <Link to={`/players/${game.black?.username}`} className="text-primary-600 hover:underline">
                                                                {game.black?.username}
                                                            </Link>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                game.winner === 'white' ? 'bg-green-100 text-green-800' :
                                                                game.winner === 'black' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {game.winner === 'white' ? 'White Wins' : game.winner === 'black' ? 'Black Wins' : 'Draw'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-gray-600">{game.turns}</td>
                                                        <td className="px-4 py-2 text-gray-500 text-sm">{new Date(game.createdAt).toLocaleDateString()}</td>
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
