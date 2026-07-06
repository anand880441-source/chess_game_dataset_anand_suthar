import React from 'react';
import { Link } from 'react-router-dom';

const rankBadges = {
    0: { bg: 'bg-gradient-to-r from-amber-400 to-yellow-500', text: 'text-white', label: '🥇' },
    1: { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-white', label: '🥈' },
    2: { bg: 'bg-gradient-to-r from-amber-600 to-orange-700', text: 'text-white', label: '🥉' },
};

function TopPlayersTable({ players, loading }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                        <div className="skeleton-shimmer h-8 w-8 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="skeleton-shimmer h-4 w-2/3 rounded"></div>
                            <div className="skeleton-shimmer h-3 w-1/3 rounded"></div>
                        </div>
                        <div className="skeleton-shimmer h-4 w-16 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!players || players.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No players found</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="table-header w-16">Rank</th>
                            <th className="table-header">Player</th>
                            <th className="table-header">Rating</th>
                            <th className="table-header">Games</th>
                            <th className="table-header">Win Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {players.map((player, index) => {
                            const badge = rankBadges[index];
                            return (
                                <tr key={player._id} className="table-row">
                                    <td className="table-cell">
                                        {badge ? (
                                            <span className="text-lg">{badge.label}</span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
                                                {index + 1}
                                            </span>
                                        )}
                                    </td>
                                    <td className="table-cell">
                                        <Link to={`/players/${player.username}`} className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                {player.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {player.username}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="table-cell">
                                        <span className="font-bold text-gray-900 dark:text-white font-mono">{player.currentRating}</span>
                                    </td>
                                    <td className="table-cell text-gray-500 dark:text-gray-400">
                                        {player.totalGames}
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[120px]">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                                                    style={{ width: `${player.winRate || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 tabular-nums w-10">
                                                {player.winRate || 0}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-3">
                {players.map((player, index) => {
                    const badge = rankBadges[index];
                    return (
                        <Link
                            key={player._id}
                            to={`/players/${player.username}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="flex-shrink-0 relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                                    {player.username?.charAt(0)?.toUpperCase()}
                                </div>
                                {badge && (
                                    <span className="absolute -top-1 -right-1 text-sm">{badge.label}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{player.username}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{player.totalGames} games</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{player.currentRating}</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{player.winRate || 0}% win</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}

export default TopPlayersTable;
