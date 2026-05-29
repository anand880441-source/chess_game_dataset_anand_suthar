import React, { useState } from 'react';
import toast from 'react-hot-toast';

function PGNViewer({ pgn }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(pgn);
            setCopied(true);
            toast.success('PGN copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy PGN');
        }
    };

    if (!pgn) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No PGN data available
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Portable Game Notation (PGN)
                </h3>
                <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {pgn}
            </pre>
        </div>
    );
}

export default PGNViewer;
