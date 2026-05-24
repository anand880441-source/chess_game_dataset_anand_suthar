const Opening = require("../models/Opening");
const Game = require("../models/Game");

// @desc    Get all openings with pagination
// @route   GET /api/v1/openings
const getAllOpenings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const openings = await Opening.find()
            .sort({ totalGames: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Opening.countDocuments();
        
        res.json({
            success: true,
            count: openings.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: openings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get popular openings (most played)
// @route   GET /api/v1/openings/popular
const getPopularOpenings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const openings = await Opening.find()
            .sort({ totalGames: -1 })
            .limit(limit);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get trending openings (highest win rate)
// @route   GET /api/v1/openings/trending
const getTrendingOpenings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const openings = await Opening.find()
            .sort({ whiteWins: -1 })
            .limit(limit);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get opening by ECO code
// @route   GET /api/v1/openings/eco/:ecoCode
const getOpeningByEco = async (req, res) => {
    try {
        const opening = await Opening.findOne({ eco: req.params.ecoCode });
        if (!opening) {
            return res.status(404).json({ success: false, message: "Opening not found" });
        }
        res.json({ success: true, data: opening });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search openings by name
// @route   GET /api/v1/openings/search?q=sicilian
const searchOpenings = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query required" });
        }
        
        const openings = await Opening.find({
            name: { $regex: query, $options: "i" }
        }).limit(20);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get opening win rates
// @route   GET /api/v1/openings/win-rates
const getOpeningWinRates = async (req, res) => {
    try {
        const openings = await Opening.find()
            .select("eco name whiteWins blackWins draws totalGames")
            .limit(20);
        
        const winRates = openings.map(op => ({
            eco: op.eco,
            name: op.name,
            whiteWinRate: op.whiteWinRate,
            blackWinRate: op.blackWinRate,
            totalGames: op.totalGames
        }));
        
        res.json({ success: true, count: winRates.length, data: winRates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get aggressive openings
// @route   GET /api/v1/openings/aggressive
const getAggressiveOpenings = async (req, res) => {
    try {
        const openings = await Opening.find({ category: "Aggressive" })
            .sort({ totalGames: -1 })
            .limit(20);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get defensive openings
// @route   GET /api/v1/openings/defensive
const getDefensiveOpenings = async (req, res) => {
    try {
        const openings = await Opening.find({ category: "Defensive" })
            .sort({ totalGames: -1 })
            .limit(20);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get gambit openings
// @route   GET /api/v1/openings/gambits
const getGambitOpenings = async (req, res) => {
    try {
        const openings = await Opening.find({ category: "Gambit" })
            .sort({ totalGames: -1 })
            .limit(20);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get openings by complexity
// @route   GET /api/v1/openings/complexity?level=Beginner
const getOpeningsByComplexity = async (req, res) => {
    try {
        const level = req.query.level || "Intermediate";
        const openings = await Opening.find({ complexity: level })
            .sort({ totalGames: -1 });
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get beginner-friendly openings
// @route   GET /api/v1/openings/beginner-friendly
const getBeginnerFriendlyOpenings = async (req, res) => {
    try {
        const openings = await Opening.find({ complexity: "Beginner" })
            .sort({ totalGames: -1 })
            .limit(20);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get openings favoring white
// @route   GET /api/v1/openings/white-advantage
const getWhiteAdvantageOpenings = async (req, res) => {
    try {
        const openings = await Opening.find({
            whiteWins: { $gt: { $multiply: ["$blackWins", 1.5] } }
        }).limit(20);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get rare openings (least played)
// @route   GET /api/v1/openings/rare
const getRareOpenings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const openings = await Opening.find()
            .sort({ totalGames: 1 })
            .limit(limit);
        
        res.json({ success: true, count: openings.length, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllOpenings,
    getPopularOpenings,
    getTrendingOpenings,
    getOpeningByEco,
    searchOpenings,
    getOpeningWinRates,
    getAggressiveOpenings,
    getDefensiveOpenings,
    getGambitOpenings,
    getOpeningsByComplexity,
    getBeginnerFriendlyOpenings,
    getWhiteAdvantageOpenings,
    getRareOpenings
};
