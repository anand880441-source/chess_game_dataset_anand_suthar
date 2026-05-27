const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

// @desc    Register user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide name, email and password" 
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide email and password" 
            });
        }

        // Find user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        res.json({ 
            success: true, 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({ 
            success: true, 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Delete user profile
const deleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ 
            success: true, 
            message: "User deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Logout user
const logout = async (req, res) => {
    res.json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};

// Placeholder for bonus features
const refreshToken = async (req, res) => {
    res.json({ success: true, message: "Refresh token endpoint - coming soon" });
};

const verifyEmail = async (req, res) => {
    res.json({ success: true, message: "Verify email endpoint - coming soon" });
};

const forgotPassword = async (req, res) => {
    res.json({ success: true, message: "Forgot password endpoint - coming soon" });
};

const resetPassword = async (req, res) => {
    res.json({ success: true, message: "Reset password endpoint - coming soon" });
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    resetPassword
};
