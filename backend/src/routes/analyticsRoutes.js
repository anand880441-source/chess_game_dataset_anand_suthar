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

// All analytics routes
router.get("/analytics/victory-distribution", getVictoryDistribution);
router.get("/analytics/color-advantage", getColorAdvantage);
router.get("/analytics/turn-count-average", getAverageTurnCount);
router.get("/analytics/rated-vs-casual", getRatedVsCasual);
router.get("/analytics/time-control-usage", getTimeControlUsage);
router.get("/analytics/shortest-games", getShortestGames);
router.get("/analytics/longest-games", getLongestGames);
router.get("/analytics/checkmate-frequency", getCheckmateFrequency);
router.get("/analytics/draw-frequency", getDrawFrequency);
router.get("/analytics/opening-success", getOpeningSuccess);
router.get("/analytics/rating-gap-upsets", getRatingGapUpsets);
router.get("/analytics/player-growth", getPlayerGrowth);
router.get("/analytics/hourly-activity", getHourlyActivity);
router.get("/analytics/stats/daily-games", getDailyGames);
router.get("/analytics/stats/monthly-games", getMonthlyGames);
router.get("/analytics/stats/yearly-games", getYearlyGames);
router.get("/analytics/stats/total-matches", getTotalMatches);
router.get("/analytics/stats/total-players", getTotalPlayers);
router.get("/analytics/stats/average-rating", getAverageRating);
router.get("/analytics/openings/checkmates", getFastestMateOpenings);

module.exports = router;
