const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    totalGames: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    currentRating: { type: Number, default: 1200 },
    ratingHistory: [{ rating: Number, date: Date }],
    openingsUsed: [{ eco: String, name: String, count: Number }],
    lastPlayedAt: { type: Date, default: null }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual fields (calculated, not stored)
playerSchema.virtual("winRate").get(function() {
    if (this.totalGames === 0) return 0;
    return ((this.wins / this.totalGames) * 100).toFixed(2);
});

playerSchema.virtual("lossRate").get(function() {
    if (this.totalGames === 0) return 0;
    return ((this.losses / this.totalGames) * 100).toFixed(2);
});

playerSchema.virtual("drawRate").get(function() {
    if (this.totalGames === 0) return 0;
    return ((this.draws / this.totalGames) * 100).toFixed(2);
});

module.exports = mongoose.model("Player", playerSchema);
