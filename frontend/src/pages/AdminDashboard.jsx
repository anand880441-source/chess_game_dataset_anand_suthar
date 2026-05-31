import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const { user, isAuthenticated, accessToken } = useSelector((state) => state.auth);
    const [systemInfo, setSystemInfo] = useState(null);
    const [systemStatus, setSystemStatus] = useState(null);
    const [systemHealth, setSystemHealth] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = user?.role === 'admin';
        setIsAdmin(adminStatus);
        fetchData(adminStatus);
    }, [user, accessToken]);

    const fetchData = async (adminStatus) => {
        setLoading(true);
        try {
            // Public endpoints (always work)
            const infoRes = await adminService.getSystemInfo();
            const statusRes = await adminService.getSystemStatus();
            setSystemInfo(infoRes.data);
            setSystemStatus(statusRes.data);
            
            // Protected endpoints - only if admin
            if (adminStatus && isAuthenticated) {
                try {
                    const healthRes = await adminService.getSystemHealth();
                    setSystemHealth(healthRes.data);
                } catch (e) {
                    console.log('Health data error:', e.response?.status);
                }
                
                try {
                    const usersRes = await adminService.getAllUsers();
                    setUsers(usersRes.data || []);
                } catch (e) {
                    console.log('Users data error:', e.response?.status);
                }
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">System administration and monitoring</p>
                    {!isAdmin && (
                        <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-lg text-sm">
                            ⚠️ You are viewing as a regular user. Some features require admin privileges.
                        </div>
                    )}
                    {isAdmin && (
                        <div className="mt-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-sm">
                            ✅ Admin mode active. Full system access enabled.
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Status</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">
                                    {systemStatus?.status || 'Unknown'}
                                </p>
                            </div>
                            <div className="bg-green-500 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Database</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">
                                    {systemStatus?.database || 'Unknown'}
                                </p>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">API Version</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {systemInfo?.apiVersion || '1.0.0'}
                                </p>
                            </div>
                            <div className="bg-purple-500 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Server Uptime</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {Math.floor((systemInfo?.uptime || 0) / 3600)}h {Math.floor(((systemInfo?.uptime || 0) % 3600) / 60)}m
                                </p>
                            </div>
                            <div className="bg-orange-500 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Node Version</span>
                            <span className="font-semibold">{systemInfo?.nodeVersion}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Platform</span>
                            <span className="font-semibold">{systemInfo?.platform}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Memory Total</span>
                            <span className="font-semibold">
                                {systemInfo?.memory ? (systemInfo.memory.total / 1024 / 1024 / 1024).toFixed(2) : 'N/A'} GB
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Memory Free</span>
                            <span className="font-semibold">
                                {systemInfo?.memory ? (systemInfo.memory.free / 1024 / 1024 / 1024).toFixed(2) : 'N/A'} GB
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Server Uptime</span>
                            <span className="font-semibold">
                                {Math.floor((systemInfo?.uptime || 0) / 3600)} hours {(Math.floor((systemInfo?.uptime || 0) % 3600 / 60))} minutes
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="font-semibold">{new Date(systemInfo?.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Admin Only Content */}
                {isAdmin && isAuthenticated ? (
                    <>
                        {/* User Management */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    User Management
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {users.length} registered users
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                {users.length > 0 ? (
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium">Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium">Email</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium">Role</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {users.map((userItem) => (
                                                <tr key={userItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3 font-medium">{userItem.name}</td>
                                                    <td className="px-4 py-3 text-gray-600">{userItem.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            userItem.role === 'admin' 
                                                                ? 'bg-purple-100 text-purple-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {userItem.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            userItem.isActive 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {userItem.isActive ? 'Active' : 'Banned'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {new Date(userItem.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        No users found. Make sure your token is valid and you have admin privileges.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Database Statistics */}
                        {systemHealth && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Database Statistics
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {systemHealth.database?.games?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">Total Games</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {systemHealth.database?.players?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">Total Players</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {systemHealth.database?.openings || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">Openings</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {systemHealth.database?.users || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">Users</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 text-center">
                        <p className="text-yellow-800 dark:text-yellow-400">
                            🔒 Admin login required to view user management and detailed system health.
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-2">
                            Current role: {user?.role || 'Not logged in'}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminDashboard;
