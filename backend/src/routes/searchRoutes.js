const express = require("express");
const router = express.Router();
const {
    globalSearch,
    getAutocomplete,
    searchMatches,
    searchPlayers,
    searchOpenings,
    searchByEco
} = require("../controllers/searchController");

router.get("/global", globalSearch);
router.get("/autocomplete", getAutocomplete);
router.get("/matches", searchMatches);
router.get("/players", searchPlayers);
router.get("/openings", searchOpenings);
router.get("/eco", searchByEco);

module.exports = router;
