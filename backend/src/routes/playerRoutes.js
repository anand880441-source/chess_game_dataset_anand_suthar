const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/playerController");

router.get("/top-rated", getTopRatedPlayers);
router.get("/top-active", getTopActivePlayers);
router.get("/top-winning", getTopWinningPlayers);
router.get("/rating-range", getPlayersByRatingRange);
router.get("/compare/:player1/:player2", comparePlayers);
router.get("/", getAllPlayers);
router.get("/:username", getPlayerByUsername);
router.get("/:username/history", getPlayerHistory);
router.get("/:username/stats", getPlayerStats);
router.get("/:username/openings", getPlayerOpenings);
router.get("/:username/recent", getPlayerRecentMatches);
router.get("/:username/rating-history", getPlayerRatingHistory);

module.exports = router;
