const express = require("express");
const router = express.Router();
const {
    getAllOpenings,
    getPopularOpenings,
    getTrendingOpenings,
    getOpeningByEco,
    searchOpenings,
    getOpeningWinRates,
    getAggressiveOpenings,
    getDefensiveOpenings,
    getGambitOpenings,
    getOpeningsByComplexity,
    getBeginnerFriendlyOpenings,
    getWhiteAdvantageOpenings,
    getRareOpenings
} = require("../controllers/openingController");

// Special routes (must be before /:ecoCode)
router.get("/popular", getPopularOpenings);
router.get("/trending", getTrendingOpenings);
router.get("/search", searchOpenings);
router.get("/win-rates", getOpeningWinRates);
router.get("/aggressive", getAggressiveOpenings);
router.get("/defensive", getDefensiveOpenings);
router.get("/gambits", getGambitOpenings);
router.get("/complexity", getOpeningsByComplexity);
router.get("/beginner-friendly", getBeginnerFriendlyOpenings);
router.get("/white-advantage", getWhiteAdvantageOpenings);
router.get("/rare", getRareOpenings);

// Parameter routes
router.get("/eco/:ecoCode", getOpeningByEco);

// Main route
router.get("/", getAllOpenings);

module.exports = router;
