import React from 'react';
import { Helmet } from 'react-helmet-async';

function Openings() {
    return (
        <>
            <Helmet>
                <title>Openings | Chess Analytics</title>
            </Helmet>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Openings Database
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Explore chess openings and their statistics
                </p>
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Openings list coming soon...
                    </p>
                </div>
            </div>
        </>
    );
}

export default Openings;
