import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, getAdminUser, getAdminToken } from '../utils/authStorage'

// ── TRILINGUAL LOCALIZATION DICTIONARY ──
const I18N = {
  English: {
    museumTitle: 'AnimVerse Virtual Literature Museum',
    eyebrow: 'HERITAGE • CLASSICS • EVOLUTION',
    lobbyTitle: 'The Grand Rotunda of World Letters',
    lobbySubtitle: 'Walk through timeless literary halls, explore visionary authors, and discover how humanity preserved its soul across languages and centuries.',
    exploreWings: 'Explore Gallery Wings',
    curatorSpotlight: 'Curator’s Masterwork Spotlight',
    allWings: 'All Gallery Wings',
    searchPlaceholder: 'Search authors, epics, poems, eras, or works…',
    filterByLanguage: 'Language Filter:',
    filterByAudience: 'Audience Filter:',
    allAges: '🌟 All Audiences',
    kidsOnly: '🧒 Kids & Family',
    adultOnly: '🧔 Adult & Scholars',
    enterWing: 'Enter Gallery Wing →',
    backToLobby: '🏛️ Return to Grand Rotunda',
    prevWing: '◀ Previous Wing',
    nextWing: 'Next Wing ▶',
    inspectPlaque: 'Inspect Exhibit Plaque 🔍',
    exhibitsCount: 'Curated Exhibits',
    literaryEra: 'Historical Era / Period',
    keyWorks: 'Major Works & Manuscripts',
    curatorNote: 'Curator’s Historical Note',
    iconicQuote: 'Iconic Literary Verse / Quote',
    convertToVideo: '✨ Convert to Animated Video',
    bookmarkExhibit: '🔖 Bookmark Exhibit',
    bookmarked: 'Exhibit Saved to Bookmarks!',
    exploreInLibrary: '📚 Explore Story Library',
    audioGuide: '🎧 Museum Audio Guide',
    playingAudio: 'Playing Audio Narration…',
    noExhibitsFound: 'No exhibits found matching your filters.',
    resetFilters: 'Reset Search & Filters',
    adminDesk: '🏛️ Curator Admin Desk',
    addExhibit: '+ Add Exhibit to Museum',
    closeModal: 'Close Plaque',
    authorDossier: 'Author Dossier',
    category: 'Category'
  },
  Malayalam: {
    museumTitle: 'അനിമ്വേർസ് സാഹിത്യ മ്യൂസിയം',
    eyebrow: 'പൈതൃകം • ഇതിഹാസങ്ങൾ • പരിണാമം',
    lobbyTitle: 'ലോക സാഹിത്യത്തിന്റെ മഹാ മന്ദിരം',
    lobbySubtitle: 'ഭാഷകളുടെയും ഇതിഹാസങ്ങളുടെയും ചരിത്രത്തിലൂടെ സഞ്ചരിക്കൂ; എഴുത്തുകാരെയും അവരുടെ യുഗങ്ങളെയും അടുത്തറിയൂ.',
    exploreWings: 'മ്യൂസിയം ഹാളുകളിലേക്ക് പ്രവേശിക്കുക',
    curatorSpotlight: 'ക്യൂറേറ്റർ തിരഞ്ഞെടുപ്പ്',
    allWings: 'എല്ലാ ഗാലറികളും',
    searchPlaceholder: 'എഴുത്തുകാർ, കൃതികൾ, കവിതകൾ, കാലഘട്ടം എന്നിവ തിരയുക…',
    filterByLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക:',
    filterByAudience: 'വായനാ വിഭാഗം:',
    allAges: '🌟 എല്ലാവർക്കുമായി',
    kidsOnly: '🧒 കുട്ടികൾക്കായി',
    adultOnly: '🧔 മുതിർന്നവർക്കായി',
    enterWing: 'ഹാളിലേക്ക് കടക്കുക →',
    backToLobby: '🏛️ പ്രധാന ഹാളിലേക്ക് മടങ്ങുക',
    prevWing: '◀ മുൻപത്തെ ഹാൾ',
    nextWing: 'അടുത്ത ഹാൾ ▶',
    inspectPlaque: 'പ്രദർശന ശിലകം കാണുക 🔍',
    exhibitsCount: 'പ്രദർശനങ്ങൾ',
    literaryEra: 'ചരിത്ര കാലഘട്ടം',
    keyWorks: 'പ്രധാന സാഹിത്യ കൃതികൾ',
    curatorNote: 'ക്യൂറേറ്ററുടെ ചരിത്ര കുറിപ്പ്',
    iconicQuote: 'പ്രസിദ്ധമായ വരികൾ / ഉദ്ധരണി',
    convertToVideo: '✨ ആനിമേഷൻ വീഡിയോയാക്കുക',
    bookmarkExhibit: '🔖 ശേഖരത്തിൽ സൂക്ഷിക്കുക',
    bookmarked: 'പ്രദർശനം ബുക്ക്മാർക്കുകളിൽ ചേർത്തു!',
    exploreInLibrary: '📚 ലൈബ്രറി പരിശോധിക്കുക',
    audioGuide: '🎧 ഓഡിയോ ഗൈഡ് കേൾക്കുക',
    playingAudio: 'ഓഡിയോ വിവരണം പ്ലേ ചെയ്യുന്നു…',
    noExhibitsFound: 'നിങ്ങൾ തിരഞ്ഞ ഫലങ്ങൾ ലഭ്യമല്ല.',
    resetFilters: 'തിരച്ചിൽ പുനഃക്രമീകരിക്കുക',
    adminDesk: '🏛️ അഡ്മിൻ ഡെസ്ക്',
    addExhibit: '+ പുതിയ പ്രദർശനം ചേർക്കുക',
    closeModal: 'അടയ്ക്കുക',
    authorDossier: 'രചയിതാവിന്റെ ചരിത്രം',
    category: 'വിഭാഗം'
  },
  Hindi: {
    museumTitle: 'एनीमवर्स वर्चुअल साहित्य संग्रहालय',
    eyebrow: 'धरोहर • कालजयी कृतियां • विकास',
    lobbyTitle: 'विश्व साहित्य का भव्य मंडप',
    lobbySubtitle: 'युगों-युगों से संजोई गई कहानियों, महान लेखकों और साहित्य के गौरवशाली इतिहास की अनूठी डिजिटल यात्रा।',
    exploreWings: 'संग्रहालय दीर्घाओं में प्रवेश करें',
    curatorSpotlight: 'क्यूरेटर की विशेष पसंद',
    allWings: 'सभी दीर्घाएं',
    searchPlaceholder: 'लेखक, कृतियां, कविताएं, कालखंड खोजें…',
    filterByLanguage: 'भाषा चुनें:',
    filterByAudience: 'दर्शक वर्ग:',
    allAges: '🌟 सभी के लिए',
    kidsOnly: '🧒 बच्चों के लिए',
    adultOnly: '🧔 वयस्कों के लिए',
    enterWing: 'दीर्घा में प्रवेश करें →',
    backToLobby: '🏛️ मुख्य मंडप में लौटें',
    prevWing: '◀ पिछली दीर्घा',
    nextWing: 'अगली दीर्घा ▶',
    inspectPlaque: 'प्रदर्शनी पट्टिका देखें 🔍',
    exhibitsCount: 'प्रदर्शित कृतियां',
    literaryEra: 'ऐतिहासिक कालखंड',
    keyWorks: 'प्रमुख कृतियां व पांडुलिपियां',
    curatorNote: 'क्यूरेटर की ऐतिहासिक टिप्पणी',
    iconicQuote: 'प्रसिद्ध काव्य पंक्ति / उद्धरण',
    convertToVideo: '✨ एनिमेटेड वीडियो बनाएं',
    bookmarkExhibit: '🔖 बुकमार्क में जोड़ें',
    bookmarked: 'प्रदर्शनी बुकमार्क में सहेजी गई!',
    exploreInLibrary: '📚 कहानी लाइब्रेरी देखें',
    audioGuide: '🎧 संग्रहालय ऑडियो गाइड',
    playingAudio: 'ऑडियो विवरण चल रहा है…',
    noExhibitsFound: 'आपके चयन के अनुसार कोई प्रदर्शनी नहीं मिली।',
    resetFilters: 'फ़िल्टर हटाएं',
    adminDesk: '🏛️ व्यवस्थापक डेस्क',
    addExhibit: '+ नई प्रदर्शनी जोड़ें',
    closeModal: 'बंद करें',
    authorDossier: 'लेखक परिचय',
    category: 'श्रेणी'
  }
}

