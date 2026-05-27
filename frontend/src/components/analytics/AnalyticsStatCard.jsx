import React from 'react';

function AnalyticsStatCard({ title, value, icon, color, subtitle }) {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        indigo: 'bg-indigo-500',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {value?.toLocaleString() || '0'}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`${colors[color]} p-3 rounded-xl`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsStatCard;
