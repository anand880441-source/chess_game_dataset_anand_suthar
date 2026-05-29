import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ArrowsRightLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
            const response = await playerService.getAll({ limit: 50 });
            if (response.success && response.data) {
                const filtered = response.data.filter(p => 
                    p.username?.toLowerCase().includes(term.toLowerCase())
                );
                setResults(filtered.slice(0, 10));
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
                toast.success('Comparison ready!');
            }
        } catch (error) {
            console.error('Comparison error:', error);
            toast.error('Failed to compare players');
        } finally {
            setIsComparing(false);
        }
    };

    const [comparisonData, setComparisonData] = useState(null);

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
        { metric: 'Rating', player1: comparisonData.player1?.rating || 0, player2: comparisonData.player2?.rating || 0 },
        { metric: 'Total Games', player1: comparisonData.player1?.totalGames || 0, player2: comparisonData.player2?.totalGames || 0 },
        { metric: 'Win Rate %', player1: parseFloat(comparisonData.player1?.winRate) || 0, player2: parseFloat(comparisonData.player2?.winRate) || 0 },
        { metric: 'Loss Rate %', player1: parseFloat(comparisonData.player1?.lossRate) || 0, player2: parseFloat(comparisonData.player2?.lossRate) || 0 },
        { metric: 'Draw Rate %', player1: parseFloat(comparisonData.player1?.drawRate) || 0, player2: parseFloat(comparisonData.player2?.drawRate) || 0 }
    ] : [];

    const isCompareDisabled = !player1 || !player2 || player1.username === player2.username;

    return (
        <>
            <Helmet>
                <title>Compare Players | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Players</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Compare two chess players side by side</p>
                </div>

                {/* Player Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Player 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Player 1</h2>
                        {player1 ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
                                        {player1.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{player1.username}</p>
                                        <p className="text-sm text-gray-500">Rating: {player1.currentRating}</p>
                                    </div>
                                </div>
                                <button onClick={() => clearPlayer(true)} className="text-gray-400 hover:text-red-500">
                                    <XMarkIcon className="w-5 h-5" />
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
                                        placeholder="Type at least 2 characters..."
                                        className="w-full input pl-10"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {showDropdown1 && searchResults1.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {searchResults1.map(player => (
                                            <div
                                                key={player._id}
                                                onClick={() => selectPlayer(player, true)}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                <p className="font-medium text-gray-900 dark:text-white">{player.username}</p>
                                                <p className="text-sm text-gray-500">Rating: {player.currentRating} • Games: {player.totalGames}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showDropdown1 && searchTerm1.length >= 2 && searchResults1.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500">
                                        No players found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Player 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Player 2</h2>
                        {player2 ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                                        {player2.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{player2.username}</p>
                                        <p className="text-sm text-gray-500">Rating: {player2.currentRating}</p>
                                    </div>
                                </div>
                                <button onClick={() => clearPlayer(false)} className="text-gray-400 hover:text-red-500">
                                    <XMarkIcon className="w-5 h-5" />
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
                                        placeholder="Type at least 2 characters..."
                                        className="w-full input pl-10"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {showDropdown2 && searchResults2.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {searchResults2.map(player => (
                                            <div
                                                key={player._id}
                                                onClick={() => selectPlayer(player, false)}
                                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                <p className="font-medium text-gray-900 dark:text-white">{player.username}</p>
                                                <p className="text-sm text-gray-500">Rating: {player.currentRating} • Games: {player.totalGames}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {showDropdown2 && searchTerm2.length >= 2 && searchResults2.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500">
                                        No players found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Compare Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleCompare}
                        disabled={isCompareDisabled || isComparing}
                        className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                            isCompareDisabled
                                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                    >
                        <ArrowsRightLeftIcon className="w-5 h-5" />
                        {isComparing ? 'Comparing...' : 'Compare Players'}
                    </button>
                </div>

                {/* Comparison Results */}
                {comparisonData && (
                    <div className="space-y-6">
                        <div className={`p-4 rounded-lg text-center ${
                            comparisonData.advantage === comparisonData.player1?.username 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        }`}>
                            <p className="text-lg font-semibold">🏆 {comparisonData.advantage} has the advantage!</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
                                        {comparisonData.player1?.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <h2 className="text-xl font-bold mt-2">{comparisonData.player1?.username}</h2>
                                    <p className="text-3xl font-bold text-primary-600">{comparisonData.player1?.rating}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Total Games</span>
                                        <span className="font-semibold">{comparisonData.player1?.totalGames}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Win Rate</span>
                                        <span className="font-semibold text-green-600">{comparisonData.player1?.winRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Loss Rate</span>
                                        <span className="font-semibold text-red-600">{comparisonData.player1?.lossRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Draw Rate</span>
                                        <span className="font-semibold text-yellow-600">{comparisonData.player1?.drawRate}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                                        {comparisonData.player2?.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <h2 className="text-xl font-bold mt-2">{comparisonData.player2?.username}</h2>
                                    <p className="text-3xl font-bold text-secondary-600">{comparisonData.player2?.rating}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Total Games</span>
                                        <span className="font-semibold">{comparisonData.player2?.totalGames}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Win Rate</span>
                                        <span className="font-semibold text-green-600">{comparisonData.player2?.winRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Loss Rate</span>
                                        <span className="font-semibold text-red-600">{comparisonData.player2?.lossRate}%</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Draw Rate</span>
                                        <span className="font-semibold text-yellow-600">{comparisonData.player2?.drawRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Performance Radar</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <RadarChart data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="metric" />
                                    <PolarRadiusAxis />
                                    <Radar name={comparisonData.player1?.username} dataKey="player1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                                    <Radar name={comparisonData.player2?.username} dataKey="player2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                    <Tooltip />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Statistics Comparison</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={radarData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="metric" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="player1" name={comparisonData.player1?.username} fill="#6366f1" />
                                    <Bar dataKey="player2" name={comparisonData.player2?.username} fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ComparePlayers;