// Preset Wing Definitions for seamless browsing
const WING_I18N = {
  'Malayalam Literature': {
    English: 'Malayalam Literature',
    Malayalam: 'മലയാള സാഹിത്യം',
    Hindi: 'मलयालम साहित्य'
  },
  'English Literature': {
    English: 'English Literature',
    Malayalam: 'ഇംഗ്ലീഷ് സാഹിത്യം',
    Hindi: 'अंग्रेजी साहित्य'
  },
  'Hindi Literature': {
    English: 'Hindi Literature',
    Malayalam: 'ഹിന്ദി സാഹിത്യം',
    Hindi: 'हिंदी साहित्य'
  },
  'Poetry': {
    English: 'Poetry & Verses',
    Malayalam: 'കവിതകൾ',
    Hindi: 'काव्य व दोहे'
  },
  "Children's Literature": {
    English: "Children's Literature",
    Malayalam: 'ബാലസാഹിത്യം',
    Hindi: 'बाल साहित्य'
  },
  'Famous Authors': {
    English: 'Famous Authors',
    Malayalam: 'പ്രശസ്ത എഴുത്തുകാർ',
    Hindi: 'प्रसिद्ध लेखक'
  },
  'Evolution of Storytelling': {
    English: 'Evolution of Storytelling',
    Malayalam: 'കഥപറച്ചിലിന്റെ പരിണാമം',
    Hindi: 'कथा-कहानी का विकास'
  }
}

const getLocalizedWingName = (wingName, lang = 'English') => {
  return WING_I18N[wingName]?.[lang] || WING_I18N[wingName]?.English || wingName
}

const PRESET_WINGS = [
  {
    name: 'Malayalam Literature',
    nativeName: 'മലയാള സാഹിത്യം',
    icon: '🏛️',
    themeColor: '#F59E0B',
    description: 'From ancient Kilippattu and Romantic poetry to the humanism of Basheer and epic realism of MT.',
    banner: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'English Literature',
    nativeName: 'English Literature',
    icon: '📚',
    themeColor: '#8B5CF6',
    description: 'The sweeping journey from Shakespeare’s Globe Theatre to Victorian realism and modern fiction.',
    banner: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Hindi Literature',
    nativeName: 'हिंदी साहित्य',
    icon: '📖',
    themeColor: '#EF4444',
    description: 'The mystic couplets of Kabir, the rural heart of Premchand, and the lyrical grace of Chhayavaad.',
    banner: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Poetry',
    nativeName: 'കവിതകൾ / कविताएं',
    icon: '✒️',
    themeColor: '#06B6D4',
    description: 'Immortal verses spanning Romantic odes, environmental elegies, Urdu ghazals, and Gitanjali hymns.',
    banner: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: "Children's Literature",
    nativeName: 'കുട്ടികളുടെ സാഹിത്യം / बाल साहित्य',
    icon: '🧒',
    themeColor: '#10B981',
    description: 'Timeless animal fables of the Panchatantra, Ruskin Bond’s mountain tales, and magical Kerala folklore.',
    banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Famous Authors',
    nativeName: 'പ്രശസ്ത എഴുത്തുകാർ / प्रसिद्ध लेखक',
    icon: '👤',
    themeColor: '#EC4899',
    description: 'Dedicated master salons celebrating the lives, handwriting, and philosophy of monumental storytellers.',
    banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Evolution of Storytelling',
    nativeName: 'കഥപറച്ചിലിന്റെ പരിണാമം / कथा-विकास',
    icon: '🕰️',
    themeColor: '#D97706',
    description: 'The epochal leap from campfire oral lore and palm-leaf manuscripts to printing presses, radio, and AI animation.',
    banner: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80'
  }
]

