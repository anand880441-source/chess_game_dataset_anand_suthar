import api from './api';

const openingService = {
    getAll: async (params = {}) => {
        const response = await api.get('/openings', { params });
        return response.data;
    },
    getPopular: async (limit = 10) => {
        const response = await api.get(`/openings/popular?limit=${limit}`);
        return response.data;
    },
    getByEco: async (ecoCode) => {
        const response = await api.get(`/openings/eco/${ecoCode}`);
        return response.data;
    },
    search: async (query) => {
        const response = await api.get(`/openings/search?q=${query}`);
        return response.data;
    },
    getWinRates: async (limit = 20) => {
        const response = await api.get(`/openings/win-rates?limit=${limit}`);
        return response.data;
    },
};

export default openingService;
