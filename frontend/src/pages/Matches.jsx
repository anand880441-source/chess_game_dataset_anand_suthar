import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import gameService from '../services/gameService';
import toast from 'react-hot-toast';

function Matches() {
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
        if (sortBy !== field) return '↕️';
        return sortOrder === 'desc' ? '↓' : '↑';
    };

    const getWinnerBadge = (winner, white, black) => {
        if (winner === 'white') {
            return <span className="text-green-600 dark:text-green-400 font-medium">White ({white})</span>;
        } else if (winner === 'black') {
            return <span className="text-red-600 dark:text-red-400 font-medium">Black ({black})</span>;
        }
        return <span className="text-yellow-600 dark:text-yellow-400">Draw</span>;
    };

    const getVictoryBadge = (status) => {
        const badges = {
            'mate': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'resign': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            'outoftime': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            'draw': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        };
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${badges[status] || 'bg-gray-100'}`}>
                {status || 'Unknown'}
            </span>
        );
    };

    return (
        <>
            <Helmet>
                <title>Matches | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Matches Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Total Matches: {totalMatches.toLocaleString()}
                        </p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex gap-2">
                        <select
                            value={filters.winner}
                            onChange={(e) => handleFilterChange('winner', e.target.value)}
                            className="input w-32"
                        >
                            <option value="">All Winners</option>
                            <option value="white">White Wins</option>
                            <option value="black">Black Wins</option>
                            <option value="draw">Draw</option>
                        </select>
                        <select
                            value={filters.rated}
                            onChange={(e) => handleFilterChange('rated', e.target.value)}
                            className="input w-32"
                        >
                            <option value="">All Games</option>
                            <option value="true">Rated</option>
                            <option value="false">Unrated</option>
                        </select>
                        <button
                            onClick={() => {
                                setFilters({ winner: '', rated: '' });
                                setCurrentPage(1);
                            }}
                            className="btn-secondary"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Matches Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Date {getSortIcon('createdAt')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        White Player
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Black Player
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('winner')}
                                    >
                                        Winner {getSortIcon('winner')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700"
                                        onClick={() => handleSort('turns')}
                                    >
                                        Moves {getSortIcon('turns')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Result
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Opening
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Rated
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
                                            <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
                                        </tr>
                                    ))
                                ) : matches.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No matches found
                                        </td>
                                    </tr>
                                ) : (
                                    matches.map((match) => (
                                        <tr key={match._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(match.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link 
                                                    to={`/players/${match.white?.username}`}
                                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                                >
                                                    {match.white?.username}
                                                </Link>
                                                <span className="text-xs text-gray-500 ml-1">({match.white?.rating})</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link 
                                                    to={`/players/${match.black?.username}`}
                                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                                >
                                                    {match.black?.username}
                                                </Link>
                                                <span className="text-xs text-gray-500 ml-1">({match.black?.rating})</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getWinnerBadge(match.winner, match.white?.username, match.black?.username)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                {match.turns}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getVictoryBadge(match.victoryStatus)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">
                                                    <div className="font-medium text-gray-700 dark:text-gray-300">
                                                        {match.opening?.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {match.opening?.eco}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${match.rated ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                    {match.rated ? 'Rated' : 'Casual'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalMatches)} of {totalMatches.toLocaleString()} matches
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

export default Matches;
