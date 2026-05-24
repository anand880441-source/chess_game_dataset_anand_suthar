const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");

// @desc    Get all games with pagination, filtering, sorting
// @route   GET /api/v1/matches
// @access  Public
const getAllGames = async (req, res) => {
    try {
        let query = { isArchived: false };
        
        // Filtering
        if (req.query.rated) query.rated = req.query.rated === "true";
        if (req.query.winner) query.winner = req.query.winner;
        if (req.query.victoryStatus) query.victoryStatus = req.query.victoryStatus;
        if (req.query.white) query["white.username"] = req.query.white;
        if (req.query.black) query["black.username"] = req.query.black;
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Sorting
        const sortField = req.query.sort || "-createdAt";
        
        const games = await Game.find(query)
            .sort(sortField)
            .skip(skip)
            .limit(limit);
        
        const total = await Game.countDocuments(query);
        
        res.status(200).json({
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

// @desc    Get single game by ID
// @route   GET /api/v1/matches/:matchId
// @access  Public
const getGameById = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        res.status(200).json({ success: true, data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new game
// @route   POST /api/v1/matches
// @access  Public
const createGame = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update game
// @route   PUT /api/v1/matches/:matchId
// @access  Public
const updateGame = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { gameId: req.params.matchId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        res.status(200).json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete game
// @route   DELETE /api/v1/matches/:matchId
// @access  Public
const deleteGame = async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({ gameId: req.params.matchId });
        
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        res.status(200).json({ success: true, message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get game moves
// @route   GET /api/v1/matches/:matchId/moves
// @access  Public
const getGameMoves = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId }).select("moves turns");
        
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        const movesArray = game.moves.split(" ");
        
        res.status(200).json({
            success: true,
            gameId: req.params.matchId,
            totalMoves: game.turns,
            moves: movesArray,
            movesNotation: game.moves
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get latest matches
// @route   GET /api/v1/matches/latest
// @access  Public
const getLatestMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false })
            .sort("-createdAt")
            .limit(limit);
        
        res.status(200).json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get trending matches (most viewed/popular)
// @route   GET /api/v1/matches/trending
// @access  Public
const getTrendingMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        // Trending based on most moves or recent high-rated games
        const games = await Game.find({ isArchived: false })
            .sort("-turns", "-createdAt")
            .limit(limit);
        
        res.status(200).json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Archive a match
// @route   PATCH /api/v1/matches/:matchId/archive
// @access  Public
const archiveMatch = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { gameId: req.params.matchId },
            { isArchived: true },
            { new: true }
        );
        
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        res.status(200).json({ success: true, message: "Game archived", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Restore archived match
// @route   PATCH /api/v1/matches/:matchId/restore
// @access  Public
const restoreMatch = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { gameId: req.params.matchId },
            { isArchived: false },
            { new: true }
        );
        
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        res.status(200).json({ success: true, message: "Game restored", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getGameMoves,
    getLatestMatches,
    getTrendingMatches,
    archiveMatch,
    restoreMatch
};
