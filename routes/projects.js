const express = require('express');
const AnimationProject = require('../models/AnimationProject');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'animverse_ai_super_secret_jwt_key_2024');
        if (decoded && decoded.id) {
          const projects = await AnimationProject.find({
            $or: [{ user: decoded.id }, { user: { $exists: false } }, { user: null }]
          }).sort('-createdAt');
          return res.json({ success: true, count: projects.length, data: projects });
        }
      } catch {
        // fallback to public listing on token verification error
      }
    }
    const projects = await AnimationProject.find().sort('-createdAt').limit(50);
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load your animation projects.' });
  }
});

router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const projects = await AnimationProject.find().sort('-createdAt').populate('user', 'name email role');
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load animation projects.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title, prompt, videoUrl, poster, style, animationStyle, aspectRatio,
      resolution, duration, durationSec, characters, scenes, engine, engineName
    } = req.body;
    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ success: false, message: 'Generation prompt is required.' });
    }

    let user = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'animverse_ai_super_secret_jwt_key_2024');
        if (decoded && decoded.id) {
          user = await User.findById(decoded.id);
        }
      } catch {
        // ignore
      }
    }

    const projectData = {
      title: title || `${String(prompt).slice(0, 40)}...`,
      prompt,
      videoUrl: videoUrl || '/videos/scene_1.mp4',
      poster: poster || scenes?.[0]?.image || '',
      thumbnailUrl: poster || scenes?.[0]?.image || '',
      style: style || 'Cinematic 8K',
      animationStyle: animationStyle || 'cinematic',
      aspectRatio: aspectRatio || '16:9 Cinema',
      resolution: resolution || '1080p Full HD',
      duration: duration || '24s',
      durationSec: durationSec || 24,
      characters: characters || [],
      scenes: scenes || [],
      engine: engine || 'ltx',
      engineName: engineName || 'LTX Studio',
      status: 'Completed'
    };

    if (user) {
      projectData.user = user._id;
      projectData.creatorName = user.name;
      projectData.creatorRole = user.role;
      projectData.creatorEmail = user.email;
    }

    const project = await AnimationProject.create(projectData);

    if (user) {
      await User.findByIdAndUpdate(user._id, { $inc: { projectCount: 1 } });
    }

    res.status(201).json({ success: true, data: project, message: 'Animation project saved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not save animation project.' });
  }
});

router.delete('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const project = await AnimationProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    const status = error.name === 'CastError' ? 404 : 500;
    res.status(status).json({ success: false, message: 'Could not delete project.' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await AnimationProject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found in your account.' });
    res.json({ success: true, message: 'Animation project deleted.' });
  } catch (error) {
    const status = error.name === 'CastError' ? 404 : 500;
    res.status(status).json({ success: false, message: 'Could not delete animation project.' });
  }
});

module.exports = router;