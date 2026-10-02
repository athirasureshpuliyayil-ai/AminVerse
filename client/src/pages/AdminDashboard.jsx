import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminUser, getAdminToken, clearAllAuth,
  getStoredStories, addStoryToStorage, deleteStoryFromStorage,
  getStoredGames, addGameToStorage, deleteGameFromStorage
} from '../utils/authStorage'

const SAMPLE_GENERATED_VIDEOS = [
  {
    id: 'vid_101',
    title: 'The Starlight Bunny & The Whispering Grove',
    prompt: 'A curious silver rabbit named Barnaby explores an enchanted grove where starflowers bloom in vibrant neon gold under a moonlit canopy.',
    creatorName: 'Athira K',
    creatorRole: 'Parent',
    creatorEmail: 'athira@animverse.ai',
    style: 'Kids Cartoon 3D',
    aspectRatio: '16:9 Cinema',
    resolution: '1080p Full HD',
    duration: '24s',
    date: '2026-09-26 14:32',
    fileSize: '14.2 MB',
    status: 'Rendered & Stored',
    videoUrl: '/videos/scene_1.mp4',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid_102',
    title: 'Quantum Abyss: Event Horizon Divergence',
    prompt: 'Dr. Aris Vance watches an inverted gravitational beam project from orbital station Aetheris-9, neutralizing dark matter waves across Earth’s thermosphere.',
    creatorName: 'David Vance',
    creatorRole: 'Adult',
    creatorEmail: 'adult@animverse.ai',
    style: 'Cinematic 8K',
    aspectRatio: '16:9 Cinema',
    resolution: '4K UHD',
    duration: '36s',
    date: '2026-09-27 10:15',
    fileSize: '38.6 MB',
    status: 'Rendered & Stored',
    videoUrl: '/videos/scene_3.mp4',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid_103',
    title: 'Midnight at Blackwood: The Secret Chamber',
    prompt: 'Detective Julian Vance turns the azimuth dial on an antique brass naval telescope in the grand library, causing the nine-foot mahogany bookshelf to slide open.',
    creatorName: 'Arthur Conan',
    creatorRole: 'Author',
    creatorEmail: 'author@animverse.ai',
    style: 'Noir Film',
    aspectRatio: '9:16 Reel',
    resolution: '1080p Full HD',
    duration: '18s',
    date: '2026-09-27 16:48',
    fileSize: '11.8 MB',
    status: 'Rendered & Stored',
    videoUrl: '/videos/scene_4.mp4',
    poster: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  }
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'videos' | 'stories' | 'games'
  const [loading, setLoading] = useState(true)

  // Data states
  const [users, setUsers] = useState([])
  const [userRoleFilter, setUserRoleFilter] = useState('All')
  const [selectedUserDossier, setSelectedUserDossier] = useState(null)

  const [videos, setVideos] = useState([])
  const [activeVideoPlayer, setActiveVideoPlayer] = useState(null)
  const [videoFilter, setVideoFilter] = useState('All')

  const [stories, setStories] = useState([])
  const [games, setGames] = useState([])
  const [radioTracks, setRadioTracks] = useState([])
  const [radioFilter, setRadioFilter] = useState('All') // 'All' | 'pending' | 'approved' | 'rejected'
  const [activeRadioTrack, setActiveRadioTrack] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  // Museum Exhibits State
  const [museumExhibits, setMuseumExhibits] = useState([])
  const [museumRoomFilter, setMuseumRoomFilter] = useState('All')
  const [museumLangFilter, setMuseumLangFilter] = useState('All')
  const [museumSearch, setMuseumSearch] = useState('')
  const [showAddExhibitModal, setShowAddExhibitModal] = useState(false)
  const [editingExhibit, setEditingExhibit] = useState(null)
  const [uploadingExhibitFile, setUploadingExhibitFile] = useState(false)

  const initialExhibitForm = {
    title: '',
    subtitle: '',
    room: 'Malayalam Literature',
    category: 'Classics',
    author: '',
    era: '',
    keyWorks: '',
    quote: '',
    language: 'English',
    ageGroup: 'all',
    description: '',
    content: '',
    imageUrl: '',
    audioUrl: '',
    accentColor: '#F59E0B',
    tags: '',
    featured: false,
    order: 0,
    isPublished: true
  }
  const [exhibitForm, setExhibitForm] = useState(initialExhibitForm)

  // Modals for Adding
  const [showAddStoryModal, setShowAddStoryModal] = useState(false)
  const [showAddGameModal, setShowAddGameModal] = useState(false)

  // New Story Form State
  const [storyForm, setStoryForm] = useState({
    title: '', author: '', genre: 'Fantasy', audience: 'kids', desc: '', time: '10 min', rating: 4.8
  })

  // New Game Form State
  const [gameForm, setGameForm] = useState({
    title: '', category: 'Puzzle & Logic', totalLevels: 10, icon: 'QUEST', color: '#8B5CF6', desc: ''
  })

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  useEffect(() => {
    const savedAdmin = getAdminUser()
    const token = getAdminToken()

    if (!savedAdmin || !token) {
      setLoading(false)
      navigate('/admin-login', { replace: true })
      return
    }

    setAdmin(savedAdmin)

    // Load registered users directly from backend API
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        let apiUsers = []
        if (data.success && data.data) {
          apiUsers = data.data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role || 'user').charAt(0).toUpperCase() + (u.role || 'user').slice(1),
            status: u.isActive ? 'Active' : 'Inactive',
            createdAt: u.createdAt.split('T')[0],
            lastActive: 'Recently',
            videosCount: u.projectCount || 0,
            storiesRead: 0,
            storageUsed: '0 MB'
          }))
        }
        
        // Merge with local users (only genuine ones, filter out the mock accounts)
        const storedUsers = JSON.parse(localStorage.getItem('animverse_users') || '[]')
        const mockIds = ['u_101', 'u_102', 'u_103', 'u_104']
        const cleanLocalUsers = storedUsers.filter(u => 
          !mockIds.includes(u.id) && 
          !['parent@animverse.ai', 'adult@animverse.ai', 'author@animverse.ai', 'elena@animverse.ai'].includes(u.email) &&
          !apiUsers.find(au => au.email === u.email)
        )
        
        const finalUsers = [...apiUsers, ...cleanLocalUsers]
        setUsers(finalUsers)
        localStorage.setItem('animverse_users', JSON.stringify(finalUsers))
      } catch (err) {
        console.error('Error fetching admin users:', err)
        // Offline fallback
        const storedUsers = JSON.parse(localStorage.getItem('animverse_users') || '[]')
        const mockIds = ['u_101', 'u_102', 'u_103', 'u_104']
        const cleanLocalUsers = storedUsers.filter(u => 
          !mockIds.includes(u.id) && 
          !['parent@animverse.ai', 'adult@animverse.ai', 'author@animverse.ai', 'elena@animverse.ai'].includes(u.email)
        )
        setUsers(cleanLocalUsers)
      }
    }
    fetchUsers()

    // Load persistent stories and games
    setStories(getStoredStories())
    setGames(getStoredGames())

    // Load radio tracks for admin
    const fetchRadioTracks = async () => {
      try {
        const res = await fetch('/api/radio/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success && data.data) {
          setRadioTracks(data.data)
        }
      } catch (err) {
        console.error('Error fetching radio tracks in admin:', err)
      }
    }
    fetchRadioTracks()

    // Load museum exhibits for admin
    const fetchMuseumExhibits = async () => {
      try {
        const res = await fetch('/api/museum/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setMuseumExhibits(data.data)
        }
      } catch (err) {
        console.error('Error fetching museum exhibits in admin:', err)
      }
    }
    fetchMuseumExhibits()

    // Load stored generated videos
    try {
      const savedProjects = JSON.parse(localStorage.getItem('animverse_saved_projects') || '[]')
      if (savedProjects.length > 0) {
        // Merge with sample video fields
        const formatted = savedProjects.map((p, idx) => ({
          id: p.id || `vid_${idx + 100}`,
          title: p.title || 'Untitled Generation',
          prompt: p.prompt || 'Custom prompt',
          creatorName: p.userName || 'Studio User',
          creatorRole: p.audience === 'kids' ? 'Parent' : p.audience === 'adult' ? 'Adult' : 'Author',
          creatorEmail: 'user@animverse.ai',
          style: p.style || 'Cinematic 8K',
          aspectRatio: '16:9 Cinema',
          resolution: '1080p Full HD',
          duration: p.duration || '24s',
          date: p.date || '2026-09-27',
          fileSize: '18.4 MB',
          status: 'Rendered & Stored',
          videoUrl: p.videoUrl || '/videos/scene_1.mp4',
          poster: p.poster || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
        }))
        setVideos(formatted)
      } else {
        setVideos(SAMPLE_GENERATED_VIDEOS)
        localStorage.setItem('animverse_saved_projects', JSON.stringify(SAMPLE_GENERATED_VIDEOS))
      }
    } catch {
      setVideos(SAMPLE_GENERATED_VIDEOS)
    }

    setLoading(false)
  }, [navigate])

  const adminLogout = () => {
    clearAllAuth()
    navigate('/login', { replace: true })
  }

  // Delete User
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}" and their telemetry?`)) return
    
    try {
      await fetch(`/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      })
    } catch (err) {
      console.error('Error deleting user:', err)
    }

    const updated = users.filter(u => u.id !== id)
    setUsers(updated)
    localStorage.setItem('animverse_users', JSON.stringify(updated))
    if (selectedUserDossier?.id === id) setSelectedUserDossier(null)
    showSuccess(`User "${name}" permanently deleted.`)
  }

  // Delete Video from Storage
  const handleDeleteVideo = async (id, title) => {
    if (!window.confirm(`Delete generated video "${title}" from server storage?`)) return

    // Delete from MongoDB
    try {
      await fetch(`/api/projects/admin/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getAdminToken()}` } })
    } catch (err) {
      console.warn('MongoDB project delete:', err)
    }

    const updated = videos.filter(v => v.id !== id)
    setVideos(updated)
    localStorage.setItem('animverse_saved_projects', JSON.stringify(updated))
    if (activeVideoPlayer?.id === id) setActiveVideoPlayer(null)
    showSuccess(`Video "${title}" deleted from MongoDB storage archive.`)
  }

  // Story Handlers
  const handleAddStory = async (e) => {
    e.preventDefault()
    if (!storyForm.title || !storyForm.author) return alert('Title and Author are required.')
    const newStory = {
      id: 'story_' + Date.now(),
      ...storyForm,
      rating: parseFloat(storyForm.rating) || 4.8,
      plays: Math.floor(Math.random() * 500) + 100
    }

    // Persist to MongoDB
    try {
      await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAdminToken()}` },
        body: JSON.stringify(newStory)
      })
    } catch (err) {
      console.warn('MongoDB story save:', err)
    }

    const updated = addStoryToStorage(newStory)
    setStories(updated)
    setShowAddStoryModal(false)
    setStoryForm({ title: '', author: '', genre: 'Fantasy', audience: 'kids', desc: '', time: '10 min', rating: 4.8 })
    showSuccess(`Story "${newStory.title}" published and stored in MongoDB!`)
  }

  const handleDeleteStory = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete story "${title}"?`)) return

    // Delete from MongoDB
    try {
      await fetch(`/api/stories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getAdminToken()}` } })
    } catch (err) {
      console.warn('MongoDB story delete:', err)
    }

    const updated = deleteStoryFromStorage(id)
    setStories(updated)
    showSuccess(`Story "${title}" deleted from MongoDB database.`)
  }

  // Game Handlers
  const handleAddGame = (e) => {
    e.preventDefault()
    if (!gameForm.title) return alert('Game title is required.')
    const newGame = {
      id: 'game_' + Date.now(),
      ...gameForm,
      totalLevels: parseInt(gameForm.totalLevels) || 10,
      currentLevel: 1,
      xp: 0,
      stars: 0
    }
    const updated = addGameToStorage(newGame)
    setGames(updated)
    setShowAddGameModal(false)
    setGameForm({ title: '', category: 'Puzzle & Logic', totalLevels: 10, icon: 'QUEST', color: '#8B5CF6', desc: '' })
    showSuccess(`Game "${newGame.title}" created successfully!`)
  }

  const handleDeleteGame = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete game "${title}"?`)) return
    const updated = deleteGameFromStorage(id)
    setGames(updated)
    showSuccess(`Game "${title}" deleted.`)
  }

  // Radio Station Handlers
  const handleUpdateRadioStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/radio/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const json = await res.json()
      if (json.success) {
        setRadioTracks(prev => prev.map(t => (t._id || t.id) === id ? { ...t, status: newStatus } : t))
        showSuccess(`Radio audio broadcast updated to '${newStatus}'!`)
      }
    } catch (err) {
      console.error('Error updating radio status:', err)
    }
  }

  const handleToggleRadioActive = async (id) => {
    try {
      const res = await fetch(`/api/radio/admin/${id}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      })
      const json = await res.json()
      if (json.success) {
        setRadioTracks(prev => prev.map(t => (t._id || t.id) === id ? { ...t, isActive: json.data.isActive } : t))
        showSuccess(`Radio track ${json.data.isActive ? 'activated' : 'deactivated'}!`)
      }
    } catch (err) {
      console.error('Error toggling radio active state:', err)
    }
  }

  const handleDeleteRadioTrack = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete radio track "${title}"?`)) return
    try {
      const res = await fetch(`/api/radio/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      })
      const json = await res.json()
      if (json.success) {
        setRadioTracks(prev => prev.filter(t => (t._id || t.id) !== id))
        showSuccess(`Radio track "${title}" deleted permanently.`)
      }
    } catch (err) {
      console.error('Error deleting radio track:', err)
    }
  }

  // Museum Handlers
  const handleToggleExhibitPublished = async (id) => {
    try {
      const res = await fetch(`/api/museum/admin/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      })
      const json = await res.json()
      if (json.success) {
        setMuseumExhibits(prev => prev.map(e => (e._id || e.id) === id ? { ...e, isPublished: json.data.isPublished } : e))
        showSuccess(json.message)
      }
    } catch (err) {
      console.error('Error toggling museum exhibit status:', err)
    }
  }

  const handleDeleteExhibit = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently remove museum exhibit "${title}"?`)) return
    try {
      const res = await fetch(`/api/museum/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      })
      const json = await res.json()
      if (json.success) {
        setMuseumExhibits(prev => prev.filter(e => (e._id || e.id) !== id))
        showSuccess(`Exhibit "${title}" deleted from literature museum.`)
      }
    } catch (err) {
      console.error('Error deleting museum exhibit:', err)
    }
  }

  const handleExhibitImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingExhibitFile(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/museum/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` },
        body: formData
      })
      const json = await res.json()
      if (json.success && json.url) {
        setExhibitForm(prev => ({ ...prev, imageUrl: json.url }))
        showSuccess('Exhibit image uploaded successfully!')
      } else {
        alert(json.message || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed')
    } finally {
      setUploadingExhibitFile(false)
    }
  }

  const openCreateExhibitModal = () => {
    setEditingExhibit(null)
    setExhibitForm(initialExhibitForm)
    setShowAddExhibitModal(true)
  }

  const openEditExhibitModal = (exhibit) => {
    setEditingExhibit(exhibit)
    setExhibitForm({
      title: exhibit.title || '',
      subtitle: exhibit.subtitle || '',
      room: exhibit.room || 'Malayalam Literature',
      category: exhibit.category || 'Classics',
      author: exhibit.author || '',
      era: exhibit.era || '',
      keyWorks: Array.isArray(exhibit.keyWorks) ? exhibit.keyWorks.join(', ') : (exhibit.keyWorks || ''),
      quote: exhibit.quote || '',
      language: exhibit.language || 'English',
      ageGroup: exhibit.ageGroup || 'all',
      description: exhibit.description || '',
      content: Array.isArray(exhibit.content) ? exhibit.content.join('\n\n') : (exhibit.content || ''),
      imageUrl: exhibit.imageUrl || '',
      audioUrl: exhibit.audioUrl || '',
      accentColor: exhibit.accentColor || '#F59E0B',
      tags: Array.isArray(exhibit.tags) ? exhibit.tags.join(', ') : (exhibit.tags || ''),
      featured: Boolean(exhibit.featured),
      order: exhibit.order || 0,
      isPublished: exhibit.isPublished !== false
    })
    setShowAddExhibitModal(true)
  }

  const handleSaveExhibit = async (e) => {
    e.preventDefault()
    if (!exhibitForm.title || !exhibitForm.room) {
      return alert('Title and Room are required.')
    }

    try {
      const url = editingExhibit
        ? `/api/museum/admin/${editingExhibit._id || editingExhibit.id}`
        : '/api/museum/admin'
      const method = editingExhibit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify(exhibitForm)
      })
      const json = await res.json()
      if (json.success) {
        if (editingExhibit) {
          setMuseumExhibits(prev => prev.map(item => (item._id || item.id) === (editingExhibit._id || editingExhibit.id) ? json.data : item))
          showSuccess(`Exhibit "${json.data.title}" updated successfully!`)
        } else {
          setMuseumExhibits(prev => [json.data, ...prev])
          showSuccess(`Exhibit "${json.data.title}" deployed to museum!`)
        }
        setShowAddExhibitModal(false)
        setEditingExhibit(null)
      } else {
        alert(json.message || 'Error saving exhibit')
      }
    } catch (err) {
      console.error('Error saving exhibit:', err)
      alert('Error connecting to server')
    }
  }

  // Filter Museum Exhibits
  const filteredMuseumExhibits = museumExhibits.filter(item => {
    if (museumRoomFilter !== 'All' && item.room !== museumRoomFilter) return false
    if (museumLangFilter !== 'All' && item.language !== 'All' && item.language !== museumLangFilter) return false
    if (museumSearch.trim()) {
      const q = museumSearch.toLowerCase()
      const matchTitle = item.title?.toLowerCase().includes(q)
      const matchAuthor = item.author?.toLowerCase().includes(q)
      const matchDesc = item.description?.toLowerCase().includes(q)
      const matchEra = item.era?.toLowerCase().includes(q)
      if (!matchTitle && !matchAuthor && !matchDesc && !matchEra) return false
    }
    return true
  })

  // Filter Radio Tracks
  const filteredRadioTracks = radioFilter === 'All'
    ? radioTracks
    : radioTracks.filter(r => r.status === radioFilter)

  // Filter users
  const filteredUsers = userRoleFilter === 'All'
    ? users
    : users.filter(u => u.role?.toLowerCase() === userRoleFilter.toLowerCase())

  // Filter videos
  const filteredVideos = videoFilter === 'All'
    ? videos
    : videos.filter(v => v.creatorRole?.toLowerCase() === videoFilter.toLowerCase())

  const S = {
    card: {
      background: 'rgba(18, 19, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      padding: 24,
      color: '#F8FAFC'
    },
    badge: (bg, color) => ({
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 50,
      fontSize: '0.74rem', fontWeight: 800, background: bg, color: color,
      border: `1px solid ${color}40`, fontFamily: 'monospace'
    })
  }

  if (loading) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0B0E',
      color: '#F8FAFC',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex'
    }}>
      
      {/* Toast Notification */}
      {successMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: '#10B981', color: 'white', padding: '14px 26px', borderRadius: 12,
          fontWeight: 800, boxShadow: '0 10px 30px rgba(16,185,129,0.4)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {successMsg}
        </div>
      )}

      {/* ── LEFT ADMIN SIDEBAR ── */}
      <aside style={{
        width: 270, background: '#0F1118', borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: '28px 18px', display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, padding: '0 8px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: '#F59E0B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A0B0E', fontWeight: 900, fontSize: '1.1rem'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>AnimVerse Admin</div>
            <div style={{ fontSize: '0.65rem', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 800 }}>
              SUPERUSER CONSOLE
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'users', label: 'All Platform Users', badge: users.length },
            { id: 'museum', label: 'Museum Exhibits 🏛️', badge: museumExhibits.length },
            { id: 'radio', label: 'Radio Management 📻', badge: radioTracks.length },
            { id: 'videos', label: 'Generated Videos Archive', badge: videos.length },
            { id: 'stories', label: 'Manage Stories', badge: stories.length },
            { id: 'games', label: 'Level-Based Games', badge: games.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 12, cursor: 'pointer', border: 'none',
                background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: activeTab === tab.id ? '#F59E0B' : '#94A3B8',
                borderLeft: activeTab === tab.id ? '3px solid #F59E0B' : '3px solid transparent',
                fontWeight: activeTab === tab.id ? 800 : 600, fontSize: '0.88rem', fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: activeTab === tab.id ? '#F59E0B' : 'rgba(255,255,255,0.06)',
                color: activeTab === tab.id ? '#0A0B0E' : '#94A3B8',
                padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800
              }}>
                {tab.badge}
              </span>
            </button>
          ))}
        </nav>

        {/* Admin profile and logout */}
        <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: '#F59E0B',
              color: '#0A0B0E', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.85rem'
            }}>
              {(admin?.name || 'A')[0]}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>{admin?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.65rem', color: '#10B981', fontFamily: 'monospace' }}>SECURE SESSION</div>
            </div>
          </div>

          <button
            onClick={adminLogout}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem'
            }}
          >
            Logout Superuser
          </button>
        </div>
      </aside>

      {/* ── MAIN ADMIN VIEW ── */}
      <main style={{ flex: 1, padding: '36px 44px', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 14px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 8 }}>
              ✦ MASTER AUDIT & GENERATION REPOSITORY
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              System Command <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Center</span>
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Inspect user telemetry, manage generated video archives, and supervise published stories & level-based games.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '10px 20px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              ← Return to Studio
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
          <div style={{ ...S.card, borderTop: '3px solid #F59E0B' }}>
            <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6 }}>
              TOTAL USERS
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B', marginBottom: 4 }}>
              {users.length} Users
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Parents, Adults, Authors
            </div>
          </div>

          <div style={{ ...S.card, borderTop: '3px solid #06B6D4' }}>
            <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6 }}>
              STORED AI VIDEOS
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06B6D4', marginBottom: 4 }}>
              {videos.length} MP4 Exports
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Full 1080p & 4K UHD archives
            </div>
          </div>

          <div style={{ ...S.card, borderTop: '3px solid #8B5CF6' }}>
            <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6 }}>
              PUBLISHED NOVELS
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#8B5CF6', marginBottom: 4 }}>
              {stories.length} Titles
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Multi-page animated books
            </div>
          </div>

          <div style={{ ...S.card, borderTop: '3px solid #10B981' }}>
            <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6 }}>
              LEVEL ARCADE GAMES
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', marginBottom: 4 }}>
              {games.length} Games
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Non-violent & cognitive quests
            </div>
          </div>

          <div style={{ ...S.card, borderTop: '3px solid #F59E0B' }}>
            <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6 }}>
              LITERATURE MUSEUM EXHIBITS
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B', marginBottom: 4 }}>
              {museumExhibits.length} Exhibits
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              7 Heritage wings & galleries
            </div>
          </div>

          <div style={{ ...S.card, borderTop: '3px solid #F43F5E' }}>
            <div style={{ fontSize: '0.72rem', color: '#F43F5E', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6 }}>
              ANIMVERSE RADIO BROADCASTS
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F43F5E', marginBottom: 4 }}>
              {radioTracks.length} Audio Tracks
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Literature, stories & poetry FM
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB: VIRTUAL LITERATURE MUSEUM MANAGEMENT
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'museum' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  🏛️ Virtual Literature Museum Exhibits ({filteredMuseumExhibits.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Curate, deploy, edit, activate/deactivate, and manage historical literature exhibits across 7 specialized wings.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/museum')}
                  style={{
                    padding: '8px 18px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)', color: '#CBD5E1',
                    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  👁️ Visit Public Museum
                </button>
                <button
                  onClick={openCreateExhibitModal}
                  style={{
                    padding: '8px 20px', borderRadius: 50, border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A0B0E',
                    fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(245,158,11,0.35)'
                  }}
                >
                  + Add New Exhibit
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 20, flexWrap: 'wrap', gap: 12, padding: '14px 18px',
              background: '#0A0B0E', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
                <input
                  type="text"
                  value={museumSearch}
                  onChange={e => setMuseumSearch(e.target.value)}
                  placeholder="Search exhibits by title, author, era..."
                  style={{
                    flex: 1, padding: '8px 14px', borderRadius: 50,
                    background: '#12131A', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontSize: '0.82rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select
                  value={museumRoomFilter}
                  onChange={e => setMuseumRoomFilter(e.target.value)}
                  style={{
                    padding: '8px 14px', borderRadius: 50, background: '#12131A',
                    border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1',
                    fontSize: '0.8rem', fontWeight: 700, outline: 'none'
                  }}
                >
                  <option value="All">All Rooms / Wings</option>
                  <option value="Malayalam Literature">Malayalam Literature</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Hindi Literature">Hindi Literature</option>
                  <option value="Poetry">Poetry</option>
                  <option value="Children's Literature">Children's Literature</option>
                  <option value="Famous Authors">Famous Authors</option>
                  <option value="Evolution of Storytelling">Evolution of Storytelling</option>
                </select>

                <select
                  value={museumLangFilter}
                  onChange={e => setMuseumLangFilter(e.target.value)}
                  style={{
                    padding: '8px 14px', borderRadius: 50, background: '#12131A',
                    border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E1',
                    fontSize: '0.8rem', fontWeight: 700, outline: 'none'
                  }}
                >
                  <option value="All">All Languages</option>
                  <option value="English">English</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            {/* Exhibits Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#64748B', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.74rem' }}>
                    <th style={{ padding: '14px 16px' }}>Exhibit Title & Artwork</th>
                    <th style={{ padding: '14px 16px' }}>Gallery Wing</th>
                    <th style={{ padding: '14px 16px' }}>Author / Era</th>
                    <th style={{ padding: '14px 16px' }}>Language & Age</th>
                    <th style={{ padding: '14px 16px' }}>Featured</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMuseumExhibits.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '48px 16px', textAlign: 'center', color: '#94A3B8' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🏛️</div>
                        <h3 style={{ fontSize: '1.2rem', color: '#FFF', margin: '0 0 4px' }}>No Exhibits Found</h3>
                        <p style={{ margin: 0, fontSize: '0.84rem' }}>Try adjusting your room or language filters, or deploy a new exhibit.</p>
                      </td>
                    </tr>
                  ) : filteredMuseumExhibits.map(exhibit => {
                    const id = exhibit._id || exhibit.id
                    return (
                      <tr key={id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src={exhibit.imageUrl} alt={exhibit.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 800, color: '#F8FAFC' }}>{exhibit.title}</div>
                              {exhibit.subtitle && <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>{exhibit.subtitle}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={S.badge(`${exhibit.accentColor || '#F59E0B'}22`, exhibit.accentColor || '#F59E0B')}>
                            {exhibit.room}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#CBD5E1' }}>{exhibit.author || '—'}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{exhibit.era || exhibit.category}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <span style={S.badge('rgba(6, 182, 212, 0.15)', '#06B6D4')}>{exhibit.language}</span>
                            <span style={S.badge('rgba(139, 92, 246, 0.15)', '#8B5CF6')}>{exhibit.ageGroup}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {exhibit.featured ? (
                            <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.85rem' }}>★ Yes</span>
                          ) : (
                            <span style={{ color: '#64748B', fontSize: '0.8rem' }}>No</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleToggleExhibitPublished(id)}
                            style={{
                              padding: '4px 10px', borderRadius: 50, border: 'none',
                              background: exhibit.isPublished !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: exhibit.isPublished !== false ? '#10B981' : '#F87171',
                              fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer'
                            }}
                          >
                            {exhibit.isPublished !== false ? '● Published' : '○ Draft'}
                          </button>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => openEditExhibitModal(exhibit)}
                              style={{
                                padding: '5px 12px', borderRadius: 8,
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                                color: '#CBD5E1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExhibit(id, exhibit.title)}
                              style={{
                                padding: '5px 12px', borderRadius: 8,
                                background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#F87171', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: ANIMVERSE RADIO MANAGEMENT
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'radio' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  📻 Radio Station Audio Management ({filteredRadioTracks.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Review, approve, reject, activate, deactivate, moderate, or remove user-uploaded audio narrations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'approved', 'pending', 'rejected'].map(st => (
                  <button
                    key={st}
                    onClick={() => setRadioFilter(st)}
                    style={{
                      padding: '7px 16px', borderRadius: 50,
                      border: `1px solid ${radioFilter === st ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                      background: radioFilter === st ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: radioFilter === st ? '#F59E0B' : '#94A3B8',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#64748B', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '14px 16px' }}>Audio Track</th>
                    <th style={{ padding: '14px 16px' }}>Category</th>
                    <th style={{ padding: '14px 16px' }}>Language</th>
                    <th style={{ padding: '14px 16px' }}>Creator</th>
                    <th style={{ padding: '14px 16px' }}>Plays / Likes</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Active</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRadioTracks.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎙️</div>
                        <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '6px' }}>No Radio Audio Broadcasts Found</h3>
                        <p style={{ fontSize: '0.85rem' }}>Audio uploads will appear here for admin moderation.</p>
                      </td>
                    </tr>
                  ) : filteredRadioTracks.map(track => {
                    const trackId = track._id || track.id;
                    return (
                      <tr key={trackId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src={track.coverImage} alt={track.title} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 800, color: '#F8FAFC' }}>{track.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>⏱️ {track.duration || '3:30'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={S.badge('rgba(245, 158, 11, 0.15)', '#F59E0B')}>{track.category}</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={S.badge('rgba(6, 182, 212, 0.15)', '#06B6D4')}>{track.language}</span>
                        </td>
                        <td style={{ padding: '16px', color: '#CBD5E1' }}>
                          {track.creatorName || track.creator?.name || 'AnimVerse User'}
                        </td>
                        <td style={{ padding: '16px', color: '#94A3B8', fontFamily: 'monospace' }}>
                          🎧 {track.playsCount || 0} • ❤️ {track.likesCount || 0}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {track.status === 'approved' && <span style={S.badge('rgba(16, 185, 129, 0.15)', '#10B981')}>Approved</span>}
                          {track.status === 'pending' && <span style={S.badge('rgba(245, 158, 11, 0.15)', '#F59E0B')}>Pending</span>}
                          {track.status === 'rejected' && <span style={S.badge('rgba(239, 68, 68, 0.15)', '#EF4444')}>Rejected</span>}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button
                            onClick={() => handleToggleRadioActive(trackId)}
                            style={{
                              padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.72rem',
                              background: track.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: track.isActive ? '#10B981' : '#EF4444'
                            }}
                          >
                            {track.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setActiveRadioTrack(track)}
                              style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', fontSize: '0.78rem', cursor: 'pointer' }}
                              title="Listen / Preview Audio"
                            >
                              ▶️ Test Play
                            </button>

                            {track.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateRadioStatus(trackId, 'approved')}
                                style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: '0.78rem', cursor: 'pointer' }}
                              >
                                Approve
                              </button>
                            )}

                            {track.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateRadioStatus(trackId, 'rejected')}
                                style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontSize: '0.78rem', cursor: 'pointer' }}
                              >
                                Reject
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteRadioTrack(trackId, track.title)}
                              style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '0.78rem', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: ALL DETAILS OF PLATFORM USERS
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  User Registry & Telemetry ({filteredUsers.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Full activity logs, storage usage, AI video generation quotas, and role authentication.
                </p>
              </div>

              {/* Role filter buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Parent', 'Adult', 'Author'].map(r => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    style={{
                      padding: '7px 16px', borderRadius: 50,
                      border: `1px solid ${userRoleFilter === r ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                      background: userRoleFilter === r ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: userRoleFilter === r ? '#F59E0B' : '#94A3B8',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Comprehensive Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#64748B', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '14px 16px' }}>User / ID</th>
                    <th style={{ padding: '14px 16px' }}>Role</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>AI Videos Generated</th>
                    <th style={{ padding: '14px 16px' }}>Stories Read</th>
                    <th style={{ padding: '14px 16px' }}>Storage</th>
                    <th style={{ padding: '14px 16px' }}>Last Active</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
                        <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '6px' }}>No Registered Users Found</h3>
                        <p style={{ fontSize: '0.85rem' }}>Genuine registered users will appear here once they create an account.</p>
                      </td>
                    </tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', background: '#F59E0B',
                            color: '#0A0B0E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.88rem'
                          }}>
                            {u.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#F8FAFC' }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{u.email}</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'monospace' }}>ID: {u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span style={S.badge(
                          u.role === 'Parent' ? 'rgba(6, 182, 212, 0.15)' : u.role === 'Adult' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          u.role === 'Parent' ? '#06B6D4' : u.role === 'Adult' ? '#C084FC' : '#F59E0B'
                        )}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                          {u.status || 'Active'}
                        </span>
                      </td>

                      <td style={{ padding: '16px', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace' }}>
                        {u.videosCount || 4} renders
                      </td>

                      <td style={{ padding: '16px', color: '#CBD5E1' }}>
                        {u.storiesRead || 12} chapters
                      </td>

                      <td style={{ padding: '16px', color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {u.storageUsed || '45 MB'}
                      </td>

                      <td style={{ padding: '16px', color: '#94A3B8', fontSize: '0.8rem' }}>
                        {u.lastActive || 'Today'}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedUserDossier(u)}
                            style={{
                              padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                              background: 'rgba(255,255,255,0.05)', color: '#F8FAFC',
                              fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                            }}
                          >
                            Inspect Dossier
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            style={{
                              padding: '6px 12px', borderRadius: 8,
                              background: 'rgba(239, 68, 68, 0.12)', color: '#F87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 700,
                              fontSize: '0.78rem', cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: GENERATED VIDEOS STORED ARCHIVE & PLAYBACK
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'videos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  Stored AI Video Productions ({filteredVideos.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  All MP4 videos rendered by Parents, Adults, and Authors across the system. Stream, inspect prompts, or download.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Parent', 'Adult', 'Author'].map(r => (
                  <button
                    key={r}
                    onClick={() => setVideoFilter(r)}
                    style={{
                      padding: '7px 16px', borderRadius: 50,
                      border: `1px solid ${videoFilter === r ? '#06B6D4' : 'rgba(255,255,255,0.1)'}`,
                      background: videoFilter === r ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: videoFilter === r ? '#06B6D4' : '#94A3B8',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                    }}
                  >
                    {r} Videos
                  </button>
                ))}
              </div>
            </div>

            {/* Video Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
              {filteredVideos.map(vid => (
                <div
                  key={vid.id}
                  style={{
                    ...S.card, display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', padding: 0, overflow: 'hidden'
                  }}
                >
                  {/* Video Poster Preview with Play Button */}
                  <div
                    onClick={() => setActiveVideoPlayer(vid)}
                    style={{
                      height: 200, background: '#000', position: 'relative',
                      cursor: 'pointer', overflow: 'hidden'
                    }}
                  >
                    <img
                      src={vid.poster}
                      alt={vid.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: '50%', background: '#F59E0B',
                        color: '#0A0B0E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', fontWeight: 900, boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
                        transition: 'transform 0.2s'
                      }}>
                        ▶
                      </div>
                    </div>

                    {/* Format and Resolution Pill */}
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      background: 'rgba(10, 11, 14, 0.85)', backdropFilter: 'blur(8px)',
                      padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem',
                      color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace'
                    }}>
                      {vid.resolution} • {vid.duration}
                    </div>

                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(10, 11, 14, 0.85)', backdropFilter: 'blur(8px)',
                      padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem',
                      color: '#F59E0B', fontWeight: 800
                    }}>
                      {vid.style}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 8px' }}>
                        {vid.title}
                      </h3>

                      {/* Prompt Snippet */}
                      <p style={{
                        fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6,
                        margin: '0 0 16px', fontStyle: 'italic',
                        background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        "{vid.prompt}"
                      </p>

                      {/* Metadata Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.78rem', color: '#64748B', marginBottom: 18 }}>
                        <div>
                          <span style={{ color: '#CBD5E1', fontWeight: 700 }}>Creator:</span> {vid.creatorName} ({vid.creatorRole})
                        </div>
                        <div>
                          <span style={{ color: '#CBD5E1', fontWeight: 700 }}>Date:</span> {vid.date}
                        </div>
                        <div>
                          <span style={{ color: '#CBD5E1', fontWeight: 700 }}>Aspect:</span> {vid.aspectRatio}
                        </div>
                        <div>
                          <span style={{ color: '#CBD5E1', fontWeight: 700 }}>Size:</span> {vid.fileSize}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => setActiveVideoPlayer(vid)}
                        style={{
                          flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                          background: '#F59E0B', color: '#0A0B0E', fontWeight: 800,
                          fontSize: '0.82rem', cursor: 'pointer'
                        }}
                      >
                        Play Video ▶
                      </button>

                      <a
                        href={vid.videoUrl}
                        download
                        style={{
                          padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700,
                          fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center'
                        }}
                      >
                        Download
                      </a>

                      <button
                        onClick={() => handleDeleteVideo(vid.id, vid.title)}
                        style={{
                          padding: '10px 14px', borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#F87171', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: MANAGE STORIES
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'stories' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  Published Story Manuscripts ({stories.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Add new original multi-chapter stories or remove stories from the universal library.
                </p>
              </div>

              <button
                onClick={() => setShowAddStoryModal(true)}
                style={{
                  padding: '10px 22px', borderRadius: 50, border: 'none',
                  background: '#F59E0B', color: '#0A0B0E', fontWeight: 800,
                  fontSize: '0.86rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.3)'
                }}
              >
                + Add New Story
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#64748B', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '12px 16px' }}>Title</th>
                    <th style={{ padding: '12px 16px' }}>Author</th>
                    <th style={{ padding: '12px 16px' }}>Genre</th>
                    <th style={{ padding: '12px 16px' }}>Audience</th>
                    <th style={{ padding: '12px 16px' }}>Duration</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#F8FAFC' }}>{s.title}</td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8' }}>{s.author}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={S.badge('rgba(245, 158, 11, 0.15)', '#F59E0B')}>{s.genre}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#CBD5E1', textTransform: 'capitalize' }}>{s.audience}</td>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}>{s.time || '10 min'}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteStory(s.id, s.title)}
                          style={{
                            padding: '6px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)',
                            color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)',
                            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: MANAGE GAMES
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'games' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  Interactive Level Games ({games.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Deploy cognitive level quests or manage multi-tier arcade challenges.
                </p>
              </div>

              <button
                onClick={() => setShowAddGameModal(true)}
                style={{
                  padding: '10px 22px', borderRadius: 50, border: 'none',
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white',
                  fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(139,92,246,0.3)'
                }}
              >
                + Add Level Game
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#64748B', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '12px 16px' }}>Game Title</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Levels</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map(g => (
                    <tr key={g.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#F8FAFC' }}>{g.title}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={S.badge('rgba(139, 92, 246, 0.15)', '#C084FC')}>{g.category}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
                        {g.totalLevels || 10} Levels
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteGame(g.id, g.title)}
                          style={{
                            padding: '6px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)',
                            color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)',
                            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ── MODAL: USER FULL DOSSIER INSPECTOR ── */}
      {selectedUserDossier && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#12131A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24,
            width: '100%', maxWidth: 640, padding: 36, color: '#F8FAFC',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: '#F59E0B',
                  color: '#0A0B0E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.2rem'
                }}>
                  {selectedUserDossier.name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{selectedUserDossier.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{selectedUserDossier.email}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserDossier(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  width: 36, height: 36, borderRadius: '50%', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#0A0B0E', padding: '16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>AUTHENTICATION ROLE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>{selectedUserDossier.role}</div>
              </div>

              <div style={{ background: '#0A0B0E', padding: '16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>GENERATION CREDITS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>{selectedUserDossier.credits} AI Credits</div>
              </div>

              <div style={{ background: '#0A0B0E', padding: '16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>VIDEOS RENDERED</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#06B6D4', marginTop: 4 }}>{selectedUserDossier.videosCount} Finished Exports</div>
              </div>

              <div style={{ background: '#0A0B0E', padding: '16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>CLOUD STORAGE USED</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#C084FC', marginTop: 4 }}>{selectedUserDossier.storageUsed} / 1 GB</div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.76rem', color: '#64748B', fontFamily: 'monospace', marginBottom: 6 }}>ADMINISTRATIVE NOTES:</div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                {selectedUserDossier.notes || 'Standard verified user account with full multi-device synchronization active.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => setSelectedUserDossier(null)}
                style={{
                  padding: '10px 20px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent', color: '#F8FAFC', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EMBEDDED VIDEO PLAYBACK STUDIO ── */}
      {activeVideoPlayer && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#12131A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24,
            width: '100%', maxWidth: 840, padding: 32, color: '#F8FAFC',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{activeVideoPlayer.title}</h3>
                <span style={{ fontSize: '0.78rem', color: '#06B6D4', fontFamily: 'monospace' }}>
                  {activeVideoPlayer.style} • {activeVideoPlayer.resolution} • {activeVideoPlayer.duration}
                </span>
              </div>

              <button
                onClick={() => setActiveVideoPlayer(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  width: 36, height: 36, borderRadius: '50%', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>

            {/* Embedded Player */}
            <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
              <video
                controls
                autoPlay
                loop
                width="100%"
                style={{ maxHeight: 420, display: 'block' }}
                src={activeVideoPlayer.videoUrl}
                poster={activeVideoPlayer.poster}
              />
            </div>

            {/* Prompt and metadata */}
            <div style={{ background: '#0A0B0E', padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', marginBottom: 4 }}>
                ORIGINAL GENERATION PROMPT:
              </div>
              <div style={{ fontSize: '0.9rem', color: '#CBD5E1', fontStyle: 'italic', lineHeight: 1.6 }}>
                "{activeVideoPlayer.prompt}"
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Stored locally • Creator: {activeVideoPlayer.creatorName} ({activeVideoPlayer.creatorRole})
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <a
                  href={activeVideoPlayer.videoUrl}
                  download
                  style={{
                    padding: '10px 22px', borderRadius: 50, border: 'none',
                    background: '#F59E0B', color: '#0A0B0E', fontWeight: 800,
                    fontSize: '0.88rem', textDecoration: 'none'
                  }}
                >
                  Download MP4 File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: RADIO AUDIO PLAYER PREVIEW ── */}
      {activeRadioTrack && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#12131A', border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 24, width: '100%', maxWidth: 520, padding: 28, color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#F59E0B' }}>
                📻 Admin Audio Moderation Player
              </div>
              <button
                onClick={() => setActiveRadioTrack(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <img src={activeRadioTrack.coverImage} alt={activeRadioTrack.title} style={{ width: 90, height: 90, borderRadius: 14, objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800 }}>{activeRadioTrack.title}</h4>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: 6 }}>Creator: {activeRadioTrack.creatorName}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={S.badge('rgba(245, 158, 11, 0.2)', '#F59E0B')}>{activeRadioTrack.category}</span>
                  <span style={S.badge('rgba(6, 182, 212, 0.2)', '#06B6D4')}>{activeRadioTrack.language}</span>
                </div>
              </div>
            </div>

            <audio controls autoPlay src={activeRadioTrack.audioUrl} style={{ width: '100%', marginBottom: 18 }} />

            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5, background: '#0A0B0E', padding: 14, borderRadius: 12, marginBottom: 20 }}>
              {activeRadioTrack.description || 'No description available for this radio audio broadcast.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setActiveRadioTrack(null)}
                style={{ padding: '8px 18px', borderRadius: 50, background: 'rgba(255,255,255,0.08)', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD NEW STORY ── */}
      {showAddStoryModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#12131A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, width: '100%', maxWidth: 540, padding: 32 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 6 }}>Publish Story Manuscript</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: 20 }}>Add a multi-page manuscript to the universal catalog.</p>

            <form onSubmit={handleAddStory}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Story Title</label>
                <input type="text" required value={storyForm.title} onChange={e => setStoryForm({ ...storyForm, title: e.target.value })} placeholder="e.g. Chronicles of Eldoria" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Author Name</label>
                  <input type="text" required value={storyForm.author} onChange={e => setStoryForm({ ...storyForm, author: e.target.value })} placeholder="Author name" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Genre</label>
                  <input type="text" value={storyForm.genre} onChange={e => setStoryForm({ ...storyForm, genre: e.target.value })} placeholder="Sci-Fi / Mystery" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Audience</label>
                  <select value={storyForm.audience} onChange={e => setStoryForm({ ...storyForm, audience: e.target.value })} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}>
                    <option value="kids">Kids & Family</option>
                    <option value="adult">Adult Fiction</option>
                    <option value="all">All Ages</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Read Duration</label>
                  <input type="text" value={storyForm.time} onChange={e => setStoryForm({ ...storyForm, time: e.target.value })} placeholder="12 min" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Synopsis / Plot Summary</label>
                <textarea rows={3} value={storyForm.desc} onChange={e => setStoryForm({ ...storyForm, desc: e.target.value })} placeholder="Plot description..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setShowAddStoryModal(false)} style={{ padding: '10px 20px', borderRadius: 50, background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: 50, background: '#F59E0B', color: '#0A0B0E', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Publish Story</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD NEW GAME ── */}
      {showAddGameModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#12131A', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, width: '100%', maxWidth: 500, padding: 32 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 6 }}>Deploy Level Arcade Game</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: 20 }}>Create a new interactive level quest for players.</p>

            <form onSubmit={handleAddGame}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Game Title</label>
                <input type="text" required value={gameForm.title} onChange={e => setGameForm({ ...gameForm, title: e.target.value })} placeholder="e.g. Director's Cinema Challenge" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Category</label>
                  <input type="text" value={gameForm.category} onChange={e => setGameForm({ ...gameForm, category: e.target.value })} placeholder="Puzzle & Logic" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Total Levels</label>
                  <input type="number" min="1" max="50" value={gameForm.totalLevels} onChange={e => setGameForm({ ...gameForm, totalLevels: e.target.value })} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Game Description</label>
                <textarea rows={3} value={gameForm.desc} onChange={e => setGameForm({ ...gameForm, desc: e.target.value })} placeholder="Objective and rules..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setShowAddGameModal(false)} style={{ padding: '10px 20px', borderRadius: 50, background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: 50, background: '#8B5CF6', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Add Level Game</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD/EDIT MUSEUM EXHIBIT ── */}
      {showAddExhibitModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#12131A', border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 24, width: '100%', maxWidth: 740, maxHeight: '90vh',
            overflowY: 'auto', padding: 32, color: 'white',
            boxShadow: '0 30px 90px rgba(0,0,0,0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B', margin: 0 }}>
                  🏛️ {editingExhibit ? 'Edit Museum Exhibit' : 'Deploy New Museum Exhibit'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Configure exhibit metadata, author dossier, historical period, and curator notes.
                </p>
              </div>

              <button
                onClick={() => { setShowAddExhibitModal(false); setEditingExhibit(null) }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExhibit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Exhibit Title *</label>
                <input
                  type="text" required
                  value={exhibitForm.title}
                  onChange={e => setExhibitForm({ ...exhibitForm, title: e.target.value })}
                  placeholder="e.g. William Shakespeare & The Globe Theatre"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Subtitle</label>
                  <input
                    type="text"
                    value={exhibitForm.subtitle}
                    onChange={e => setExhibitForm({ ...exhibitForm, subtitle: e.target.value })}
                    placeholder="e.g. The Universal Mirror of Human Passion"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Gallery Wing / Room *</label>
                  <select
                    value={exhibitForm.room}
                    onChange={e => setExhibitForm({ ...exhibitForm, room: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  >
                    <option value="Malayalam Literature">🏛️ Malayalam Literature</option>
                    <option value="English Literature">📚 English Literature</option>
                    <option value="Hindi Literature">📖 Hindi Literature</option>
                    <option value="Poetry">✒️ Poetry</option>
                    <option value="Children's Literature">🧒 Children's Literature</option>
                    <option value="Famous Authors">👤 Famous Authors</option>
                    <option value="Evolution of Storytelling">🕰️ Evolution of Storytelling</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Author / Creator</label>
                  <input
                    type="text"
                    value={exhibitForm.author}
                    onChange={e => setExhibitForm({ ...exhibitForm, author: e.target.value })}
                    placeholder="e.g. William Shakespeare"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Historical Era / Period</label>
                  <input
                    type="text"
                    value={exhibitForm.era}
                    onChange={e => setExhibitForm({ ...exhibitForm, era: e.target.value })}
                    placeholder="e.g. Elizabethan Era (1564–1616)"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Category</label>
                  <input
                    type="text"
                    value={exhibitForm.category}
                    onChange={e => setExhibitForm({ ...exhibitForm, category: e.target.value })}
                    placeholder="e.g. Drama / Epic"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Language</label>
                  <select
                    value={exhibitForm.language}
                    onChange={e => setExhibitForm({ ...exhibitForm, language: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  >
                    <option value="English">English</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Hindi">Hindi</option>
                    <option value="All">All Languages</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Audience / Age Group</label>
                  <select
                    value={exhibitForm.ageGroup}
                    onChange={e => setExhibitForm({ ...exhibitForm, ageGroup: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  >
                    <option value="all">All Ages</option>
                    <option value="kids">Kids & Family</option>
                    <option value="adult">Adult Scholars</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Key Works (comma-separated)</label>
                <input
                  type="text"
                  value={exhibitForm.keyWorks}
                  onChange={e => setExhibitForm({ ...exhibitForm, keyWorks: e.target.value })}
                  placeholder="e.g. Hamlet, Macbeth, Romeo and Juliet"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Iconic Quote / Verse Excerpt</label>
                <input
                  type="text"
                  value={exhibitForm.quote}
                  onChange={e => setExhibitForm({ ...exhibitForm, quote: e.target.value })}
                  placeholder="All the world's a stage, and all the men and women merely players..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Artwork Image URL (or upload below)</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="url"
                    value={exhibitForm.imageUrl}
                    onChange={e => setExhibitForm({ ...exhibitForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                  <label style={{
                    padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontWeight: 700,
                    fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    {uploadingExhibitFile ? 'Uploading…' : '📁 Upload File'}
                    <input type="file" accept="image/*" onChange={handleExhibitImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Curator Overview Description</label>
                <textarea
                  rows={2}
                  value={exhibitForm.description}
                  onChange={e => setExhibitForm({ ...exhibitForm, description: e.target.value })}
                  placeholder="Introductory text on the exhibit stand..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Detailed Analysis Paragraphs (double newline separated)</label>
                <textarea
                  rows={4}
                  value={exhibitForm.content}
                  onChange={e => setExhibitForm({ ...exhibitForm, content: e.target.value })}
                  placeholder="Detailed multi-paragraph breakdown for the modal plaque..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={exhibitForm.featured}
                    onChange={e => setExhibitForm({ ...exhibitForm, featured: e.target.checked })}
                  />
                  <span>★ Feature in Rotunda Spotlight</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={exhibitForm.isPublished}
                    onChange={e => setExhibitForm({ ...exhibitForm, isPublished: e.target.checked })}
                  />
                  <span>● Active / Published</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddExhibitModal(false); setEditingExhibit(null) }}
                  style={{ padding: '10px 20px', borderRadius: 50, background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 26px', borderRadius: 50, background: '#F59E0B', color: '#0A0B0E', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  {editingExhibit ? 'Update Exhibit' : 'Deploy Exhibit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
