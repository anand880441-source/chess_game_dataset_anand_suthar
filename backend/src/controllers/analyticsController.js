const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");

// ============ BASIC ANALYTICS ============

const getVictoryDistribution = async (req, res) => {
    try {
        const distribution = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: "$winner", count: { $sum: 1 } } }
        ]);
        res.json({ success: true, data: distribution });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getColorAdvantage = async (req, res) => {
    try {
        const whiteWins = await Game.countDocuments({ winner: "white", isArchived: false });
        const blackWins = await Game.countDocuments({ winner: "black", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, data: { whiteWins, blackWins, whiteWinRate: ((whiteWins / total) * 100).toFixed(2), blackWinRate: ((blackWins / total) * 100).toFixed(2) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAverageTurnCount = async (req, res) => {
    try {
        const result = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: null, averageTurns: { $avg: "$turns" }, minTurns: { $min: "$turns" }, maxTurns: { $max: "$turns" } } }
        ]);
        res.json({ success: true, data: result[0] || { averageTurns: 0, minTurns: 0, maxTurns: 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRatedVsCasual = async (req, res) => {
    try {
        const rated = await Game.countDocuments({ rated: true, isArchived: false });
        const unrated = await Game.countDocuments({ rated: false, isArchived: false });
        const total = rated + unrated;
        res.json({ success: true, data: { rated, unrated, ratedPercentage: ((rated / total) * 100).toFixed(2), unratedPercentage: ((unrated / total) * 100).toFixed(2) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTimeControlUsage = async (req, res) => {
    try {
        const timeControls = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: "$incrementCode", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.json({ success: true, data: timeControls });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getShortestGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort({ turns: 1 }).limit(limit);
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLongestGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort({ turns: -1 }).limit(limit);
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCheckmateFrequency = async (req, res) => {
    try {
        const checkmates = await Game.countDocuments({ victoryStatus: "mate", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, data: { checkmates, total, frequency: ((checkmates / total) * 100).toFixed(2) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDrawFrequency = async (req, res) => {
    try {
        const draws = await Game.countDocuments({ winner: "draw", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, data: { draws, total, drawRate: ((draws / total) * 100).toFixed(2) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOpeningSuccess = async (req, res) => {
    try {
        const openings = await Opening.find().sort({ totalGames: -1 }).limit(10);
        res.json({ success: true, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ STATISTICS ============

const getTotalMatches = async (req, res) => {
    try {
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTotalPlayers = async (req, res) => {
    try {
        const total = await Player.countDocuments();
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAverageRating = async (req, res) => {
    try {
        const result = await Player.aggregate([{ $group: { _id: null, averageRating: { $avg: "$currentRating" } } }]);
        res.json({ success: true, averageRating: Math.round(result[0]?.averageRating || 0) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADVANCED ANALYTICS ============

const getRatingGapUpsets = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const upsets = await Game.find({
            isArchived: false,
            $or: [
                { winner: "white", $expr: { $lt: ["$white.rating", "$black.rating"] } },
                { winner: "black", $expr: { $lt: ["$black.rating", "$white.rating"] } }
            ]
        }).sort({ createdAt: -1 }).limit(limit);
        const upsetCount = await Game.countDocuments({
            isArchived: false,
            $or: [
                { winner: "white", $expr: { $lt: ["$white.rating", "$black.rating"] } },
                { winner: "black", $expr: { $lt: ["$black.rating", "$white.rating"] } }
            ]
        });
        res.json({ success: true, count: upsets.length, totalUpsets: upsetCount, data: upsets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPlayerGrowth = async (req, res) => {
    try {
        const growth = await Player.aggregate([
            { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, newPlayers: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $project: { year: "$_id.year", month: "$_id.month", newPlayers: 1, _id: 0 } }
        ]);
        res.json({ success: true, data: growth });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getHourlyActivity = async (req, res) => {
    try {
        const hourlyStats = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: { hour: { $hour: "$createdAt" } }, games: { $sum: 1 } } },
            { $sort: { "_id.hour": 1 } },
            { $project: { hour: "$_id.hour", games: 1, _id: 0 } }
        ]);
        res.json({ success: true, data: hourlyStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ TIME-BASED STATISTICS ============

const getDailyGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const stats = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } }, games: { $sum: 1 } } },
            { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
            { $limit: limit }
        ]);
        res.json({ success: true, count: stats.length, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMonthlyGames = async (req, res) => {
    try {
        const stats = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, games: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        res.json({ success: true, count: stats.length, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getYearlyGames = async (req, res) => {
    try {
        const stats = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: { year: { $year: "$createdAt" } }, games: { $sum: 1 } } },
            { $sort: { "_id.year": 1 } }
        ]);
        res.json({ success: true, count: stats.length, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ FASTEST MATE OPENINGS ============

const getFastestMateOpenings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const fastestMates = await Game.aggregate([
            { $match: { victoryStatus: "mate", isArchived: false } },
            {
                $group: {
                    _id: { eco: "$opening.eco", name: "$opening.name" },
                    games: { $sum: 1 },
                    avgTurns: { $avg: "$turns" },
                    minTurns: { $min: "$turns" }
                }
            },
            { $sort: { minTurns: 1 } },
            { $limit: limit },
            {
                $project: {
                    eco: "$_id.eco",
                    name: "$_id.name",
                    totalCheckmates: "$games",
                    averageTurnsToMate: { $round: ["$avgTurns", 0] },
                    fastestMate: "$minTurns",
                    _id: 0
                }
            }
        ]);
        res.json({ success: true, count: fastestMates.length, data: fastestMates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ EXPORTS ============

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
    getAverageRating,
    getRatingGapUpsets,
    getPlayerGrowth,
    getHourlyActivity,
    getDailyGames,
    getMonthlyGames,
    getYearlyGames,
    getFastestMateOpenings
};
