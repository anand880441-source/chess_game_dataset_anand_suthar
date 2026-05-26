# ♟️ Chess Game Dataset & Analytics API

An advanced, high-performance Node.js & Express backend for importing, analyzing, and querying chess match datasets. It provides rich endpoints for match statistics, player comparisons, opening analysis, fuzzy search, user authentication, and system administration.

---

## 🚀 Features

- **Data Seeding pipeline**: Imports raw JSON chess match datasets, handles deduplication, resolves timestamp values safely, and seeds MongoDB with collections for Matches, Players, and Openings.
- **Robust Authentication**: Secure registration, login, profile management, and role-based access control (RBAC) with JWT (JSON Web Tokens).
- **Match Queries & PGN Exports**: Pagination, advanced sorting/filtering, and dynamic generation of Standard Chess PGN format text.
- **Opening Analysis**: Win-rate tracking, category grouping (Aggressive, Gambit, Defensive, etc.), and complexity filtering.
- **Deep Analytics Engine**: Victory distributions, color advantages, time-control habits, checkmate ratios, and average turn count analysis.
- **Fuzzy Search & Autocomplete**: Custom regex-based and auto-complete routes for fast player, match, and opening lookups.

---

## 🛠️ Technology Stack

- **Runtime Environment**: Node.js (v16+)
- **Framework**: Express.js (v5)
- **Database**: MongoDB Atlas (via Mongoose v9)
- **Security**: JWT (jsonwebtoken), Password hashing (bcryptjs)
- **Validation**: express-validator
- **Tooling**: Nodemon (development)

---

## 📁 Directory Structure

```text
├── backend/
│   ├── data/
│   │   └── chess_games.json       # Source JSON dataset for seeding
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # MongoDB connection configuration
│   │   ├── controllers/
│   │   │   ├── adminController.js # Users & system administration
│   │   │   ├── analyticsController.js # Match stat distribution & trends
│   │   │   ├── authController.js  # Registration, login, profile
│   │   │   ├── gameController.js  # Matches CRUD & filters
│   │   │   ├── openingController.js # Opening categories & success rates
│   │   │   ├── playerController.js # Leaderboards & player stats
│   │   │   └── searchController.js # Fuzzy search & autocomplete
│   │   ├── middleware/
│   │   │   └── authMiddleware.js  # JWT validation & RBAC (Admin/User)
│   │   ├── models/
│   │   │   ├── Game.js            # Chess game schema
│   │   │   ├── Opening.js         # Chess opening schema
│   │   │   ├── Player.js          # Player performance schema
│   │   │   └── User.js            # User authentication schema
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── gameRoutes.js
│   │   │   ├── openingRoutes.js
│   │   │   ├── playerRoutes.js
│   │   │   └── searchRoutes.js
│   │   └── utils/
│   ├── .env                       # Environment configurations
│   ├── app.js                     # Express app setup & middleware
│   ├── index.js                   # Server entry point
│   └── seed.js                    # Bulk seeder CLI script
└── README.md                      # Root documentation (this file)
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** installed on your machine.
- **MongoDB Atlas** database URI connection string.

### 2. Install Dependencies
Navigate into the `backend` folder and install NPM packages:
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
NODE_ENV=development
```

### 4. Seed the Database
Make sure you have a `chess_games.json` file inside `backend/data/` containing the chess match records, then run the bulk seeder script:
```bash
node seed.js
```
*Note: The seeder clears existing matches, player metrics, and opening rates, then performs batch insertions with validation and deduplication.*

### 5. Run the Server
**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

---

## 🗄️ Database Schemas

### 🎮 Game Schema (`Game.js`)
Tracks individual chess matches.
- `gameId` (String, Unique): ID of the match.
- `rated` (Boolean): Rated vs. casual game.
- `createdAt` / `lastMoveAt` (Date): Timestamps.
- `turns` (Number): Total moves played.
- `victoryStatus` (String): `outoftime`, `resign`, `mate`, `draw`.
- `winner` (String): `white`, `black`, `draw`.
- `incrementCode` (String): Time control configuration.
- `white` / `black`: `{ username, rating }`.
- `moves` (String): Full notation list.
- `opening`: `{ eco, name, ply }`.
- `isArchived` (Boolean): Status indicator for soft deletes.

