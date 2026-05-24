const express = require("express");
const router = express.Router();
const {
    searchMatches,
    searchPlayers,
    searchOpenings,
    searchEco,
    searchMoves,
    fuzzySearch,
    autocomplete,
    searchByPlayerRating,
    searchByDateRange
} = require("../controllers/searchController");

// Search routes
router.get("/matches", searchMatches);
router.get("/players", searchPlayers);
router.get("/openings", searchOpenings);
router.get("/eco", searchEco);
router.get("/moves", searchMoves);
router.get("/fuzzy", fuzzySearch);
router.get("/autocomplete", autocomplete);
router.get("/player-rating", searchByPlayerRating);
router.get("/date-range", searchByDateRange);

module.exports = router;