export default function MuseumPage() {
  const navigate = useNavigate()
  const user = getUser()
  const adminUser = getAdminUser()
  const isAdmin = Boolean(adminUser || user?.role === 'admin')

  // Core navigation state
  const [currentWing, setCurrentWing] = useState('Lobby') // 'Lobby' | Wing Name
  const [selectedExhibit, setSelectedExhibit] = useState(null)
  const [language, setLanguage] = useState('English')
  const [audienceFilter, setAudienceFilter] = useState('all') // 'all' | 'kids' | 'adult'
  const [langFilter, setLangFilter] = useState('All') // 'All' | 'English' | 'Malayalam' | 'Hindi'
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // Data states
  const [exhibits, setExhibits] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  // Quick Admin Modal on Museum Page
  const [showQuickAdminModal, setShowQuickAdminModal] = useState(false)
  const [quickForm, setQuickForm] = useState({
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
    accentColor: '#F59E0B',
    tags: '',
    featured: false,
    isPublished: true
  })

  const t = I18N[language] || I18N.English

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Fetch all exhibits & rooms from backend
  const loadMuseumData = async () => {
    try {
      setLoading(true)
      const [exRes, rmRes] = await Promise.all([
        fetch('/api/museum'),
        fetch('/api/museum/rooms')
      ])

      const exJson = await exRes.json()
      const rmJson = await rmRes.json()

      if (exJson.success && Array.isArray(exJson.data)) {
        setExhibits(exJson.data)
      }
      if (rmJson.success && Array.isArray(rmJson.data)) {
        setRooms(rmJson.data)
      }
    } catch (error) {
      console.warn('Error loading museum data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMuseumData()
  }, [])

  // Filtered exhibits calculation
  const filteredExhibits = useMemo(() => {
    return exhibits.filter((item) => {
      // Room match
      if (currentWing !== 'Lobby' && item.room !== currentWing) {
        return false
      }
      // Language match
      if (langFilter !== 'All' && item.language !== 'All' && item.language !== langFilter) {
        return false
      }
      // Audience match
      if (audienceFilter !== 'all' && item.ageGroup !== 'all' && item.ageGroup !== audienceFilter) {
        return false
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = item.title?.toLowerCase().includes(q)
        const matchAuthor = item.author?.toLowerCase().includes(q)
        const matchDesc = item.description?.toLowerCase().includes(q)
        const matchEra = item.era?.toLowerCase().includes(q)
        const matchTags = Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(q))
        if (!matchTitle && !matchAuthor && !matchDesc && !matchEra && !matchTags) return false
      }
      return true
    })
  }, [exhibits, currentWing, langFilter, audienceFilter, searchQuery])

  // Featured spotlight exhibit
  const spotlightExhibit = useMemo(() => {
    return exhibits.find(e => e.featured) || exhibits[0]
  }, [exhibits])

  // Current wing metadata
  const currentWingMeta = useMemo(() => {
    if (currentWing === 'Lobby') return null
    return rooms.find(r => r.name === currentWing) || PRESET_WINGS.find(w => w.name === currentWing) || {
      name: currentWing,
      icon: '🏛️',
      themeColor: '#F59E0B',
      description: `Curated literary exhibits in the ${currentWing} collection.`,
      banner: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80'
    }
  }, [currentWing, rooms])

  // Wing navigation helper
  const allWingNames = useMemo(() => {
    const list = rooms.length > 0 ? rooms.map(r => r.name) : PRESET_WINGS.map(w => w.name)
    return Array.from(new Set(list))
  }, [rooms])

  const navigateWing = (direction) => {
    const currentIndex = allWingNames.indexOf(currentWing)
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % allWingNames.length
      setCurrentWing(allWingNames[nextIndex])
    } else {
      const prevIndex = (currentIndex - 1 + allWingNames.length) % allWingNames.length
      setCurrentWing(allWingNames[prevIndex])
    }
    window.scrollTo({ top: 380, behavior: 'smooth' })
  }

  // Audio narration toggle (using SpeechSynthesis for authentic narration)
  const toggleAudioNarration = (exhibit) => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio narration not supported on this browser.')
      return
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }

    window.speechSynthesis.cancel()
    const textToSpeak = `${exhibit.title}. By ${exhibit.author || 'Ancient Tradition'}. ${exhibit.description}. ${exhibit.quote || ''}. ${Array.isArray(exhibit.content) ? exhibit.content.join(' ') : ''}`
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
    setIsPlayingAudio(true)
    showToast(t.playingAudio)
  }

  // Stop audio on unmount or exhibit change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [selectedExhibit])

  // Quick Admin Add Exhibit Handler
  const handleQuickAddExhibit = async (e) => {
    e.preventDefault()
    if (!quickForm.title || !quickForm.room) {
      showToast('Title and Room are required.')
      return
    }

    try {
      const token = getAdminToken()
      const res = await fetch('/api/museum/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quickForm)
      })
      const json = await res.json()
      if (json.success) {
        showToast(`Exhibit "${quickForm.title}" added to ${quickForm.room}!`)
        setShowQuickAdminModal(false)
        setQuickForm({
          title: '', subtitle: '', room: 'Malayalam Literature', category: 'Classics',
          author: '', era: '', keyWorks: '', quote: '', language: 'English', ageGroup: 'all',
          description: '', content: '', imageUrl: '', accentColor: '#F59E0B', tags: '',
          featured: false, isPublished: true
        })
        loadMuseumData()
      } else {
        showToast(json.message || 'Error adding exhibit')
      }
    } catch (err) {
      console.error(err)
      showToast('Server connection error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090E',
      color: '#F8FAFC',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflowX: 'hidden'
    }}>

      {/* ── TOAST ALERT ── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 99999,
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white', padding: '14px 24px', borderRadius: 14,
          fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {toastMsg}
        </div>
      )}

      {/* ── TOP LUXURY MUSEUM NAVIGATION BAR ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7, 9, 14, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          maxWidth: 1360, margin: '0 auto', padding: '16px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20
        }}>
          {/* Museum Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', boxShadow: '0 0 20px rgba(245,158,11,0.35)'
              }}>
                🏛️
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  AnimVerse <span style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: 800 }}>MUSEUM</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#06B6D4', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  VIRTUAL LITERATURE WINGS
                </div>
              </div>
            </Link>

            {currentWing !== 'Lobby' && (
              <button
                onClick={() => setCurrentWing('Lobby')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 50,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t.backToLobby}
              </button>
            )}
          </div>

          {/* Language & Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {/* Language Switcher */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: 3
            }}>
              {['English', 'Malayalam', 'Hindi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    border: 'none', borderRadius: 50,
                    background: language === lang ? '#F59E0B' : 'transparent',
                    color: language === lang ? '#07090E' : '#94A3B8',
                    padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {lang === 'Malayalam' ? 'മലയാളം' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>

            {/* Stories link */}
            <Link
              to="/stories"
              style={{
                textDecoration: 'none', padding: '8px 16px', borderRadius: 50,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#E2E8F0', fontSize: '0.82rem', fontWeight: 700
              }}
            >
              📖 Story Library
            </Link>

            {/* Radio link */}
            <Link
              to="/radio"
              style={{
                textDecoration: 'none', padding: '8px 16px', borderRadius: 50,
                background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#67E8F9', fontSize: '0.82rem', fontWeight: 700
              }}
            >
              📻 Audio Radio
            </Link>

            {/* Admin Desk Trigger if admin */}
            {isAdmin && (
              <button
                onClick={() => setShowQuickAdminModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  color: 'white', border: 'none', fontSize: '0.82rem',
                  fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(139,92,246,0.35)'
                }}
              >
                ⚙️ {t.adminDesk}
              </button>
            )}

            {/* User Dashboard / Login */}
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '8px 18px', borderRadius: 50, border: 'none',
                  background: '#F59E0B', color: '#07090E', fontWeight: 900,
                  fontSize: '0.82rem', cursor: 'pointer'
                }}
              >
                Studio
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 18px', borderRadius: 50, border: 'none',
                  background: '#F59E0B', color: '#07090E', fontWeight: 900,
                  fontSize: '0.82rem', cursor: 'pointer'
                }}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 28px 100px' }}>

        {/* ══════════════════════════════════════════════════════════════
            VIEW A: GRAND ROTUNDA / LOBBY (OVERVIEW & DIRECTORY)
            ══════════════════════════════════════════════════════════════ */}
        {currentWing === 'Lobby' ? (
          <div>
            {/* Grand Rotunda Entrance Hero */}
            <section style={{
              position: 'relative', borderRadius: 32, overflow: 'hidden',
              padding: '64px 48px', marginBottom: 48,
              background: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.18) 0%, rgba(6,182,212,0.12) 40%, rgba(15,17,26,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 780 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 16px', borderRadius: 50,
                  background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
                  color: '#F59E0B', fontSize: '0.74rem', fontWeight: 800,
                  letterSpacing: '1.8px', marginBottom: 20
                }}>
                  ✦ {t.eyebrow}
                </div>

                <h1 style={{
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 900,
                  lineHeight: 1.06, color: '#FFFFFF', margin: '0 0 20px',
                  letterSpacing: '-0.03em'
                }}>
                  {t.lobbyTitle}
                </h1>

                <p style={{
                  fontSize: '1.12rem', lineHeight: 1.8, color: '#CBD5E1',
                  marginBottom: 32, maxWidth: 660
                }}>
                  {t.lobbySubtitle}
                </p>

                {/* Quick Wing Navigation Bar */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const el = document.getElementById('museum-wings-section')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    style={{
                      padding: '14px 28px', borderRadius: 50, border: 'none',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: '#07090E', fontWeight: 900, fontSize: '0.95rem',
                      cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.35)'
                    }}
                  >
                    {t.exploreWings} ➔
                  </button>

                  <button
                    onClick={() => navigate('/generate')}
                    style={{
                      padding: '14px 28px', borderRadius: 50,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF', fontWeight: 800, fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✨ Animate a Classic
                  </button>
                </div>
              </div>

              {/* Decorative Pillars / Lighting Overlay */}
              <div style={{
                position: 'absolute', right: -60, top: -60, width: 420, height: 420,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
            </section>

            {/* Curator's Featured Spotlight Masterwork */}
            {spotlightExhibit && (
              <section style={{
                marginBottom: 56, background: 'rgba(18, 20, 30, 0.75)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28,
                padding: '36px 40px', backdropFilter: 'blur(20px)'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 24, flexWrap: 'wrap', gap: 12
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                      ★ {t.curatorSpotlight}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF', margin: '4px 0 0' }}>
                      {spotlightExhibit.title}
                    </h2>
                  </div>

                  <span style={{
                    padding: '6px 16px', borderRadius: 50,
                    background: `${spotlightExhibit.accentColor || '#F59E0B'}22`,
                    border: `1px solid ${spotlightExhibit.accentColor || '#F59E0B'}66`,
                    color: spotlightExhibit.accentColor || '#F59E0B',
                    fontWeight: 800, fontSize: '0.78rem'
                  }}>
                    {spotlightExhibit.room} • {spotlightExhibit.era || spotlightExhibit.category}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr', gap: 36, alignItems: 'center' }}>
                  <div style={{
                    position: 'relative', height: 320, borderRadius: 20,
                    overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}>
                    <img
                      src={spotlightExhibit.imageUrl}
                      alt={spotlightExhibit.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(7,9,14,0.85) 100%)'
                    }} />
                    {spotlightExhibit.author && (
                      <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Author / Creator</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{spotlightExhibit.author}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    {spotlightExhibit.quote && (
                      <blockquote style={{
                        margin: '0 0 20px', padding: '16px 20px',
                        background: 'rgba(245,158,11,0.06)', borderLeft: '3px solid #F59E0B',
                        borderRadius: '0 14px 14px 0', fontSize: '1.05rem', fontStyle: 'italic',
                        color: '#F8FAFC', lineHeight: 1.6
                      }}>
                        "{spotlightExhibit.quote}"
                      </blockquote>
                    )}

                    <p style={{ color: '#CBD5E1', lineHeight: 1.8, fontSize: '0.98rem', marginBottom: 24 }}>
                      {spotlightExhibit.description}
                    </p>

                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedExhibit(spotlightExhibit)}
                        style={{
                          padding: '12px 24px', borderRadius: 50, border: 'none',
                          background: '#F59E0B', color: '#07090E', fontWeight: 800,
                          fontSize: '0.88rem', cursor: 'pointer'
                        }}
                      >
                        {t.inspectPlaque}
                      </button>

                      <button
                        onClick={() => setCurrentWing(spotlightExhibit.room)}
                        style={{
                          padding: '12px 24px', borderRadius: 50,
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                          color: '#FFF', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                        }}
                      >
                        Visit {spotlightExhibit.room} Wing ➔
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── MUSEUM GALLERY WINGS DIRECTORY ── */}
            <section id="museum-wings-section" style={{ marginTop: 24 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                marginBottom: 32, flexWrap: 'wrap', gap: 16
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    ✦ MUSEUM FLOOR DIRECTORY
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFF', margin: '4px 0 0' }}>
                    {t.allWings} (7 Sections)
                  </h2>
                </div>

                <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                  Select any wing to enter its interactive gallery hall.
                </div>
              </div>

              {/* 7 Interactive Museum Wing Portals */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: 24
              }}>
                {PRESET_WINGS.map((wing) => {
                  const wingExhibitsCount = exhibits.filter(e => e.room === wing.name).length
                  return (
                    <div
                      key={wing.name}
                      onClick={() => {
                        setCurrentWing(wing.name)
                        window.scrollTo({ top: 380, behavior: 'smooth' })
                      }}
                      style={{
                        position: 'relative', borderRadius: 24, overflow: 'hidden',
                        background: 'rgba(18, 20, 30, 0.85)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)'
                        e.currentTarget.style.borderColor = wing.themeColor
                        e.currentTarget.style.boxShadow = `0 20px 40px ${wing.themeColor}26`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)'
                      }}
                    >
                      {/* Wing Card Banner */}
                      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                        <img
                          src={wing.banner}
                          alt={wing.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `linear-gradient(180deg, rgba(7,9,14,0.15) 0%, rgba(7,9,14,0.85) 100%)`
                        }} />

                        <div style={{
                          position: 'absolute', top: 16, left: 16,
                          width: 44, height: 44, borderRadius: 14,
                          background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(10px)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.4rem', border: `1px solid ${wing.themeColor}55`
                        }}>
                          {wing.icon}
                        </div>

                        <div style={{
                          position: 'absolute', top: 16, right: 16,
                          padding: '5px 12px', borderRadius: 50,
                          background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#E2E8F0', fontSize: '0.74rem', fontWeight: 800
                        }}>
                          {wingExhibitsCount} {t.exhibitsCount}
                        </div>

                        <div style={{ position: 'absolute', bottom: 14, left: 20 }}>
                          <div style={{ fontSize: '0.72rem', color: wing.themeColor, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            {wing.nativeName}
                          </div>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFF', margin: '2px 0 0' }}>
                            {wing.name}
                          </h3>
                        </div>
                      </div>

                      {/* Wing Card Body */}
                      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 20px' }}>
                          {wing.description}
                        </p>

                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)'
                        }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                            Wing Gallery Stand
                          </span>
                          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: wing.themeColor }}>
                            {t.enterWing}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════
              VIEW B: SPECIFIC MUSEUM ROOM / WING VIEW
              ══════════════════════════════════════════════════════════════ */
          <div>
            {/* Wing Stage Header */}
            <section style={{
              position: 'relative', borderRadius: 28, overflow: 'hidden',
              padding: '48px 40px', marginBottom: 36,
              background: `linear-gradient(135deg, ${currentWingMeta?.themeColor || '#F59E0B'}18 0%, rgba(15,17,26,0.92) 100%)`,
              border: `1px solid ${currentWingMeta?.themeColor || '#F59E0B'}44`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '5px 14px', borderRadius: 50,
                    background: `${currentWingMeta?.themeColor || '#F59E0B'}22`,
                    border: `1px solid ${currentWingMeta?.themeColor || '#F59E0B'}66`,
                    color: currentWingMeta?.themeColor || '#F59E0B',
                    fontSize: '0.74rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: 14
                  }}>
                    {currentWingMeta?.icon} {currentWingMeta?.nativeName || currentWing}
                  </div>

                  <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFF', margin: '0 0 12px' }}>
                    {getLocalizedWingName(currentWing, language)}
                  </h1>

                  <p style={{ color: '#CBD5E1', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
                    {currentWingMeta?.description}
                  </p>
                </div>

                {/* Wing Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                  <button
                    onClick={() => setCurrentWing('Lobby')}
                    style={{
                      padding: '10px 20px', borderRadius: 50,
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer'
                    }}
                  >
                    {t.backToLobby}
                  </button>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => navigateWing('prev')}
                      style={{
                        padding: '8px 14px', borderRadius: 50,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {t.prevWing}
                    </button>
                    <button
                      onClick={() => navigateWing('next')}
                      style={{
                        padding: '8px 14px', borderRadius: 50,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#CBD5E1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {t.nextWing}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wing Quick Tabs Bar */}
              <div style={{
                display: 'flex', gap: 8, marginTop: 32, overflowX: 'auto',
                paddingBottom: 6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20
              }}>
                {allWingNames.map(wingName => {
                  const isActive = currentWing === wingName
                  const localizedLabel = getLocalizedWingName(wingName, language)
                  return (
                    <button
                      key={wingName}
                      onClick={() => setCurrentWing(wingName)}
                      style={{
                        padding: '8px 18px', borderRadius: 50, border: 'none',
                        background: isActive ? '#F59E0B' : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#07090E' : '#CBD5E1',
                        fontWeight: isActive ? 900 : 700, fontSize: '0.82rem',
                        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                        boxShadow: isActive ? '0 4px 14px rgba(245,158,11,0.3)' : 'none'
                      }}
                    >
                      {localizedLabel}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Filter & Search Bar */}
            <div style={{
              background: 'rgba(18, 20, 30, 0.75)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '18px 24px', marginBottom: 36,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 16
            }}>
              {/* Search Box */}
              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 460 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  style={{
                    width: '100%', padding: '10px 16px 10px 40px',
                    borderRadius: 50, background: '#0A0C14',
                    border: '1px solid rgba(255,255,255,0.12)', color: 'white',
                    fontSize: '0.86rem', outline: 'none'
                  }}
                />
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {/* Language Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>{t.filterByLanguage}</span>
                  <select
                    value={langFilter}
                    onChange={(e) => setLangFilter(e.target.value)}
                    style={{
                      padding: '8px 14px', borderRadius: 50, background: '#0A0C14',
                      border: '1px solid rgba(255,255,255,0.12)', color: '#F8FAFC',
                      fontSize: '0.8rem', fontWeight: 700, outline: 'none'
                    }}
                  >
                    <option value="All">All Languages</option>
                    <option value="English">English</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                  </select>
                </div>

                {/* Audience Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>{t.filterByAudience}</span>
                  <select
                    value={audienceFilter}
                    onChange={(e) => setAudienceFilter(e.target.value)}
                    style={{
                      padding: '8px 14px', borderRadius: 50, background: '#0A0C14',
                      border: '1px solid rgba(255,255,255,0.12)', color: '#F8FAFC',
                      fontSize: '0.8rem', fontWeight: 700, outline: 'none'
                    }}
                  >
                    <option value="all">{t.allAges}</option>
                    <option value="kids">{t.kidsOnly}</option>
                    <option value="adult">{t.adultOnly}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Exhibits Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏛️</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading Literature Exhibits…</div>
              </div>
            ) : filteredExhibits.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '64px 20px',
                background: 'rgba(18,20,30,0.5)', borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📜</div>
                <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: 6 }}>{t.noExhibitsFound}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 20 }}>Try modifying your search term or language filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setLangFilter('All')
                    setAudienceFilter('all')
                  }}
                  style={{
                    padding: '10px 22px', borderRadius: 50, border: 'none',
                    background: '#F59E0B', color: '#07090E', fontWeight: 800,
                    fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  {t.resetFilters}
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 28
              }}>
                {filteredExhibits.map((exhibit) => (
                  <div
                    key={exhibit._id || exhibit.title}
                    onClick={() => setSelectedExhibit(exhibit)}
                    style={{
                      borderRadius: 22, overflow: 'hidden',
                      background: 'rgba(18, 20, 30, 0.85)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.45)',
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      display: 'flex', flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)'
                      e.currentTarget.style.borderColor = exhibit.accentColor || '#F59E0B'
                      e.currentTarget.style.boxShadow = `0 18px 36px ${exhibit.accentColor || '#F59E0B'}26`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.45)'
                    }}
                  >
                    {/* Exhibit Artwork Thumbnail */}
                    <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                      <img
                        src={exhibit.imageUrl}
                        alt={exhibit.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, rgba(7,9,14,0.1) 0%, rgba(7,9,14,0.85) 100%)'
                      }} />

                      {/* Header Badges Container - Flex with no overlap */}
                      <div style={{
                        position: 'absolute', top: 12, left: 12, right: 12,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        gap: 8, zIndex: 2
                      }}>
                        {exhibit.era ? (
                          <div style={{
                            padding: '4px 10px', borderRadius: 50,
                            background: 'rgba(7,9,14,0.88)', backdropFilter: 'blur(8px)',
                            color: '#F8FAFC', fontSize: '0.7rem', fontWeight: 800,
                            border: '1px solid rgba(255,255,255,0.18)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            maxWidth: '62%'
                          }}>
                            ⏳ {exhibit.era}
                          </div>
                        ) : <div />}

                        <div style={{
                          padding: '4px 10px', borderRadius: 50,
                          background: `${exhibit.accentColor || '#F59E0B'}33`,
                          color: exhibit.accentColor || '#F59E0B',
                          fontSize: '0.7rem', fontWeight: 800,
                          border: `1px solid ${exhibit.accentColor || '#F59E0B'}66`,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          flexShrink: 0
                        }}>
                          {exhibit.language === 'Malayalam' ? 'മലയാളം' : exhibit.language === 'Hindi' ? 'हिंदी' : exhibit.language}
                        </div>
                      </div>

                      {/* Author on Image */}
                      {exhibit.author && (
                        <div style={{ position: 'absolute', bottom: 12, left: 18, right: 18 }}>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>
                            {exhibit.author}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Exhibit Plaque Card Info */}
                    <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {exhibit.category && (
                          <div style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 50,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700, marginBottom: 10
                          }}>
                            {exhibit.category}
                          </div>
                        )}

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: '0 0 6px', lineHeight: 1.3 }}>
                          {exhibit.title}
                        </h3>

                        {exhibit.subtitle && (
                          <div style={{ fontSize: '0.84rem', color: '#CBD5E1', marginBottom: 12, fontStyle: 'italic' }}>
                            {exhibit.subtitle}
                          </div>
                        )}

                        <p style={{
                          color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6,
                          margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {exhibit.description}
                        </p>
                      </div>

                      {/* Plaque Action Bar */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(exhibit.tags || []).slice(0, 2).map(tag => (
                            <span key={tag} style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: exhibit.accentColor || '#F59E0B' }}>
                          {t.inspectPlaque}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════
          DETAILED EXHIBIT PLAQUE / SHOWCASE MODAL
          ══════════════════════════════════════════════════════════════ */}
      {selectedExhibit && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#0F121C', border: `1px solid ${selectedExhibit.accentColor || '#F59E0B'}55`,
            borderRadius: 28, width: '100%', maxWidth: 860, maxHeight: '90vh',
            overflowY: 'auto', padding: 36, color: '#F8FAFC',
            boxShadow: `0 30px 90px rgba(0,0,0,0.9), 0 0 60px ${selectedExhibit.accentColor || '#F59E0B'}22`
          }}>
            {/* Modal Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 50,
                    background: `${selectedExhibit.accentColor || '#F59E0B'}22`,
                    color: selectedExhibit.accentColor || '#F59E0B',
                    fontSize: '0.74rem', fontWeight: 800,
                    border: `1px solid ${selectedExhibit.accentColor || '#F59E0B'}66`
                  }}>
                    🏛️ {selectedExhibit.room}
                  </span>
                  {selectedExhibit.era && (
                    <span style={{
                      padding: '4px 12px', borderRadius: 50,
                      background: 'rgba(255,255,255,0.06)', color: '#CBD5E1',
                      fontSize: '0.74rem', fontWeight: 700
                    }}>
                      ⏳ {selectedExhibit.era}
                    </span>
                  )}
                  <span style={{
                    padding: '4px 12px', borderRadius: 50,
                    background: 'rgba(6,182,212,0.12)', color: '#67E8F9',
                    fontSize: '0.74rem', fontWeight: 800
                  }}>
                    {selectedExhibit.language} • {selectedExhibit.category || 'Classics'}
                  </span>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', margin: '0 0 4px', lineHeight: 1.2 }}>
                  {selectedExhibit.title}
                </h2>

                {selectedExhibit.subtitle && (
                  <div style={{ fontSize: '1rem', color: '#CBD5E1', fontStyle: 'italic' }}>
                    {selectedExhibit.subtitle}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedExhibit(null)
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
                  setIsPlayingAudio(false)
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none',
                  color: '#CBD5E1', width: 40, height: 40, borderRadius: '50%',
                  fontSize: '1.2rem', cursor: 'pointer', fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>

            {/* High-Res Artwork & Audio Bar */}
            <div style={{ position: 'relative', height: 340, borderRadius: 20, overflow: 'hidden', marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
              <img
                src={selectedExhibit.imageUrl}
                alt={selectedExhibit.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(7,9,14,0.1) 0%, rgba(7,9,14,0.85) 100%)'
              }} />

              {/* Author Banner on Image */}
              {selectedExhibit.author && (
                <div style={{ position: 'absolute', bottom: 18, left: 24 }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t.authorDossier}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
                    {selectedExhibit.author}
                  </div>
                </div>
              )}

              {/* Audio Guide Narration Trigger */}
              <button
                onClick={() => toggleAudioNarration(selectedExhibit)}
                style={{
                  position: 'absolute', bottom: 18, right: 24,
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 50, border: 'none',
                  background: isPlayingAudio ? '#EF4444' : 'rgba(7,9,14,0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFF', fontWeight: 800, fontSize: '0.82rem',
                  cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {isPlayingAudio ? '⏹️ Stop Narration' : t.audioGuide}
              </button>
            </div>

            {/* Key Works Pills */}
            {Array.isArray(selectedExhibit.keyWorks) && selectedExhibit.keyWorks.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                  📖 {t.keyWorks}:
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedExhibit.keyWorks.map(work => (
                    <span
                      key={work}
                      style={{
                        padding: '6px 14px', borderRadius: 50,
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                        color: '#FDE68A', fontSize: '0.82rem', fontWeight: 700
                      }}
                    >
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Iconic Quote Callout */}
            {selectedExhibit.quote && (
              <div style={{
                marginBottom: 24, padding: '20px 24px',
                background: 'rgba(245,158,11,0.06)', borderLeft: `4px solid ${selectedExhibit.accentColor || '#F59E0B'}`,
                borderRadius: '0 16px 16px 0'
              }}>
                <div style={{ fontSize: '0.72rem', color: selectedExhibit.accentColor || '#F59E0B', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>
                  ✦ {t.iconicQuote}
                </div>
                <div style={{ fontSize: '1.08rem', fontStyle: 'italic', color: '#FFF', lineHeight: 1.6 }}>
                  "{selectedExhibit.quote}"
                </div>
              </div>
            )}

            {/* Curator Analysis Content */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: '0.74rem', color: '#06B6D4', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
                ✦ {t.curatorNote}:
              </div>
              <p style={{ fontSize: '1.02rem', color: '#CBD5E1', lineHeight: 1.8, marginBottom: 16 }}>
                {selectedExhibit.description}
              </p>
              {Array.isArray(selectedExhibit.content) && selectedExhibit.content.map((p, idx) => (
                <p key={idx} style={{ fontSize: '0.96rem', color: '#94A3B8', lineHeight: 1.8, marginBottom: 14 }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Action Bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: 14
            }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    navigate(`/generate?prompt=${encodeURIComponent(selectedExhibit.title + ': ' + selectedExhibit.description)}`)
                  }}
                  style={{
                    padding: '12px 24px', borderRadius: 50, border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#07090E', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(245,158,11,0.3)'
                  }}
                >
                  {t.convertToVideo}
                </button>

                <button
                  onClick={() => {
                    const saved = JSON.parse(localStorage.getItem('animverse_bookmarked_exhibits') || '[]')
                    if (!saved.some(e => e._id === selectedExhibit._id)) {
                      saved.push(selectedExhibit)
                      localStorage.setItem('animverse_bookmarked_exhibits', JSON.stringify(saved))
                    }
                    showToast(t.bookmarked)
                  }}
                  style={{
                    padding: '12px 20px', borderRadius: 50,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFF', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer'
                  }}
                >
                  {t.bookmarkExhibit}
                </button>
              </div>

              <button
                onClick={() => setSelectedExhibit(null)}
                style={{
                  padding: '10px 20px', borderRadius: 50,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#94A3B8', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          QUICK ADMIN CURATOR MODAL (FOR ADMIN ROLES)
          ══════════════════════════════════════════════════════════════ */}
      {showQuickAdminModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#111420', border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 28, width: '100%', maxWidth: 720, maxHeight: '90vh',
            overflowY: 'auto', padding: 36, color: '#FFF',
            boxShadow: '0 30px 80px rgba(0,0,0,0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B', margin: 0 }}>
                  🏛️ Curator Admin Desk: {t.addExhibit}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0' }}>
                  Deploy a new curated masterwork exhibit into the museum halls.
                </p>
              </div>

              <button
                onClick={() => setShowQuickAdminModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddExhibit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Exhibit Title *</label>
                <input
                  type="text" required
                  value={quickForm.title}
                  onChange={e => setQuickForm({ ...quickForm, title: e.target.value })}
                  placeholder="e.g. Mahakavi Kumaran Asan & Veena Poovu"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Gallery Room / Section *</label>
                  <select
                    value={quickForm.room}
                    onChange={e => setQuickForm({ ...quickForm, room: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  >
                    {PRESET_WINGS.map(w => (
                      <option key={w.name} value={w.name}>{w.icon} {w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Author / Creator</label>
                  <input
                    type="text"
                    value={quickForm.author}
                    onChange={e => setQuickForm({ ...quickForm, author: e.target.value })}
                    placeholder="Author name"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Historical Era / Period</label>
                  <input
                    type="text"
                    value={quickForm.era}
                    onChange={e => setQuickForm({ ...quickForm, era: e.target.value })}
                    placeholder="e.g. Victorian Era (1837–1901)"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Language & Audience</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={quickForm.language}
                      onChange={e => setQuickForm({ ...quickForm, language: e.target.value })}
                      style={{ flex: 1, padding: '10px 10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                    >
                      <option value="English">English</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Hindi">Hindi</option>
                      <option value="All">All</option>
                    </select>
                    <select
                      value={quickForm.ageGroup}
                      onChange={e => setQuickForm({ ...quickForm, ageGroup: e.target.value })}
                      style={{ flex: 1, padding: '10px 10px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                    >
                      <option value="all">All Ages</option>
                      <option value="kids">Kids</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Key Works (comma-separated)</label>
                <input
                  type="text"
                  value={quickForm.keyWorks}
                  onChange={e => setQuickForm({ ...quickForm, keyWorks: e.target.value })}
                  placeholder="e.g. Hamlet, Macbeth, Romeo and Juliet"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Iconic Quote / Verse</label>
                <input
                  type="text"
                  value={quickForm.quote}
                  onChange={e => setQuickForm({ ...quickForm, quote: e.target.value })}
                  placeholder="Quote or famous poetry line..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Artwork / Image URL</label>
                <input
                  type="url"
                  value={quickForm.imageUrl}
                  onChange={e => setQuickForm({ ...quickForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4, color: '#CBD5E1' }}>Curator Description & Content</label>
                <textarea
                  rows={3}
                  value={quickForm.description}
                  onChange={e => setQuickForm({ ...quickForm, description: e.target.value })}
                  placeholder="Overview description for the museum stand..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#07090E', border: '1px solid rgba(255,255,255,0.15)', color: 'white', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  to="/admin"
                  style={{ color: '#06B6D4', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  ➔ Open Full Admin Dashboard
                </Link>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdminModal(false)}
                    style={{ padding: '10px 18px', borderRadius: 50, background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 24px', borderRadius: 50, background: '#F59E0B', color: '#07090E', border: 'none', fontWeight: 900, cursor: 'pointer' }}
                  >
                    Deploy Exhibit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
