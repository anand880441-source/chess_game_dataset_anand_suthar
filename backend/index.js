require("dotenv").config();
const connectDB = require("./src/config/database");

// Connect to database
connectDB();

const app = require("./app");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server started successfully!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/v1/health`);
    console.log(`\n✨ Ready to accept requests!\n`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        console.log("Process terminated!");
    });
});
