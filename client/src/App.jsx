import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import GeneratorWizard from './pages/GeneratorWizard'
import GameHub from './pages/GameHub'
import GamePlay from './pages/GamePlay'
import StoryLibrary from './pages/StoryLibrary'
import StoryDetail from './pages/StoryDetail'
import StoryQuiz from './pages/StoryQuiz'
import StoryContest from './pages/StoryContest'
import MyStories from './pages/MyStories'
import ProjectHistory from './pages/ProjectHistory'
import Downloads from './pages/Downloads'
import Bookmarks from './pages/Bookmarks'
import Templates from './pages/Templates'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import ProjectRoadmap from './pages/ProjectRoadmap'
import RadioPage from './pages/RadioPage'
import MuseumPage from './pages/Museum'
import { StoryTheatreEditor, StoryTheatrePlayer } from './pages/StoryTheatre'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

import ParentLogin from './pages/ParentLogin'
import AdultLogin from './pages/AdultLogin'
import AuthorLogin from './pages/AuthorLogin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portal & Login Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/parent" element={<ParentLogin />} />
        <Route path="/login/adult" element={<AdultLogin />} />
        <Route path="/login/author" element={<AuthorLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/contest" element={<StoryContest />} />
        <Route path="/radio" element={<RadioPage />} />
        <Route path="/museum" element={<MuseumPage />} />

        {/* Protected User Studio & Dedicated Role Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/stories" element={<StoryLibrary />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/stories/:id/quiz" element={<StoryQuiz />} />
          <Route path="/stories/:id/theatre" element={<StoryTheatrePlayer />} />
          <Route path="/videos" element={<ProjectHistory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/user" element={<Dashboard forcedRole="author" />} />
          <Route path="/dashboard/parent" element={<Dashboard forcedRole="parent" />} />
          <Route path="/dashboard/adult" element={<Dashboard forcedRole="adult" />} />
          <Route path="/dashboard/author" element={<Dashboard forcedRole="author" />} />
          
          <Route path="/my-stories" element={<MyStories />} />
          <Route path="/author/theatre/:storyId" element={<StoryTheatreEditor />} />
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
          <Route path="/roadmap" element={<ProjectRoadmap />} />
          <Route path="/project-governance" element={<ProjectRoadmap />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
