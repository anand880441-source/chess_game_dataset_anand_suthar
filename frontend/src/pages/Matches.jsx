import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';
import toast from 'react-hot-toast';

function Matches() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMatches, setTotalMatches] = useState(0);
    const [filters, setFilters] = useState({
        winner: '',
        rated: '',
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const limit = 15;

    useEffect(() => {
        fetchMatches();
    }, [currentPage, sortBy, sortOrder, filters]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: limit,
                sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy
            };
            
            if (filters.winner) params.winner = filters.winner;
            if (filters.rated !== '') params.rated = filters.rated;
            
            const response = await gameService.getAll(params);
            setMatches(response.data || []);
            setTotalMatches(response.total || 0);
            setTotalPages(Math.ceil((response.total || 0) / limit));
        } catch (error) {
            console.error('Error fetching matches:', error);
            toast.error('Failed to load matches');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
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

    const getWinnerBadge = (winner, white, black) => {
        if (winner === 'white') {
            return <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">White Wins</span>;
        } else if (winner === 'black') {
            return <span className="text-rose-600 dark:text-rose-400 font-semibold text-xs bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded-lg">Black Wins</span>;
        }
        return <span className="text-amber-600 dark:text-amber-500 font-semibold text-xs bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg">Draw</span>;
    };

    const getVictoryBadge = (status) => {
        const badges = {
            'mate': 'badge-purple',
            'resign': 'badge-warning',
            'outoftime': 'badge-danger',
            'draw': 'badge-info'
        };
        return (
            <span className={`badge ${badges[status] || 'bg-gray-100 dark:bg-gray-800'}`}>
                {status || 'Unknown'}
            </span>
        );
    };

    return (
        <>
            <Helmet>
                <title>Matches | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="page-header !mb-0">
                        <h1 className="page-title flex items-center gap-2">
                            <span>♟️</span> Matches History
                        </h1>
                        <p className="page-subtitle">
                            Search and dissect historical chess matches. Total Database: <span className="font-semibold text-gray-900 dark:text-white">{totalMatches.toLocaleString()}</span>
                        </p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto w-full lg:w-auto">
                        <select
                            value={filters.winner}
                            onChange={(e) => handleFilterChange('winner', e.target.value)}
                            className="input !py-2 !px-3 text-xs w-32 focus:ring-primary-500/20"
                        >
                            <option value="">All Winners</option>
                            <option value="white">White Wins</option>
                            <option value="black">Black Wins</option>
                            <option value="draw">Draw</option>
                        </select>
                        <select
                            value={filters.rated}
                            onChange={(e) => handleFilterChange('rated', e.target.value)}
                            className="input !py-2 !px-3 text-xs w-32 focus:ring-primary-500/20"
                        >
                            <option value="">All Matches</option>
                            <option value="true">Rated</option>
                            <option value="false">Casual</option>
                        </select>
                        {(filters.winner || filters.rated !== '') && (
                            <button
                                onClick={() => {
                                    setFilters({ winner: '', rated: '' });
                                    setCurrentPage(1);
                                }}
                                className="btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Matches Content Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                    
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50">
                                    <th className="table-header cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors" onClick={() => handleSort('createdAt')}>
                                        Date {getSortIcon('createdAt')}
                                    </th>
                                    <th className="table-header">White Player</th>
                                    <th className="table-header">Black Player</th>
                                    <th className="table-header cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors" onClick={() => handleSort('winner')}>
                                        Winner {getSortIcon('winner')}
                                    </th>
                                    <th className="table-header cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors" onClick={() => handleSort('turns')}>
                                        Moves {getSortIcon('turns')}
                                    </th>
                                    <th className="table-header">Victory</th>
                                    <th className="table-header">Opening Setup</th>
                                    <th className="table-header text-center">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-20 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-32 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-32 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-6 w-20 rounded-full"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-12 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-6 w-16 rounded-full"></div></td>
                                            <td className="table-cell">
                                                <div className="space-y-1.5">
                                                    <div className="skeleton-shimmer h-4 w-40 rounded"></div>
                                                    <div className="skeleton-shimmer h-3 w-16 rounded"></div>
                                                </div>
                                            </td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-12 mx-auto rounded"></div></td>
                                        </tr>
                                    ))
                                ) : matches.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="table-cell text-center py-12 text-gray-500">
                                            No matches found matching your filters
                                        </td>
                                    </tr>
                                ) : (
                                    matches.map((match) => (
                                        <tr 
                                            key={match._id} 
                                            className="table-row cursor-pointer" 
                                            onClick={() => navigate(`/matches/${match.gameId}`)}
                                        >
                                            <td className="table-cell text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(match.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="table-cell font-medium">
                                                <Link 
                                                    to={`/players/${match.white?.username}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 font-semibold flex items-center gap-1.5"
                                                >
                                                    <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-400 font-bold">W</div>
                                                    {match.white?.username}
                                                </Link>
                                                <span className="text-[10px] font-mono text-gray-400 block mt-0.5">Rating: {match.white?.rating}</span>
                                            </td>
                                            <td className="table-cell font-medium">
                                                <Link 
                                                    to={`/players/${match.black?.username}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 font-semibold flex items-center gap-1.5"
                                                >
                                                    <div className="w-5 h-5 rounded bg-gray-900 dark:bg-gray-600 flex items-center justify-center text-[10px] text-white font-bold">B</div>
                                                    {match.black?.username}
                                                </Link>
                                                <span className="text-[10px] font-mono text-gray-400 block mt-0.5">Rating: {match.black?.rating}</span>
                                            </td>
                                            <td className="table-cell">
                                                {getWinnerBadge(match.winner)}
                                            </td>
                                            <td className="table-cell font-mono text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                {match.turns}
                                            </td>
                                            <td className="table-cell">
                                                {getVictoryBadge(match.victoryStatus)}
                                            </td>
                                            <td className="table-cell">
                                                <div className="text-xs">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block truncate max-w-[200px]" title={match.opening?.name}>
                                                        {match.opening?.name || 'Unknown Opening'}
                                                    </span>
                                                    <span className="font-mono text-gray-400 text-[10px]">{match.opening?.eco || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="table-cell text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md ${match.rated ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                    {match.rated ? 'Rated' : 'Casual'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="skeleton-shimmer h-4 w-20 rounded"></div>
                                        <div className="skeleton-shimmer h-4 w-12 rounded"></div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="skeleton-shimmer h-12 flex-1 rounded-xl"></div>
                                        <div className="skeleton-shimmer h-12 flex-1 rounded-xl"></div>
                                    </div>
                                </div>
                            ))
                        ) : matches.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No matches found matching your filters
                            </div>
                        ) : (
                            matches.map((match) => {
                                // Determine card border based on match result
                                const resultBorderClass = 
                                    match.winner === 'white' ? 'border-l-4 border-l-emerald-500' : 
                                    match.winner === 'black' ? 'border-l-4 border-l-rose-500' : 
                                    'border-l-4 border-l-amber-500';

                                return (
                                    <div 
                                        key={match._id} 
                                        onClick={() => navigate(`/matches/${match.gameId}`)}
                                        className={`p-4 space-y-3.5 hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-all ${resultBorderClass} cursor-pointer`}
                                    >
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{new Date(match.createdAt).toLocaleDateString()}</span>
                                            <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded-md ${match.rated ? 'bg-primary-500/10 text-primary-500' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                                                {match.rated ? 'RATED' : 'CASUAL'}
                                            </span>
                                        </div>

                                        {/* Player vs Player grid */}
                                        <div className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-slate-800/10 p-3 rounded-xl">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-bold flex-shrink-0">W</div>
                                                <div className="truncate">
                                                    <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{match.white?.username}</p>
                                                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">Rating: {match.white?.rating}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="text-gray-400 font-bold text-xs px-2">VS</div>
                                            
                                            <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse text-right">
                                                <div className="w-7 h-7 rounded bg-gray-900 dark:bg-gray-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">B</div>
                                                <div className="truncate">
                                                    <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{match.black?.username}</p>
                                                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">Rating: {match.black?.rating}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details row */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                {getWinnerBadge(match.winner)}
                                                {getVictoryBadge(match.victoryStatus)}
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[150px] inline-block align-middle" title={match.opening?.name}>
                                                    {match.opening?.name || 'Unknown Opening'}
                                                </span>
                                                <span className="text-[10px] font-mono text-gray-400 ml-1.5">({match.turns} turns)</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20 dark:bg-slate-900/10">
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * limit, totalMatches)}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalMatches.toLocaleString()}</span> matches
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

export default Matches;
