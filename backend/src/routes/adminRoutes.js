const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    banUser,
    unbanUser,
    getSystemHealth,
    getSystemInfo,
    getSystemStatus
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// Admin only routes
router.get("/users", protect, admin, getAllUsers);
router.patch("/users/:id/ban", protect, admin, banUser);
router.patch("/users/:id/unban", protect, admin, unbanUser);
router.get("/system/health", protect, admin, getSystemHealth);

// Public system routes
router.get("/system/info", getSystemInfo);
router.get("/system/status", getSystemStatus);

module.exports = router;
