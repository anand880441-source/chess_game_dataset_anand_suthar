const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`);
    next();
});

// Health check
app.get("/api/v1/health", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Server is running",
        timestamp: new Date().toISOString()
    });
});

// Import routes
const gameRoutes = require("./src/routes/gameRoutes");
const playerRoutes = require("./src/routes/playerRoutes");
const openingRoutes = require("./src/routes/openingRoutes");

// Use routes
app.use("/api/v1/matches", gameRoutes);
app.use("/api/v1/players", playerRoutes);
app.use("/api/v1/openings", openingRoutes);

console.log("✅ Routes registered:");
console.log("   - GET  /api/v1/health");
console.log("   - GET  /api/v1/matches");
console.log("   - GET  /api/v1/matches/:matchId");
console.log("   - GET  /api/v1/matches/:matchId/moves");
console.log("   - GET  /api/v1/matches/:matchId/pgn");
console.log("   - GET  /api/v1/matches/random/game");
console.log("   - GET  /api/v1/matches/filter/*");
console.log("   - GET  /api/v1/players");
console.log("   - GET  /api/v1/players/:username");
console.log("   - GET  /api/v1/players/:username/stats");
console.log("   - GET  /api/v1/players/top-rated");
console.log("   - GET  /api/v1/players/compare/:p1/:p2");
console.log("   - GET  /api/v1/openings");
console.log("   - GET  /api/v1/openings/popular");
console.log("   - GET  /api/v1/openings/eco/:ecoCode");
console.log("   - GET  /api/v1/openings/search");
console.log("   - GET  /api/v1/openings/win-rates");

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Chess Match Analytics API",
        version: "1.0.0",
        endpoints: {
            health: "GET /api/v1/health",
            matches: "GET /api/v1/matches",
            match: "GET /api/v1/matches/:matchId",
            moves: "GET /api/v1/matches/:matchId/moves",
            pgn: "GET /api/v1/matches/:matchId/pgn",
            random: "GET /api/v1/matches/random/game",
            players: "GET /api/v1/players",
            player: "GET /api/v1/players/:username",
            playerStats: "GET /api/v1/players/:username/stats",
            topRated: "GET /api/v1/players/top-rated",
            compare: "GET /api/v1/players/compare/:player1/:player2",
            openings: "GET /api/v1/openings",
            popularOpenings: "GET /api/v1/openings/popular",
            openingByEco: "GET /api/v1/openings/eco/:ecoCode",
            searchOpenings: "GET /api/v1/openings/search",
            openingWinRates: "GET /api/v1/openings/win-rates"
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.url} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

module.exports = app;