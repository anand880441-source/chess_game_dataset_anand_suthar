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
            setTotalPages(1);
            setCurrentPage(1);
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
        if (sortBy !== field) return (
            <svg className="w-3 h-3 ml-1 text-gray-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        );
        return sortOrder === 'desc' ? (
            <svg className="w-3 h-3 ml-1 text-primary-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
            </svg>
        ) : (
            <svg className="w-3 h-3 ml-1 text-primary-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
        );
    };

    return (
        <>
            <Helmet>
                <title>Players | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6 animate-fade-in">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="page-header !mb-0">
                        <h1 className="page-title flex items-center gap-2">
                            <span>👥</span> Players Directory
                        </h1>
                        <p className="page-subtitle">
                            Browse and sort active players. Total Registered: <span className="font-semibold text-gray-900 dark:text-white">{totalPlayers.toLocaleString()}</span>
                        </p>
                    </div>
                    
                    {/* Actions & Search */}
                    <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search player username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="input pr-10 py-2 text-sm"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                        <button 
                            onClick={() => { setSearchTerm(''); fetchPlayers(); }} 
                            className="btn-secondary !py-2.5" 
                            title="Reset Directory"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50">
                                    <th onClick={() => handleSort('username')} className="table-header cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors select-none">
                                        Player {getSortIcon('username')}
                                    </th>
                                    <th onClick={() => handleSort('currentRating')} className="table-header cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors select-none">
                                        Rating {getSortIcon('currentRating')}
                                    </th>
                                    <th onClick={() => handleSort('totalGames')} className="table-header cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors select-none">
                                        Games {getSortIcon('totalGames')}
                                    </th>
                                    <th className="table-header">Win Rate</th>
                                    <th className="table-header">Loss Rate</th>
                                    <th className="table-header">Draw Rate</th>
                                    <th className="table-header">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-32 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-16 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-12 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-16 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-16 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-16 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-24 rounded"></div></td>
                                        </tr>
                                    ))
                                ) : players.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="table-cell text-center py-12 text-gray-500">
                                            No players found
                                        </td>
                                    </tr>
                                ) : (
                                    players.map((player) => (
                                        <tr key={player._id} className="table-row">
                                            <td className="table-cell">
                                                <Link to={`/players/${player.username}`} className="flex items-center gap-3 group">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {player.username?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {player.username}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="table-cell font-bold text-gray-900 dark:text-white font-mono">
                                                {player.currentRating}
                                            </td>
                                            <td className="table-cell text-gray-500 dark:text-gray-400">
                                                {player.totalGames}
                                            </td>
                                            <td className="table-cell text-emerald-600 dark:text-emerald-400 font-semibold">
                                                {player.winRate || 0}%
                                            </td>
                                            <td className="table-cell text-red-600 dark:text-red-400 font-medium">
                                                {player.lossRate || 0}%
                                            </td>
                                            <td className="table-cell text-amber-600 dark:text-amber-500 font-medium">
                                                {player.drawRate || 0}%
                                            </td>
                                            <td className="table-cell text-xs text-gray-500 dark:text-gray-400">
                                                {player.lastPlayedAt ? new Date(player.lastPlayedAt).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="skeleton-shimmer h-10 w-10 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="skeleton-shimmer h-4 w-1/3 rounded"></div>
                                            <div className="skeleton-shimmer h-3 w-1/4 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="skeleton-shimmer h-8 rounded"></div>
                                        <div className="skeleton-shimmer h-8 rounded"></div>
                                        <div className="skeleton-shimmer h-8 rounded"></div>
                                    </div>
                                </div>
                            ))
                        ) : players.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No players found
                            </div>
                        ) : (
                            players.map((player) => (
                                <div key={player._id} className="p-4 space-y-3 hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <Link to={`/players/${player.username}`} className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
                                                {player.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{player.username}</h4>
                                                <p className="text-xs text-gray-400">Rating: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{player.currentRating}</span></p>
                                            </div>
                                        </Link>
                                        <span className="text-xs text-gray-400">
                                            {player.lastPlayedAt ? new Date(player.lastPlayedAt).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-slate-800/20 p-2.5 rounded-xl text-center text-xs">
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Games</p>
                                            <p className="font-semibold mt-0.5 text-gray-700 dark:text-gray-300">{player.totalGames}</p>
                                        </div>
                                        <div>
                                            <p className="text-emerald-500/90 text-[10px] uppercase font-bold tracking-wider">Win %</p>
                                            <p className="font-semibold mt-0.5 text-emerald-600 dark:text-emerald-400">{player.winRate || 0}%</p>
                                        </div>
                                        <div>
                                            <p className="text-red-500/90 text-[10px] uppercase font-bold tracking-wider">Loss %</p>
                                            <p className="font-semibold mt-0.5 text-red-600 dark:text-red-400">{player.lossRate || 0}%</p>
                                        </div>
                                        <div>
                                            <p className="text-amber-500/90 text-[10px] uppercase font-bold tracking-wider">Draw %</p>
                                            <p className="font-semibold mt-0.5 text-amber-600 dark:text-amber-400">{player.drawRate || 0}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Enhanced Pagination Footer */}
                    {!loading && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20 dark:bg-slate-900/10">
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * limit, totalPlayers)}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPlayers.toLocaleString()}</span> players
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="btn-secondary !p-2 disabled:opacity-40"
                                    title="First Page"
                                >
                                    «
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="btn-secondary !p-2 disabled:opacity-40"
                                    title="Previous"
                                >
                                    ‹
                                </button>
                                
                                <span className="px-4 py-1.5 text-xs sm:text-sm font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl border border-primary-100 dark:border-primary-900/30">
                                    Page {currentPage} of {totalPages}
                                </span>
                                
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn-secondary !p-2 disabled:opacity-40"
                                    title="Next"
                                >
                                    ›
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="btn-secondary !p-2 disabled:opacity-40"
                                    title="Last Page"
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Players;
