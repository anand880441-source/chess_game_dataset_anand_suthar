const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
    getAllUsers, banUser, unbanUser,
    getSystemHealth, getSystemInfo, getSystemStatus,
    getSystemLogs, getSystemPerformance, getSystemStorage,
    clearCache, getCacheStatus, recalculateStats
} = require("../controllers/adminController");

// User Management (Admin only)
router.get("/users", protect, admin, getAllUsers);
router.patch("/users/:id/ban", protect, admin, banUser);
router.patch("/users/:id/unban", protect, admin, unbanUser);

// System Health (Admin only)
router.get("/system/health", protect, admin, getSystemHealth);
router.get("/system/logs", protect, admin, getSystemLogs);
router.get("/system/performance", protect, admin, getSystemPerformance);
router.get("/system/storage", protect, admin, getSystemStorage);
router.delete("/cache/clear", protect, admin, clearCache);
router.get("/cache/status", protect, admin, getCacheStatus);
router.post("/system/recalculate-stats", protect, admin, recalculateStats);

// Public system routes
router.get("/system/info", getSystemInfo);
router.get("/system/status", getSystemStatus);

module.exports = router;
