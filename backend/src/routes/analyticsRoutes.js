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
    getAverageRating,
    getRatingGapUpsets,
    getPlayerGrowth,
    getHourlyActivity,
    getDailyGames,
    getMonthlyGames,
    getYearlyGames,
    getFastestMateOpenings
} = require("../controllers/analyticsController");

// Analytics routes - now under /api/v1/analytics (no need for extra /analytics in path)
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
router.get("/rating-gap-upsets", getRatingGapUpsets);
router.get("/player-growth", getPlayerGrowth);
router.get("/hourly-activity", getHourlyActivity);
router.get("/openings/checkmates", getFastestMateOpenings);

// Statistics routes
router.get("/stats/total-matches", getTotalMatches);
router.get("/stats/total-players", getTotalPlayers);
router.get("/stats/average-rating", getAverageRating);

// Time-based statistics routes
router.get("/stats/daily-games", getDailyGames);
router.get("/stats/monthly-games", getMonthlyGames);
router.get("/stats/yearly-games", getYearlyGames);

module.exports = router;
