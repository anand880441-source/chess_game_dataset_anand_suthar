const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    logout
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

module.exports = router;
