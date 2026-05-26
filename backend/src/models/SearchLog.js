const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["matches", "players", "openings", "eco", "moves", "general"],
        default: "general"
    },
    ipAddress: String,
    userAgent: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    resultsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for quick counting
searchLogSchema.index({ createdAt: -1 });
searchLogSchema.index({ query: 1, count: -1 });

module.exports = mongoose.model("SearchLog", searchLogSchema);
