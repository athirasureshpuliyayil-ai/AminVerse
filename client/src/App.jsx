import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import GeneratorWizard from './pages/GeneratorWizard'
import GameHub from './pages/GameHub'
import GamePlay from './pages/GamePlay'
import StoryLibrary from './pages/StoryLibrary'
import StoryDetail from './pages/StoryDetail'
import ProjectHistory from './pages/ProjectHistory'
import Downloads from './pages/Downloads'
import Bookmarks from './pages/Bookmarks'
import Templates from './pages/Templates'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import AdminPortal from './pages/AdminPortal'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        <Route path="/stories" element={<StoryLibrary />} />
        <Route path="/stories/:id" element={<StoryDetail />} />

        {/* Protected User Studio Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<GeneratorWizard />} />
          <Route path="/generate/:projectId" element={<GeneratorWizard />} />
          <Route path="/relax" element={<GameHub />} />
          <Route path="/relax/:gameId" element={<GamePlay />} />
          <Route path="/projects" element={<ProjectHistory />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/admin-dashboard" element={<AdminPortal />} />
          <Route path="/admin/*" element={<AdminPortal />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
