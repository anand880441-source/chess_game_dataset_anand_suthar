import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/uiSlice';
import SearchBar from '../components/search/SearchBar';
import toast from 'react-hot-toast';

// SVG Icon Components
const icons = {
    dashboard: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
        </svg>
    ),
    players: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    matches: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    openings: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    analytics: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    compare: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    ),
    admin: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    profile: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    logout: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
    sun: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    moon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    ),
    menu: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    ),
    close: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    chevronLeft: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    ),
    chevronRight: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    ),
    chess: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 22H5v-2h14v2M17.16 8.26A8.94 8.94 0 0018 5h-2a7 7 0 01-.59 2.84L12 11.28 8.59 7.84A7 7 0 018 5H6a8.94 8.94 0 00.84 3.26L12 13.43l5.16-5.17M12 2a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1M17 20H7l2-8h6l2 8z" />
        </svg>
    ),
};

function MainLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const isAdmin = user?.role === 'admin';

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = () => setUserDropdownOpen(false);
        if (userDropdownOpen) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [userDropdownOpen]);

    const mainNavItems = [
        { path: '/dashboard', name: 'Dashboard', icon: icons.dashboard },
        { path: '/players', name: 'Players', icon: icons.players },
        { path: '/matches', name: 'Matches', icon: icons.matches },
        { path: '/openings', name: 'Openings', icon: icons.openings },
        { path: '/analytics', name: 'Analytics', icon: icons.analytics },
        { path: '/compare', name: 'Compare', icon: icons.compare },
    ];

    const secondaryNavItems = [
        ...(isAdmin ? [{ path: '/admin', name: 'Admin', icon: icons.admin }] : []),
        { path: '/profile', name: 'Profile', icon: icons.profile },
        { path: '/settings', name: 'Settings', icon: icons.settings },
    ];

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ item }) => (
        <Link
            to={item.path}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
            <span className={`flex-shrink-0 transition-colors duration-200 ${
                isActive(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
            }`}>
                {item.icon}
            </span>
            {!sidebarCollapsed && (
                <span className="truncate">{item.name}</span>
            )}
            {isActive(item.path) && !sidebarCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            )}
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                ${sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}
                w-72
            `}>
                {/* Logo */}
                <div className={`flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white flex-shrink-0">
                        {icons.chess}
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">Chess Analytics</h1>
                        </div>
                    )}
                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                    >
                        {icons.close}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <div className={`text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ${sidebarCollapsed ? 'text-center' : 'px-3'}`}>
                        {sidebarCollapsed ? '—' : 'Main'}
                    </div>
                    {mainNavItems.map((item) => (
                        <NavLink key={item.path} item={item} />
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className={`text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ${sidebarCollapsed ? 'text-center' : 'px-3'}`}>
                            {sidebarCollapsed ? '—' : 'Account'}
                        </div>
                        {secondaryNavItems.map((item) => (
                            <NavLink key={item.path} item={item} />
                        ))}
                    </div>
                </nav>

                {/* Sidebar Footer / User Section */}
                <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 p-3">
                    {!sidebarCollapsed ? (
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle (desktop only) */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden lg:flex items-center justify-center h-10 border-t border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    {sidebarCollapsed ? icons.chevronRight : icons.chevronLeft}
                </button>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
                    <div className="flex items-center justify-between h-full px-4 sm:px-6">
                        {/* Left: Mobile menu + Search */}
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                {icons.menu}
                            </button>
                            <div className="hidden sm:block flex-1 max-w-md">
                                <SearchBar />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1">
                            {/* Mobile search toggle */}
                            <div className="sm:hidden">
                                <SearchBar />
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={handleThemeToggle}
                                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-200"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? icons.sun : icons.moon}
                            </button>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setUserDropdownOpen(!userDropdownOpen); }}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-fade-in z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                {icons.profile}
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                {icons.settings}
                                                <span>Settings</span>
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                {icons.logout}
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
