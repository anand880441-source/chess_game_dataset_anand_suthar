const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.log(`⚠️ MongoDB connection error: ${error.message}`);
        console.log(`💡 Continuing without database - some features may not work`);
        return null;
    }
};

module.exports = connectDB;
