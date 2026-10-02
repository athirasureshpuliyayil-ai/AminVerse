const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RadioAudio = require('../models/RadioAudio');
const { protect, authorize } = require('../middleware/auth');
const { RADIO_SAMPLE_TRACKS, LEGACY_SEED_TITLES } = require('./radioSamples');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../public/uploads/radio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File Filter for Audio and Images
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    if (file.mimetype.startsWith('audio/') || file.originalname.match(/\.(mp3|wav|m4a|aac|ogg|flac|webm)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files (MP3, WAV, M4A, OGG, WEBM) are allowed for audio upload!'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/') || file.originalname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed for cover image!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max limit for audio
  }
});

// Default seed audio tracks for all 9 radio categories & 3 languages
const DEFAULT_RADIO_TRACKS = [
  {
    title: "Serenade of the Midnight Moon",
    description: "Gentle acoustic guitar and piano melange designed for deep literary reflection and reading ambiance.",
    category: "Music",
    language: "English",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    duration: "2:45",
    durationSeconds: 165,
    creatorName: "Acoustic Dreams",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: true,
    playsCount: 1420,
    likesCount: 312
  },
  {
    title: "The Golden Phoenix of Malabar",
    description: "A captivating short story narrating an ancient fable from the lush coastal hills of Southern India.",
    category: "Stories",
    language: "Malayalam",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-mountains-rivers-141319.mp3",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    duration: "4:12",
    durationSeconds: 252,
    creatorName: "Kavya Menon",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: true,
    playsCount: 2890,
    likesCount: 540
  },
  {
    title: "Vikramaditya and the Celestial Sword",
    description: "A thrilling episode from the epic legend of King Vikramaditya recited in classical narrative style.",
    category: "Mini Novels",
    language: "Hindi",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73562.mp3?filename=ambient-piano-10781.mp3",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    duration: "5:30",
    durationSeconds: 330,
    creatorName: "Rajesh Kumar",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: true,
    playsCount: 3110,
    likesCount: 428
  },
  {
    title: "Ode to the Evening Star (Poetry Recital)",
    description: "Soul-stirring poetry reading celebrating the quiet beauty of twilight and human emotions.",
    category: "Poetry",
    language: "English",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c40562e861.mp3?filename=soft-piano-meditation-124976.mp3",
    coverImage: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=600&q=80",
    duration: "3:05",
    durationSeconds: 185,
    creatorName: "Elena Vance",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: false,
    playsCount: 980,
    likesCount: 195
  },
  {
    title: "The Life & Vision of Rabindranath Tagore",
    description: "An intimate narration about the life of Nobel Laureate Rabindranath Tagore and his musical poetry.",
    category: "Author Stories",
    language: "English",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_b2f9f83526.mp3?filename=peaceful-garden-14002.mp3",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    duration: "6:15",
    durationSeconds: 375,
    creatorName: "Dr. Ananya Roy",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: true,
    playsCount: 1780,
    likesCount: 340
  },
  {
    title: "APJ Abdul Kalam: Wings of Fire Journey",
    description: "Inspirational story detailing the early life and perseverance of India's Missile Man, Dr. APJ Abdul Kalam.",
    category: "Famous Lives",
    language: "Malayalam",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_2731871236.mp3?filename=inspirational-background-11229.mp3",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    duration: "7:40",
    durationSeconds: 460,
    creatorName: "Siddharth Nair",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: false,
    playsCount: 4200,
    likesCount: 890
  },
  {
    title: "Marie Curie: Radiant Discoveries",
    description: "The pioneering story of Marie Curie, her discovery of Radium, and her double Nobel Prize triumphs.",
    category: "Scientists",
    language: "English",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c3be4d5089.mp3?filename=cinematic-documentary-115669.mp3",
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    duration: "5:50",
    durationSeconds: 350,
    creatorName: "Dr. Aris Vance",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: false,
    playsCount: 2150,
    likesCount: 410
  },
  {
    title: "Voyage of Voyager 1: Into the Interstellar Void",
    description: "Fascinating audio journey exploring Voyager 1's journey beyond the heliosphere carrying the Golden Record.",
    category: "Astronauts & Space",
    language: "English",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_993f353198.mp3?filename=deep-space-ambient-124403.mp3",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    duration: "6:45",
    durationSeconds: 405,
    creatorName: "Astro Cosmos",
    creatorRole: "author",
    status: "approved",
    isActive: true,
    isFeatured: true,
    playsCount: 5600,
    likesCount: 1120
  },
  {
    title: "Future of Storytelling in the AI Era",
    description: "Thoughtful literature conversation on how human narrators and AI tools co-create immersive audiobooks.",
    category: "Literature Talks",
    language: "Hindi",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_51c6c6fa71.mp3?filename=gentle-acoustic-10669.mp3",
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    duration: "8:20",
    durationSeconds: 500,
    creatorName: "AnimVerse Forum",
    creatorRole: "admin",
    status: "approved",
    isActive: true,
    isFeatured: false,
    playsCount: 1980,
    likesCount: 375
  }
];

