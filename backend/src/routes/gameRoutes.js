const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const {
    getAllGames, getGameById, createGame, updateGame, deleteGame, getGameMoves,
    getLatestMatches, getTrendingMatches, archiveMatch, restoreMatch, getGamePgn, getRandomMatch,
    getGameFen, getGameAnalysis, getPlayerRatingHistory, getFilteredMatches,
    getMatchesCursor, getMatchesInfinite
} = require("../controllers/gameController");

// Test route
router.get("/test", (req, res) => { res.json({ success: true, message: "Game routes are working!" }); });

// Main CRUD routes
router.get("/", getAllGames);
router.get("/latest/list", getLatestMatches);
router.get("/trending/list", getTrendingMatches);
router.get("/random/game", getRandomMatch);
router.post("/", createGame);

// Advanced Pagination Routes (PR #17)
router.get("/scroll", getMatchesCursor);
router.get("/infinite", getMatchesInfinite);

// Filter routes
router.get("/filter/:type", getFilteredMatches);
router.get("/filter/rated", getFilteredMatches);
router.get("/filter/unrated", getFilteredMatches);
router.get("/filter/white-wins", getFilteredMatches);
router.get("/filter/black-wins", getFilteredMatches);
router.get("/filter/draws", getFilteredMatches);
router.get("/filter/blitz", getFilteredMatches);
router.get("/filter/rapid", getFilteredMatches);

// Parameter routes
router.get("/:matchId", getGameById);
router.get("/:matchId/moves", getGameMoves);
router.get("/:matchId/pgn", getGamePgn);
router.get("/:matchId/fen", getGameFen);
router.get("/:matchId/analysis", getGameAnalysis);
router.put("/:matchId", updateGame);
router.delete("/:matchId", deleteGame);
router.patch("/:matchId/archive", archiveMatch);
router.patch("/:matchId/restore", restoreMatch);

module.exports = router;
