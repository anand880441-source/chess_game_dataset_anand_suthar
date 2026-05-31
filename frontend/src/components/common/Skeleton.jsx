import React from 'react';

export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            {Array(rows).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 mb-2">
                    {Array(cols).fill(0).map((_, j) => (
                        <div key={j} className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
    );
}

export default TableSkeleton;
