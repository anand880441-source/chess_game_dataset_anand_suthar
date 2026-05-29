const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema({
    query: { type: String, required: true },
    type: { type: String, default: "global" },
    resultsCount: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("SearchLog", searchLogSchema);
