import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import playerService from '../services/playerService';
import toast from 'react-hot-toast';

function Players() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [sortBy, setSortBy] = useState('currentRating');
    const [sortOrder, setSortOrder] = useState('desc');

    const limit = 20;

    useEffect(() => {
        fetchPlayers();
    }, [currentPage, sortBy, sortOrder]);

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: limit,
                sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy
            };
            
            const response = await playerService.getAll(params);
            setPlayers(response.data || []);
            setTotalPlayers(response.total || 0);
            setTotalPages(Math.ceil((response.total || 0) / limit));
        } catch (error) {
            console.error('Error fetching players:', error);
            toast.error('Failed to load players');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchPlayers();
            return;
        }
        
        setLoading(true);
        try {
            const allPlayers = await playerService.getAll({ limit: 1000 });
            const filtered = allPlayers.data?.filter(p => 
                p.username?.toLowerCase().includes(searchTerm.toLowerCase())
            ) || [];
            setPlayers(filtered);
            setTotalPlayers(filtered.length);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return '↕️';
        return sortOrder === 'desc' ? '↓' : '↑';
    };

    return (
        <>
            <Helmet>
                <title>Players | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Players Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Total Players: {totalPlayers.toLocaleString()}
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="input pr-10"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                🔍
                            </button>
                        </div>
                        <button onClick={fetchPlayers} className="btn-secondary">🔄</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th onClick={() => handleSort('username')} className="px-4 py-3 text-left text-xs font-medium cursor-pointer">
                                        Player {getSortIcon('username')}
                                    </th>
                                    <th onClick={() => handleSort('currentRating')} className="px-4 py-3 text-left text-xs font-medium cursor-pointer">
                                        Rating {getSortIcon('currentRating')}
                                    </th>
                                    <th onClick={() => handleSort('totalGames')} className="px-4 py-3 text-left text-xs font-medium cursor-pointer">
                                        Games {getSortIcon('totalGames')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium">Win Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium">Loss Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium">Draw Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium">Last Played</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        </tr>
                                    ))
                                ) : players.length === 0 ? (
                                    <tr><td colSpan="7" className="px-4 py-8 text-center">No players found</td></tr>
                                ) : (
                                    players.map((player) => (
                                        <tr key={player._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3">
                                                <Link to={`/players/${player.username}`} className="text-primary-600 hover:underline font-medium">
                                                    {player.username}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 font-semibold">{player.currentRating}</td>
                                            <td className="px-4 py-3">{player.totalGames}</td>
                                            <td className="px-4 py-3 text-green-600">{player.winRate || 0}%</td>
                                            <td className="px-4 py-3 text-red-600">{player.lossRate || 0}%</td>
                                            <td className="px-4 py-3 text-yellow-600">{player.drawRate || 0}%</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{player.lastPlayedAt ? new Date(player.lastPlayedAt).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && totalPages > 1 && (
                        <div className="px-4 py-3 border-t flex items-center justify-between flex-wrap gap-2">
                            <div className="text-sm text-gray-500">Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalPlayers)} of {totalPlayers} players</div>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary px-3 py-1 disabled:opacity-50">Previous</button>
                                <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary px-3 py-1 disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Players;
