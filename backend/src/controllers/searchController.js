const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");
const SearchLog = require("../models/SearchLog");

// Helper to log searches
const logSearch = async (query, type, resultsCount, req) => {
    try {
        await SearchLog.create({
            query,
            type,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            userId: req.user?.id || null,
            resultsCount
        });
    } catch (error) {
        console.error("Search logging error:", error.message);
    }
};

// @desc    Search matches
const searchMatches = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const searchRegex = { $regex: query, $options: "i" };
        
        const games = await Game.find({
            $or: [
                { moves: searchRegex },
                { "white.username": searchRegex },
                { "black.username": searchRegex },
                { "opening.name": searchRegex }
            ],
            isArchived: false
        }).skip(skip).limit(limit).sort({ createdAt: -1 });
        
        const total = await Game.countDocuments({
            $or: [
                { moves: searchRegex },
                { "white.username": searchRegex },
                { "black.username": searchRegex },
                { "opening.name": searchRegex }
            ],
            isArchived: false
        });
        
        await logSearch(query, "matches", games.length, req);
        
        res.json({ success: true, count: games.length, total, page, pages: Math.ceil(total / limit), query, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search players
const searchPlayers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const players = await Player.find({ username: { $regex: query, $options: "i" } }).limit(20);
        
        await logSearch(query, "players", players.length, req);
        
        res.json({ success: true, count: players.length, query, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search openings
const searchOpenings = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const openings = await Opening.find({ name: { $regex: query, $options: "i" } }).limit(20);
        
        await logSearch(query, "openings", openings.length, req);
        
        res.json({ success: true, count: openings.length, query, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search by ECO code
const searchEco = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "ECO code required" });
        }
        
        const openings = await Opening.find({ eco: { $regex: query, $options: "i" } }).limit(20);
        
        await logSearch(query, "eco", openings.length, req);
        
        res.json({ success: true, count: openings.length, query, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get recent searches
const getRecentSearches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const recentSearches = await SearchLog.aggregate([
            { $group: { _id: "$query", count: { $sum: 1 }, lastSearched: { $max: "$createdAt" } } },
            { $sort: { lastSearched: -1 } },
            { $limit: limit },
            { $project: { query: "$_id", count: 1, lastSearched: 1, _id: 0 } }
        ]);
        
        res.json({ success: true, count: recentSearches.length, data: recentSearches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get popular searches
const getPopularSearches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const popularSearches = await SearchLog.aggregate([
            { $group: { _id: "$query", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
            { $project: { query: "$_id", count: 1, _id: 0 } }
        ]);
        
        res.json({ success: true, count: popularSearches.length, data: popularSearches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Advanced search with multiple filters
const advancedSearch = async (req, res) => {
    try {
        const { q, type, minRating, maxRating, startDate, endDate, winner, page = 1, limit = 20 } = req.query;
        
        let filter = { isArchived: false };
        
        if (q) {
            const searchRegex = { $regex: q, $options: "i" };
            filter.$or = [
                { moves: searchRegex },
                { "white.username": searchRegex },
                { "black.username": searchRegex },
                { "opening.name": searchRegex }
            ];
        }
        
        if (winner && winner !== "any") filter.winner = winner;
        if (minRating) filter["white.rating"] = { $gte: parseInt(minRating) };
        if (maxRating) filter["black.rating"] = { $lte: parseInt(maxRating) };
        if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const games = await Game.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Game.countDocuments(filter);
        
        await logSearch(q || "advanced", "general", games.length, req);
        
        res.json({ success: true, count: games.length, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), filters: req.query, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    searchMatches,
    searchPlayers,
    searchOpenings,
    searchEco,
    getRecentSearches,
    getPopularSearches,
    advancedSearch
};
