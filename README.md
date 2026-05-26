# <div align="center"><img src="https://res.cloudinary.com/dpvmzqfvv/image/upload/v1779780443/download_5_nhy4fz.jpg" alt="Chess Match Analytics Banner" width="100%" /></div>

<div align="center">

[![Node.js Version](https://img.shields.io/badge/Node.js-22.x-green.svg?style=flat-square)](https://nodejs.org/)
[![Express.js Version](https://img.shields.io/badge/Express.js-5.x-blue.svg?style=flat-square)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg?style=flat-square)](https://www.mongodb.com/cloud/atlas)
[![Render](https://img.shields.io/badge/Deployed-Render-purple.svg?style=flat-square)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

A **production-ready REST API** for chess match analytics, player statistics, opening theory, and game analysis. Built with Node.js, Express, MongoDB Atlas, and JWT authentication.

### 🎯 Key Features

| Category | Description |
| :--- | :--- |
| ♟️ **Match Management** | Complete CRUD operations, PGN/FEN export, random match, filtering |
| 👥 **Player Analytics** | Stats, rating history, win/loss/draw rates, player comparison |
| 📚 **Opening Database** | 365+ openings with ECO codes, win rates, complexity levels |
| 🔍 **Advanced Search** | Full-text search, autocomplete, ECO code search, rating filters |
| 📊 **Analytics Engine** | Victory distribution, color advantage, checkmate frequency |
| 🔐 **Authentication** | JWT-based auth with bcrypt password hashing |
| 👑 **Admin Panel** | User management, system health monitoring |

---

## 📊 Database Statistics

<div align="center">
  <table style="width: 100%; border: none; text-align: center; border-collapse: separate; border-spacing: 12px;">
    <tr>
      <td style="background: #1e293b; color: #fff; padding: 20px; border-radius: 12px; width: 20%;">
        <span style="font-size: 2em; font-weight: bold; color: #38bdf8;">19,113</span><br/>
        <strong style="color: #94a3b8; text-transform: uppercase; font-size: 0.75em; letter-spacing: 1px;">Total Games</strong>
      </td>
      <td style="background: #1e293b; color: #fff; padding: 20px; border-radius: 12px; width: 20%;">
        <span style="font-size: 2em; font-weight: bold; color: #818cf8;">15,635</span><br/>
        <strong style="color: #94a3b8; text-transform: uppercase; font-size: 0.75em; letter-spacing: 1px;">Total Players</strong>
      </td>
      <td style="background: #1e293b; color: #fff; padding: 20px; border-radius: 12px; width: 20%;">
        <span style="font-size: 2em; font-weight: bold; color: #a78bfa;">365</span><br/>
        <strong style="color: #94a3b8; text-transform: uppercase; font-size: 0.75em; letter-spacing: 1px;">Total Openings</strong>
      </td>
      <td style="background: #1e293b; color: #fff; padding: 20px; border-radius: 12px; width: 20%;">
        <span style="font-size: 2em; font-weight: bold; color: #f43f5e;">60.5</span><br/>
        <strong style="color: #94a3b8; text-transform: uppercase; font-size: 0.75em; letter-spacing: 1px;">Average Turns</strong>
      </td>
      <td style="background: #1e293b; color: #fff; padding: 20px; border-radius: 12px; width: 20%;">
        <span style="font-size: 2em; font-weight: bold; color: #10b981;">31.26%</span><br/>
        <strong style="color: #94a3b8; text-transform: uppercase; font-size: 0.75em; letter-spacing: 1px;">Checkmate Rate</strong>
      </td>
    </tr>
  </table>
</div>

---

## 🎨 System Flow & ER Diagram

```mermaid
graph TD
    classDef border fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef db fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#fff;

    A[Client Request] --> B[authMiddleware]:::border
    B --> C[Express Router]:::border
    C --> D[Controllers Layer]:::border
    D --> E[Mongoose Schema Models]:::border
    E --> F[(MongoDB Atlas)]:::db
```

```mermaid
erDiagram
    GAME {
        string gameId PK
        boolean rated
        date createdAt
        number turns
        string victoryStatus
        string winner
        string moves
    }
    PLAYER {
        string username PK
        number totalGames
        number wins
        number losses
        number draws
        number currentRating
    }
    OPENING {
        string eco PK
        string name
        number totalGames
        number whiteWins
        number blackWins
    }
    USER {
        string name
        string email PK
        string password
        string role
        boolean isActive
    }

    PLAYER ||--o{ GAME : "plays"
    OPENING ||--o{ GAME : "uses"
```

---

## 🚀 Live API

| Environment | URL |
| :--- | :--- |
| **Production** | [https://chess-match-analytics-api.onrender.com](https://chess-match-analytics-api.onrender.com) |
| **API Base** | [https://chess-match-analytics-api.onrender.com/api/v1](https://chess-match-analytics-api.onrender.com/api/v1) |
| **Health Check** | [https://chess-match-analytics-api.onrender.com/api/v1/health](https://chess-match-analytics-api.onrender.com/api/v1/health) |
| **Postman Docs** | [View Documentation](https://documenter.getpostman.com/view/50840839/2sBXwmQCzf) |

---

## 📁 Project Structure

```text
chess_game_dataset_anand_suthar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── gameController.js   # Match operations
│   │   │   ├── playerController.js # Player analytics
│   │   │   ├── openingController.js # Opening database
│   │   │   ├── searchController.js  # Search endpoints
│   │   │   ├── analyticsController.js # Stats & analytics
│   │   │   ├── authController.js   # JWT authentication
│   │   │   └── adminController.js  # Admin routes
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT verification
│   │   ├── models/
│   │   │   ├── Game.js             # Match schema
│   │   │   ├── Player.js           # Player schema
│   │   │   ├── Opening.js          # Opening schema
│   │   │   └── User.js             # User schema
│   │   └── routes/
│   │       ├── gameRoutes.js
│   │       ├── playerRoutes.js
│   │       ├── openingRoutes.js
│   │       ├── searchRoutes.js
│   │       ├── analyticsRoutes.js
│   │       ├── authRoutes.js
│   │       └── adminRoutes.js
│   ├── .env                        # Environment variables
│   ├── .gitignore
│   ├── app.js                      # Express app
│   ├── index.js                    # Server entry
│   ├── package.json
│   ├── seed.js                     # Database seeding script
│   └── verify-seed.js              # Data verification
├── data/                           # JSON dataset (gitignored)
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express.js](https://expressjs.com/) | Web framework |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Cloud database |
| [Mongoose](https://mongoosejs.com/) | ODM for MongoDB |
| [JWT](https://jwt.io/) | Authentication |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Password hashing |
| [CORS](https://www.npmjs.com/package/cors) | Cross-origin support |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variables |

---

## 📡 API Endpoints (80+)

### 🏥 Health & System

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/v1/health` | Server health check |
| `GET` | `/api/v1/admin/system/info` | System information |
| `GET` | `/api/v1/admin/system/status` | Service status |

### 🔐 Authentication

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Create new user |
| `POST` | `/api/v1/auth/login` | Login & get JWT |
| `GET` | `/api/v1/auth/profile` | Get user profile |
| `PATCH` | `/api/v1/auth/profile` | Update profile |
| `DELETE` | `/api/v1/auth/profile` | Delete account |

### ♟️ Match Management

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/v1/matches` | List all matches (paginated) |
| `GET` | `/api/v1/matches/:matchId` | Get match details |
| `GET` | `/api/v1/matches/:matchId/moves` | Get move sequence |
| `GET` | `/api/v1/matches/:matchId/pgn` | Get PGN notation |
| `GET` | `/api/v1/matches/latest/list` | Latest matches |
| `GET` | `/api/v1/matches/trending/list` | Trending matches |
| `GET` | `/api/v1/matches/random/game` | Random match |
| `GET` | `/api/v1/matches/filter/rated` | Rated matches |
| `GET` | `/api/v1/matches/filter/white-wins` | White victories |

### 👥 Player Routes

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/v1/players` | List all players |
| `GET` | `/api/v1/players/:username` | Player details |
| `GET` | `/api/v1/players/:username/stats` | Player statistics |
| `GET` | `/api/v1/players/:username/history` | Match history |
| `GET` | `/api/v1/players/top-rated` | Highest rated |
| `GET` | `/api/v1/players/top-active` | Most active |
| `GET` | `/api/v1/players/compare/:p1/:p2` | Compare players |

### 📚 Opening Routes

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/v1/openings` | List all openings |
| `GET` | `/api/v1/openings/popular` | Most played |
| `GET` | `/api/v1/openings/eco/:ecoCode` | Get by ECO code |
| `GET` | `/api/v1/openings/search` | Search openings |
| `GET` | `/api/v1/openings/win-rates` | Win rate statistics |

### 🔍 Search Routes

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/v1/search/matches` | Search matches |
| `GET` | `/api/v1/search/players` | Search players |
| `GET` | `/api/v1/search/openings` | Search openings |
| `GET` | `/api/v1/search/eco` | Search by ECO |
| `GET` | `/api/v1/search/autocomplete` | Autocomplete suggestions |
| `GET` | `/api/v1/search/player-rating` | Filter by rating |

### 📊 Analytics

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/v1/victory-distribution` | Win/loss/draw stats |
| `GET` | `/api/v1/color-advantage` | White vs Black |
| `GET` | `/api/v1/turn-count-average` | Average moves |
| `GET` | `/api/v1/checkmate-frequency` | Checkmate rate |
| `GET` | `/api/v1/stats/total-matches` | Total games |
| `GET` | `/api/v1/stats/total-players` | Total players |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anand880441-source/chess_game_dataset_anand_suthar.git

# Navigate to backend folder
cd chess_game_dataset_anand_suthar/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create manually
```

### Environment Variables
Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chess_analytics
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### Database Seeding

```bash
# Place your chess dataset JSON file in backend/data/chess_games.json

# Run seed script
node seed.js

# Verify data imported
node verify-seed.js
```

### Run Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```
Server will start at: http://localhost:5000

---

## 🧪 Testing

### Test with cURL

```bash
# Health check
curl https://chess-match-analytics-api.onrender.com/api/v1/health

# Get matches
curl "https://chess-match-analytics-api.onrender.com/api/v1/matches?page=1&limit=5"

# Get player stats
curl https://chess-match-analytics-api.onrender.com/api/v1/players/bourgris/stats
```

### Test with Postman
Import the Postman collection from the documentation link or use the provided JSON.

---

## 📈 Performance Optimizations

| Optimization | Implementation |
| :--- | :--- |
| **Database Indexes** | Indexed on `gameId`, `username`, `winner`, `createdAt`, `turns` |
| **Pagination** | All list endpoints support `page` and `limit` |
| **Query Filtering** | Dynamic filters for `winner`, `rating`, `victory status` |
| **Aggregation Pipeline** | Analytics using MongoDB aggregation framework |
| **Batch Processing** | Bulk inserts for seeding (1000 documents per batch) |

---

## 🔒 Security Features

- [x] JWT-based authentication
- [x] bcrypt password hashing (10 salt rounds)
- [x] Protected routes with middleware
- [x] Role-based access control (user/admin)
- [x] Environment variables for secrets
- [x] CORS enabled for cross-origin requests

---

## 🧑💻 Developer

| Name | GitHub |
| :--- | :--- |
| Anand Suthar | [@anand880441-source](https://github.com/anand880441-source) |

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This project is part of the CGxSU Semester 1 Assignment - Full Stack Project (80 Marks).

---

## 🙏 Acknowledgments

- Dataset provided by CGxSU
- MongoDB Atlas for cloud database hosting
- Render for free API deployment

---

## 📞 Support

For issues or questions:
- Connect with your assigned mentor
- Check the Postman Documentation
- Review the Assignment Checklist

<div align="center">
  <br/>
  <h3>⭐ If this project helped you, please star the repository! ⭐</h3>
  <p>Built with ❤️ for the Chess Community</p>
</div>