const express = require('express');
const router = express.Router();

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';
const MARKETS = { English: 'GB', Malayalam: 'IN', Hindi: 'IN' };

let cachedToken = null;
let tokenExpiresAt = 0;

async function getSpotifyAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    const error = new Error('Spotify catalog access is not connected.');
    error.status = 503;
    error.code = 'SPOTIFY_NOT_CONFIGURED';
    throw error;
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error_description || 'Spotify authentication failed.');
    error.status = response.status;
    throw error;
  }

  cachedToken = payload.access_token;
  tokenExpiresAt = Date.now() + payload.expires_in * 1000;
  return cachedToken;
}

router.get('/search', async (req, res) => {
  const query = String(req.query.q || '').trim().slice(0, 120);
  const language = String(req.query.language || 'English');
  if (!query) return res.status(400).json({ success: false, message: 'Enter a song or artist to search Spotify.' });
  if (!MARKETS[language]) return res.status(400).json({ success: false, message: 'Choose English, Malayalam, or Hindi.' });

  try {
    const token = await getSpotifyAccessToken();
    const url = new URL(SPOTIFY_SEARCH_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('type', 'track');
    url.searchParams.set('market', MARKETS[language]);
    url.searchParams.set('limit', '20');

    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const payload = await response.json();
    if (!response.ok) {
      const error = new Error(payload.error?.message || 'Spotify search failed.');
      error.status = response.status;
      throw error;
    }

    const tracks = (payload.tracks?.items || []).map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      image: track.album.images[0]?.url || '',
      durationMs: track.duration_ms,
      uri: track.uri,
      url: track.external_urls.spotify,
      previewUrl: track.preview_url,
      market: MARKETS[language]
    }));

    res.json({ success: true, market: MARKETS[language], tracks });
  } catch (error) {
    console.error('Spotify catalog search failed:', error.message);
    res.status(error.status || 502).json({
      success: false,
      code: error.code || 'SPOTIFY_SEARCH_FAILED',
      message: error.message || 'Spotify is temporarily unavailable.'
    });
  }
});

module.exports = router;
