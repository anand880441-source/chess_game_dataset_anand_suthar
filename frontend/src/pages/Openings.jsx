import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
                <title>Openings | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Chess Openings Database
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Total Openings: {totalOpenings.toLocaleString()}
                        </p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search openings by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="input pr-10 w-64"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                🔍
                            </button>
                        </div>
                        <button
                            onClick={fetchOpenings}
                            className="btn-secondary"
                        >
                            🔄
                        </button>
                    </div>
                </div>

                {/* Openings Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        ECO Code
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Opening Name
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('totalGames')}
                                    >
                                        Total Games {getSortIcon('totalGames')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('whiteWins')}
                                    >
                                        White Wins {getSortIcon('whiteWins')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('blackWins')}
                                    >
                                        Black Wins {getSortIcon('blackWins')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Win Rate
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Avg. Moves
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Complexity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                                        </tr>
                                    ))
                                ) : openings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No openings found
                                        </td>
                                    </tr>
                                ) : (
                                    openings.map((opening) => {
                                        const whiteWinRate = ((opening.whiteWins / opening.totalGames) * 100).toFixed(1);
                                        const blackWinRate = ((opening.blackWins / opening.totalGames) * 100).toFixed(1);
                                        return (
                                            <tr key={opening._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-4 py-3">
                                                    <span className="font-mono text-sm font-semibold text-primary-600 dark:text-primary-400">
                                                        {opening.eco}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {opening.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {opening.totalGames}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                                                    {opening.whiteWins}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                                    {opening.blackWins}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{ width: `${whiteWinRate}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[45px]">
                                                            White {whiteWinRate}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-red-500 rounded-full"
                                                                style={{ width: `${blackWinRate}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[45px]">
                                                            Black {blackWinRate}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {opening.averageTurns}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        opening.complexity === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        opening.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                    }`}>
                                                        {opening.complexity}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalOpenings)} of {totalOpenings} openings
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="btn-secondary px-3 py-1 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn-secondary px-3 py-1 disabled:opacity-50"
                                >
                                    Next
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
