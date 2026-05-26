const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");

// Victory distribution
const getVictoryDistribution = async (req, res) => {
    try {
        const distribution = await Game.aggregate([
            { $match: { isArchived: false } },
            { $group: { _id: "$winner", count: { $sum: 1 } } },
            { $project: { outcome: "$_id", count: 1, _id: 0 } }
        ]);
        res.json({ success: true, data: distribution });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Color advantage
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

// Average turn count
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

// Rated vs casual
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

// Time control usage
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

// Shortest games
const getShortestGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort({ turns: 1 }).limit(limit).select("gameId white.username black.username turns winner");
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Longest games
const getLongestGames = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort({ turns: -1 }).limit(limit).select("gameId white.username black.username turns winner");
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Checkmate frequency
const getCheckmateFrequency = async (req, res) => {
    try {
        const checkmates = await Game.countDocuments({ victoryStatus: "mate", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, data: { checkmates, total, frequency: ((checkmates / total) * 100).toFixed(2) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Draw frequency
const getDrawFrequency = async (req, res) => {
    try {
        const draws = await Game.countDocuments({ winner: "draw", isArchived: false });
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, data: { draws, total, drawRate: ((draws / total) * 100).toFixed(2) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Opening success
const getOpeningSuccess = async (req, res) => {
    try {
        const openings = await Opening.find().sort({ totalGames: -1 }).limit(10).select("eco name whiteWinRate blackWinRate totalGames");
        res.json({ success: true, data: openings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Total matches
const getTotalMatches = async (req, res) => {
    try {
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Total players
const getTotalPlayers = async (req, res) => {
    try {
        const total = await Player.countDocuments();
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Average rating
const getAverageRating = async (req, res) => {
    try {
        const result = await Player.aggregate([{ $group: { _id: null, averageRating: { $avg: "$currentRating" } } }]);
        res.json({ success: true, averageRating: Math.round(result[0]?.averageRating || 0) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Rating gap upsets
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

// Player growth
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

// Hourly activity
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
    getHourlyActivity
};
