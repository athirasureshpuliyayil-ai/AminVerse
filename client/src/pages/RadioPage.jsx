import { useState, useEffect, useCallback } from 'react';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import RadioPlayer from '../components/RadioPlayer';
import MusicStation from '../components/MusicStation';
import { getToken, getUser } from '../utils/authStorage';

const CATEGORIES = [
  { id: 'All', name: 'All Stations', icon: '📻', desc: 'Browse all literature radio channels', color: '#F59E0B' },
  { id: 'Music', name: 'Music', icon: '🎵', desc: 'Relaxing & literary ambient music', color: '#EC4899' },
  { id: 'Stories', name: 'Stories', icon: '📖', desc: 'Short stories & narrated fiction', color: '#8B5CF6' },
  { id: 'Mini Novels', name: 'Mini Novels', icon: '📚', desc: 'Serialized novellas & long form audio', color: '#6366F1' },
  { id: 'Poetry', name: 'Poetry', icon: '✍️', desc: 'Poetry recitals & rhythmic verses', color: '#10B981' },
  { id: 'Author Stories', name: 'Author Stories', icon: '👤', desc: 'Author introductions & writer journeys', color: '#06B6D4' },
  { id: 'Famous Lives', name: 'Famous Lives', icon: '🌟', desc: 'Life stories of legendary icons', color: '#F59E0B' },
  { id: 'Scientists', name: 'Scientists', icon: '🔬', desc: 'Discoveries, inventions & scientist bios', color: '#3B82F6' },
  { id: 'Astronauts & Space', name: 'Astronauts & Space', icon: '🚀', desc: 'Space exploration & cosmic journeys', color: '#8B5CF6' },
  { id: 'Literature Talks', name: 'Literature Talks', icon: '💬', desc: 'Book reviews, discussions & literary chats', color: '#F43F5E' }
];

const LANGUAGES = [
  { id: 'All', name: 'All Languages', icon: '🌐' },
  { id: 'English', name: 'English', icon: '🇬🇧' },
  { id: 'Malayalam', name: 'Malayalam', icon: '🇮🇳' },
  { id: 'Hindi', name: 'Hindi', icon: '🇮🇳' }
];

