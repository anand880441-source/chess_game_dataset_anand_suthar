const express = require("express");
const router = express.Router();
const {
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
    getAverageRating
} = require("../controllers/analyticsController");

// Analytics routes
router.get("/victory-distribution", getVictoryDistribution);
router.get("/color-advantage", getColorAdvantage);
router.get("/turn-count-average", getAverageTurnCount);
router.get("/rated-vs-casual", getRatedVsCasual);
router.get("/time-control-usage", getTimeControlUsage);
router.get("/shortest-games", getShortestGames);
router.get("/longest-games", getLongestGames);
router.get("/checkmate-frequency", getCheckmateFrequency);
router.get("/draw-frequency", getDrawFrequency);
router.get("/opening-success", getOpeningSuccess);

// Statistics routes
router.get("/stats/total-matches", getTotalMatches);
router.get("/stats/total-players", getTotalPlayers);
router.get("/stats/average-rating", getAverageRating);

module.exports = router;
