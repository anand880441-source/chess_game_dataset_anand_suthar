require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Server is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Chess Match Analytics API",
        version: "1.0.0",
        status: "running"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("");
    console.log("✅ Server started successfully!");
    console.log("📍 http://localhost:" + PORT);
    console.log("🏥 Health: http://localhost:" + PORT + "/api/v1/health");
    console.log("");
});
