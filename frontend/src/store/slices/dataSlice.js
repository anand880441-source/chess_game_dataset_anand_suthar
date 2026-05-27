import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    matches: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        error: null,
    },
    players: {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        loading: false,
        error: null,
    },
    openings: {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        loading: false,
        error: null,
    },
    analytics: {
        victoryDistribution: null,
        colorAdvantage: null,
        checkmateFrequency: null,
        loading: false,
        error: null,
    },
    selectedMatch: null,
    selectedPlayer: null,
    filters: {
        winner: null,
        rated: null,
        victoryStatus: null,
    },
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        // Matches
        setMatches: (state, action) => {
            state.matches.items = action.payload.data;
            state.matches.total = action.payload.total;
            state.matches.page = action.payload.page;
            state.matches.limit = action.payload.limit || 10;
        },
        setMatchesLoading: (state, action) => {
            state.matches.loading = action.payload;
        },
        setMatchesError: (state, action) => {
            state.matches.error = action.payload;
        },
        
        // Players
        setPlayers: (state, action) => {
            state.players.items = action.payload.data;
            state.players.total = action.payload.total;
            state.players.page = action.payload.page;
        },
        setPlayersLoading: (state, action) => {
            state.players.loading = action.payload;
        },
        
        // Openings
        setOpenings: (state, action) => {
            state.openings.items = action.payload.data;
            state.openings.total = action.payload.total;
        },
        setOpeningsLoading: (state, action) => {
            state.openings.loading = action.payload;
        },
        
        // Analytics
        setVictoryDistribution: (state, action) => {
            state.analytics.victoryDistribution = action.payload;
        },
        setColorAdvantage: (state, action) => {
            state.analytics.colorAdvantage = action.payload;
        },
        setCheckmateFrequency: (state, action) => {
            state.analytics.checkmateFrequency = action.payload;
        },
        setAnalyticsLoading: (state, action) => {
            state.analytics.loading = action.payload;
        },
        
        // Selected items
        setSelectedMatch: (state, action) => {
            state.selectedMatch = action.payload;
        },
        setSelectedPlayer: (state, action) => {
            state.selectedPlayer = action.payload;
        },
        
        // Filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { winner: null, rated: null, victoryStatus: null };
        },
        
        // Reset
        resetData: () => initialState,
    },
});

export const {
    setMatches, setMatchesLoading, setMatchesError,
    setPlayers, setPlayersLoading,
    setOpenings, setOpeningsLoading,
    setVictoryDistribution, setColorAdvantage, setCheckmateFrequency, setAnalyticsLoading,
    setSelectedMatch, setSelectedPlayer,
    setFilters, clearFilters,
    resetData,
} = dataSlice.actions;
export default dataSlice.reducer;
