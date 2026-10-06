/**
 * Authentication Storage Utility for AnimVerse AI
 * Handles conditional persistence between localStorage (Remember Me) and sessionStorage (Session only).
 */

const TOKEN_KEY = 'animverse_token';
const USER_KEY = 'animverse_user';
const ADMIN_TOKEN_KEY = 'animverse_admin_token';
const ADMIN_USER_KEY = 'animverse_admin';

/**
 * Decode JWT payload safely without external dependencies
 */
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  // If mock/demo token is active in client session, treat as valid
  if (typeof token === 'string' && token.startsWith('mock_')) return false;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;

  // JWT exp is in seconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Save user authentication
 * @param {string} token - JWT token string
 * @param {object} user - User object
 * @param {boolean} remember - If true, save to localStorage; else sessionStorage
 */
export const setAuth = (token, user, remember = false) => {
  clearAuth(); // clean existing state first
  const storage = remember ? localStorage : sessionStorage;
  if (token) storage.setItem(TOKEN_KEY, token);
  if (user) storage.setItem(USER_KEY, JSON.stringify(user));
  // Save remember preference tag
  storage.setItem('animverse_remember_me', remember ? 'true' : 'false');
};

/**
 * Save admin authentication
 */
export const setAdminAuth = (token, user, remember = false) => {
  clearAdminAuth();
  const storage = remember ? localStorage : sessionStorage;
  if (token) storage.setItem(ADMIN_TOKEN_KEY, token);
  if (user) storage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  storage.setItem('animverse_admin_remember_me', remember ? 'true' : 'false');
};

/**
 * Get active user token (from localStorage or sessionStorage)
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (isTokenExpired(token)) {
    clearAuth();
    return null;
  }
  return token;
};

export const setUser = (user) => {
  if (!user) return;
  if (localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Get active user object
 */
export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get active admin token
 */
export const getAdminToken = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return null;

  if (isTokenExpired(token)) {
    clearAdminAuth();
    return null;
  }
  return token;
};

/**
 * Get active admin user object
 */
export const getAdminUser = () => {
  const token = getAdminToken();
  if (!token) return null;

  const userStr = localStorage.getItem(ADMIN_USER_KEY) || sessionStorage.getItem(ADMIN_USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Clear user authentication from all storages
 */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('animverse_remember_me');

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem('animverse_remember_me');
};

/**
 * Clear admin authentication from all storages
 */
export const clearAdminAuth = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem('animverse_admin_remember_me');

  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
  sessionStorage.removeItem('animverse_admin_remember_me');
};

/**
 * Clear all authentication (both user and admin)
 */
export const clearAllAuth = () => {
  clearAuth();
  clearAdminAuth();
};

/* ============================================
   Story & Game Persistence Management
   ============================================ */

const DEFAULT_STORIES = [
  { id: '1', title: 'The Crystal Dragon of Lumina', author: 'Elena Vance', audience: 'kids', genre: 'Fantasy', rating: 4.9, plays: 1420, desc: 'A young brave dragon rider discovers a hidden crystal valley filled with ancient magic.', bg: '#4F46E5', time: '12 min' },
  { id: '2', title: 'Cyberpunk Odyssey 2099', author: 'Marcus Sterling', audience: 'adult', genre: 'Sci-Fi', rating: 4.8, plays: 3290, desc: 'A rogue AI detective investigates a mysterious hack in Neo-Tokyo.', bg: '#8B5CF6', time: '18 min' },
  { id: '3', title: 'The Whispering Forest Quest', author: 'Sarah Jenkins', audience: 'kids', genre: 'Adventure', rating: 4.7, plays: 980, desc: 'Join Toby the Fox as he searches for the lost golden acorn in the enchanted forest.', bg: '#10B981', time: '10 min' },
  { id: '4', title: 'Nebula Protocol: Zero Point', author: 'Dr. Aris Thorne', audience: 'adult', genre: 'Sci-Fi Thriller', rating: 4.95, plays: 4120, desc: 'Deep space exploration team uncovers an ancient alien artifact on Mars.', bg: '#06B6D4', time: '22 min' },
];

const DEFAULT_GAMES = [
  { id: 'g1', title: 'Story Quest: Sequence Master', category: 'Puzzle & Logic', totalLevels: 10, currentLevel: 3, xp: 450, stars: 7, desc: 'Arrange animated scene keyframes in chronological order to build the master story.', icon: '🧩', color: '#6366F1' },
  { id: 'g2', title: 'Character Memory Matrix', category: 'Brain & Memory', totalLevels: 10, currentLevel: 2, xp: 280, stars: 5, desc: 'Test your memory recall by matching character cards and legendary relics.', icon: '🎴', color: '#8B5CF6' },
  { id: 'g3', title: 'Animate Word Realm', category: 'Vocabulary', totalLevels: 10, currentLevel: 1, xp: 120, stars: 3, desc: 'Unscramble story keywords to unleash AI animated scene transformations.', icon: '🔤', color: '#10B981' },
  { id: 'g4', title: 'Director\'s Sound Studio', category: 'Audio & Music', totalLevels: 8, currentLevel: 1, xp: 90, stars: 2, desc: 'Match voiceover audio clips and ambient soundscapes to animated keyframes.', icon: '🎧', color: '#06B6D4' }
];

export const getStoredStories = () => {
  const data = localStorage.getItem('animverse_stories');
  if (!data) {
    localStorage.setItem('animverse_stories', JSON.stringify(DEFAULT_STORIES));
    return DEFAULT_STORIES;
  }
  try { return JSON.parse(data); } catch { return DEFAULT_STORIES; }
};

export const saveStoredStories = (stories) => {
  localStorage.setItem('animverse_stories', JSON.stringify(stories));
};

export const addStoryToStorage = (newStory) => {
  const stories = getStoredStories();
  const updated = [newStory, ...stories];
  saveStoredStories(updated);
  return updated;
};

export const deleteStoryFromStorage = (storyId) => {
  const stories = getStoredStories();
  const updated = stories.filter(s => s.id !== String(storyId));
  saveStoredStories(updated);
  return updated;
};

export const getStoredGames = () => {
  const data = localStorage.getItem('animverse_games');
  if (!data) {
    localStorage.setItem('animverse_games', JSON.stringify(DEFAULT_GAMES));
    return DEFAULT_GAMES;
  }
  try { return JSON.parse(data); } catch { return DEFAULT_GAMES; }
};

export const saveStoredGames = (games) => {
  localStorage.setItem('animverse_games', JSON.stringify(games));
};

export const addGameToStorage = (newGame) => {
  const games = getStoredGames();
  const updated = [newGame, ...games];
  saveStoredGames(updated);
  return updated;
};

export const deleteGameFromStorage = (gameId) => {
  const games = getStoredGames();
  const updated = games.filter(g => g.id !== String(gameId));
  saveStoredGames(updated);
  return updated;
};

