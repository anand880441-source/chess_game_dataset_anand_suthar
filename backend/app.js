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

// Import and use game routes
const gameRoutes = require("./src/routes/gameRoutes");
app.use("/api/v1/matches", gameRoutes);

console.log("✅ Routes registered:");
console.log("   - GET  /api/v1/matches");
console.log("   - GET  /api/v1/matches/test");
console.log("   - GET  /api/v1/matches/:matchId");
console.log("   - GET  /api/v1/matches/:matchId/moves");
console.log("   - GET  /api/v1/matches/latest/list");

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Chess Match Analytics API",
        version: "1.0.0",
        endpoints: {
            health: "GET /api/v1/health",
            matches: "GET /api/v1/matches",
            test: "GET /api/v1/matches/test",
            match: "GET /api/v1/matches/:matchId",
            moves: "GET /api/v1/matches/:matchId/moves",
            latest: "GET /api/v1/matches/latest/list"
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
