const mongoose = require("mongoose");

const openingSchema = new mongoose.Schema({
    eco: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    totalGames: {
        type: Number,
        default: 0
    },
    whiteWins: {
        type: Number,
        default: 0
    },
    blackWins: {
        type: Number,
        default: 0
    },
    draws: {
        type: Number,
        default: 0
    },
    averageTurns: {
        type: Number,
        default: 0
    },
    complexity: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Master"],
        default: "Intermediate"
    },
    category: {
        type: String,
        enum: ["Aggressive", "Defensive", "Gambit", "Positional", "Balanced"],
        default: "Balanced"
    }
}, {
    timestamps: true
});

// Virtual fields
openingSchema.virtual("whiteWinRate").get(function() {
    if (this.totalGames === 0) return 0;
    return ((this.whiteWins / this.totalGames) * 100).toFixed(2);
});

openingSchema.virtual("blackWinRate").get(function() {
    if (this.totalGames === 0) return 0;
    return ((this.blackWins / this.totalGames) * 100).toFixed(2);
});

module.exports = mongoose.model("Opening", openingSchema);
