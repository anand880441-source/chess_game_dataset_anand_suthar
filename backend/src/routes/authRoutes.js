const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    logout
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

// Bonus routes - to be implemented later
router.post("/refresh-token", (req, res) => {
    res.json({ success: true, message: "Refresh token endpoint - coming soon" });
});
router.post("/verify-email", (req, res) => {
    res.json({ success: true, message: "Verify email endpoint - coming soon" });
});
router.post("/forgot-password", (req, res) => {
    res.json({ success: true, message: "Forgot password endpoint - coming soon" });
});
router.post("/reset-password", (req, res) => {
    res.json({ success: true, message: "Reset password endpoint - coming soon" });
});

module.exports = router;
