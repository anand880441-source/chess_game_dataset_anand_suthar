import React from 'react';
import { Link } from 'react-router-dom';

function RecentMatchesTable({ matches, loading }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                        <div className="skeleton-shimmer h-10 w-10 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="skeleton-shimmer h-4 w-3/4 rounded"></div>
                            <div className="skeleton-shimmer h-3 w-1/2 rounded"></div>
                        </div>
                        <div className="skeleton-shimmer h-6 w-20 rounded-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!matches || matches.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No recent matches found</p>
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
                            <th className="table-header">White</th>
                            <th className="table-header">Black</th>
                            <th className="table-header">Result</th>
                            <th className="table-header">Moves</th>
                            <th className="table-header">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {matches.map((match) => (
                            <tr key={match._id} className="table-row">
                                <td className="table-cell">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {match.white?.username?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{match.white?.username}</span>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-gray-800 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                            {match.black?.username?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{match.black?.username}</span>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className={`badge ${
                                        match.winner === 'white' ? 'badge-success' :
                                        match.winner === 'black' ? 'badge-danger' :
                                        'badge-warning'
                                    }`}>
                                        {match.winner === 'white' ? 'White' : match.winner === 'black' ? 'Black' : 'Draw'}
                                    </span>
                                </td>
                                <td className="table-cell text-gray-500 dark:text-gray-400 font-mono text-xs">
                                    {match.turns}
                                </td>
                                <td className="table-cell text-gray-500 dark:text-gray-400 text-xs">
                                    {new Date(match.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-3">
                {matches.map((match) => (
                    <div key={match._id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                                    {match.white?.username?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{match.white?.username}</p>
                                    <p className="text-xs text-gray-400">White</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">VS</span>
                            <div className="flex items-center gap-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white text-right">{match.black?.username}</p>
                                    <p className="text-xs text-gray-400 text-right">Black</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-gray-800 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                    {match.black?.username?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className={`badge ${
                                match.winner === 'white' ? 'badge-success' :
                                match.winner === 'black' ? 'badge-danger' :
                                'badge-warning'
                            }`}>
                                {match.winner === 'white' ? 'White Wins' : match.winner === 'black' ? 'Black Wins' : 'Draw'}
                            </span>
                            <span className="text-gray-400 font-mono">{match.turns} moves</span>
                            <span className="text-gray-400">{new Date(match.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default RecentMatchesTable;
