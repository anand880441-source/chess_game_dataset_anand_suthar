import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { 
    UserGroupIcon, 
    ServerIcon, 
    ChartBarIcon, 
    TrashIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    CpuChipIcon,
    CloudIcon 
} from '@heroicons/react/24/outline';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [systemHealth, setSystemHealth] = useState(null);
    const [systemInfo, setSystemInfo] = useState(null);
    const [systemStatus, setSystemStatus] = useState(null);
    const [systemLogs, setSystemLogs] = useState([]);
    const [systemPerformance, setSystemPerformance] = useState(null);
    const [systemStorage, setSystemStorage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [actionLoading, setActionLoading] = useState(false);

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (isAdmin) {
            fetchAdminData();
        }
    }, [isAdmin]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [usersRes, healthRes, infoRes, statusRes, logsRes, perfRes, storageRes] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getSystemHealth(),
                adminService.getSystemInfo(),
                adminService.getSystemStatus(),
                adminService.getSystemLogs(20),
                adminService.getSystemPerformance(),
                adminService.getSystemStorage()
            ]);
            
            setUsers(usersRes.data || []);
            setSystemHealth(healthRes.data);
            setSystemInfo(infoRes.data);
            setSystemStatus(statusRes.data);
            setSystemLogs(logsRes.data || []);
            setSystemPerformance(perfRes.data);
            setSystemStorage(storageRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId) => {
        if (!window.confirm('Are you sure you want to ban this user?')) return;
        setActionLoading(true);
        try {
            await adminService.banUser(userId);
            toast.success('User banned successfully');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to ban user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnbanUser = async (userId) => {
        setActionLoading(true);
        try {
            await adminService.unbanUser(userId);
            toast.success('User unbanned successfully');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to unban user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearCache = async () => {
        if (!window.confirm('Are you sure you want to clear the cache?')) return;
        setActionLoading(true);
        try {
            await adminService.clearCache();
            toast.success('Cache cleared successfully');
        } catch (error) {
            toast.error('Failed to clear cache');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRecalculateStats = async () => {
        if (!window.confirm('This may take a few minutes. Continue?')) return;
        setActionLoading(true);
        try {
            await adminService.recalculateStats();
            toast.success('Statistics recalculated successfully');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to recalculate stats');
        } finally {
            setActionLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    You don't have permission to access this page.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const statsCards = [
        { title: 'Total Users', value: users.length, icon: UserGroupIcon, color: 'bg-blue-500' },
        { title: 'Active Users', value: users.filter(u => u.isActive).length, icon: UserGroupIcon, color: 'bg-green-500' },
        { title: 'System Status', value: systemStatus?.status || 'Unknown', icon: ServerIcon, color: 'bg-purple-500' },
        { title: 'Database', value: systemStatus?.database || 'Unknown', icon: CloudIcon, color: 'bg-indigo-500' },
    ];

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        System administration and monitoring
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-xl`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'overview'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'users'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('system')}
                            className={`py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'system'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            System Health
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`py-2 px-1 text-sm font-medium transition-colors ${
                                activeTab === 'logs'
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            System Logs
                        </button>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* System Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                System Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">API Version</span>
                                    <span className="font-semibold">{systemInfo?.apiVersion}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Node Version</span>
                                    <span className="font-semibold">{systemInfo?.nodeVersion}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Platform</span>
                                    <span className="font-semibold">{systemInfo?.platform}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Server Uptime</span>
                                    <span className="font-semibold">{Math.floor(systemInfo?.uptime / 3600)} hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Database Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Database Statistics
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">{systemHealth?.database?.games?.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Total Games</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">{systemHealth?.database?.players?.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Total Players</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">{systemHealth?.database?.openings}</p>
                                    <p className="text-sm text-gray-500">Openings</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">{systemHealth?.database?.users}</p>
                                    <p className="text-sm text-gray-500">Users</p>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        {systemPerformance && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Performance Metrics
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{systemPerformance.totalGames?.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">Total Games</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{systemPerformance.totalPlayers?.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">Total Players</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">{systemPerformance.averageRating}</p>
                                        <p className="text-sm text-gray-500">Avg Rating</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-600">{Math.floor(systemPerformance.serverUptime / 3600)}h</p>
                                        <p className="text-sm text-gray-500">Server Uptime</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Storage Info */}
                        {systemStorage && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Storage Analytics
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{systemStorage.databaseSize}</p>
                                        <p className="text-sm text-gray-500">Database Size</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{systemStorage.indexesSize}</p>
                                        <p className="text-sm text-gray-500">Indexes Size</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{systemStorage.collections}</p>
                                        <p className="text-sm text-gray-500">Collections</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{systemStorage.objects?.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">Documents</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Admin Actions
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleClearCache}
                                    disabled={actionLoading}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Clear Cache
                                </button>
                                <button
                                    onClick={handleRecalculateStats}
                                    disabled={actionLoading}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <ArrowPathIcon className="w-4 h-4" />
                                    Recalculate Stats
                                </button>
                                <button
                                    onClick={fetchAdminData}
                                    disabled={actionLoading}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <ArrowPathIcon className="w-4 h-4" />
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium">Joined</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-medium">{user.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    user.isActive 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.isActive ? 'Active' : 'Banned'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.isActive ? (
                                                    <button
                                                        onClick={() => handleBanUser(user._id)}
                                                        disabled={actionLoading || user.role === 'admin'}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                                    >
                                                        Ban
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnbanUser(user._id)}
                                                        disabled={actionLoading}
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        Unban
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* System Health Tab */}
                {activeTab === 'system' && systemHealth && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Server Health
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-600">Memory Usage</span>
                                        <span className="text-sm font-semibold">
                                            {((systemHealth.server?.memory?.heapUsed / systemHealth.server?.memory?.heapTotal) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-primary-500 h-2 rounded-full"
                                            style={{ width: `${((systemHealth.server?.memory?.heapUsed / systemHealth.server?.memory?.heapTotal) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Node Version</span>
                                    <span className="font-semibold">{systemHealth.server?.nodeVersion}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Platform</span>
                                    <span className="font-semibold">{systemHealth.server?.platform}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">CPU Cores</span>
                                    <span className="font-semibold">{systemHealth.server?.cpus}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Server Uptime</span>
                                    <span className="font-semibold">{Math.floor(systemHealth.server?.uptime / 3600)} hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* System Logs Tab */}
                {activeTab === 'logs' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b">
                            <h2 className="text-lg font-semibold">Recent System Activity</h2>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                            {systemLogs.length > 0 ? (
                                systemLogs.map((log, index) => (
                                    <div key={index} className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    Search query: "{log.query}"
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {log.type} • {log.resultsCount} results • {new Date(log.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No logs available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminDashboard;
