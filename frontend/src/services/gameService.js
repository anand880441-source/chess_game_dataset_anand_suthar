import api from './api';

const gameService = {
    getAll: async (params = {}) => {
        const response = await api.get('/matches', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/matches/${id}`);
        return response.data;
    },
    getMoves: async (id) => {
        const response = await api.get(`/matches/${id}/moves`);
        return response.data;
    },
    getPGN: async (id) => {
        const response = await api.get(`/matches/${id}/pgn`);
        return response.data;
    },
    getFEN: async (id) => {
        const response = await api.get(`/matches/${id}/fen`);
        return response.data;
    },
    getAnalysis: async (id) => {
        const response = await api.get(`/matches/${id}/analysis`);
        return response.data;
    },
    getLatest: async (limit = 10) => {
        const response = await api.get(`/matches/latest/list?limit=${limit}`);
        return response.data;
    },
    getTrending: async (limit = 10) => {
        const response = await api.get(`/matches/trending/list?limit=${limit}`);
        return response.data;
    },
    getRandom: async () => {
        const response = await api.get('/matches/random/game');
        return response.data;
    },
    filter: async (type, params = {}) => {
        const response = await api.get(`/matches/filter/${type}`, { params });
        return response.data;
    },
};

export default gameService;
