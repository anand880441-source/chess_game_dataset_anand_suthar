import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/uiSlice';

function Settings() {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);

    return (
        <>
            <Helmet>
                <title>Settings | Chess Analytics</title>
            </Helmet>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Settings
                </h1>
                
                <div className="mt-8 space-y-6">
                    {/* Theme Settings */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Appearance
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300">Theme</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Switch between light and dark mode
                                </p>
                            </div>
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                            >
                                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                            </button>
                        </div>
                    </div>

                    {/* Profile Settings placeholder */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Profile
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Profile settings coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;
