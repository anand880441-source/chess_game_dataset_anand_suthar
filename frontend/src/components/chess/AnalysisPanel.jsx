import React from 'react';

function AnalysisPanel({ analysis, position }) {
    if (!analysis) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Analysis not available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Game Summary
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Total Moves:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{analysis.totalMoves}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Winner:</span>
                        <span className={`font-semibold ${
                            analysis.winner === 'white' ? 'text-green-600' :
                            analysis.winner === 'black' ? 'text-red-600' :
                            'text-yellow-600'
                        }`}>
                            {analysis.winner === 'white' ? 'White' : analysis.winner === 'black' ? 'Black' : 'Draw'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Victory Type:</span>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">
                            {analysis.victoryType || 'Unknown'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Opening:</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-right">
                            {analysis.openingName}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">ECO Code:</span>
                        <span className="font-mono font-semibold text-gray-900 dark:text-white">
                            {analysis.openingEco}
                        </span>
                    </div>
                </div>
            </div>

            {position && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Position Analysis
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Material Advantage:</span>
                            <span className={`font-semibold ${position.materialAdvantage > 0 ? 'text-green-600' : position.materialAdvantage < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {position.materialAdvantage > 0 ? `+${position.materialAdvantage}` : position.materialAdvantage}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">White Material:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{position.whiteMaterial}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Black Material:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{position.blackMaterial}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalysisPanel;
