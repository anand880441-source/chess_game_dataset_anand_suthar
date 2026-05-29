import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';

// Icons
const icons = {
    dashboard: '📊',
    players: '👥',
    matches: '♟️',
    openings: '📚',
    analytics: '📈',
    profile: '👤',
    settings: '⚙️',
    logout: '🚪',
    menu: '☰',
    close: '✕',
    light: '☀️',
    dark: '🌙',
    user: '👤',
};

const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: icons.dashboard },
    { path: '/players', name: 'Players', icon: icons.players },
    { path: '/matches', name: 'Matches', icon: icons.matches },
    { path: '/openings', name: 'Openings', icon: icons.openings },
    { path: '/analytics', name: 'Analytics', icon: icons.analytics },
    { path: '/profile', name: 'Profile', icon: icons.profile },
    { path: '/settings', name: 'Settings', icon: icons.settings },
];

function MainLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navbar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <span className="text-2xl">♟️</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                                    Chess Analytics
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        location.pathname === item.path
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Right side - User menu & Theme toggle */}
                        <div className="flex items-center gap-2">
                            {/* Theme Toggle */}
                            <button
                                onClick={handleThemeToggle}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                <span className="text-xl">{theme === 'dark' ? icons.light : icons.dark}</span>
                            </button>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                    <span className="text-xs">▼</span>
                                </button>

                                {/* Dropdown Menu */}
                                {userDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setUserDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="py-1">
                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <span>{icons.profile}</span>
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <span>{icons.settings}</span>
                                                    <span>Settings</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setUserDropdownOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <span>{icons.logout}</span>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="text-2xl">{mobileMenuOpen ? icons.close : icons.menu}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-800 pt-16">
                    <div className="px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                                    location.pathname === item.path
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Logged in as
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;
