import api from './api';

const adminService = {
    // User Management (requires admin token)
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    
    banUser: async (userId) => {
        const response = await api.patch(`/admin/users/${userId}/ban`);
        return response.data;
    },
    
    unbanUser: async (userId) => {
        const response = await api.patch(`/admin/users/${userId}/unban`);
        return response.data;
    },
    
    // System Health (requires admin token)
    getSystemHealth: async () => {
        const response = await api.get('/admin/system/health');
        return response.data;
    },
    
    // Public endpoints (no token needed)
    getSystemInfo: async () => {
        const response = await api.get('/admin/system/info');
        return response.data;
    },
    
    getSystemStatus: async () => {
        const response = await api.get('/admin/system/status');
        return response.data;
    },
    
    getSystemLogs: async (limit = 50) => {
        const response = await api.get(`/admin/system/logs?limit=${limit}`);
        return response.data;
    },
    
    getSystemPerformance: async () => {
        const response = await api.get('/admin/system/performance');
        return response.data;
    },
    
    getSystemStorage: async () => {
        const response = await api.get('/admin/system/storage');
        return response.data;
    },
    
    clearCache: async () => {
        const response = await api.delete('/admin/cache/clear');
        return response.data;
    },
    
    getCacheStatus: async () => {
        const response = await api.get('/admin/cache/status');
        return response.data;
    },
    
    recalculateStats: async () => {
        const response = await api.post('/admin/system/recalculate-stats');
        return response.data;
    },
};

export default adminService;
