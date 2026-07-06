import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import openingService from '../services/openingService';
import toast from 'react-hot-toast';

function Openings() {
    const [openings, setOpenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOpenings, setTotalOpenings] = useState(0);
    const [sortBy, setSortBy] = useState('totalGames');
    const [sortOrder, setSortOrder] = useState('desc');

    const limit = 20;

    useEffect(() => {
        fetchOpenings();
    }, [currentPage, sortBy, sortOrder]);

    const fetchOpenings = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: limit,
                sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy
            };
            
            const response = await openingService.getAll(params);
            setOpenings(response.data || []);
            setTotalOpenings(response.total || 0);
            setTotalPages(Math.ceil((response.total || 0) / limit));
        } catch (error) {
            console.error('Error fetching openings:', error);
            toast.error('Failed to load openings');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchOpenings();
            return;
        }
        
        setLoading(true);
        try {
            const response = await openingService.search(searchTerm);
            setOpenings(response.data || []);
            setTotalOpenings(response.data?.length || 0);
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

    const getComplexityBadge = (complexity) => {
        const badges = {
            'Beginner': 'badge-success',
            'Intermediate': 'badge-warning',
            'Advanced': 'badge-purple',
            'Expert': 'badge-danger',
        };
        return (
            <span className={`badge ${badges[complexity] || 'bg-gray-100 dark:bg-gray-800 text-gray-700'}`}>
                {complexity || 'Standard'}
            </span>
        );
    };

    return (
        <>
            <Helmet>
                <title>Openings | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6 animate-fade-in">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="page-header !mb-0">
                        <h1 className="page-title flex items-center gap-2">
                            <span>📚</span> Chess Openings theory
                        </h1>
                        <p className="page-subtitle">
                            Explore openings and analyze white/black success rates. Total database: <span className="font-semibold text-gray-900 dark:text-white">{totalOpenings.toLocaleString()}</span>
                        </p>
                    </div>
                    
                    {/* Actions & Search */}
                    <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Search opening name or ECO..."
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
                            onClick={() => { setSearchTerm(''); fetchOpenings(); }} 
                            className="btn-secondary !py-2.5" 
                            title="Reset Database"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Database Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                    
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50">
                                    <th className="table-header w-24">ECO</th>
                                    <th className="table-header">Opening Name</th>
                                    <th onClick={() => handleSort('totalGames')} className="table-header cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors" style={{ width: '130px' }}>
                                        Total Games {getSortIcon('totalGames')}
                                    </th>
                                    <th onClick={() => handleSort('whiteWins')} className="table-header cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors" style={{ width: '120px' }}>
                                        White Wins {getSortIcon('whiteWins')}
                                    </th>
                                    <th onClick={() => handleSort('blackWins')} className="table-header cursor-pointer select-none hover:bg-gray-100/50 dark:hover:bg-slate-800/30 transition-colors" style={{ width: '120px' }}>
                                        Black Wins {getSortIcon('blackWins')}
                                    </th>
                                    <th className="table-header">Win Distribution</th>
                                    <th className="table-header w-28">Avg. Moves</th>
                                    <th className="table-header w-28">Complexity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-12 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-60 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-16 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-12 rounded text-green-500"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-12 rounded text-red-500"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-40 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-5 w-8 rounded"></div></td>
                                            <td className="table-cell"><div className="skeleton-shimmer h-6 w-16 rounded-full"></div></td>
                                        </tr>
                                    ))
                                ) : openings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="table-cell text-center py-12 text-gray-500">
                                            No openings found matching your search
                                        </td>
                                    </tr>
                                ) : (
                                    openings.map((opening) => {
                                        const whiteWinPercent = opening.totalGames > 0 ? ((opening.whiteWins / opening.totalGames) * 100).toFixed(1) : 0;
                                        const blackWinPercent = opening.totalGames > 0 ? ((opening.blackWins / opening.totalGames) * 100).toFixed(1) : 0;
                                        
                                        return (
                                            <tr key={opening._id} className="table-row">
                                                <td className="table-cell">
                                                    <Link to={`/openings/${opening.eco}`} className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-2 py-1 rounded-md border border-primary-100/50 dark:border-primary-900/10 hover:underline">
                                                        {opening.eco}
                                                    </Link>
                                                </td>
                                                <td className="table-cell">
                                                    <Link to={`/openings/${opening.eco}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors block truncate max-w-sm" title={opening.name}>
                                                        {opening.name}
                                                    </Link>
                                                </td>
                                                <td className="table-cell font-medium text-gray-700 dark:text-gray-300 font-mono">
                                                    {opening.totalGames.toLocaleString()}
                                                </td>
                                                <td className="table-cell font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                                                    {opening.whiteWins.toLocaleString()}
                                                </td>
                                                <td className="table-cell font-semibold text-rose-600 dark:text-rose-400 font-mono">
                                                    {opening.blackWins.toLocaleString()}
                                                </td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-3">
                                                        {/* Gradient split indicator */}
                                                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex min-w-[120px]">
                                                            <div 
                                                                className="h-full bg-emerald-500 rounded-l-full" 
                                                                style={{ width: `${whiteWinPercent}%` }} 
                                                                title={`White Wins: ${whiteWinPercent}%`}
                                                            />
                                                            <div 
                                                                className="h-full bg-rose-500 rounded-r-full" 
                                                                style={{ width: `${blackWinPercent}%` }} 
                                                                title={`Black Wins: ${blackWinPercent}%`}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tabular-nums">
                                                            W: {whiteWinPercent}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="table-cell text-gray-500 dark:text-gray-400 font-mono text-center">
                                                    {opening.averageTurns}
                                                </td>
                                                <td className="table-cell">
                                                    {getComplexityBadge(opening.complexity)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="skeleton-shimmer h-6 w-12 rounded"></div>
                                        <div className="skeleton-shimmer h-4 w-3/4 rounded"></div>
                                    </div>
                                    <div className="skeleton-shimmer h-8 w-full rounded"></div>
                                </div>
                            ))
                        ) : openings.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No openings found matching your search
                            </div>
                        ) : (
                            openings.map((opening) => {
                                const whiteWinPercent = opening.totalGames > 0 ? ((opening.whiteWins / opening.totalGames) * 100).toFixed(1) : 0;
                                const blackWinPercent = opening.totalGames > 0 ? ((opening.blackWins / opening.totalGames) * 100).toFixed(1) : 0;

                                return (
                                    <div key={opening._id} className="p-4 space-y-3 hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-1.5 py-0.5 rounded border border-primary-100/50">
                                                    {opening.eco}
                                                </span>
                                                <Link to={`/openings/${opening.eco}`} className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 hover:underline">
                                                    {opening.name}
                                                </Link>
                                            </div>
                                            {getComplexityBadge(opening.complexity)}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-slate-800/20 p-2 rounded-xl text-center text-[10px] text-gray-500">
                                            <div>
                                                <p className="font-semibold text-gray-700 dark:text-gray-300 font-mono text-xs">{opening.totalGames}</p>
                                                <p className="uppercase font-bold tracking-wider mt-0.5">Games</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-xs">{opening.whiteWins}</p>
                                                <p className="uppercase font-bold tracking-wider mt-0.5 text-emerald-500">White Wins</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-rose-600 dark:text-rose-400 font-mono text-xs">{opening.blackWins}</p>
                                                <p className="uppercase font-bold tracking-wider mt-0.5 text-rose-500">Black Wins</p>
                                            </div>
                                        </div>

                                        {/* Win distribution bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                                                <span>White Win Rate: {whiteWinPercent}%</span>
                                                <span>Black Win Rate: {blackWinPercent}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${whiteWinPercent}%` }} />
                                                <div className="bg-rose-500 h-full" style={{ width: `${blackWinPercent}%` }} />
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
                                Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * limit, totalOpenings)}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalOpenings.toLocaleString()}</span> openings
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
                                
                                <span className="px-4 py-1.5 text-xs sm:text-sm font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl border border-primary-100/30 dark:border-primary-900/30">
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

export default Openings;