let radioSeedPromise;
const autoSeedRadio = () => {
  if (!radioSeedPromise) {
    radioSeedPromise = (async () => {
      try {
        await RadioAudio.bulkWrite(RADIO_SAMPLE_TRACKS.map(track => ({
          updateOne: {
            filter: { seedKey: track.seedKey },
            update: { $setOnInsert: track },
            upsert: true
          }
        })));
        await RadioAudio.updateMany(
          { title: { $in: LEGACY_SEED_TITLES }, seedKey: { $exists: false } },
          { $set: { isActive: false } }
        );
      } catch (err) {
        radioSeedPromise = null;
        throw err;
      }
    })();
  }
  return radioSeedPromise;
};

// @route   GET /api/radio
// @desc    Get active & approved radio audio tracks with filtering and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    await autoSeedRadio();

    const { category, language, search, featured, sort, ageGroup } = req.query;

    const query = {
      status: 'approved',
      isActive: true
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (language && language !== 'All') {
      query.language = language;
    }

    if (ageGroup && ageGroup !== 'all') {
      query.ageGroup = { $in: ['all', ageGroup] };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { narrationText: { $regex: escapedSearch, $options: 'i' } },
        { creatorName: { $regex: escapedSearch, $options: 'i' } },
        { category: { $regex: escapedSearch, $options: 'i' } },
        { language: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { playsCount: -1, likesCount: -1 };
    } else if (sort === 'liked') {
      sortOption = { likesCount: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const tracks = await RadioAudio.find(query).sort(sortOption).populate('creator', 'name email role avatar');

    res.json({
      success: true,
      count: tracks.length,
      data: tracks
    });
  } catch (error) {
    console.error('Error fetching radio tracks:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/radio/:id
// @desc    Get single audio track & increment play count
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const track = await RadioAudio.findById(req.params.id).populate('creator', 'name email role avatar');
    if (!track) {
      return res.status(404).json({ success: false, message: 'Radio audio track not found' });
    }

    // Increment play and view count
    track.playsCount += 1;
    track.viewsCount += 1;
    await track.save();

    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/radio/upload
// @desc    Upload real audio content with title, description, category, language, cover image, and audio file
// @access  Private (Authenticated User)
router.post('/upload', protect, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, language, ageGroup, duration, narratorName, narrationText } = req.body;

    if (!title || !category || !language) {
      return res.status(400).json({ success: false, message: 'Title, Category, and Language are required' });
    }

    let audioUrl = req.body.audioUrl || '';
    let coverImage = req.body.coverImageUrl || '';

    if (req.files && req.files.audio && req.files.audio[0]) {
      audioUrl = `/uploads/radio/${req.files.audio[0].filename}`;
    }

    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImage = `/uploads/radio/${req.files.coverImage[0].filename}`;
    }

    if (!audioUrl) {
      return res.status(400).json({ success: false, message: 'Audio file is required for upload' });
    }

    if (!['Music', 'Stories', 'Mini Novels', 'Poetry', 'Author Stories', 'Famous Lives', 'Scientists', 'Astronauts & Space', 'Literature Talks'].includes(category)) {
      return res.status(400).json({ success: false, message: 'Please select a valid radio category' });
    }

    if (!['English', 'Malayalam', 'Hindi'].includes(language)) {
      return res.status(400).json({ success: false, message: 'Please select English, Malayalam, or Hindi' });
    }

    // Default covers based on category if not provided
    const categoryCovers = {
      'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      'Stories': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      'Mini Novels': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      'Poetry': 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=600&q=80',
      'Author Stories': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'Famous Lives': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      'Scientists': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      'Astronauts & Space': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      'Literature Talks': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
    };

    if (!coverImage) {
      coverImage = categoryCovers[category] || categoryCovers['Stories'];
    }

    const newTrack = await RadioAudio.create({
      title,
      description: description || '',
      category,
      language: language || 'English',
      languageCode: { English: 'en-GB', Malayalam: 'ml-IN', Hindi: 'hi-IN' }[language || 'English'],
      audioType: 'file',
      narrationText: narrationText || '',
      ageGroup: ageGroup || 'all',
      audioUrl,
      coverImage,
      duration: duration || '3:30',
      creator: req.user._id,
      creatorName: narratorName?.trim() || req.user.name || 'AnimVerse User',
      creatorRole: req.user.role || 'user',
      status: 'approved', // Auto-approved for frictionless creator playback, admins can modify
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Audio broadcast successfully uploaded to AnimVerse Radio!',
      data: newTrack
    });
  } catch (error) {
    console.error('Error uploading radio audio:', error);
    res.status(500).json({ success: false, message: 'Server upload error', error: error.message });
  }
});

// @route   POST /api/radio/:id/like
// @desc    Toggle like on radio track
// @access  Private (Authenticated User)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const track = await RadioAudio.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Radio audio track not found' });
    }

    const userId = req.user._id;
    const index = track.likes.indexOf(userId);

    if (index === -1) {
      track.likes.push(userId);
      track.likesCount += 1;
    } else {
      track.likes.splice(index, 1);
      track.likesCount = Math.max(0, track.likesCount - 1);
    }

    await track.save();

    res.json({
      success: true,
      liked: index === -1,
      likesCount: track.likesCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/* =========================================================
   ADMIN MANAGEMENT ROUTES FOR ANIMVERSE RADIO
   ========================================================= */

// @route   GET /api/radio/admin/all
// @desc    Get all radio tracks for Admin Dashboard (includes pending/rejected/inactive)
// @access  Private / Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const tracks = await RadioAudio.find().sort({ createdAt: -1 }).populate('creator', 'name email role');
    
    const stats = {
      total: tracks.length,
      approved: tracks.filter(t => t.status === 'approved').length,
      pending: tracks.filter(t => t.status === 'pending').length,
      rejected: tracks.filter(t => t.status === 'rejected').length,
      active: tracks.filter(t => t.isActive).length,
      totalPlays: tracks.reduce((sum, t) => sum + (t.playsCount || 0), 0)
    };

    res.json({
      success: true,
      stats,
      count: tracks.length,
      data: tracks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/radio/admin/:id/status
// @desc    Approve or Reject audio track
// @access  Private / Admin
router.patch('/admin/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected' | 'pending'
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const track = await RadioAudio.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Radio audio track not found' });
    }

    track.status = status;
    await track.save();

    res.json({
      success: true,
      message: `Audio track status updated to '${status}'`,
      data: track
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/radio/admin/:id/toggle-active
// @desc    Activate or Deactivate audio track
// @access  Private / Admin
router.patch('/admin/:id/toggle-active', protect, authorize('admin'), async (req, res) => {
  try {
    const track = await RadioAudio.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Radio audio track not found' });
    }

    track.isActive = !track.isActive;
    await track.save();

    res.json({
      success: true,
      message: `Audio track ${track.isActive ? 'activated' : 'deactivated'}`,
      data: track
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/radio/admin/:id
// @desc    Delete audio track
// @access  Private / Admin
router.delete('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const track = await RadioAudio.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Radio audio track not found' });
    }

    await track.deleteOne();

    res.json({
      success: true,
      message: 'Audio track deleted permanently from AnimVerse Radio'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
