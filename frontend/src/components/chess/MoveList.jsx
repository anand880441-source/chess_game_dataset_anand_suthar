import React from 'react';

function MoveList({ moves, currentMoveIndex, onMoveClick }) {
    if (!moves || moves.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No moves available
            </div>
        );
    }

    // Format moves in pairs (white, black)
    const movePairs = [];
    for (let i = 0; i < moves.length; i += 2) {
        movePairs.push({
            moveNumber: Math.floor(i / 2) + 1,
            white: moves[i],
            whiteIndex: i,
            black: moves[i + 1] || null,
            blackIndex: i + 1
        });
    }

    return (
        <div className="h-96 overflow-y-auto">
            <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">#</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">White</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Black</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {movePairs.map((pair) => (
                        <tr key={pair.moveNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {pair.moveNumber}
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    onClick={() => onMoveClick(pair.whiteIndex)}
                                    className={`text-sm font-mono hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-full text-left ${
                                        currentMoveIndex === pair.whiteIndex 
                                            ? 'text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded'
                                            : 'text-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {pair.white}
                                </button>
                            </td>
                            <td className="px-3 py-2">
                                {pair.black && (
                                    <button
                                        onClick={() => onMoveClick(pair.blackIndex)}
                                        className={`text-sm font-mono hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-full text-left ${
                                            currentMoveIndex === pair.blackIndex 
                                                ? 'text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded'
                                                : 'text-gray-800 dark:text-gray-200'
                                        }`}
                                    >
                                        {pair.black}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MoveList;
