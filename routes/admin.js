const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const AnimationProject = require('../models/AnimationProject');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get all data for admin dashboard
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    const stories = await Story.find().sort('-createdAt');
    const projects = await AnimationProject.find().populate('user', 'name email').sort('-createdAt');
    
    // Extract authors from stories (distinct authors)
    // Sometimes authors are represented by the string `author` in Story schema
    const authorsList = await Story.distinct('author');
    
    // We might also want to map authors to users if possible, or just send a summary
    const authors = authorsList.map((name, index) => ({ id: index, name }));

    const stats = {
      totalUsers: users.length,
      totalStories: stories.length,
      totalProjects: projects.length,
      totalAuthors: authors.length
    };

    res.json({
      success: true,
      data: {
        stats,
        users,
        authors,
        stories,
        projects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
