import api from './api';

const searchService = {
    // Global search across matches, players, openings
    globalSearch: async (query, type = 'all', limit = 20) => {
        const response = await api.get('/search/global', { 
            params: { q: query, type, limit } 
        });
        return response.data;
    },
    
    // Search matches
    searchMatches: async (query, page = 1, limit = 20) => {
        const response = await api.get('/search/matches', { 
            params: { q: query, page, limit } 
        });
        return response.data;
    },
    
    // Search players
    searchPlayers: async (query, limit = 20) => {
        const response = await api.get('/search/players', { 
            params: { q: query, limit } 
        });
        return response.data;
    },
    
    // Search openings
    searchOpenings: async (query, limit = 20) => {
        const response = await api.get('/search/openings', { 
            params: { q: query, limit } 
        });
        return response.data;
    },
    
    // Search by ECO code
    searchByEco: async (ecoCode) => {
        const response = await api.get(`/search/eco?q=${ecoCode}`);
        return response.data;
    },
    
    // Get autocomplete suggestions
    getAutocomplete: async (query) => {
        const response = await api.get('/search/autocomplete', { 
            params: { q: query } 
        });
        return response.data;
    },
    
    // Advanced search with filters
    advancedSearch: async (filters) => {
        const response = await api.get('/search/advanced', { params: filters });
        return response.data;
    },
    
    // Search by date range
    searchByDateRange: async (from, to, page = 1, limit = 20) => {
        const response = await api.get('/search/date-range', { 
            params: { from, to, page, limit } 
        });
        return response.data;
    },
    
    // Search by player rating
    searchByPlayerRating: async (rating, tolerance = 100) => {
        const response = await api.get('/search/player-rating', { 
            params: { rating, tolerance } 
        });
        return response.data;
    },
    
    // Get recent searches (if backend supports)
    getRecentSearches: async () => {
        const response = await api.get('/search/recent');
        return response.data;
    },
    
    // Get popular searches
    getPopularSearches: async () => {
        const response = await api.get('/search/popular');
        return response.data;
    },
};

export default searchService;
