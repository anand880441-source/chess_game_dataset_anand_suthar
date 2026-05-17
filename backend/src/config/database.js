const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected: " + conn.connection.host);
        console.log("📊 Database Name: " + conn.connection.name);
    } catch (error) {
        console.log("⚠️ MongoDB not available: " + error.message);
        console.log("💡 Continuing without database for now...");
    }
};

module.exports = connectDB;
