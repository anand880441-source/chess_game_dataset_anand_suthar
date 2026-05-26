const mongoose = require("mongoose");
const User = require("../models/User");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Opening = require("../models/Opening");
const os = require("os");

// @desc    Get all users
// @route   GET /api/v1/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Ban a user
// @route   PATCH /api/v1/admin/users/:id/ban
const banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, message: "User banned", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Unban a user
// @route   PATCH /api/v1/admin/users/:id/unban
const unbanUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, message: "User unbanned", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    System health
// @route   GET /api/v1/admin/system/health
const getSystemHealth = async (req, res) => {
    try {
        const gameCount = await Game.countDocuments();
        const playerCount = await Player.countDocuments();
        const openingCount = await Opening.countDocuments();
        const userCount = await User.countDocuments();
        
        res.json({
            success: true,
            data: {
                database: {
                    games: gameCount,
                    players: playerCount,
                    openings: openingCount,
                    users: userCount
                },
                server: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    nodeVersion: process.version,
                    platform: os.platform(),
                    cpus: os.cpus().length
                },
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    System info
// @route   GET /api/v1/system/info
const getSystemInfo = async (req, res) => {
    res.json({
        success: true,
        data: {
            apiVersion: "1.0.0",
            nodeVersion: process.version,
            platform: os.platform(),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            uptime: process.uptime(),
            timestamp: new Date()
        }
    });
};

// @desc    System status
// @route   GET /api/v1/system/status
const getSystemStatus = async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    res.json({
        success: true,
        data: {
            status: "operational",
            database: dbStatus,
            server: "running",
            uptime: process.uptime(),
            timestamp: new Date()
        }
    });
};

module.exports = {
    getAllUsers,
    banUser,
    unbanUser,
    getSystemHealth,
    getSystemInfo,
    getSystemStatus
};
