import api from './api';

const analyticsService = {
    getVictoryDistribution: async () => {
        const response = await api.get('/analytics/victory-distribution');
        return response.data;
    },
    getColorAdvantage: async () => {
        const response = await api.get('/analytics/color-advantage');
        return response.data;
    },
    getCheckmateFrequency: async () => {
        const response = await api.get('/analytics/checkmate-frequency');
        return response.data;
    },
    getDailyGames: async (limit = 30) => {
        const response = await api.get(`/analytics/stats/daily-games?limit=${limit}`);
        return response.data;
    },
    getMonthlyGames: async () => {
        const response = await api.get('/analytics/stats/monthly-games');
        return response.data;
    },
    getYearlyGames: async () => {
        const response = await api.get('/analytics/stats/yearly-games');
        return response.data;
    },
};

export default analyticsService;
