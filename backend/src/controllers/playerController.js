const Player = require("../models/Player");
const Game = require("../models/Game");

// @desc    Get all players with pagination
const getAllPlayers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        let sort = {};
        if (req.query.sort) {
            const sortField = req.query.sort.startsWith("-") ? req.query.sort.substring(1) : req.query.sort;
            const sortOrder = req.query.sort.startsWith("-") ? -1 : 1;
            sort[sortField] = sortOrder;
        } else {
            sort = { currentRating: -1 };
        }
        
        const players = await Player.find().sort(sort).skip(skip).limit(limit);
        const total = await Player.countDocuments();
        
        const playersWithRates = players.map(player => ({
            ...player.toObject(),
            winRate: player.winRate,
            lossRate: player.lossRate,
            drawRate: player.drawRate
        }));
        
        res.json({ success: true, count: players.length, total, page, pages: Math.ceil(total / limit), data: playersWithRates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player by username
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

// @desc    Get player statistics
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

// @desc    Get player history - FIXED
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
        }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        // Transform games to show correct result for this player
        const transformedGames = games.map(game => {
            const isWhite = game.white.username === req.params.username;
            let result = 'Loss';
            
            if (game.winner === 'draw') {
                result = 'Draw';
            } else if (isWhite && game.winner === 'white') {
                result = 'Win';
            } else if (!isWhite && game.winner === 'black') {
                result = 'Win';
            }
            
            return {
                _id: game._id,
                gameId: game.gameId,
                opponent: isWhite ? game.black.username : game.white.username,
                opponentRating: isWhite ? game.black.rating : game.white.rating,
                playerColor: isWhite ? 'White' : 'Black',
                result: result,
                turns: game.turns,
                createdAt: game.createdAt,
                winner: game.winner
            };
        });
        
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
            data: transformedGames 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get top rated players
const getTopRatedPlayers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const players = await Player.find().sort({ currentRating: -1 }).limit(limit);
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get top active players
const getTopActivePlayers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const players = await Player.find().sort({ totalGames: -1 }).limit(limit);
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get top winning players
const getTopWinningPlayers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const players = await Player.find().sort({ wins: -1 }).limit(limit);
        res.json({ success: true, count: players.length, data: players });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Compare two players
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
const getPlayersByRatingRange = async (req, res) => {
    try {
        const min = parseInt(req.query.min) || 0;
        const max = parseInt(req.query.max) || 3000;
        const players = await Player.find({ currentRating: { $gte: min, $lte: max } }).sort({ currentRating: -1 });
        res.json({ success: true, count: players.length, data: players, range: { min, max } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get recent matches of a player
const getPlayerRecentMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const games = await Game.find({
            $or: [
                { "white.username": req.params.username },
                { "black.username": req.params.username }
            ]
        }).sort({ createdAt: -1 }).limit(limit);
        
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player openings usage
const getPlayerOpenings = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        res.json({ success: true, username: player.username, openingsUsed: player.openingsUsed });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player rating history
const getPlayerRatingHistory = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
        
        const games = await Game.find({
            $or: [
                { "white.username": req.params.username },
                { "black.username": req.params.username }
            ]
        }).sort({ createdAt: 1 }).select("white.username white.rating black.username black.rating createdAt winner");
        
        const ratingHistory = [];
        for (const game of games) {
            const isWhite = game.white.username === req.params.username;
            ratingHistory.push({
                date: game.createdAt,
                rating: isWhite ? game.white.rating : game.black.rating,
                opponent: isWhite ? game.black.username : game.white.username,
                result: game.winner === req.params.username ? "win" : game.winner === "draw" ? "draw" : "loss"
            });
        }
        
        res.json({ success: true, username: req.params.username, currentRating: player.currentRating, ratingHistory });
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
    getTopRatedPlayers,
    getTopActivePlayers,
    getTopWinningPlayers,
    comparePlayers,
    getPlayersByRatingRange,
    getPlayerRecentMatches,
    getPlayerRatingHistory
};
