const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/playerController");

// Top players routes (must be before /:username routes)
router.get("/top-rated", getTopRatedPlayers);
router.get("/top-active", getTopActivePlayers);
router.get("/top-winning", getTopWinningPlayers);
router.get("/rating-range", getPlayersByRatingRange);
router.get("/compare/:player1/:player2", comparePlayers);

// Player specific routes
router.get("/", getAllPlayers);
router.get("/:username", getPlayerByUsername);
router.get("/:username/history", getPlayerHistory);
router.get("/:username/stats", getPlayerStats);
router.get("/:username/openings", getPlayerOpenings);
router.get("/:username/win-rate", getPlayerWinRate);
router.get("/:username/recent", getPlayerRecentMatches);

module.exports = router;
