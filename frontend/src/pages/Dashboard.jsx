import React from 'react';
import { Helmet } from 'react-helmet-async';

function Dashboard() {
    return (
        <>
            <Helmet>
                <title>Dashboard | Chess Analytics</title>
            </Helmet>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Welcome to Chess Match Analytics Dashboard!
                </p>
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Dashboard content coming soon...
                    </p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
