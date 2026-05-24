const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");

// @desc    Victory distribution analytics
// @route   GET /api/v1/analytics/victory-distribution
const getVictoryDistribution = async (req, res) => {
    try {
        const distribution = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: {
                _id: "$winner",
                count: { $sum: 1 }
            }},
            { $project: {
                outcome: "$_id",
                count: 1,
                percentage: {
                    $multiply: [
                        { $divide: ["$count", await Game.countDocuments({ isArchived: false })] },
                        100
                    ]
                }
            }}
        ]);
        
        res.json({ success: true, data: distribution });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    White vs Black advantage
// @route   GET /api/v1/analytics/color-advantage
const getColorAdvantage = async (req, res) => {
    try {
        const whiteWins = await Game.countDocuments({ winner: "white", isArchived: false });
        const blackWins = await Game.countDocuments({ winner: "black", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        
        res.json({
            success: true,
            data: {
                whiteWins,
                blackWins,
                whiteWinRate: ((whiteWins / total) * 100).toFixed(2),
                blackWinRate: ((blackWins / total) * 100).toFixed(2),
                advantage: whiteWins > blackWins ? "White" : "Black"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Average move count
// @route   GET /api/v1/analytics/turn-count-average
const getAverageTurnCount = async (req, res) => {
    try {
        const result = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: {
                _id: null,
                averageTurns: { $avg: "$turns" },
                minTurns: { $min: "$turns" },
                maxTurns: { $max: "$turns" }
            }}
        ]);
        
        res.json({ success: true, data: result[0] || { averageTurns: 0, minTurns: 0, maxTurns: 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Rated vs Casual analytics
// @route   GET /api/v1/analytics/rated-vs-casual
const getRatedVsCasual = async (req, res) => {
    try {
        const rated = await Game.countDocuments({ rated: true, isArchived: false });
        const unrated = await Game.countDocuments({ rated: false, isArchived: false });
        const total = rated + unrated;
        
        res.json({
            success: true,
            data: {
                rated,
                unrated,
                ratedPercentage: ((rated / total) * 100).toFixed(2),
                unratedPercentage: ((unrated / total) * 100).toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Time control usage analytics
// @route   GET /api/v1/analytics/time-control-usage
const getTimeControlUsage = async (req, res) => {
    try {
        const timeControls = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: {
                _id: "$incrementCode",
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        res.json({ success: true, data: timeControls });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Shortest games analytics
// @route   GET /api/v1/analytics/shortest-games
const getShortestGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false })
            .sort({ turns: 1 })
            .limit(limit)
            .select("gameId white.username black.username turns winner");
        
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Longest games analytics
// @route   GET /api/v1/analytics/longest-games
const getLongestGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false })
            .sort({ turns: -1 })
            .limit(limit)
            .select("gameId white.username black.username turns winner");
        
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Checkmate frequency
// @route   GET /api/v1/analytics/checkmate-frequency
const getCheckmateFrequency = async (req, res) => {
    try {
        const checkmates = await Game.countDocuments({ victoryStatus: "mate", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        
        res.json({
            success: true,
            data: {
                checkmates,
                total,
                frequency: ((checkmates / total) * 100).toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Draw frequency
// @route   GET /api/v1/analytics/draw-frequency
const getDrawFrequency = async (req, res) => {
    try {
        const draws = await Game.countDocuments({ winner: "draw", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        
        res.json({
            success: true,
            data: {
                draws,
                total,
                drawRate: ((draws / total) * 100).toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Opening success analytics
// @route   GET /api/v1/analytics/opening-success
const getOpeningSuccess = async (req, res) => {
    try {
        const openings = await Opening.find()
            .sort({ totalGames: -1 })
            .limit(10)
            .select("eco name whiteWinRate blackWinRate totalGames");
        
        res.json({ success: true, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Total matches count
// @route   GET /api/v1/stats/total-matches
const getTotalMatches = async (req, res) => {
    try {
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Total players count
// @route   GET /api/v1/stats/total-players
const getTotalPlayers = async (req, res) => {
    try {
        const total = await Player.countDocuments();
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Average rating
// @route   GET /api/v1/stats/average-rating
const getAverageRating = async (req, res) => {
    try {
        const result = await Player.aggregate([
            { $group: {
                _id: null,
                averageRating: { $avg: "$currentRating" }
            }}
        ]);
        
        res.json({ success: true, averageRating: Math.round(result[0]?.averageRating || 0) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getVictoryDistribution,
    getColorAdvantage,
    getAverageTurnCount,
    getRatedVsCasual,
    getTimeControlUsage,
    getShortestGames,
    getLongestGames,
    getCheckmateFrequency,
    getDrawFrequency,
    getOpeningSuccess,
    getTotalMatches,
    getTotalPlayers,
    getAverageRating
};
