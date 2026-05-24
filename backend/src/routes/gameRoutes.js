const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

// Test route to verify routing works
router.get("/test", (req, res) => {
    res.json({ success: true, message: "Game routes are working!" });
});

// Get all matches with pagination
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Build filter
        let filter = { isArchived: false };
        if (req.query.winner) filter.winner = req.query.winner;
        if (req.query.rated) filter.rated = req.query.rated === "true";
        if (req.query.victoryStatus) filter.victoryStatus = req.query.victoryStatus;
        
        // Build sort
        let sort = {};
        if (req.query.sort) {
            const sortField = req.query.sort.startsWith("-") 
                ? req.query.sort.substring(1) 
                : req.query.sort;
            const sortOrder = req.query.sort.startsWith("-") ? -1 : 1;
            sort[sortField] = sortOrder;
        } else {
            sort = { createdAt: -1 };
        }
        
        const games = await Game.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        
        const total = await Game.countDocuments(filter);
        
        res.json({
            success: true,
            count: games.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: games
        });
    } catch (error) {
        console.error("Error in GET /matches:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single match by ID
router.get("/:matchId", async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId });
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        res.json({ success: true, data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get moves of a match
router.get("/:matchId/moves", async (req, res) => {
    try {
        const game = await Game.findOne({ gameId: req.params.matchId }).select("moves turns");
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        
        const movesArray = game.moves ? game.moves.split(" ") : [];
        
        res.json({
            success: true,
            gameId: req.params.matchId,
            totalMoves: game.turns,
            moves: movesArray,
            movesNotation: game.moves
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get latest matches
router.get("/latest/list", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false })
            .sort({ createdAt: -1 })
            .limit(limit);
        
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get trending matches (most moves)
router.get("/trending/list", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const games = await Game.find({ isArchived: false })
            .sort({ turns: -1 })
            .limit(limit);
        
        res.json({ success: true, count: games.length, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new match
router.post("/", async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update match
router.put("/:matchId", async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { gameId: req.params.matchId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        res.json({ success: true, data: game });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete match
router.delete("/:matchId", async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({ gameId: req.params.matchId });
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        res.json({ success: true, message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Archive match
router.patch("/:matchId/archive", async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { gameId: req.params.matchId },
            { isArchived: true },
            { new: true }
        );
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        res.json({ success: true, message: "Game archived", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Restore archived match
router.patch("/:matchId/restore", async (req, res) => {
    try {
        const game = await Game.findOneAndUpdate(
            { gameId: req.params.matchId },
            { isArchived: false },
            { new: true }
        );
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }
        res.json({ success: true, message: "Game restored", data: game });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
