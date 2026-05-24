const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");

// @desc    Search matches by query
// @route   GET /api/v1/search/matches?q=mate
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
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
        const total = await Game.countDocuments({
            $or: [
                { moves: searchRegex },
                { "white.username": searchRegex },
                { "black.username": searchRegex },
                { "opening.name": searchRegex }
            ],
            isArchived: false
        });
        
        res.json({
            success: true,
            count: games.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            query,
            data: games
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search players by username
// @route   GET /api/v1/search/players?q=magnus
const searchPlayers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const players = await Player.find({
            username: { $regex: query, $options: "i" }
        }).limit(20);
        
        res.json({
            success: true,
            count: players.length,
            query,
            data: players
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search openings by name
// @route   GET /api/v1/search/openings?q=sicilian
const searchOpenings = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const openings = await Opening.find({
            name: { $regex: query, $options: "i" }
        }).limit(20);
        
        res.json({
            success: true,
            count: openings.length,
            query,
            data: openings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search by ECO code
// @route   GET /api/v1/search/eco?q=B20
const searchEco = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "ECO code required" });
        }
        
        const openings = await Opening.find({
            eco: { $regex: query, $options: "i" }
        }).limit(20);
        
        res.json({
            success: true,
            count: openings.length,
            query,
            data: openings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search by move sequence
// @route   GET /api/v1/search/moves?q=e4,e5
const searchMoves = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Move sequence required" });
        }
        
        const movesPattern = query.replace(/,/g, " ");
        
        const games = await Game.find({
            moves: { $regex: movesPattern, $options: "i" },
            isArchived: false
        }).limit(20);
        
        res.json({
            success: true,
            count: games.length,
            query,
            data: games
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Fuzzy search (more flexible)
// @route   GET /api/v1/search/fuzzy?q=carokann
const fuzzySearch = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        // Create fuzzy pattern
        const fuzzyPattern = query.split("").join(".*");
        
        const openings = await Opening.find({
            name: { $regex: fuzzyPattern, $options: "i" }
        }).limit(20);
        
        const players = await Player.find({
            username: { $regex: fuzzyPattern, $options: "i" }
        }).limit(10);
        
        res.json({
            success: true,
            query,
            openings: { count: openings.length, data: openings },
            players: { count: players.length, data: players }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Autocomplete suggestions
// @route   GET /api/v1/search/autocomplete?q=queen
const autocomplete = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Query required" });
        }
        
        const searchRegex = { $regex: `^${query}`, $options: "i" };
        
        const openingNames = await Opening.find({ name: searchRegex })
            .select("name eco")
            .limit(5);
        
        const playerNames = await Player.find({ username: searchRegex })
            .select("username")
            .limit(5);
        
        res.json({
            success: true,
            query,
            suggestions: {
                openings: openingNames,
                players: playerNames
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search by player rating
// @route   GET /api/v1/search/player-rating?rating=2500
const searchByPlayerRating = async (req, res) => {
    try {
        const rating = parseInt(req.query.rating);
        if (!rating) {
            return res.status(400).json({ success: false, message: "Rating required" });
        }
        
        const tolerance = parseInt(req.query.tolerance) || 100;
        
        const players = await Player.find({
            currentRating: { $gte: rating - tolerance, $lte: rating + tolerance }
        }).sort({ currentRating: -1 }).limit(20);
        
        res.json({
            success: true,
            count: players.length,
            rating,
            tolerance,
            data: players
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search by date range
// @route   GET /api/v1/search/date-range?from=2025-01-01&to=2025-02-01
const searchByDateRange = async (req, res) => {
    try {
        const from = req.query.from ? new Date(req.query.from) : null;
        const to = req.query.to ? new Date(req.query.to) : null;
        
        if (!from || !to) {
            return res.status(400).json({ success: false, message: "From and to dates required" });
        }
        
        const games = await Game.find({
            createdAt: { $gte: from, $lte: to },
            isArchived: false
        }).sort({ createdAt: -1 }).limit(50);
        
        res.json({
            success: true,
            count: games.length,
            from,
            to,
            data: games
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    searchMatches,
    searchPlayers,
    searchOpenings,
    searchEco,
    searchMoves,
    fuzzySearch,
    autocomplete,
    searchByPlayerRating,
    searchByDateRange
};
