const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const AnimationProject = require('../models/AnimationProject');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/user/dashboard
// @desc    Get all data for user dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    const myStories = await Story.find({ addedBy: userId }).sort('-createdAt');
    const myProjects = await AnimationProject.find({ user: userId }).sort('-createdAt');
    
    const stats = {
      totalStories: myStories.length,
      totalProjects: myProjects.length,
      downloads: user.downloadCount || 0
    };

    res.json({
      success: true,
      data: {
        user,
        stats,
        myStories,
        myProjects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/user/stories
// @desc    Author upload/create story
// @access  Private
router.post('/stories', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const { title, description, synopsis, content, pages, language, genre, ageGroup, audience, category, color, icon, coverImage } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Story title is required' });
    }

    const story = await Story.create({
      title,
      author: req.user.name || 'Author',
      description: description || synopsis || '',
      synopsis: synopsis || description || '',
      content: Array.isArray(content) ? content.join('\n\n') : content || synopsis || description || '',
      pages: Array.isArray(pages) ? pages : [],
      language: language || 'English',
      genre: genre || 'Fantasy',
      ageGroup: ageGroup || 'all',
      audience: audience || (ageGroup === 'kids' || ageGroup === 'children' ? 'Kids' : ageGroup === 'adult' ? 'Adults' : 'All'),
      category: category || 'Original Story',
      color: color || '#7C3AED',
      icon: icon || '✍️',
      coverImage: coverImage || '',
      addedBy: req.user._id,
      isPublished: true
    });

    res.status(201).json({
      success: true,
      message: 'Story uploaded and published successfully!',
      story
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/user/switch-role
// @desc    Switch active user role (e.g. parent, adult, author)
// @access  Private
router.put('/switch-role', protect, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['parent', 'adult', 'author', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true }).select('-password');
    res.json({ success: true, message: `Switched role to ${role}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/user/projects
// @desc    Save generated animation project
// @access  Private
router.post('/projects', protect, async (req, res) => {
  try {
    const { title, prompt, story, characters, scenes, animationStyle, voiceStyle, musicTheme, duration, videoUrl, thumbnailUrl } = req.body;

    const project = await AnimationProject.create({
      user: req.user._id,
      title: title || 'Untitled Animation',
      prompt: prompt || 'Custom Animation Prompt',
      story: story || '',
      characters: characters || [],
      scenes: scenes || [],
      animationStyle: animationStyle || 'cartoon',
      voiceStyle: voiceStyle || 'male',
      musicTheme: musicTheme || 'adventure',
      status: 'completed',
      duration: duration || 18,
      videoUrl: videoUrl || '',
      thumbnailUrl: thumbnailUrl || ''
    });

    // Increment user project count
    await User.findByIdAndUpdate(req.user._id, { $inc: { projectCount: 1 } });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

