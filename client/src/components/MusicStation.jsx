import { useState } from 'react';
import './MusicStation.css';

const trackId = track => track?._id || track?.id;

const SEARCH_SUGGESTIONS = [
  { label: 'Broken Angel', query: 'Broken Angel' },
  { label: 'Varnajal', query: 'Varnajal BKU MAL' },
  { label: 'Meri Maa', query: 'Meri Maa Taare Zameen Par' }
];

function formatDuration(durationMs) {
  const seconds = Math.floor(durationMs / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function MusicStation({ tracks, currentTrack, isPlaying, onPlayTrack, onStopLocalPlayback, language }) {
  const [spotifyQuery, setSpotifyQuery] = useState('');
  const [spotifyTracks, setSpotifyTracks] = useState([]);
  const [spotifySelection, setSpotifySelection] = useState(null);
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [spotifyError, setSpotifyError] = useState('');
  const [spotifyMarket, setSpotifyMarket] = useState('');
  const [spotifyFallbackUrl, setSpotifyFallbackUrl] = useState('');
  const selectedTrack = tracks.find(track => trackId(track) === trackId(currentTrack)) || tracks[0];
  const selectedIsPlaying = Boolean(isPlaying && trackId(selectedTrack) === trackId(currentTrack));

  const searchSpotify = async searchTerm => {
    const query = searchTerm.trim();
    if (!query) return;

    setSpotifyQuery(query);
    setSpotifyLoading(true);
    setSpotifyError('');
    setSpotifyFallbackUrl('');
    setSpotifySelection(null);
    try {
      const params = new URLSearchParams({ q: query, language });
      const response = await fetch(`/api/spotify/search?${params}`);
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        const error = new Error(payload.message || 'Spotify search failed.');
        error.code = payload.code;
        throw error;
      }
      setSpotifyTracks(payload.tracks);
      setSpotifyMarket(payload.market);
      if (!payload.tracks.length) setSpotifyError('No Spotify tracks found. Try another song or artist.');
    } catch (error) {
      setSpotifyTracks([]);
      setSpotifyError('');
      setSpotifyFallbackUrl(`https://open.spotify.com/search/${encodeURIComponent(query)}`);
    } finally {
      setSpotifyLoading(false);
    }
  };

  return (
    <section className="music-station" aria-label="Music listening room">
      <div className="spotify-search-panel">
        <div className="spotify-search-copy">
          <span className="spotify-wordmark"><span aria-hidden="true">●</span> Spotify</span>
          <h2>Find a song to play</h2>
          <p>Search Spotify’s catalog. Playback opens in Spotify’s embedded player.</p>
        </div>
        <form className="spotify-search-form" onSubmit={event => { event.preventDefault(); searchSpotify(spotifyQuery); }}>
          <input
            aria-label="Search Spotify songs and artists"
            placeholder="Song or artist"
            value={spotifyQuery}
            onChange={event => setSpotifyQuery(event.target.value)}
            maxLength={120}
          />
          <button type="submit" disabled={spotifyLoading || !spotifyQuery.trim()}>
            {spotifyLoading ? 'Searching…' : 'Search'}
          </button>
        </form>
        <div className="spotify-suggestions" aria-label="Popular searches">
          {SEARCH_SUGGESTIONS.map(suggestion => (
            <button type="button" key={suggestion.label} onClick={() => searchSpotify(suggestion.query)}>
              {suggestion.label}
            </button>
          ))}
        </div>
        {spotifyError && (
          <div className="spotify-search-message" role="status">
            <span>{spotifyError}</span>
          </div>
        )}
        {spotifyFallbackUrl && (
          <div className="spotify-search-message">
            <a href={spotifyFallbackUrl} target="_blank" rel="noreferrer">
              Open in Spotify ↗
            </a>
          </div>
        )}
      </div>

      {spotifyTracks.length > 0 && (
        <div className="spotify-results">
          <div className="spotify-results-heading">
            <h3>Spotify results</h3>
            <span>Spotify market: {spotifyMarket}</span>
          </div>
          {spotifySelection && (
            <div className="spotify-embed-wrap">
              <iframe
                title={`Spotify player: ${spotifySelection.name}`}
                src={`https://open.spotify.com/embed/track/${spotifySelection.id}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
              <a href={spotifySelection.url} target="_blank" rel="noreferrer">Open full track in Spotify ↗</a>
            </div>
          )}
          <div className="spotify-results-list">
            {spotifyTracks.map(track => (
              <div className={`spotify-result${spotifySelection?.id === track.id ? ' is-selected' : ''}`} key={track.id}>
                <img src={track.image} alt="" />
                <div className="spotify-result-info">
                  <strong>{track.name}</strong>
                  <span>{track.artists.join(', ')}</span>
                  <small>{track.album}</small>
                </div>
                <span className="spotify-result-duration">{formatDuration(track.durationMs)}</span>
                <button type="button" aria-label={`Play ${track.name} on Spotify`} onClick={() => { setSpotifySelection(track); onStopLocalPlayback(); }}>
                  ▶
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="music-station-heading">
        <div>
          <span className="music-eyebrow">ANIMVERSE MUSIC</span>
          <h2>Your listening room</h2>
        </div>
        <span className="music-track-count">{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</span>
      </div>

      <div className="music-station-layout">
        {!selectedTrack ? (
          <div className="music-empty" role="status">
            <span className="music-empty-icon" aria-hidden="true">♫</span>
            <h3>No local music matches these filters</h3>
            <p>Spotify search above is available independently. Clear the page search to browse your library.</p>
          </div>
        ) : <>
        <div className="music-feature">
          <div className="music-feature-artwork">
            <img src={selectedTrack.coverImage} alt={`${selectedTrack.title} cover`} />
            <span className="music-artwork-mark" aria-hidden="true">♫</span>
          </div>
          <div className="music-feature-info">
            <span className="music-feature-label">{selectedIsPlaying ? 'NOW PLAYING' : 'FEATURED TRACK'}</span>
            <h3 title={selectedTrack.title}>{selectedTrack.title}</h3>
            <p>{selectedTrack.creatorName || 'AnimVerse Music Studio'}</p>
            <div className="music-feature-meta">
              <span>{selectedTrack.language}</span>
              <span>{selectedTrack.duration || 'Audio track'}</span>
            </div>
            <button className="music-main-play" type="button" onClick={() => onPlayTrack(selectedTrack)}>
              <span aria-hidden="true">{selectedIsPlaying ? 'Ⅱ' : '▶'}</span>
              {selectedIsPlaying ? 'Pause' : 'Play track'}
            </button>
          </div>
        </div>

        <div className="music-queue-wrap">
          <div className="music-queue-heading">
            <div>
              <span className="music-eyebrow">YOUR LIBRARY</span>
              <h3>Tracks</h3>
            </div>
            <span className="music-queue-language">Filtered by selected language</span>
          </div>
          <div className="music-queue" aria-label="Music tracks">
            {tracks.map((track, index) => {
              const isCurrent = trackId(track) === trackId(currentTrack);
              const isActive = isCurrent && isPlaying;
              return (
                <button
                  className={`music-track-row${isCurrent ? ' is-current' : ''}`}
                  key={trackId(track)}
                  type="button"
                  aria-label={`${isActive ? 'Pause' : 'Play'} ${track.title}`}
                  onClick={() => onPlayTrack(track)}
                >
                  <span className="music-track-index" aria-hidden="true">
                    {isActive ? <span className="music-playing-bars"><i /><i /><i /></span> : String(index + 1).padStart(2, '0')}
                  </span>
                  <img className="music-track-art" src={track.coverImage} alt="" />
                  <span className="music-track-copy">
                    <span className="music-track-title">{track.title}</span>
                    <span className="music-track-artist">{track.creatorName || 'AnimVerse Music Studio'}</span>
                  </span>
                  <span className="music-track-language">{track.language}</span>
                  <span className="music-track-duration">{track.duration || '—:—'}</span>
                  <span className="music-row-play" aria-hidden="true">{isActive ? 'Ⅱ' : '▶'}</span>
                </button>
              );
            })}
          </div>
        </div>
        </>}
      </div>
    </section>
  );
}
