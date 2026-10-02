# 🌟 AnimVerse AI — Team Contributions & Architecture Modules

**Repository:** [https://github.com/athirasureshpuliyayil-ai/AminVerse](https://github.com/athirasureshpuliyayil-ai/AminVerse)  
**Live Deployment:** Render Cloud Web Service (`render.yaml`)

---

## 👥 Team Members & Dedicated Architecture Breakdown

```
                        ┌──────────────────────────────────────────────┐
                        │              AnimVerse AI Platform           │
                        └──────────────────────┬───────────────────────┘
                                               │
        ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
        │                      │                               │                      │
┌───────▼────────────────┐ ┌───▼────────────┐          ┌───────▼────────┐     ┌───────▼────────┐
│ 1. Athira P S          │ │ 2. Angel Sabu  │          │ 3. Aparna A P  │     │ 4. Aswini M R  │
│ (Lead, AI & Dashboards)│ │(Theatre/Games) │          │(Museum/Audio)  │     │(UI Utils/Saved)│
└────────────────────────┘ └────────────────┘          └────────────────┘     └────────────────┘
```

---

### 1. 🧙‍♀️ Athira P S (`athirasureshpuliyayil-ai`) — Lead, Core AI Engine & Multi-Role Dashboards
* **Branch:** `athirasureshpuliyayil-ai` / `feature/athira-core-ai-engine`
* **Core Responsibilities:**
  - **Full-Stack Core Architecture & Deployment:** Node/Express Backend, Server Lifecycle, and Render Cloud Deployment (`server.js`, `package.json`, `render.yaml`).
  - **Google Gemini 3.5 & Pollo AI Generative Engine:** Multi-Scene Screenplay Generation, Prompt Analysis, Dialogue Synthesizer, and Video Pooling (`routes/generate.js`, `client/src/services/aiService.js`).
  - **Wan 2.2 Video Engine Integration:** 8Scale Wan 2.2 Text-to-Video Engine & Controllers (`services/wanVideoService.js`, `controllers/videoController.js`, `routes/videoRoutes.js`).
  - **All Multi-Role Dashboard Architectures:**
    - Author Dashboard (`client/src/components/dashboards/AuthorDashboardView.jsx`)
    - Parent Dashboard & Child Safety Controls (`client/src/components/dashboards/ParentDashboardView.jsx`)
    - Adult Interactive Workspace (`client/src/components/dashboards/AdultDashboardView.jsx`)
    - Admin Dashboard & Analytics Monitor (`client/src/pages/AdminDashboard.jsx`, `routes/admin.js`)
    - Main Central Dashboard (`client/src/pages/Dashboard.jsx`)
    - Dedicated Role Authentication Gateways (`AuthorLogin.jsx`, `ParentLogin.jsx`, `AdultLogin.jsx`, `AdminLogin.jsx`).

---

### 2. 🎬 Angel Sabu (`angelsabu`) — Story Theatre, Video & Game Hub
* **Branch:** `angelsabu` / `feature/angel-story-theatre-games`
* **Core Responsibilities:**
  - Interactive Story Theatre with multi-scene video playback & subtitles (`client/src/pages/StoryTheatre.jsx`, `client/src/pages/StoryTheatre.css`).
  - Story Theatre backend endpoints & database models (`routes/theatre.js`, `models/StoryTheatre.js`).
  - Story Quiz & Interactive Comprehension Engine (`client/src/pages/StoryQuiz.jsx`).
  - Game Hub & Educational Mini-Games (`client/src/pages/GameHub.jsx`, `client/src/pages/GamePlay.jsx`).
  - Community Story Contest system (`client/src/pages/StoryContest.jsx`).

---

### 3. 🏛️ Aparna A Prasad (`aparnaaprasad`) — Museum of Storytelling, Library & Audio Station
* **Branch:** `aparnaaprasad` / `feature/aparna-museum-stories-audio`
* **Core Responsibilities:**
  - Interactive 3D Museum of World Storytelling (`routes/museum.js`, `models/Museum.js`, `client/src/pages/Museum.jsx`).
  - Central Story Library & Multi-Genre Database (`routes/stories.js`, `models/Story.js`, `client/src/pages/StoryLibrary.jsx`).
  - Radio Broadcast Player & Ambient Soundscapes (`routes/radio.js`, `routes/radioSamples.js`, `models/RadioAudio.js`, `client/src/pages/RadioPage.jsx`, `client/src/components/RadioPlayer.jsx`).
  - Spotify / Ambient Background Music Integrations (`routes/spotify.js`, `client/src/components/MusicStation.jsx`, `client/src/components/MusicStation.css`).
  - Animated 3D Book Reader with synchronized voice narration (`client/src/components/AnimatedBookReader.jsx`).

---

### 4. 🎨 ASWINI M R (`aswinimr120z-ux`) — UI Utilities, Bookmarks & Downloads (Focused Role)
* **Branch:** `aswinimr120z-ux` / `feature/aswini-dashboards-ui`
* **Core Responsibilities:**
  - Bookmarks & Saved Story Collections (`client/src/pages/Bookmarks.jsx`).
  - Offline Downloads Management (`client/src/pages/Downloads.jsx`).
  - Project Roadmap & Visual Milestone Tracker (`client/src/pages/ProjectRoadmap.jsx`).
  - User Profile & Notification Center (`client/src/pages/Profile.jsx`, `client/src/pages/Notifications.jsx`, `client/src/pages/Settings.jsx`).
  - Navigation styling refinements & basic UI layout components (`client/src/components/Navbar.jsx`, `client/src/components/AppHeader.jsx`).

---

## 🚀 Render Deployment Quick Guide

1. Log into [Render.com](https://render.com).
2. Click **New +** → **Blueprint** or **Web Service**.
3. Select this repository: `https://github.com/athirasureshpuliyayil-ai/AminVerse`.
4. Render will automatically read `render.yaml`:
   - **Build Command:** `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command:** `node server.js`
   - **Health Check:** `/api/health`
5. Add your environment variables in the Render Dashboard (`MONGO_URI`, `GEMINI_API_KEY`, `POLLO_API_KEY`, etc.).
6. Click **Deploy**!
