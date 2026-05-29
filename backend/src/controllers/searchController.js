const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");
const SearchLog = require("../models/SearchLog");

// @desc    Global search across all entities
// @route   GET /api/v1/search/global
const globalSearch = async (req, res) => {
    try {
        const { q, type = "all", limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const searchRegex = { $regex: q, $options: "i" };
        let results = { matches: [], players: [], openings: [] };
        
        if (type === "all" || type === "matches") {
            const matches = await Game.find({
                $or: [
                    { moves: searchRegex },
                    { "white.username": searchRegex },
                    { "black.username": searchRegex }
                ],
                isArchived: false
            }).limit(parseInt(limit)).sort({ createdAt: -1 });
            results.matches = matches;
        }
        
        if (type === "all" || type === "players") {
            const players = await Player.find({ username: searchRegex }).limit(parseInt(limit));
            results.players = players;
        }
        
        if (type === "all" || type === "openings") {
            const openings = await Opening.find({ name: searchRegex }).limit(parseInt(limit));
            results.openings = openings;
        }
        
        // Log search
        try {
            await SearchLog.create({ query: q, type: "global", resultsCount: results.matches.length + results.players.length + results.openings.length });
        } catch(e) {}
        
        res.json({ success: true, ...results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Autocomplete suggestions
// @route   GET /api/v1/search/autocomplete
const getAutocomplete = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({ success: true, suggestions: { players: [], openings: [] } });
        }
        
        const searchRegex = { $regex: `^${q}`, $options: "i" };
        
        const players = await Player.find({ username: searchRegex }).limit(5).select("username");
        const openings = await Opening.find({ name: searchRegex }).limit(5).select("name eco");
        
        res.json({
            success: true,
            suggestions: {
                players: players.map(p => ({ username: p.username })),
                openings: openings.map(o => ({ name: o.name, eco: o.eco }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search matches
// @route   GET /api/v1/search/matches
const searchMatches = async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const searchRegex = { $regex: q, $options: "i" };
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const matches = await Game.find({
            $or: [
                { moves: searchRegex },
                { "white.username": searchRegex },
                { "black.username": searchRegex }
            ],
            isArchived: false
        }).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        
        const total = await Game.countDocuments({
            $or: [
                { moves: searchRegex },
                { "white.username": searchRegex },
                { "black.username": searchRegex }
            ],
            isArchived: false
        });
        
        res.json({ success: true, count: matches.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), data: matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search players
// @route   GET /api/v1/search/players
const searchPlayers = async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const searchRegex = { $regex: q, $options: "i" };
        const players = await Player.find({ username: searchRegex }).limit(parseInt(limit));
        
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search openings
// @route   GET /api/v1/search/openings
const searchOpenings = async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const searchRegex = { $regex: q, $options: "i" };
        const openings = await Opening.find({ name: searchRegex }).limit(parseInt(limit));
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search by ECO code
// @route   GET /api/v1/search/eco
const searchByEco = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, message: "ECO code required" });
        }
        
        const openings = await Opening.find({ eco: { $regex: q, $options: "i" } }).limit(10);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    globalSearch,
    getAutocomplete,
    searchMatches,
    searchPlayers,
    searchOpenings,
    searchByEco
};
