import api from './api';

const playerService = {
    getAll: async (params = {}) => {
        const response = await api.get('/players', { params });
        return response.data;
    },
    getByUsername: async (username) => {
        const response = await api.get(`/players/${username}`);
        return response.data;
    },
    getStats: async (username) => {
        const response = await api.get(`/players/${username}/stats`);
        return response.data;
    },
    getHistory: async (username, limit = 10) => {
        const response = await api.get(`/players/${username}/history?limit=${limit}`);
        return response.data;
    },
    getTopRated: async (limit = 10) => {
        const response = await api.get(`/players/top-rated?limit=${limit}`);
        return response.data;
    },
    getRatingHistory: async (username) => {
        const response = await api.get(`/players/${username}/rating-history`);
        return response.data;
    },
    compare: async (player1, player2) => {
        const response = await api.get(`/players/compare/${player1}/${player2}`);
        return response.data;
    },
};

export default playerService;
