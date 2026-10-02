import { useState, useEffect, useRef, useCallback } from 'react';

export default function RadioPlayer({ currentTrack, playlist = [], onTrackChange, onLikeToggle, isPlaying, onPlaybackChange }) {
  const audioRef = useRef(null);
  const speechActiveRef = useRef(false);
  const speechUtteranceRef = useRef(null);
  const speechTimerRef = useRef(null);
  const speechOffsetRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playbackError, setPlaybackError] = useState('');

  const startSpeechPreview = useCallback((startAt = speechOffsetRef.current, isFallback = false) => {
    if (speechActiveRef.current) return;
    if (!currentTrack?.narrationText || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setPlaybackError('This audio could not be loaded. Try another broadcast.');
      onPlaybackChange(false);
      return;
    }

    const text = currentTrack.narrationText;
    const durationSeconds = currentTrack.durationSeconds || Math.ceil(text.split(/\s+/).length / 2.5);
    const safeStart = Math.min(Math.max(0, startAt), Math.max(0, durationSeconds - 1));
    const startCharacter = Math.floor((safeStart / durationSeconds) * text.length);
    const preview = new window.SpeechSynthesisUtterance(text.slice(startCharacter));
    preview.lang = currentTrack.languageCode || ({ English: 'en-GB', Malayalam: 'ml-IN', Hindi: 'hi-IN' }[currentTrack.language] || 'en-GB');
    preview.volume = isMuted ? 0 : volume;
    const voiceLanguage = preview.lang.toLowerCase();
    preview.voice = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase() === voiceLanguage)
      || window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith(voiceLanguage.split('-')[0]))
      || null;
    speechActiveRef.current = true;
    speechUtteranceRef.current = preview;
    speechOffsetRef.current = safeStart;
    setDuration(durationSeconds);
    setCurrentTime(safeStart);
    setPlaybackError(isFallback ? 'Audio source unavailable; playing the built-in narration.' : '');
    preview.onend = () => {
      if (!speechActiveRef.current || speechUtteranceRef.current !== preview) return;
      speechActiveRef.current = false;
      clearInterval(speechTimerRef.current);
      speechTimerRef.current = null;
      setCurrentTime(durationSeconds);
      onPlaybackChange(false);
    };
    preview.onerror = () => {
      if (!speechActiveRef.current || speechUtteranceRef.current !== preview) return;
      speechActiveRef.current = false;
      clearInterval(speechTimerRef.current);
      speechTimerRef.current = null;
      setPlaybackError('This audio could not be played. Try another broadcast.');
      onPlaybackChange(false);
    };
    preview.onboundary = event => {
      if (event.name === 'word') {
        setCurrentTime(Math.min(durationSeconds, safeStart + ((startCharacter + event.charIndex) / text.length) * durationSeconds));
      }
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(preview);
    clearInterval(speechTimerRef.current);
    speechTimerRef.current = setInterval(() => {
      if (speechActiveRef.current && !window.speechSynthesis.paused) {
        setCurrentTime(time => Math.min(durationSeconds, time + 0.25));
      }
    }, 250);
    onPlaybackChange(true);
  }, [currentTrack, isMuted, onPlaybackChange, volume]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (speechActiveRef.current && window.speechSynthesis) {
        speechActiveRef.current = false;
        clearInterval(speechTimerRef.current);
        speechTimerRef.current = null;
        window.speechSynthesis.cancel();
      }
      setPlaybackError('');
      speechOffsetRef.current = 0;
      setCurrentTime(0);
      setDuration(currentTrack.durationSeconds || 0);
      if (currentTrack.audioType === 'file') {
        audioRef.current.src = currentTrack.audioUrl;
      } else {
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    if (speechActiveRef.current && window.speechSynthesis) {
      if (isPlaying) window.speechSynthesis.resume();
      else window.speechSynthesis.pause();
      return;
    }
    if (isPlaying) {
      if (currentTrack.audioType === 'speech') {
        startSpeechPreview();
        return;
      }
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err);
        if (currentTrack.narrationText) startSpeechPreview(speechOffsetRef.current, true);
        else onPlaybackChange(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying, onPlaybackChange, startSpeechPreview]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    onPlaybackChange(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (speechActiveRef.current && window.speechSynthesis) {
      speechActiveRef.current = false;
      clearInterval(speechTimerRef.current);
      window.speechSynthesis.cancel();
      speechOffsetRef.current = newTime;
      if (isPlaying) startSpeechPreview(newTime);
    } else if (audioRef.current && currentTrack.audioType === 'file') {
      audioRef.current.currentTime = newTime;
    } else {
      speechOffsetRef.current = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
    if (speechUtteranceRef.current) speechUtteranceRef.current.volume = newVol;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      if (speechUtteranceRef.current) speechUtteranceRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      if (speechUtteranceRef.current) speechUtteranceRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleNext = () => {
    if (!playlist.length || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => (t._id || t.id) === (currentTrack._id || currentTrack.id));
    const nextIndex = (currentIndex + 1) % playlist.length;
    if (onTrackChange) onTrackChange(playlist[nextIndex]);
  };

  const handlePrev = () => {
    if (!playlist.length || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => (t._id || t.id) === (currentTrack._id || currentTrack.id));
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    if (onTrackChange) onTrackChange(playlist[prevIndex]);
  };

  const handleEnded = () => {
    if (playlist.length > 1) {
      onPlaybackChange(true);
      handleNext();
    } else {
      onPlaybackChange(false);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  const S = {
    dockContainer: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(12, 14, 20, 0.96)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(245, 158, 11, 0.3)',
      boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.7)',
      padding: '12px 24px',
      color: '#fff',
      transition: 'all 0.3s ease'
    },
    innerFlex: {
      maxWidth: 1400,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20
    },
    trackMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minWidth: 260,
      flex: '0 0 28%'
    },
    coverImg: {
      width: 54,
      height: 54,
      borderRadius: 12,
      objectFit: 'cover',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.15)'
    },
    trackTitle: {
      fontWeight: 800,
      fontSize: '0.95rem',
      color: '#F8FAFC',
      marginBottom: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 220
    },
    trackCreator: {
      fontSize: '0.78rem',
      color: '#94A3B8',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    },
    categoryBadge: {
      fontSize: '0.65rem',
      padding: '2px 8px',
      borderRadius: 20,
      background: 'rgba(245, 158, 11, 0.18)',
      color: '#F59E0B',
      fontWeight: 700,
      border: '1px solid rgba(245, 158, 11, 0.3)'
    },
    controlsCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      flex: 1,
      maxWidth: 600
    },
    buttonRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    },
    controlBtn: {
      background: 'none',
      border: 'none',
      color: '#CBD5E1',
      fontSize: '1.2rem',
      cursor: 'pointer',
      transition: 'transform 0.15s, color 0.15s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6
    },
    playBtn: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      border: 'none',
      color: '#0A0B0E',
      fontSize: '1.3rem',
      fontWeight: 900,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
      transition: 'all 0.2s'
    },
    progressRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%'
    },
    timeText: {
      fontSize: '0.75rem',
      color: '#94A3B8',
      fontFamily: 'monospace',
      width: 40,
      textAlign: 'center'
    },
    seekBar: {
      flex: 1,
      height: 5,
      appearance: 'none',
      background: 'rgba(255,255,255,0.15)',
      borderRadius: 10,
      outline: 'none',
      cursor: 'pointer'
    },
    rightControls: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      flex: '0 0 22%',
      justifyContent: 'flex-end'
    },
    volumeBar: {
      width: 80,
      height: 4,
      appearance: 'none',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: 10,
      outline: 'none',
      cursor: 'pointer'
    },
    equalizer: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 3,
      height: 18,
      marginRight: 6
    },
    eqBar: (delay, isPlaying) => ({
      width: 3,
      height: isPlaying ? '100%' : '30%',
      background: '#F59E0B',
      borderRadius: 2,
      animation: isPlaying ? `eqPulse 0.8s ease-in-out infinite alternate ${delay}s` : 'none'
    })
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration && Number.isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onPlay={() => onPlaybackChange(true)}
        onError={() => {
          if (currentTrack.narrationText) startSpeechPreview(0, true);
          else {
            setPlaybackError('This audio could not be loaded. Try another broadcast.');
            onPlaybackChange(false);
          }
        }}
        onEnded={handleEnded}
      />

      <style>{`
        @keyframes eqPulse {
          0% { height: 20%; }
          50% { height: 100%; }
          100% { height: 40%; }
        }
      `}</style>

      <div style={S.dockContainer}>
        <div style={S.innerFlex}>
          {/* Left Track Info */}
          <div style={S.trackMeta}>
            <img src={currentTrack.coverImage} alt={currentTrack.title} style={S.coverImg} />
            <div style={{ overflow: 'hidden' }}>
              <div style={S.trackTitle} title={currentTrack.title}>{currentTrack.title}</div>
              {playbackError && <div role="status" style={{ color: '#FCA5A5', fontSize: '0.72rem' }}>{playbackError}</div>}
              <div style={S.trackCreator}>
                <span>{currentTrack.creatorName || 'AnimVerse Creator'}</span>
                <span style={S.categoryBadge}>{currentTrack.category}</span>
                <span style={{ ...S.categoryBadge, background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                  {currentTrack.language}
                </span>
              </div>
            </div>
          </div>

          {/* Center Playback Controls */}
          <div style={S.controlsCenter}>
            <div style={S.buttonRow}>
              {/* Equalizer Visualizer */}
              <div style={S.equalizer}>
                <div style={S.eqBar(0, isPlaying)} />
                <div style={S.eqBar(0.2, isPlaying)} />
                <div style={S.eqBar(0.4, isPlaying)} />
                <div style={S.eqBar(0.1, isPlaying)} />
              </div>

              <button style={S.controlBtn} onClick={handlePrev} title="Previous Track">
                ⏮️
              </button>
              <button style={S.playBtn} onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button style={S.controlBtn} onClick={handleNext} title="Next Track">
                ⏭️
              </button>
            </div>

            {/* Progress Slider */}
            <div style={S.progressRow}>
              <span style={S.timeText}>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                style={S.seekBar}
              />
              <span style={S.timeText}>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Volume & Extra Actions */}
          <div style={S.rightControls}>
            <button
              style={{ ...S.controlBtn, color: currentTrack.liked ? '#F43F5E' : '#94A3B8' }}
              onClick={() => onLikeToggle && onLikeToggle(currentTrack)}
              title="Like Broadcast"
            >
              {currentTrack.liked ? '❤️' : '🤍'}
            </button>

            <button style={S.controlBtn} onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={S.volumeBar}
            />

            <button
              style={{ ...S.controlBtn, fontSize: '0.9rem', padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}
              onClick={() => setIsExpanded(e => !e)}
              title="Show Details"
            >
              ℹ️ Details
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          right: 30,
          width: 360,
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 16,
          padding: 20,
          zIndex: 1001,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#fff',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#F59E0B' }}>📻 Now Playing Info</h4>
            <button
              onClick={() => setIsExpanded(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ✖
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <img src={currentTrack.coverImage} alt={currentTrack.title} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: 4 }}>{currentTrack.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: 4 }}>By {currentTrack.creatorName || 'AnimVerse Narrator'}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={S.categoryBadge}>{currentTrack.category}</span>
                <span style={{ ...S.categoryBadge, color: '#06B6D4', borderColor: '#06B6D4' }}>{currentTrack.language}</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 12px 0' }}>
            {currentTrack.description || 'No description provided for this literature audio broadcast.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span>🎧 Listens: {currentTrack.playsCount || 0}</span>
            <span>❤️ Likes: {currentTrack.likesCount || 0}</span>
            <span>⏱️ Duration: {currentTrack.duration || '0:00'}</span>
          </div>
        </div>
      )}
    </>
  );
}
