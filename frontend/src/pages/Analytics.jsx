import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import analyticsService from '../services/analyticsService';
import toast from 'react-hot-toast';

// Custom themed color palette for premium design
const CHART_COLORS = ['#6366f1', '#f43f5e', '#f59e0b']; // Indigo, Rose, Amber
const GRADIENT_COLORS = {
    indigo: '#6366f1',
    emerald: '#10b981',
    rose: '#f43f5e',
    amber: '#f59e0b',
    violet: '#8b5cf6'
};

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
            // Victory distribution
            const victoryRes = await analyticsService.getVictoryDistribution();
            if (victoryRes.data && Array.isArray(victoryRes.data)) {
                const transformed = victoryRes.data.map(item => ({
                    name: item._id === 'white' ? 'White Wins' : 
                          item._id === 'black' ? 'Black Wins' : 'Draws',
                    value: item.count || 0
                }));
                setVictoryData(transformed);
            }

            // Color advantage
            const colorRes = await analyticsService.getColorAdvantage();
            if (colorRes.data) {
                setColorAdvantage(colorRes.data);
            }

            // Checkmate frequency
            const checkmateRes = await analyticsService.getCheckmateFrequency();
            if (checkmateRes.data) {
                setCheckmateData(checkmateRes.data);
            }

            // Monthly games
            const monthlyRes = await analyticsService.getMonthlyGames();
            if (monthlyRes.data && Array.isArray(monthlyRes.data)) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const formatted = monthlyRes.data.slice(-12).map(item => ({
                    name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
                    games: item.games || 0
                }));
                setMonthlyGames(formatted);
            }

            // Yearly games
            const yearlyRes = await analyticsService.getYearlyGames();
            if (yearlyRes.data && Array.isArray(yearlyRes.data)) {
                const formatted = yearlyRes.data.map(item => ({
                    name: item._id.year?.toString() || 'Unknown',
                    games: item.games || 0
                }));
                setYearlyGames(formatted);
            }

            // Top openings
            const openingsRes = await analyticsService.getOpeningSuccess();
            if (openingsRes.data && Array.isArray(openingsRes.data)) {
                const formatted = openingsRes.data.slice(0, 5).map(o => ({
                    name: o.name?.substring(0, 32) + (o.name?.length > 32 ? '...' : ''),
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

    // Calculate totals
    const totalGames = victoryData.reduce((sum, item) => sum + (item.value || 0), 0);
    const whiteWins = victoryData.find(d => d.name === 'White Wins')?.value || 0;
    const blackWins = victoryData.find(d => d.name === 'Black Wins')?.value || 0;
    const draws = victoryData.find(d => d.name === 'Draws')?.value || 0;
    const whiteWinRate = totalGames > 0 ? ((whiteWins / totalGames) * 100).toFixed(1) : 0;
    const blackWinRate = totalGames > 0 ? ((blackWins / totalGames) * 100).toFixed(1) : 0;
    const drawRate = totalGames > 0 ? ((draws / totalGames) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center animate-pulse">
                        <svg className="w-6 h-6 text-white animate-float" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 22H5v-2h14v2M17.16 8.26A8.94 8.94 0 0018 5h-2a7 7 0 01-.59 2.84L12 11.28 8.59 7.84A7 7 0 018 5H6a8.94 8.94 0 00.84 3.26L12 13.43l5.16-5.17M12 2a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1M17 20H7l2-8h6l2 8z" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-primary-500/20 animate-ping"></div>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Crunching stats...</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Analytics | Chess Analytics</title>
            </Helmet>

            <div className="space-y-8 animate-fade-in">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title flex items-center gap-2">
                        <span>📈</span> Analytics Dashboard
                    </h1>
                    <p className="page-subtitle">
                        Advanced data modeling and statistical insight generation
                    </p>
                </div>

                {/* Stats Cards Overhaul */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* White wins card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-950/50 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-indigo-500/10 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">White Win Rate</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">{whiteWinRate}%</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-semibold">{whiteWins.toLocaleString()} wins</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md">
                                ⚪
                            </div>
                        </div>
                    </div>

                    {/* Black wins card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-slate-900 rounded-2xl border border-rose-100 dark:border-rose-950/50 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-rose-500/10 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Black Win Rate</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">{blackWinRate}%</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-semibold">{blackWins.toLocaleString()} wins</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md">
                                ⚫
                            </div>
                        </div>
                    </div>

                    {/* Draw rate card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-slate-900 rounded-2xl border border-amber-100 dark:border-amber-950/50 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-amber-500/10 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Draw Rate</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">{drawRate}%</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-semibold">{draws.toLocaleString()} matches</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                                🤝
                            </div>
                        </div>
                    </div>

                    {/* Checkmate frequency card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/20 dark:to-slate-900 rounded-2xl border border-violet-100 dark:border-violet-950/50 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-violet-500/10 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-violet-500">Checkmate Rate</p>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-mono">{checkmateData?.frequency || 0}%</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-semibold">{checkmateData?.checkmates?.toLocaleString() || 0} mates</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center text-white shadow-md">
                                👑
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Distribution Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Victory distribution pie */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                            Victory Outcome Distribution
                        </h3>
                        {victoryData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={victoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {victoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
                        )}
                    </div>

                    {/* Color Advantage Progress Indicators */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                                Match Outcome Balance
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        <span className="flex items-center gap-1.5">⚪ White Victories</span>
                                        <span className="font-mono">{whiteWinRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${whiteWinRate}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        <span className="flex items-center gap-1.5">⚫ Black Victories</span>
                                        <span className="font-mono">{blackWinRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${blackWinRate}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        <span className="flex items-center gap-1.5">🤝 Draw Outcomes</span>
                                        <span className="font-mono">{drawRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${drawRate}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                            <span>Advantage Focus: <strong className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{whiteWinRate >= blackWinRate ? 'White Setup' : 'Black Setup'}</strong></span>
                            <span>Analyzed Dataset: <strong className="font-mono">{totalGames.toLocaleString()} matches</strong></span>
                        </div>
                    </div>
                </div>

                {/* Historical Trends Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Monthly trend line */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Monthly Matches Activity</h3>
                        {monthlyGames.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyGames}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="games" stroke={GRADIENT_COLORS.indigo} strokeWidth={3} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} name="Matches Played" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
                        )}
                    </div>

                    {/* Yearly distribution bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Annual Match Volume</h3>
                        {yearlyGames.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={yearlyGames}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Bar dataKey="games" fill={GRADIENT_COLORS.emerald} radius={[6, 6, 0, 0]} name="Games Recorded" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
                        )}
                    </div>
                </div>

                {/* Top Opening Variations */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                        Top 5 High-Volume Openings Setup
                    </h3>
                    {topOpenings.length > 0 ? (
                        <div className="space-y-5">
                            {topOpenings.map((opening, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {index + 1}. {opening.name}
                                        </span>
                                        <span className="text-xs font-mono font-bold bg-gray-50 dark:bg-slate-800/30 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800">
                                            {opening.games.toLocaleString()} matches played
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        {/* Progress bar split */}
                                        <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                            <div 
                                                className="bg-indigo-500 h-full transition-all duration-700" 
                                                style={{ width: `${(opening.games / (topOpenings[0]?.games || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                                            <span className="text-emerald-600 dark:text-emerald-400">White Win: {opening.whiteWinRate}%</span>
                                            <span className="text-rose-600 dark:text-rose-400 font-medium">Black Win: {opening.blackWinRate}%</span>
                                        </div>
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
