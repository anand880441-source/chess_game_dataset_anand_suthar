const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");
const { Chess } = require("chess.js");

// ============ BASIC CRUD ============

const getAllGames = async (req, res) => {
    try {
        let query = { isArchived: false };
        if (req.query.rated) query.rated = req.query.rated === "true";
        if (req.query.winner) query.winner = req.query.winner;
        if (req.query.victoryStatus) query.victoryStatus = req.query.victoryStatus;
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortField = req.query.sort || "-createdAt";
        
        const games = await Game.find(query).sort(sortField).skip(skip).limit(limit);
        const total = await Game.countDocuments(query);
        
        res.json({ success: true, count: games.length, total, page, pages: Math.ceil(total / limit), data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGameById = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.json({ success: true, data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createGame = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateGame = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate({ gameId: req.params.matchId }, req.body, { new: true });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteGame = async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.json({ success: true, message: "Game deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGameMoves = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId }).select("moves turns");
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        const movesArray = game.moves.split(" ");
        res.json({ success: true, gameId: req.params.matchId, totalMoves: game.turns, moves: movesArray });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLatestMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort("-createdAt").limit(limit);
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTrendingMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort("-turns").limit(limit);
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const archiveMatch = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate({ gameId: req.params.matchId }, { isArchived: true }, { new: true });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.json({ success: true, message: "Game archived", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const restoreMatch = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate({ gameId: req.params.matchId }, { isArchived: false }, { new: true });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.json({ success: true, message: "Game restored", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGamePgn = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        const result = game.winner === "white" ? "1-0" : game.winner === "black" ? "0-1" : "1/2-1/2";
        const pgn = `[Event "Chess Game"]\n[Site "Chess Platform"]\n[Date "${game.createdAt.toISOString().split('T')[0]}"]\n[White "${game.white.username}"]\n[Black "${game.black.username}"]\n[Result "${result}"]\n[WhiteElo "${game.white.rating}"]\n[BlackElo "${game.black.rating}"]\n[TimeControl "${game.incrementCode}"]\n\n${game.moves}`;
        res.json({ success: true, pgn });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRandomMatch = async (req, res) => {
    try {
        const count = await Game.countDocuments({ isArchived: false });
        const random = Math.floor(Math.random() * count);
        const game = await Game.findOne({ isArchived: false }).skip(random);
        res.json({ success: true, data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGameFen = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        const chess = new Chess();
        const movesArray = game.moves.split(" ");
        for (const move of movesArray) chess.move(move);
        res.json({ success: true, gameId: req.params.matchId, fen: chess.fen() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGameAnalysis = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        const chess = new Chess();
        const movesArray = game.moves.split(" ");
        for (const move of movesArray) chess.move(move);
        res.json({ success: true, gameId: req.params.matchId, analysis: { totalMoves: game.turns, winner: game.winner, victoryType: game.victoryStatus, openingName: game.opening.name } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPlayerRatingHistory = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) return res.status(404).json({ success: false, message: "Player not found" });
        const games = await Game.find({ $or: [{ "white.username": req.params.username }, { "black.username": req.params.username }] }).sort({ createdAt: 1 });
        const ratingHistory = [];
        for (const game of games) {
            const isWhite = game.white.username === req.params.username;
            ratingHistory.push({ date: game.createdAt, rating: isWhite ? game.white.rating : game.black.rating, opponent: isWhite ? game.black.username : game.white.username });
        }
        res.json({ success: true, username: req.params.username, currentRating: player.currentRating, ratingHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFilteredMatches = async (req, res) => {
    try {
        const type = req.params.type;
        const limit = parseInt(req.query.limit) || 10;
        let filter = { isArchived: false };
        if (type === "white-wins") filter.winner = "white";
        else if (type === "black-wins") filter.winner = "black";
        else if (type === "draws") filter.winner = "draw";
        else if (type === "rated") filter.rated = true;
        else if (type === "unrated") filter.rated = false;
        else if (type === "blitz") filter.incrementCode = { $regex: /^3\+[0-9]|^5\+[0-9]/ };
        else if (type === "rapid") filter.incrementCode = { $regex: /^10\+[0-9]|^15\+[0-9]/ };
        const games = await Game.find(filter).limit(limit);
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADVANCED PAGINATION (PR #17) ============

const getMatchesCursor = async (req, res) => {
    try {
        const cursor = req.query.cursor;
        const limit = parseInt(req.query.limit) || 10;
        let query = { isArchived: false };
        if (cursor) query._id = { $lt: cursor };
        const games = await Game.find(query).sort({ _id: -1 }).limit(limit);
        const nextCursor = games.length === limit ? games[games.length - 1]._id : null;
        res.json({ success: true, count: games.length, nextCursor, hasMore: nextCursor !== null, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMatchesInfinite = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const games = await Game.find({ isArchived: false }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Game.countDocuments({ isArchived: false });
        res.json({ success: true, count: games.length, page, hasMore: skip + games.length < total, total, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllGames, getGameById, createGame, updateGame, deleteGame, getGameMoves,
    getLatestMatches, getTrendingMatches, archiveMatch, restoreMatch, getGamePgn, getRandomMatch,
    getGameFen, getGameAnalysis, getPlayerRatingHistory, getFilteredMatches,
    getMatchesCursor, getMatchesInfinite
};