export default function RadioPage() {
  const user = getUser();
  const token = getToken();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth <= 760);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular' | 'liked'

  // Player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Upload Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    narratorName: '',
    category: 'Stories',
    language: 'English',
    ageGroup: 'all'
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Fetch Radio Tracks from Backend API
  const fetchRadioTracks = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/radio?category=${encodeURIComponent(selectedCategory)}&language=${encodeURIComponent(selectedLanguage)}&sort=${sortBy}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Radio feed request failed (${res.status})`);
      const json = await res.json();

      if (json.success && json.data) {
        setTracks(json.data);
        setCurrentTrack(current => {
          if (!current && json.data.length > 0) {
          const featured = json.data.find(t => t.isFeatured) || json.data[0];
            return featured;
          }
          return current;
        });
      }
    } catch (err) {
      console.error('Error loading radio tracks:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedLanguage, sortBy, searchQuery]);

  useEffect(() => {
    fetchRadioTracks();
  }, [fetchRadioTracks]);

  useEffect(() => {
    const collapseForSmallScreen = () => {
      if (window.innerWidth <= 760) setSidebarCollapsed(true);
    };
    window.addEventListener('resize', collapseForSmallScreen);
    return () => window.removeEventListener('resize', collapseForSmallScreen);
  }, []);

  // Handle Play track
  const handlePlayTrack = async (track) => {
    if ((currentTrack?._id || currentTrack?.id) === (track._id || track.id)) {
      setIsPlaying(playing => !playing);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      try {
        await fetch(`/api/radio/${track._id || track.id}`);
      } catch (e) {
        console.log('Play count update failed:', e);
      }
    }
  };

  // Handle Like track
  const handleLikeToggle = async (track) => {
    if (!token) {
      alert('Please log in to like radio broadcasts!');
      return;
    }

    try {
      const trackId = track._id || track.id;
      const res = await fetch(`/api/radio/${trackId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setTracks(prev => prev.map(t => {
          if ((t._id || t.id) === trackId) {
            return {
              ...t,
              likesCount: json.likesCount,
              liked: json.liked
            };
          }
          return t;
        }));
        if (currentTrack && (currentTrack._id || currentTrack.id) === trackId) {
          setCurrentTrack(prev => ({ ...prev, likesCount: json.likesCount, liked: json.liked }));
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Handle File change for Audio
  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      setAudioFile(file);
      setAudioPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle File change for Cover Image
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
    }
  };

  // Handle Audio Upload submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!user || !token) {
      setUploadError('You must be logged in to upload audio broadcasts.');
      return;
    }

    if (!uploadForm.title.trim()) {
      setUploadError('Please provide a title for your broadcast.');
      return;
    }

    if (!audioFile) {
      setUploadError('Please select a real audio file (MP3, WAV, M4A, OGG) to upload.');
      return;
    }

    if (!uploadForm.narratorName.trim()) {
      setUploadError('Please provide the narrator or author name.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('narratorName', uploadForm.narratorName.trim());
      formData.append('category', uploadForm.category);
      formData.append('language', uploadForm.language);
      formData.append('ageGroup', uploadForm.ageGroup);
      formData.append('audio', audioFile);
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      const res = await fetch('/api/radio/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const json = await res.json();

      if (json.success) {
        setUploadSuccess('Your audio broadcast has been published to AnimVerse Radio!');
        setTracks(current => [json.data, ...current.filter(track => (track._id || track.id) !== (json.data._id || json.data.id))]);
        setSelectedCategory(uploadForm.category);
        setSelectedLanguage(uploadForm.language);
        setSearchQuery('');
        setSortBy('latest');
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadForm({ title: '', description: '', narratorName: '', category: 'Stories', language: 'English', ageGroup: 'all' });
          setAudioFile(null);
          setCoverFile(null);
          if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
          setAudioPreviewUrl('');
          setUploadSuccess('');
        }, 1500);
      } else {
        setUploadError(json.message || 'Failed to upload audio broadcast.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Server connection error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const featuredTrack = tracks.find(t => t.isFeatured) || tracks[0];

  const S = {
    pageLayout: {
      display: 'flex',
      minHeight: '100vh',
      background: '#07090E',
      color: '#F8FAFC',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      paddingBottom: currentTrack ? 110 : 40
    },
    container: {
      padding: '24px 32px',
      maxWidth: 1400,
      margin: '0 auto',
      width: '100%'
    },
    heroBanner: {
      position: 'relative',
      borderRadius: 24,
      padding: '36px 40px',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.2) 50%, rgba(13, 16, 24, 0.95) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 30,
      marginBottom: 36,
      overflow: 'hidden'
    },
    heroTitle: {
      fontSize: '2.2rem',
      fontWeight: 900,
      margin: '0 0 10px 0',
      background: 'linear-gradient(135deg, #FFF 30%, #F59E0B 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em'
    },
    heroDesc: {
      fontSize: '1rem',
      color: '#CBD5E1',
      maxWidth: 600,
      lineHeight: 1.6,
      marginBottom: 20
    },
    badgeFm: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 16px',
      borderRadius: 50,
      background: 'rgba(245, 158, 11, 0.2)',
      border: '1px solid #F59E0B',
      color: '#F59E0B',
      fontWeight: 800,
      fontSize: '0.85rem',
      marginBottom: 14
    },
    primaryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 28px',
      borderRadius: 50,
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#0A0B0E',
      fontWeight: 800,
      fontSize: '0.95rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 6px 24px rgba(245, 158, 11, 0.4)',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    uploadBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 24px',
      borderRadius: 50,
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#F8FAFC',
      fontWeight: 700,
      fontSize: '0.95rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    sectionHeading: {
      fontSize: '1.4rem',
      fontWeight: 800,
      marginBottom: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16,
      marginBottom: 36
    },
    categoryCard: (active, color) => ({
      padding: '18px 20px',
      borderRadius: 16,
      background: active ? `linear-gradient(135deg, ${color}25, rgba(15, 23, 42, 0.8))` : 'rgba(255, 255, 255, 0.03)',
      border: active ? `2px solid ${color}` : '1px solid rgba(255, 255, 255, 0.08)',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: active ? `0 10px 30px ${color}30` : 'none'
    }),
    filterBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 28,
      flexWrap: 'wrap',
      background: 'rgba(255, 255, 255, 0.02)',
      padding: '14px 20px',
      borderRadius: 16,
      border: '1px solid rgba(255, 255, 255, 0.06)'
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: 50,
      padding: '8px 18px',
      flex: 1,
      minWidth: 260,
      maxWidth: 420
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      outline: 'none',
      width: '100%',
      fontSize: '0.9rem',
      fontFamily: 'inherit'
    },
    pillsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    },
    langPill: (active) => ({
      padding: '6px 14px',
      borderRadius: 30,
      fontSize: '0.82rem',
      fontWeight: 700,
      cursor: 'pointer',
      background: active ? '#F59E0B' : 'rgba(255,255,255,0.06)',
      color: active ? '#0A0B0E' : '#CBD5E1',
      border: active ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.15s'
    }),
    audioGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 22
    },
    audioCard: (isPlayingThis) => ({
      borderRadius: 20,
      background: isPlayingThis ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
      border: isPlayingThis ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }),
    cardCoverWrap: {
      position: 'relative',
      width: '100%',
      height: 180,
      overflow: 'hidden'
    },
    cardCover: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s'
    },
    playOverlayBtn: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'opacity 0.2s',
      cursor: 'pointer'
    },
    cardContent: {
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#F8FAFC',
      margin: '0 0 6px 0',
      lineHeight: 1.4
    },
    cardCreator: {
      fontSize: '0.8rem',
      color: '#94A3B8',
      marginBottom: 12
    },
    cardFooter: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    },
    modalBox: {
      background: '#0F172A',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      borderRadius: 24,
      maxWidth: 600,
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: 30,
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
      position: 'relative'
    },
    formGroup: {
      marginBottom: 18
    },
    label: {
      display: 'block',
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#CBD5E1',
      marginBottom: 6
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 12,
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 12,
      background: '#1E293B',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      color: '#fff',
      fontSize: '0.9rem',
      outline: 'none',
      fontFamily: 'inherit'
    }
  };

  return (
    <div className="radio-page-layout" style={S.pageLayout}>
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div style={S.mainContent}>
        <AppHeader title="AnimVerse Radio FM 📻" />

        <div className="radio-page-container" style={S.container}>
          {/* Hero FM Station Banner */}
          <div style={S.heroBanner}>
            <div style={{ zIndex: 2 }}>
              <div style={S.badgeFm}>
                <span>🔴 LIVE FM BROADCAST</span>
                <span>• 108.5 MHz</span>
              </div>
              <h1 style={S.heroTitle}>AnimVerse Literature & Storytelling Radio</h1>
              <p style={S.heroDesc}>
                Tune in to narrated fiction, short stories, serialized mini novels, poetic recitals, author spotlights, and scientific discoveries spoken by real creators.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {featuredTrack && (
                  <button style={S.primaryBtn} onClick={() => handlePlayTrack(featuredTrack)}>
                    <span>▶️ Listen Live Now</span>
                  </button>
                )}
                <button style={S.uploadBtn} onClick={() => setShowUploadModal(true)}>
                  <span>🎙️ Upload Your Narration</span>
                </button>
              </div>
            </div>

            {featuredTrack && (
              <div style={{ position: 'relative', flexShrink: 0, zIndex: 2 }}>
                <img
                  src={featuredTrack.coverImage}
                  alt={featuredTrack.title}
                  style={{ width: 180, height: 180, borderRadius: 20, objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', border: '2px solid rgba(255,255,255,0.15)' }}
                />
                <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>
                  ⏱️ {featuredTrack.duration}
                </span>
              </div>
            )}
          </div>

          {/* Radio Categories Grid */}
          <div style={S.sectionHeading}>
            <span>📻 Radio Stations & Channels</span>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>Select a channel to tune in</span>
          </div>

          <div style={S.categoryGrid}>
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  style={S.categoryCard(active, cat.color)}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div style={{ fontSize: '2.2rem' }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: active ? cat.color : '#FFF' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 2 }}>
                      {cat.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search and Filters Bar */}
          <div style={S.filterBar}>
            {/* Search Box */}
            <div style={S.searchBox}>
              <span style={{ color: '#94A3B8' }}>🔍</span>
              <input
                style={S.searchInput}
                placeholder="Search stories, poems, authors, scientists..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  ✖
                </button>
              )}
            </div>

            {/* Language Pills */}
            <div style={S.pillsRow}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginRight: 4 }}>Language:</span>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  style={S.langPill(selectedLanguage === lang.id)}
                  onClick={() => setSelectedLanguage(lang.id)}
                >
                  {lang.icon} {lang.name}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <select
              style={{ ...S.select, width: 'auto', padding: '8px 14px', borderRadius: 20 }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="latest">✨ Recently Added</option>
              <option value="popular">🔥 Most Listened</option>
              <option value="liked">❤️ Most Liked</option>
            </select>
          </div>

          {/* Audio Content Grid */}
          <div style={S.sectionHeading}>
            <span>{selectedCategory === 'Music' ? '♫ Music library' : '🎧 Available Broadcasts'} ({tracks.length})</span>
            {selectedCategory !== 'All' && (
              <span style={{ fontSize: '0.85rem', color: '#F59E0B' }}>
                Channel: {selectedCategory}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>📻</div>
              <p>Tuning into AnimVerse FM radio frequencies...</p>
            </div>
          ) : selectedCategory === 'Music' ? (
            <MusicStation
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onStopLocalPlayback={() => setIsPlaying(false)}
              language={selectedLanguage === 'All' ? 'English' : selectedLanguage}
            />
          ) : tracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px border rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎙️</div>
              <h3 style={{ margin: '0 0 8px 0', fontWeight: 800 }}>No audio broadcasts found</h3>
              <p style={{ color: '#94A3B8', maxWidth: 460, margin: '0 auto 20px auto' }}>
                No broadcasts match these filters. Try another station or language.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button style={S.uploadBtn} onClick={() => { setSelectedCategory('All'); setSelectedLanguage('All'); setSearchQuery(''); }}>
                  Reset filters
                </button>
                <button style={S.primaryBtn} onClick={() => setShowUploadModal(true)}>
                  + Upload Narration Now
                </button>
              </div>
            </div>
          ) : (
            <div style={S.audioGrid}>
              {tracks.map(track => {
                const isPlayingThis = isPlaying && currentTrack && (currentTrack._id || currentTrack.id) === (track._id || track.id);
                return (
                  <div key={track._id || track.id} style={S.audioCard(isPlayingThis)}>
                    <div style={S.cardCoverWrap}>
                      <img src={track.coverImage} alt={track.title} style={S.cardCover} />
                      <div
                        style={{ ...S.playOverlayBtn, opacity: isPlayingThis ? 1 : undefined }}
                        className="play-overlay"
                        onClick={() => handlePlayTrack(track)}
                      >
                        <div style={{
                          width: 50, height: 50, borderRadius: '50%', background: '#F59E0B',
                          color: '#0A0B0E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.4rem', fontWeight: 900, boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
                        }}>
                          {isPlayingThis ? '⏸️' : '▶️'}
                        </div>
                      </div>
                      <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15, 23, 42, 0.85)', padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                        {track.category}
                      </span>
                      <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(15, 23, 42, 0.85)', padding: '3px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, color: '#06B6D4', border: '1px solid rgba(6,182,212,0.3)' }}>
                        {track.language}
                      </span>
                    </div>

                    <div style={S.cardContent}>
                      <h4 style={S.cardTitle}>{track.title}</h4>
                      <div style={S.cardCreator}>🎙️ {track.creatorName || 'AnimVerse Narrator'}</div>
                      <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '0 0 14px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {track.description || 'Listen to this authentic narration on AnimVerse Radio.'}
                      </p>

                      <div style={S.cardFooter}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          ⏱️ {track.duration || '3:30'} • 🎧 {track.playsCount || 0}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => handleLikeToggle(track)}
                            style={{ background: 'none', border: 'none', color: track.liked ? '#F43F5E' : '#94A3B8', cursor: 'pointer', fontSize: '0.9rem' }}
                            title="Like"
                          >
                            {track.liked ? '❤️' : '🤍'} {track.likesCount || 0}
                          </button>

                          <button
                            onClick={() => handlePlayTrack(track)}
                            style={{ padding: '6px 14px', borderRadius: 20, background: isPlayingThis ? '#F59E0B' : 'rgba(255,255,255,0.08)', color: isPlayingThis ? '#0A0B0E' : '#FFF', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                          >
                            {isPlayingThis ? 'Playing' : 'Listen'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Docked Sticky Radio Player */}
      <RadioPlayer
        currentTrack={currentTrack}
        playlist={tracks}
        onTrackChange={setCurrentTrack}
        onLikeToggle={handleLikeToggle}
        isPlaying={isPlaying}
        onPlaybackChange={setIsPlaying}
      />

      {/* Upload Audio Modal */}
      {showUploadModal && (
        <div style={S.modalOverlay}>
          <div style={S.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#F59E0B' }}>
                🎙️ Upload Real Audio Broadcast
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✖
              </button>
            </div>

            {uploadError && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', fontSize: '0.85rem', marginBottom: 16 }}>
                ⚠️ {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', fontSize: '0.85rem', marginBottom: 16 }}>
                ✅ {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit}>
              <div style={S.formGroup}>
                <label style={S.label}>Broadcast Title *</label>
                <input
                  style={S.input}
                  placeholder="e.g. The Legend of the Starlight Wanderer"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Description & Narration Notes</label>
                <textarea
                  style={{ ...S.input, height: 80, resize: 'vertical' }}
                  placeholder="Provide background info about this audio recording or poem..."
                  value={uploadForm.description}
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Narrator / Author Name *</label>
                <input
                  style={S.input}
                  placeholder="Name shown with this broadcast"
                  value={uploadForm.narratorName}
                  onChange={e => setUploadForm({ ...uploadForm, narratorName: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Radio Category *</label>
                  <select
                    style={S.select}
                    value={uploadForm.category}
                    onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c.id !== 'All').map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Language *</label>
                  <select
                    style={S.select}
                    value={uploadForm.language}
                    onChange={e => setUploadForm({ ...uploadForm, language: e.target.value })}
                  >
                    <option value="English">🇬🇧 English</option>
                    <option value="Malayalam">🇮🇳 Malayalam</option>
                    <option value="Hindi">🇮🇳 Hindi</option>
                  </select>
                </div>
              </div>

              {/* Real Audio File Selector */}
              <div style={S.formGroup}>
                <label style={S.label}>Audio Recording File (MP3, WAV, M4A, OGG) *</label>
                <input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/aac,audio/webm,audio/flac,.mp3,.wav,.m4a,.ogg,.aac,.webm,.flac"
                  onChange={handleAudioFileChange}
                  style={S.input}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: 4 }}>
                  Audio files up to 50 MB are supported.
                </span>
              </div>

              {/* Audio Preview if selected */}
              {audioPreviewUrl && (
                <div style={{ padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    🎵 Preview Selected Audio:
                  </span>
                  <audio controls src={audioPreviewUrl} style={{ width: '100%', height: 36 }} />
                </div>
              )}

              {/* Cover Image Selector */}
              <div style={S.formGroup}>
                <label style={S.label}>Cover Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  style={S.input}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  style={S.uploadBtn}
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  style={S.primaryBtn}
                >
                  {uploading ? 'Uploading Audio...' : 'Publish Audio Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
