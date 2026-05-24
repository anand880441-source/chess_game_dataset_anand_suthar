const Player = require("../models/Player");
const Game = require("../models/Game");

// @desc    Get all players with pagination
// @route   GET /api/v1/players
const getAllPlayers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const players = await Player.find()
            .sort({ totalGames: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Player.countDocuments();
        
        res.json({
            success: true,
            count: players.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: players
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player details by username
// @route   GET /api/v1/players/:username
const getPlayerByUsername = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        res.json({ success: true, data: player });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player match history
// @route   GET /api/v1/players/:username/history
const getPlayerHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const games = await Game.find({
            $or: [
                { "white.username": req.params.username },
                { "black.username": req.params.username }
            ],
            isArchived: false
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
        const total = await Game.countDocuments({
            $or: [
                { "white.username": req.params.username },
                { "black.username": req.params.username }
            ],
            isArchived: false
        });
        
        res.json({
            success: true,
            count: games.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: games
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player statistics
// @route   GET /api/v1/players/:username/stats
const getPlayerStats = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        
        res.json({
            success: true,
            data: {
                username: player.username,
                totalGames: player.totalGames,
                wins: player.wins,
                losses: player.losses,
                draws: player.draws,
                winRate: player.winRate,
                lossRate: player.lossRate,
                drawRate: player.drawRate,
                currentRating: player.currentRating,
                lastPlayedAt: player.lastPlayedAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player opening usage
// @route   GET /api/v1/players/:username/openings
const getPlayerOpenings = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        
        res.json({
            success: true,
            username: player.username,
            openingsUsed: player.openingsUsed.sort((a, b) => b.count - a.count)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player win percentage
// @route   GET /api/v1/players/:username/win-rate
const getPlayerWinRate = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        
        res.json({
            success: true,
            username: player.username,
            winRate: player.winRate,
            wins: player.wins,
            totalGames: player.totalGames
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get top rated players
// @route   GET /api/v1/players/top-rated
const getTopRatedPlayers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const players = await Player.find()
            .sort({ currentRating: -1 })
            .limit(limit);
        
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get most active players
// @route   GET /api/v1/players/top-active
const getTopActivePlayers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const players = await Player.find()
            .sort({ totalGames: -1 })
            .limit(limit);
        
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get highest winning players
// @route   GET /api/v1/players/top-winning
const getTopWinningPlayers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const players = await Player.find()
            .sort({ wins: -1 })
            .limit(limit);
        
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Compare two players
// @route   GET /api/v1/players/compare/:player1/:player2
const comparePlayers = async (req, res) => {
    try {
        const player1 = await Player.findOne({ username: req.params.player1 });
        const player2 = await Player.findOne({ username: req.params.player2 });
        
        if (!player1 || !player2) {
            return res.status(404).json({ success: false, message: "One or both players not found" });
        }
        
        res.json({
            success: true,
            comparison: {
                player1: {
                    username: player1.username,
                    rating: player1.currentRating,
                    totalGames: player1.totalGames,
                    winRate: player1.winRate
                },
                player2: {
                    username: player2.username,
                    rating: player2.currentRating,
                    totalGames: player2.totalGames,
                    winRate: player2.winRate
                },
                advantage: player1.currentRating > player2.currentRating ? player1.username : player2.username
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Filter players by rating range
// @route   GET /api/v1/players/rating-range?min=1200&max=2000
const getPlayersByRatingRange = async (req, res) => {
    try {
        const min = parseInt(req.query.min) || 0;
        const max = parseInt(req.query.max) || 3000;
        
        const players = await Player.find({
            currentRating: { $gte: min, $lte: max }
        }).sort({ currentRating: -1 });
        
        res.json({
            success: true,
            count: players.length,
            data: players,
            range: { min, max }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get recent matches of a player
// @route   GET /api/v1/players/:username/recent
const getPlayerRecentMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const games = await Game.find({
            $or: [
                { "white.username": req.params.username },
                { "black.username": req.params.username }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(limit);
        
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerByUsername,
    getPlayerHistory,
    getPlayerStats,
    getPlayerOpenings,
    getPlayerWinRate,
    getTopRatedPlayers,
    getTopActivePlayers,
    getTopWinningPlayers,
    comparePlayers,
    getPlayersByRatingRange,
    getPlayerRecentMatches
};
