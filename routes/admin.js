const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const AnimationProject = require('../models/AnimationProject');
const RadioAudio = require('../models/RadioAudio');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get all data for admin dashboard
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    const stories = await Story.find().sort('-createdAt');
    const projects = await AnimationProject.find().populate('user', 'name email').sort('-createdAt');
    const radioTracks = await RadioAudio.find().sort('-createdAt');

    // Extract authors from stories (distinct authors)
    const authorsList = await Story.distinct('author');
    const authors = authorsList.map((name, index) => ({ id: index, name }));

    const stats = {
      totalUsers: users.length,
      totalStories: stories.length,
      totalProjects: projects.length,
      totalAuthors: authors.length,
      totalRadioTracks: radioTracks.length
    };

    res.json({
      success: true,
      data: {
        stats,
        users,
        authors,
        stories,
        projects,
        radioTracks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users directly from MongoDB
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      data: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        projectCount: u.projectCount || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete registered user from MongoDB
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in MongoDB' });
    }
    await AnimationProject.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ success: true, message: 'User successfully removed from MongoDB registry' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
