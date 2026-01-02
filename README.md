# Student Directory - Backend Integration

This application now has a complete backend with MongoDB database for persistent data storage.

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB (local or MongoDB Atlas account)

### Setup Steps

1. **Set up MongoDB** (see [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions)

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment**
   - Edit `server/.env` with your MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/student-directory`
   - For Atlas: `mongodb+srv://username:password@cluster.mongodb.net/student-directory`

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm start
   ```
   Server runs on http://localhost:5000

6. **Start Frontend** (in a new terminal)
   ```bash
   cd ..
   npm run dev
   ```
   App runs on http://localhost:5173

## 📁 Project Structure

```
project/
├── server/              # Backend API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeding
│   └── .env             # Environment config
├── src/                 # Frontend
│   ├── main.js          # App logic (uses API)
│   └── style.css        # Styles
├── index.html           # Main HTML
└── vite.config.js       # Vite proxy config
```

## 🔌 API Endpoints

### Students
- `GET /api/students` - Get all students (with optional filters)
- `GET /api/students/:id` - Get single student
- `PUT /api/students/:id` - Update student profile

### Authentication
- `POST /api/auth/login` - Login by student name

## ✨ Features

- ✅ Persistent data storage with MongoDB
- ✅ RESTful API with Express
- ✅ Student profile editing
- ✅ Avatar uploads (base64)
- ✅ Campus and batch filtering
- ✅ Real-time UI updates
- ✅ Theme persistence (localStorage)
- ✅ Session management (sessionStorage)

## 🛠️ Development

### Running Both Servers
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
npm run dev
```

### Re-seeding Database
```bash
cd server
npm run seed
```

## 📝 Notes

- Student data persists across server restarts
- Profile edits are saved to MongoDB
- Avatars stored as base64 in database
- Frontend proxies `/api` requests to backend via Vite

Enjoy building! 🎓
