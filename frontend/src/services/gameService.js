import api from './api';

const gameService = {
    getAll: async (params = {}) => {
        // Build query string for opening filter
        let queryParams = { ...params };
        
        // Handle opening ECO filter
        if (params.openingEco) {
            queryParams['opening.eco'] = params.openingEco;
            delete queryParams.openingEco;
        }
        
        const response = await api.get('/matches', { params: queryParams });
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
    getByOpeningEco: async (ecoCode, limit = 10) => {
        // Fetch all matches and filter client-side since backend doesn't support opening filter directly
        const response = await api.get('/matches', { params: { limit: 100 } });
        if (response.data.success && response.data.data) {
            const filtered = response.data.data.filter(game => 
                game.opening?.eco === ecoCode || 
                game.opening?.eco?.toLowerCase() === ecoCode?.toLowerCase()
            );
            return { success: true, data: filtered.slice(0, limit) };
        }
        return { success: false, data: [] };
    },
};

export default gameService;
