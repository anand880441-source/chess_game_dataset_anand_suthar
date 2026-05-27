import React from 'react';
import { Helmet } from 'react-helmet-async';

function Players() {
    return (
        <>
            <Helmet>
                <title>Players | Chess Analytics</title>
            </Helmet>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Players Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage chess players data
                </p>
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Players list coming soon...
                    </p>
                </div>
            </div>
        </>
    );
}

export default Players;
