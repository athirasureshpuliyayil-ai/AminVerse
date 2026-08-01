const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const AnimationProject = require('../models/AnimationProject');
const { protect } = require('../middleware/auth');

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

module.exports = router;