### 👤 Player Schema (`Player.js`)
Aggregated statistics for unique chess usernames.
- `username` (String, Unique): Chess handle.
- `totalGames` (Number): Matches played.
- `wins` / `losses` / `draws` (Number): Outcome counts.
- `currentRating` (Number): Latest rating.
- `ratingHistory` (Array): Rating evolution tracks.
- `openingsUsed`: List of `{ eco, name, count }`.
- `lastPlayedAt` (Date): Latest game timestamp.
- **Virtual Fields**: `winRate`, `lossRate`, `drawRate` (calculated dynamically).

### 📖 Opening Schema (`Opening.js`)
Global statistics for chess openings.
- `eco` (String, Unique): Encyclopedia of Chess Openings code.
- `name` (String): Opening name.
- `totalGames` / `whiteWins` / `blackWins` / `draws` (Number): Results distribution.
- `averageTurns` (Number): Typical length of games using this opening.
- `complexity` (String): `Beginner`, `Intermediate`, `Advanced`, `Master`.
- `category` (String): `Aggressive`, `Defensive`, `Gambit`, `Positional`, `Balanced`.
- **Virtual Fields**: `whiteWinRate`, `blackWinRate`.

---

## 🔌 API Endpoints Reference

Base URL: `http://localhost:5000`

### 🏥 Health & System Check
- `GET /api/v1/health` - Check backend server availability.

### 🔑 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user (`name`, `email`, `password`) | Public |
| **POST** | `/login` | Log in and receive a JWT token (`email`, `password`) | Public |
| **POST** | `/logout` | Log out the user | Public |
| **GET** | `/profile` | Get current user's profile | Bearer Token |
| **PATCH** | `/profile` | Update current user's details | Bearer Token |
| **DELETE**| `/profile` | Delete current user's account | Bearer Token |

### 🎮 Matches & Games (`/api/v1/matches`)
| Method | Endpoint | Description | Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Get all matches (paginated, filterable) | `page`, `limit`, `winner`, `rated`, `victoryStatus`, `sort` |
| **GET** | `/:matchId` | Get detailed information for a single match | `matchId` |
| **GET** | `/:matchId/moves` | Get only the moves list and turns | `matchId` |
| **GET** | `/:matchId/pgn` | Export match details in standard PGN text format | `matchId` |
| **GET** | `/random/game` | Fetch a random active match | None |
| **GET** | `/latest/list` | Get latest chess matches | `limit` (default: 10) |
| **GET** | `/trending/list` | Get matches with the highest turn counts | `limit` (default: 10) |
| **POST** | `/` | Create a new match record | JSON Request Body |
| **PUT** | `/:matchId` | Update a match record | `matchId` + Body |
| **DELETE**| `/:matchId` | Delete a match record | `matchId` |
| **PATCH** | `/:matchId/archive` | Archive match (soft-delete) | `matchId` |
| **PATCH** | `/:matchId/restore` | Restore archived match | `matchId` |
| **GET** | `/filter/rated` | Get only rated matches | `page`, `limit` |
| **GET** | `/filter/unrated`| Get only unrated matches | `page`, `limit` |
| **GET** | `/filter/white-wins`| Filter by matches won by white | `page`, `limit` |
| **GET** | `/filter/black-wins`| Filter by matches won by black | `page`, `limit` |
| **GET** | `/filter/draws` | Filter by drawn matches | `page`, `limit` |

