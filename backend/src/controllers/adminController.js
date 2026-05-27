const mongoose = require("mongoose");
const User = require("../models/User");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");
const SearchLog = require("../models/SearchLog");
const os = require("os");

// ============ USER MANAGEMENT ============

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User banned", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const unbanUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "User unbanned", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ SYSTEM HEALTH ============

const getSystemHealth = async (req, res) => {
    try {
        const gameCount = await Game.countDocuments();
        const playerCount = await Player.countDocuments();
        const openingCount = await Opening.countDocuments();
        const userCount = await User.countDocuments();
        const searchCount = await SearchLog.countDocuments();
        
        res.json({
            success: true,
            data: {
                database: { games: gameCount, players: playerCount, openings: openingCount, users: userCount, searches: searchCount },
                server: { uptime: process.uptime(), memory: process.memoryUsage(), nodeVersion: process.version, platform: os.platform() },
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ SYSTEM INFO ============

const getSystemInfo = async (req, res) => {
    res.json({
        success: true,
        data: {
            apiVersion: "1.0.0",
            nodeVersion: process.version,
            platform: os.platform(),
            memory: { total: os.totalmem(), free: os.freemem(), used: os.totalmem() - os.freemem() },
            uptime: process.uptime(),
            timestamp: new Date()
        }
    });
};

const getSystemStatus = async (req, res) => {
    let dbStatus = "disconnected";
    try {
        dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    } catch (e) {
        dbStatus = "unknown";
    }
    res.json({ success: true, data: { status: "operational", database: dbStatus, server: "running", uptime: process.uptime() } });
};

// ============ SYSTEM LOGS ============

const getSystemLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const logs = await SearchLog.find().sort({ createdAt: -1 }).limit(limit);
        res.json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSystemPerformance = async (req, res) => {
    try {
        const totalGames = await Game.countDocuments();
        const totalPlayers = await Player.countDocuments();
        const totalOpenings = await Opening.countDocuments();
        const avgRating = await Player.aggregate([{ $group: { _id: null, avg: { $avg: "$currentRating" } } }]);
        
        res.json({
            success: true,
            data: {
                totalGames,
                totalPlayers,
                totalOpenings,
                averageRating: Math.round(avgRating[0]?.avg || 0),
                serverUptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ SYSTEM STORAGE ============

const getSystemStorage = async (req, res) => {
    try {
        const stats = await mongoose.connection.db.stats();
        res.json({
            success: true,
            data: {
                databaseSize: (stats.dataSize / 1024 / 1024).toFixed(2) + " MB",
                indexesSize: (stats.indexSize / 1024 / 1024).toFixed(2) + " MB",
                collections: stats.collections,
                objects: stats.objects
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ CACHE MANAGEMENT ============

let cache = {};

const clearCache = async (req, res) => {
    cache = {};
    res.json({ success: true, message: "Cache cleared successfully" });
};

const getCacheStatus = async (req, res) => {
    res.json({ success: true, data: { cacheSize: Object.keys(cache).length, keys: Object.keys(cache) } });
};

// ============ RECALCULATE STATS ============

const recalculateStats = async (req, res) => {
    try {
        const players = await Player.find();
        for (const player of players) {
            const games = await Game.find({
                $or: [{ "white.username": player.username }, { "black.username": player.username }],
                isArchived: false
            });
            
            let wins = 0, losses = 0, draws = 0;
            for (const game of games) {
                if (game.winner === "draw") draws++;
                else if ((game.winner === "white" && game.white.username === player.username) ||
                         (game.winner === "black" && game.black.username === player.username)) wins++;
                else losses++;
            }
            
            await Player.updateOne(
                { username: player.username },
                { wins, losses, draws, totalGames: games.length }
            );
        }
        
        res.json({ success: true, message: "Statistics recalculated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsers, banUser, unbanUser,
    getSystemHealth, getSystemInfo, getSystemStatus,
    getSystemLogs, getSystemPerformance, getSystemStorage,
    clearCache, getCacheStatus, recalculateStats
};
