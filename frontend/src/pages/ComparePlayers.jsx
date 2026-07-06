import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import playerService from '../services/playerService';
import toast from 'react-hot-toast';

function ComparePlayers() {
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [searchTerm1, setSearchTerm1] = useState('');
    const [searchTerm2, setSearchTerm2] = useState('');
    const [searchResults1, setSearchResults1] = useState([]);
    const [searchResults2, setSearchResults2] = useState([]);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonData, setComparisonData] = useState(null);
    
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
                setShowDropdown1(false);
            }
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                setShowDropdown2(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search players when typing
    useEffect(() => {
        if (searchTerm1.length >= 2) {
            searchPlayers(searchTerm1, setSearchResults1);
            setShowDropdown1(true);
        } else {
            setSearchResults1([]);
            setShowDropdown1(false);
        }
    }, [searchTerm1]);

    useEffect(() => {
        if (searchTerm2.length >= 2) {
            searchPlayers(searchTerm2, setSearchResults2);
            setShowDropdown2(true);
        } else {
            setSearchResults2([]);
            setShowDropdown2(false);
        }
    }, [searchTerm2]);

    const searchPlayers = async (term, setResults) => {
        try {
            const response = await playerService.getAll({ limit: 100 });
            if (response.success && response.data) {
                const filtered = response.data.filter(p => 
                    p.username?.toLowerCase().includes(term.toLowerCase())
                );
                setResults(filtered.slice(0, 8));
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleCompare = async () => {
        if (!player1 || !player2) {
            toast.error('Please select two players to compare');
            return;
        }

        if (player1.username === player2.username) {
            toast.error('Please select two different players');
            return;
        }

        setIsComparing(true);
        try {
            const response = await playerService.compare(player1.username, player2.username);
            if (response.success) {
                setComparisonData(response.comparison);
                toast.success('Statistical analysis ready!');
            }
        } catch (error) {
            console.error('Comparison error:', error);
            toast.error('Failed to compare players');
        } finally {
            setIsComparing(false);
        }
    };

    const selectPlayer = (player, isPlayer1) => {
        if (isPlayer1) {
            setPlayer1(player);
            setSearchTerm1(player.username);
            setShowDropdown1(false);
        } else {
            setPlayer2(player);
            setSearchTerm2(player.username);
            setShowDropdown2(false);
        }
        setComparisonData(null);
    };

    const clearPlayer = (isPlayer1) => {
        if (isPlayer1) {
            setPlayer1(null);
            setSearchTerm1('');
            setSearchResults1([]);
        } else {
            setPlayer2(null);
            setSearchTerm2('');
            setSearchResults2([]);
        }
        setComparisonData(null);
    };

    // Prepare radar chart data
    const radarData = comparisonData ? [
        { metric: 'Rating', [comparisonData.player1?.username || 'Player 1']: comparisonData.player1?.rating || 0, [comparisonData.player2?.username || 'Player 2']: comparisonData.player2?.rating || 0 },
        { metric: 'Total Games', [comparisonData.player1?.username || 'Player 1']: comparisonData.player1?.totalGames || 0, [comparisonData.player2?.username || 'Player 2']: comparisonData.player2?.totalGames || 0 },
        { metric: 'Win Rate %', [comparisonData.player1?.username || 'Player 1']: parseFloat(comparisonData.player1?.winRate) || 0, [comparisonData.player2?.username || 'Player 2']: parseFloat(comparisonData.player2?.winRate) || 0 },
        { metric: 'Loss Rate %', [comparisonData.player1?.username || 'Player 1']: parseFloat(comparisonData.player1?.lossRate) || 0, [comparisonData.player2?.username || 'Player 2']: parseFloat(comparisonData.player2?.lossRate) || 0 },
        { metric: 'Draw Rate %', [comparisonData.player1?.username || 'Player 1']: parseFloat(comparisonData.player1?.drawRate) || 0, [comparisonData.player2?.username || 'Player 2']: parseFloat(comparisonData.player2?.drawRate) || 0 }
    ] : [];

    const isCompareDisabled = !player1 || !player2 || player1.username === player2.username;

    return (
        <>
            <Helmet>
                <title>Compare Players | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6 animate-fade-in">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title flex items-center gap-2">
                        <span>🔄</span> Compare Players
                    </h1>
                    <p className="page-subtitle">
                        Analyze head-to-head match stats and performance radar maps
                    </p>
                </div>

                {/* Player Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Player 1 Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between relative">
                        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Player Selection 1</h2>
                        
                        {player1 ? (
                            <div className="flex items-center justify-between p-4 bg-primary-500/5 dark:bg-primary-950/10 border border-primary-500/10 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                        {player1.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{player1.username}</p>
                                        <p className="text-xs text-gray-500">ELO Rating: <strong className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{player1.currentRating}</strong></p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => clearPlayer(true)} 
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef1}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm1}
                                        onChange={(e) => setSearchTerm1(e.target.value)}
                                        onFocus={() => searchTerm1.length >= 2 && setShowDropdown1(true)}
                                        placeholder="Type player username..."
                                        className="w-full input pl-10"
                                    />
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                </div>
                                
                                {showDropdown1 && searchResults1.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800 animate-fade-in">
                                        {searchResults1.map(player => (
                                            <div
                                                key={player._id}
                                                onClick={() => selectPlayer(player, true)}
                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                                            >
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{player.username}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Rating: {player.currentRating} • Games: {player.totalGames}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showDropdown1 && searchTerm1.length >= 2 && searchResults1.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg p-4 text-center text-xs text-gray-500">
                                        No players matched "{searchTerm1}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Player 2 Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between relative">
                        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Player Selection 2</h2>
                        
                        {player2 ? (
                            <div className="flex items-center justify-between p-4 bg-accent-500/5 dark:bg-accent-950/10 border border-accent-500/10 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                        {player2.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{player2.username}</p>
                                        <p className="text-xs text-gray-500">ELO Rating: <strong className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{player2.currentRating}</strong></p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => clearPlayer(false)} 
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef2}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm2}
                                        onChange={(e) => setSearchTerm2(e.target.value)}
                                        onFocus={() => searchTerm2.length >= 2 && setShowDropdown2(true)}
                                        placeholder="Type player username..."
                                        className="w-full input pl-10"
                                    />
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                </div>
                                
                                {showDropdown2 && searchResults2.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800 animate-fade-in">
                                        {searchResults2.map(player => (
                                            <div
                                                key={player._id}
                                                onClick={() => selectPlayer(player, false)}
                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                                            >
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{player.username}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Rating: {player.currentRating} • Games: {player.totalGames}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showDropdown2 && searchTerm2.length >= 2 && searchResults2.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg p-4 text-center text-xs text-gray-500">
                                        No players matched "{searchTerm2}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Compare Action Trigger */}
                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleCompare}
                        disabled={isCompareDisabled || isComparing}
                        className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                            isCompareDisabled
                                ? 'bg-gray-100 dark:bg-slate-900 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed shadow-none'
                                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20 hover:shadow-lg active:scale-[0.98]'
                        }`}
                    >
                        {isComparing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Modeling comparison...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Compare Statistical Models
                            </>
                        )}
                    </button>
                </div>

                {/* Head-to-Head Comparison Output */}
                {comparisonData && (
                    <div className="space-y-8 animate-slide-up">
                        {/* Winner/Advantage Banner */}
                        <div className={`p-5 rounded-2xl text-center border font-bold text-sm sm:text-base flex items-center justify-center gap-2 ${
                            comparisonData.advantage === comparisonData.player1?.username 
                                ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                                : 'bg-accent-500/5 text-accent-600 dark:text-accent-400 border-accent-500/10'
                        }`}>
                            <span>🏆</span> 
                            <span>Advantage Model: <strong className="uppercase tracking-wider font-extrabold">{comparisonData.advantage}</strong></span>
                        </div>

                        {/* Head-to-Head Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Player 1 details */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between transition-all hover:shadow-card-hover">
                                <div className="text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                                        {comparisonData.player1?.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 truncate">{comparisonData.player1?.username}</h3>
                                    <p className="text-3xl font-black text-primary-600 dark:text-primary-400 mt-1.5 font-mono">{comparisonData.player1?.rating}</p>
                                </div>
                                <div className="space-y-4 pt-5 text-sm">
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Total Games</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-200 font-mono">{comparisonData.player1?.totalGames}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Win Rate</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{comparisonData.player1?.winRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Loss Rate</span>
                                        <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{comparisonData.player1?.lossRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Draw Rate</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-500 font-mono">{comparisonData.player1?.drawRate}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Player 2 details */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between transition-all hover:shadow-card-hover">
                                <div className="text-center pb-5 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                                        {comparisonData.player2?.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 truncate">{comparisonData.player2?.username}</h3>
                                    <p className="text-3xl font-black text-accent-600 dark:text-accent-400 mt-1.5 font-mono">{comparisonData.player2?.rating}</p>
                                </div>
                                <div className="space-y-4 pt-5 text-sm">
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Total Games</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-200 font-mono">{comparisonData.player2?.totalGames}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Win Rate</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{comparisonData.player2?.winRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Loss Rate</span>
                                        <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{comparisonData.player2?.lossRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-50/50 dark:border-gray-800/30">
                                        <span className="text-gray-400 font-semibold">Draw Rate</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-500 font-mono">{comparisonData.player2?.drawRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Radar Chart */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6 flex flex-col justify-between">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Metric Performance Radar</h3>
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={radarData}>
                                            <PolarGrid stroke="rgba(156, 163, 175, 0.15)" />
                                            <PolarAngleAxis dataKey="metric" stroke="#9ca3af" fontSize={11} />
                                            <PolarRadiusAxis stroke="rgba(156, 163, 175, 0.2)" />
                                            <Radar 
                                                name={comparisonData.player1?.username || 'Player 1'} 
                                                dataKey={comparisonData.player1?.username || 'Player 1'} 
                                                stroke="#6366f1" 
                                                fill="#6366f1" 
                                                fillOpacity={0.25} 
                                            />
                                            <Radar 
                                                name={comparisonData.player2?.username || 'Player 2'} 
                                                dataKey={comparisonData.player2?.username || 'Player 2'} 
                                                stroke="#f59e0b" 
                                                fill="#f59e0b" 
                                                fillOpacity={0.25} 
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/80 p-6 flex flex-col justify-between">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Direct Attribute Analysis</h3>
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={radarData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                            <XAxis dataKey="metric" stroke="#9ca3af" fontSize={11} tickLine={false} />
                                            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                            <Bar dataKey={comparisonData.player1?.username || 'Player 1'} fill="#6366f1" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey={comparisonData.player2?.username || 'Player 2'} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ComparePlayers;
