const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Import models
const Game = require("./src/models/Game");
const Player = require("./src/models/Player");
const Opening = require("./src/models/Opening");

// Helper function to safely convert to Date
function safeDate(value) {
    if (!value) return null;
    
    try {
        let timestamp;
        
        if (typeof value === "string" && value.includes("E")) {
            timestamp = parseFloat(value);
        } else if (typeof value === "string") {
            timestamp = parseInt(value, 10);
        } else if (typeof value === "number") {
            timestamp = value;
        } else {
            return null;
        }
        
        if (isNaN(timestamp) || timestamp <= 0) {
            return null;
        }
        
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return null;
        }
        
        return date;
    } catch (error) {
        return null;
    }
}

function convertBoolean(value) {
    if (typeof value === "string") {
        return value.toUpperCase() === "TRUE";
    }
    return Boolean(value);
}

function convertRating(value) {
    const num = parseInt(value, 10);
    return isNaN(num) ? 1200 : num;
}

function convertTurns(value) {
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

async function seedDatabase() {
    try {
        console.log("🔌 Connecting to MongoDB Atlas...");
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });
        
        console.log("✅ Connected to MongoDB Atlas");
        
        console.log("\n📖 Reading JSON file...");
        
        const rawData = fs.readFileSync(
            path.join(__dirname, "data", "chess_games.json"),
            "utf8"
        );
        
        const gamesData = JSON.parse(rawData);
        console.log(`✅ Loaded ${gamesData.length} games from JSON`);
        
        // Clear existing data
        console.log("🗑️  Clearing existing collections...");
        await Game.deleteMany({});
        await Player.deleteMany({});
        await Opening.deleteMany({});
        
        const playersMap = new Map();
        const openingsMap = new Map();
        const transformedGames = [];
        const uniqueGameIds = new Set(); // Track unique game IDs
        
        console.log("🔄 Transforming data...");
        let duplicateCount = 0;
        
        for (let i = 0; i < gamesData.length; i++) {
            const game = gamesData[i];
            
            // Skip duplicate game IDs
            if (uniqueGameIds.has(game.id)) {
                duplicateCount++;
                continue;
            }
            uniqueGameIds.add(game.id);
            
            const createdAt = safeDate(game.created_at);
            const lastMoveAt = safeDate(game.last_move_at);
            
            const transformedGame = {
                gameId: game.id,
                rated: convertBoolean(game.rated),
                createdAt: createdAt || new Date(),
                lastMoveAt: lastMoveAt || new Date(),
                turns: convertTurns(game.turns),
                victoryStatus: game.victory_status,
                winner: game.winner,
                incrementCode: game.increment_code,
                white: {
                    username: game.white_id || "unknown",
                    rating: convertRating(game.white_rating)
                },
                black: {
                    username: game.black_id || "unknown",
                    rating: convertRating(game.black_rating)
                },
                moves: game.moves || "",
                opening: {
                    eco: game.opening_eco || "unknown",
                    name: game.opening_name || "Unknown Opening",
                    ply: game.opening_ply ? parseInt(game.opening_ply, 10) : 0
                },
                isArchived: false
            };
            transformedGames.push(transformedGame);
            
            // Track players
            const players = [
                { username: game.white_id, rating: convertRating(game.white_rating) },
                { username: game.black_id, rating: convertRating(game.black_rating) }
            ];
            
            for (const player of players) {
                if (!player.username || player.username === "unknown") continue;
                
                if (!playersMap.has(player.username)) {
                    playersMap.set(player.username, {
                        username: player.username,
                        totalGames: 0,
                        wins: 0,
                        losses: 0,
                        draws: 0,
                        currentRating: player.rating,
                        openingsUsed: new Map(),
                        lastPlayedAt: null
                    });
                }
                
                const playerData = playersMap.get(player.username);
                playerData.totalGames++;
                
                if (game.winner === "white" && player.username === game.white_id) {
                    playerData.wins++;
                } else if (game.winner === "black" && player.username === game.black_id) {
                    playerData.wins++;
                } else if (game.winner === "draw") {
                    playerData.draws++;
                } else if (player.username === game.white_id && game.winner === "black") {
                    playerData.losses++;
                } else if (player.username === game.black_id && game.winner === "white") {
                    playerData.losses++;
                }
                
                const openingKey = `${game.opening_eco}|${game.opening_name}`;
                if (!playerData.openingsUsed.has(openingKey)) {
                    playerData.openingsUsed.set(openingKey, {
                        eco: game.opening_eco || "unknown",
                        name: game.opening_name || "Unknown",
                        count: 0
                    });
                }
                playerData.openingsUsed.get(openingKey).count++;
                
                if (createdAt && (!playerData.lastPlayedAt || createdAt > playerData.lastPlayedAt)) {
                    playerData.lastPlayedAt = createdAt;
                }
            }
            
            const ecoCode = game.opening_eco || "unknown";
            if (!openingsMap.has(ecoCode)) {
                openingsMap.set(ecoCode, {
                    eco: ecoCode,
                    name: game.opening_name || "Unknown Opening",
                    totalGames: 0,
                    whiteWins: 0,
                    blackWins: 0,
                    draws: 0,
                    totalTurns: 0
                });
            }
            
            const openingData = openingsMap.get(ecoCode);
            openingData.totalGames++;
            openingData.totalTurns += convertTurns(game.turns);
            
            if (game.winner === "white") {
                openingData.whiteWins++;
            } else if (game.winner === "black") {
                openingData.blackWins++;
            } else if (game.winner === "draw") {
                openingData.draws++;
            }
            
            if ((i + 1) % 5000 === 0) {
                console.log(`   Processed ${i + 1}/${gamesData.length} games (${duplicateCount} duplicates skipped)...`);
            }
        }
        
        console.log(`\n📊 Total unique games: ${transformedGames.length} (${duplicateCount} duplicates removed)`);
        
        console.log("👥 Preparing players data...");
        const playersToInsert = [];
        for (const [username, data] of playersMap) {
            playersToInsert.push({
                username: data.username,
                totalGames: data.totalGames,
                wins: data.wins,
                losses: data.losses,
                draws: data.draws,
                currentRating: data.currentRating,
                ratingHistory: [],
                openingsUsed: Array.from(data.openingsUsed.values()),
                lastPlayedAt: data.lastPlayedAt || new Date()
            });
        }
        
        console.log("📚 Preparing openings data...");
        const openingsToInsert = [];
        for (const [eco, data] of openingsMap) {
            openingsToInsert.push({
                eco: data.eco,
                name: data.name,
                totalGames: data.totalGames,
                whiteWins: data.whiteWins,
                blackWins: data.blackWins,
                draws: data.draws,
                averageTurns: Math.round(data.totalTurns / data.totalGames),
                complexity: "Intermediate",
                category: "Balanced"
            });
        }
        
        const BATCH_SIZE = 1000;
        
        console.log("💾 Inserting players into database...");
        for (let i = 0; i < playersToInsert.length; i += BATCH_SIZE) {
            const batch = playersToInsert.slice(i, i + BATCH_SIZE);
            await Player.insertMany(batch);
            console.log(`   Inserted ${Math.min(i + BATCH_SIZE, playersToInsert.length)}/${playersToInsert.length} players`);
        }
        
        console.log("💾 Inserting openings into database...");
        for (let i = 0; i < openingsToInsert.length; i += BATCH_SIZE) {
            const batch = openingsToInsert.slice(i, i + BATCH_SIZE);
            await Opening.insertMany(batch);
            console.log(`   Inserted ${Math.min(i + BATCH_SIZE, openingsToInsert.length)}/${openingsToInsert.length} openings`);
        }
        
        console.log("💾 Inserting games into database...");
        for (let i = 0; i < transformedGames.length; i += BATCH_SIZE) {
            const batch = transformedGames.slice(i, i + BATCH_SIZE);
            await Game.insertMany(batch);
            console.log(`   Inserted ${Math.min(i + BATCH_SIZE, transformedGames.length)}/${transformedGames.length} games`);
        }
        
        console.log("\n🎉 Database seeding completed successfully!");
        console.log("📊 Final Summary:");
        console.log(`   - Games: ${transformedGames.length} (${duplicateCount} duplicates skipped)`);
        console.log(`   - Players: ${playersToInsert.length}`);
        console.log(`   - Openings: ${openingsToInsert.length}`);
        
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
        process.exit(0);
        
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

seedDatabase();
