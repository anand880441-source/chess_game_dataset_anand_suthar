const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    rated: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    lastMoveAt: {
        type: Date,
        required: true
    },
    turns: {
        type: Number,
        required: true
    },
    victoryStatus: {
        type: String,
        enum: ["outoftime", "resign", "mate", "draw"],
        required: true
    },
    winner: {
        type: String,
        enum: ["white", "black", "draw"],
        required: true
    },
    incrementCode: {
        type: String,
        required: true
    },
    white: {
        username: { type: String, required: true },
        rating: { type: Number, required: true }
    },
    black: {
        username: { type: String, required: true },
        rating: { type: Number, required: true }
    },
    moves: {
        type: String,
        required: true
    },
    opening: {
        eco: { type: String },
        name: { type: String },
        ply: { type: Number }
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create indexes for better query performance (only here, not in schema)
gameSchema.index({ gameId: 1 }, { unique: true });
gameSchema.index({ "white.username": 1 });
gameSchema.index({ "black.username": 1 });
gameSchema.index({ winner: 1 });
gameSchema.index({ victoryStatus: 1 });
gameSchema.index({ createdAt: -1 });
gameSchema.index({ turns: -1 });
gameSchema.index({ "opening.eco": 1 });
gameSchema.index({ "opening.name": 1 });

module.exports = mongoose.model("Game", gameSchema);