### 👤 Player Statistics (`/api/v1/players`)
| Method | Endpoint | Description | Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Get list of all players (paginated) | None |
| **GET** | `/top-rated` | Get highest rated players | None |
| **GET** | `/top-active` | Get players with the most games played | None |
| **GET** | `/top-winning` | Get players with the highest win counts | None |
| **GET** | `/rating-range` | Filter players within a rating boundary | `min`, `max` |
| **GET** | `/compare/:player1/:player2` | Compare stats side-by-side between two players | `player1`, `player2` |
| **GET** | `/:username` | Find a single player profile by username | `username` |
| **GET** | `/:username/history`| Fetch full match history of a player | `username` |
| **GET** | `/:username/stats`| Get game rates, ratings, and stats | `username` |
| **GET** | `/:username/openings`| Get list of openings used by this player | `username` |
| **GET** | `/:username/win-rate`| Fetch calculated win rate for a player | `username` |
| **GET** | `/:username/recent`| Fetch recent matches played by username | `username` |

### 📖 Chess Openings (`/api/v1/openings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Retrieve all registered chess openings |
| **GET** | `/popular` | Top opening strategies by total games played |
| **GET** | `/trending` | Chess openings with rising usage |
| **GET** | `/search` | Search openings by keyword name or description |
| **GET** | `/win-rates` | Retrieve openings sorted by highest win rate |
| **GET** | `/aggressive` | Openings classified as aggressive |
| **GET** | `/defensive` | Openings classified as defensive |
| **GET** | `/gambits` | Openings classified as gambits |
| **GET** | `/complexity` | Filter openings by complexity (`Beginner`, `Intermediate`, `Advanced`) |
| **GET** | `/beginner-friendly`| Find low complexity, high win-rate openings |
| **GET** | `/white-advantage` | Openings showing highest win rate for white |
| **GET** | `/rare` | Openings with very low total games played |
| **GET** | `/eco/:ecoCode` | Retrieve info about a specific opening by ECO code |

### 🔍 Advanced Search Engine (`/api/v1/search`)
- `GET /api/v1/search/matches` - Detailed filters for matches.
- `GET /api/v1/search/players` - Search player base using prefix/queries.
- `GET /api/v1/search/openings` - Query openings list by keyword.
- `GET /api/v1/search/eco` - Search by ECO code prefix.
- `GET /api/v1/search/moves` - Search games containing specific move chains.
- `GET /api/v1/search/fuzzy` - Fuzzy matching on username names, openings, or outcomes.
- `GET /api/v1/search/autocomplete` - Returns matching lists for active typing UI.
- `GET /api/v1/search/player-rating` - Search for games in rating range.
- `GET /api/v1/search/date-range` - Find games played between timestamp limits.

### 📊 Deep Analytics (`/api/v1`)
- `GET /api/v1/victory-distribution` - Percentage breakdown of `resign`, `mate`, `draw`, `outoftime`.
- `GET /api/v1/color-advantage` - Compare white wins, black wins, and draw rates.
- `GET /api/v1/turn-count-average` - System-wide average turn count.
- `GET /api/v1/rated-vs-casual` - Ratio of rated matches to casual matches.
- `GET /api/v1/time-control-usage` - Usage counts of various time increment codes.
- `GET /api/v1/shortest-games` - Retrieve top shortest resolved games.
- `GET /api/v1/longest-games` - Retrieve top longest resolved games.
- `GET /api/v1/checkmate-frequency` - Percentage of games ended with checkmate (`mate`).
- `GET /api/v1/draw-frequency` - Stats on types of drawn games.
- `GET /api/v1/opening-success` - Cross-referenced list of win rates for openings.
- `GET /api/v1/stats/total-matches` - Overall counter for all records.
- `GET /api/v1/stats/total-players` - Total player count.
- `GET /api/v1/stats/average-rating` - System-wide average Elo rating.

### 🛠️ Administration & Management (`/api/v1/admin`)
*Note: Admin privileges are checked through headers containing a valid admin JWT.*
- `GET /api/v1/admin/users` - List all registered user accounts (Admin).
- `PATCH /api/v1/admin/users/:id/ban` - Restrict user access by ID (Admin).
- `PATCH /api/v1/admin/users/:id/unban` - Reinstate user access by ID (Admin).
- `GET /api/v1/admin/system/health` - Live memory/CPU health diagnostics (Admin).
- `GET /api/v1/admin/system/info` - Public server host info.
- `GET /api/v1/admin/system/status` - Live uptime status.