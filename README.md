# 🎬 AnimVerse AI — Intelligent Prompt-to-Animation Platform

**MCA Capstone Project 2025**

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB
Edit `.env` file:
- **Without Auth (Default):** `MONGO_URI=mongodb://localhost:27017/capstoneproject`
- **With Auth (athira/athira123):** `MONGO_URI=mongodb://athira:athira123@localhost:27017/capstoneproject?authSource=admin`

### 3. Start Server
```bash
node server.js
# Or with auto-reload:
npm run dev
```

### 4. Open Browser
Visit: **http://localhost:5000**

---

## 📄 Pages

| Page | URL |
|------|-----|
| Home | http://localhost:5000/ |
| Login | http://localhost:5000/login |
| Register | http://localhost:5000/register |
| Admin Login | http://localhost:5000/admin-login |
| Dashboard | http://localhost:5000/dashboard |
| Admin Panel | http://localhost:5000/admin-dashboard |

---

## 🔑 Create First Admin Account
```bash
# POST to this endpoint once:
curl -X POST http://localhost:5000/api/auth/seed-admin
# Default admin: admin@animverse.ai / admin123456
```

---

## 🗃️ Database
- **DB Name:** capstoneproject
- **Username:** athira
- **Password:** athira123

---

## 📁 Project Structure
```
AnimVerseAi/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema (user/admin roles)
│   ├── Story.js           # Story library schema
│   └── AnimationProject.js # Animation projects schema
├── routes/
│   └── auth.js            # Auth API routes
├── public/
│   ├── css/style.css      # Main stylesheet (White+Yellow+Red theme)
│   ├── images/            # Logo, hero images
│   ├── index.html         # Home page
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── admin-login.html   # Admin portal
│   ├── dashboard.html     # User dashboard
│   ├── admin-dashboard.html # Admin panel
│   └── forgot-password.html # Password recovery
├── .env                   # Environment variables
├── package.json
└── server.js              # Express server entry point
```

---

## 🎨 Design Theme
- **Primary:** Red (`#E63946`)
- **Secondary:** Golden Yellow (`#FFD60A`)
- **Accent:** Orange-Gold (`#FF9F1C`)
- **Background:** Warm White (`#FFFBF0`)
- Font: Poppins (Google Fonts)

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/admin-login` | Admin login |
| POST | `/api/auth/forgot-password` | Forgot password |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/seed-admin` | Create first admin |
| GET | `/api/health` | Server health check |
