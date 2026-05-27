import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import analyticsService from '../services/analyticsService';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

function Analytics() {
    const [loading, setLoading] = useState(true);
    const [victoryData, setVictoryData] = useState([]);
    const [colorAdvantage, setColorAdvantage] = useState(null);
    const [monthlyGames, setMonthlyGames] = useState([]);
    const [yearlyGames, setYearlyGames] = useState([]);
    const [topOpenings, setTopOpenings] = useState([]);
    const [checkmateData, setCheckmateData] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch victory distribution - API returns {success, data: [{_id, count}]}
            const victoryRes = await analyticsService.getVictoryDistribution();
            if (victoryRes.data && Array.isArray(victoryRes.data)) {
                const transformed = victoryRes.data.map(item => ({
                    name: item._id === 'white' ? 'White Wins' : 
                          item._id === 'black' ? 'Black Wins' : 'Draws',
                    value: item.count || 0
                }));
                setVictoryData(transformed);
            }

            // Fetch color advantage - API returns {success, data: {whiteWins, blackWins, whiteWinRate, blackWinRate}}
            const colorRes = await analyticsService.getColorAdvantage();
            if (colorRes.data) {
                setColorAdvantage(colorRes.data);
            }

            // Fetch checkmate frequency
            const checkmateRes = await analyticsService.getCheckmateFrequency();
            if (checkmateRes.data) {
                setCheckmateData(checkmateRes.data);
            }

            // Fetch monthly games - API returns {success, data: [{_id: {year, month}, games}]}
            const monthlyRes = await analyticsService.getMonthlyGames();
            if (monthlyRes.data && Array.isArray(monthlyRes.data)) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const formatted = monthlyRes.data.slice(-12).map(item => ({
                    name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
                    games: item.games || 0
                }));
                setMonthlyGames(formatted);
            }

            // Fetch yearly games - API returns {success, data: [{_id: {year}, games}]}
            const yearlyRes = await analyticsService.getYearlyGames();
            if (yearlyRes.data && Array.isArray(yearlyRes.data)) {
                const formatted = yearlyRes.data.map(item => ({
                    name: item._id.year?.toString() || 'Unknown',
                    games: item.games || 0
                }));
                setYearlyGames(formatted);
            }

            // Fetch top openings - API returns {success, data: [opening objects]}
            const openingsRes = await analyticsService.getOpeningSuccess();
            if (openingsRes.data && Array.isArray(openingsRes.data)) {
                const formatted = openingsRes.data.slice(0, 5).map(o => ({
                    name: o.name?.substring(0, 40) + (o.name?.length > 40 ? '...' : ''),
                    games: o.totalGames || 0,
                    whiteWinRate: ((o.whiteWins / o.totalGames) * 100).toFixed(1),
                    blackWinRate: ((o.blackWins / o.totalGames) * 100).toFixed(1)
                }));
                setTopOpenings(formatted);
            }

        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals from victory data
    const totalGames = victoryData.reduce((sum, item) => sum + (item.value || 0), 0);
    const whiteWins = victoryData.find(d => d.name === 'White Wins')?.value || 0;
    const blackWins = victoryData.find(d => d.name === 'Black Wins')?.value || 0;
    const draws = victoryData.find(d => d.name === 'Draws')?.value || 0;
    const whiteWinRate = totalGames > 0 ? ((whiteWins / totalGames) * 100).toFixed(1) : 0;
    const blackWinRate = totalGames > 0 ? ((blackWins / totalGames) * 100).toFixed(1) : 0;
    const drawRate = totalGames > 0 ? ((draws / totalGames) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Analytics | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Comprehensive chess statistics and insights
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">White Win Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{whiteWinRate}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{whiteWins.toLocaleString()} wins</p>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-xl">
                                <span className="text-2xl">⚪</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Black Win Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{blackWinRate}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{blackWins.toLocaleString()} wins</p>
                            </div>
                            <div className="bg-red-500 p-3 rounded-xl">
                                <span className="text-2xl">⚫</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Draw Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{drawRate}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{draws.toLocaleString()} draws</p>
                            </div>
                            <div className="bg-yellow-500 p-3 rounded-xl">
                                <span className="text-2xl">🤝</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checkmate Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{checkmateData?.frequency || 0}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{checkmateData?.checkmates?.toLocaleString() || 0} checkmates</p>
                            </div>
                            <div className="bg-purple-500 p-3 rounded-xl">
                                <span className="text-2xl">♟️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Victory Distribution Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Victory Distribution
                        </h2>
                        {victoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={victoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {victoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>
                        )}
                    </div>

                    {/* Color Advantage Progress Bars */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Color Advantage
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">White Wins</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{whiteWinRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${whiteWinRate}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Black Wins</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{blackWinRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${blackWinRate}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Draws</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{drawRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${drawRate}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Advantage: <span className="font-semibold">{whiteWinRate >= blackWinRate ? 'White' : 'Black'}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Total Games Analyzed: {totalGames.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Time-based Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Games Trend</h3>
                        {monthlyGames.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyGames}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="games" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Yearly Games Distribution</h3>
                        {yearlyGames.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={yearlyGames}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="games" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>
                        )}
                    </div>
                </div>

                {/* Top Openings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Top 5 Most Played Openings
                    </h2>
                    {topOpenings.length > 0 ? (
                        <div className="space-y-4">
                            {topOpenings.map((opening, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {index + 1}. {opening.name}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {opening.games.toLocaleString()} games
                                        </span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-primary-500 h-2 rounded-full"
                                                style={{ width: `${(opening.games / (topOpenings[0]?.games || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 min-w-[60px]">
                                            White: {opening.whiteWinRate}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No data available</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Analytics;
