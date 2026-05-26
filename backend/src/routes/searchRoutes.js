const express = require("express");
const router = express.Router();
const {
    searchMatches,
    searchPlayers,
    searchOpenings,
    searchEco,
    getRecentSearches,
    getPopularSearches,
    advancedSearch
} = require("../controllers/searchController");

// Search routes
router.get("/matches", searchMatches);
router.get("/players", searchPlayers);
router.get("/openings", searchOpenings);
router.get("/eco", searchEco);
router.get("/recent", getRecentSearches);
router.get("/popular", getPopularSearches);
router.get("/advanced", advancedSearch);

module.exports = router;
