const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");
const { Chess } = require("chess.js");

// @desc    Get all games with pagination, filtering, sorting
const getAllGames = async (req, res) => {
    try {
        let query = { isArchived: false };
        if (req.query.rated) query.rated = req.query.rated === "true";
        if (req.query.winner) query.winner = req.query.winner;
        if (req.query.victoryStatus) query.victoryStatus = req.query.victoryStatus;
        if (req.query.white) query["white.username"] = req.query.white;
        if (req.query.black) query["black.username"] = req.query.black;
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortField = req.query.sort || "-createdAt";
        
        const games = await Game.find(query).sort(sortField).skip(skip).limit(limit);
        const total = await Game.countDocuments(query);
        
        res.status(200).json({ success: true, count: games.length, total, page, pages: Math.ceil(total / limit), data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single game by ID
const getGameById = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.status(200).json({ success: true, data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new game
const createGame = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update game
const updateGame = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate({ gameId: req.params.matchId }, req.body, { new: true, runValidators: true });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.status(200).json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete game
const deleteGame = async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.status(200).json({ success: true, message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get game moves
const getGameMoves = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId }).select("moves turns");
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        const movesArray = game.moves.split(" ");
        res.status(200).json({ success: true, gameId: req.params.matchId, totalMoves: game.turns, moves: movesArray, movesNotation: game.moves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get latest matches
const getLatestMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort("-createdAt").limit(limit);
        res.status(200).json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get trending matches
const getTrendingMatches = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false }).sort("-turns").limit(limit);
        res.status(200).json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Archive a match
const archiveMatch = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate({ gameId: req.params.matchId }, { isArchived: true }, { new: true });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.status(200).json({ success: true, message: "Game archived", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Restore archived match
const restoreMatch = async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate({ gameId: req.params.matchId }, { isArchived: false }, { new: true });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        res.status(200).json({ success: true, message: "Game restored", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get PGN notation
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

// @desc    Get random match
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

// @desc    Get FEN notation
const getGameFen = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        
        const chess = new Chess();
        const movesArray = game.moves.split(" ");
        for (const move of movesArray) { chess.move(move); }
        
        res.json({ success: true, gameId: req.params.matchId, fen: chess.fen(), lastMove: movesArray[movesArray.length - 1], isCheckmate: chess.isCheckmate(), isCheck: chess.isCheck(), isStalemate: chess.isStalemate() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get basic analysis
const getGameAnalysis = async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) return res.status(404).json({ success: false, message: "Game not found" });
        
        const chess = new Chess();
        const movesArray = game.moves.split(" ");
        for (const move of movesArray) { chess.move(move); }
        
        const board = chess.board();
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
        let whiteMaterial = 0, blackMaterial = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const value = pieceValues[piece.type];
                    if (piece.color === "w") whiteMaterial += value;
                    else blackMaterial += value;
                }
            }
        }
        
        res.json({ success: true, gameId: req.params.matchId, analysis: { totalMoves: game.turns, materialAdvantage: whiteMaterial - blackMaterial, winner: game.winner, victoryType: game.victoryStatus, openingName: game.opening.name, openingEco: game.opening.eco }, position: { whiteMaterial, blackMaterial, advantage: whiteMaterial > blackMaterial ? "White" : blackMaterial > whiteMaterial ? "Black" : "Equal" } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get player rating history
const getPlayerRatingHistory = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.params.username });
        if (!player) return res.status(404).json({ success: false, message: "Player not found" });
        
        const games = await Game.find({ $or: [{ "white.username": req.params.username }, { "black.username": req.params.username }] }).sort({ createdAt: 1 }).select("white.username white.rating black.username black.rating createdAt winner");
        
        const ratingHistory = [];
        for (const game of games) {
            const isWhite = game.white.username === req.params.username;
            ratingHistory.push({ date: game.createdAt, rating: isWhite ? game.white.rating : game.black.rating, opponent: isWhite ? game.black.username : game.white.username, result: game.winner === req.params.username ? "win" : game.winner === "draw" ? "draw" : "loss" });
        }
        
        res.json({ success: true, username: req.params.username, currentRating: player.currentRating, ratingHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Simple filter function for time controls and results
const getFilteredMatches = async (req, res) => {
    try {
        const filterType = req.params.type || req.query.type;
        const limit = parseInt(req.query.limit) || 10;
        let filter = { isArchived: false };
        
        switch(filterType) {
            case "rated": filter.rated = true; break;
            case "unrated": filter.rated = false; break;
            case "white-wins": filter.winner = "white"; break;
            case "black-wins": filter.winner = "black"; break;
            case "draws": filter.winner = "draw"; break;
            case "blitz": filter.incrementCode = { $regex: /^3\+[0-9]|^5\+[0-9]/ }; break;
            case "rapid": filter.incrementCode = { $regex: /^10\+[0-9]|^15\+[0-9]/ }; break;
            case "bullet": filter.incrementCode = { $regex: /^[0-2]\+[0-9]|^1\+/ }; break;
            case "classical": filter.incrementCode = { $regex: /^30\+[0-9]|^45\+[0-9]|^60\+/ }; break;
            default: break;
        }
        
        const games = await Game.find(filter).limit(limit);
        res.json({ success: true, count: games.length, type: filterType, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllGames, getGameById, createGame, updateGame, deleteGame, getGameMoves,
    getLatestMatches, getTrendingMatches, archiveMatch, restoreMatch, getGamePgn, getRandomMatch,
    getGameFen, getGameAnalysis, getPlayerRatingHistory, getFilteredMatches
};
