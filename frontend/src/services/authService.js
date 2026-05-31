import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        console.log('Auth service login response:', response.data);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.patch('/auth/profile', userData);
        return response.data;
    },
    deleteProfile: async () => {
        const response = await api.delete('/auth/profile');
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
};

export default authService;
