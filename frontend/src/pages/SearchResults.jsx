import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import searchService from '../services/searchService';
import toast from 'react-hot-toast';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [activeTab, setActiveTab] = useState('all');
    const [results, setResults] = useState({
        matches: [],
        players: [],
        openings: []
    });
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if (query) {
            performSearch();
        }
    }, [query, activeTab]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const response = await searchService.globalSearch(query, activeTab);
            if (response.success) {
                setResults({
                    matches: response.matches || [],
                    players: response.players || [],
                    openings: response.openings || []
                });
                const total = (response.matches?.length || 0) + (response.players?.length || 0) + (response.openings?.length || 0);
                setTotalCount(total);
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'all', label: 'All', count: totalCount },
        { id: 'players', label: 'Players', count: results.players.length },
        { id: 'matches', label: 'Matches', count: results.matches.length },
        { id: 'openings', label: 'Openings', count: results.openings.length }
    ];

    return (
        <>
            <Helmet>
                <title>Search: {query} | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Search Results
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Found {totalCount} results for "{query}"
                    </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-primary-600 border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Players Results */}
                        {(activeTab === 'all' || activeTab === 'players') && results.players.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Players</h2>
                                <div className="grid gap-3">
                                    {results.players.map(player => (
                                        <Link
                                            key={player._id}
                                            to={`/players/${player.username}`}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                                    {player.username?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{player.username}</p>
                                                    <p className="text-sm text-gray-500">Rating: {player.currentRating} • Games: {player.totalGames}</p>
                                                </div>
                                            </div>
                                            <span className="text-primary-600">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Openings Results */}
                        {(activeTab === 'all' || activeTab === 'openings') && results.openings.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Openings</h2>
                                <div className="grid gap-3">
                                    {results.openings.map(opening => (
                                        <Link
                                            key={opening._id}
                                            to={`/openings/${opening.eco}`}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{opening.name}</p>
                                                <p className="text-sm text-gray-500">ECO: {opening.eco} • Games: {opening.totalGames}</p>
                                            </div>
                                            <span className="text-primary-600">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Matches Results */}
                        {(activeTab === 'all' || activeTab === 'matches') && results.matches.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Matches</h2>
                                <div className="grid gap-3">
                                    {results.matches.map(match => (
                                        <Link
                                            key={match._id}
                                            to={`/matches/${match.gameId}`}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {match.white?.username} vs {match.black?.username}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {match.winner === 'white' ? 'White Wins' : match.winner === 'black' ? 'Black Wins' : 'Draw'} • {match.turns} moves
                                                </p>
                                            </div>
                                            <span className="text-primary-600">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {totalCount === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No results found for "{query}"</p>
                                <p className="text-sm text-gray-400 mt-2">Try different keywords</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default SearchResults;
