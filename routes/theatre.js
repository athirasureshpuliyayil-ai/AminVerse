const express = require('express');
const jwt = require('jsonwebtoken');
const Story = require('../models/Story');
const StoryTheatre = require('../models/StoryTheatre');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const BACKGROUNDS = new Set(['forest', 'castle', 'night', 'meadow', 'ocean', 'library', 'stage']);
const POSITIONS = new Set(['left', 'center', 'right']);

const normalizePerformance = input => {
  const characters = Array.isArray(input.characters) ? input.characters.slice(0, 12).map(character => ({
    name: String(character.name || '').trim().slice(0, 80),
    role: String(character.role || '').trim().slice(0, 120),
    appearance: String(character.appearance || '').trim().slice(0, 240),
    illustration: String(character.illustration || '🎭').slice(0, 8),
    color: /^#[0-9a-fA-F]{6}$/.test(character.color) ? character.color : '#F59E0B',
    position: POSITIONS.has(character.position) ? character.position : 'center'
  })) : [];

  const scenes = Array.isArray(input.scenes) ? input.scenes.slice(0, 40).map(scene => ({
    title: String(scene.title || '').trim().slice(0, 120),
    background: BACKGROUNDS.has(scene.background) ? scene.background : 'stage',
    backgroundImage: /^https?:\/\//i.test(scene.backgroundImage || '') ? String(scene.backgroundImage).slice(0, 500) : '',
    dialogues: Array.isArray(scene.dialogues) ? scene.dialogues.slice(0, 100).map(line => ({
      speaker: String(line.speaker || '').trim().slice(0, 80),
      text: String(line.text || '').trim().slice(0, 2000)
    })).filter(line => line.text) : []
  })) : [];

  return { characters, scenes, isPublished: input.isPublished !== false };
};

const getOwnedStory = async (storyId, userId) => Story.findOne({ _id: storyId, addedBy: userId });

async function getOptionalUser(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}

router.get('/mine', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const data = await StoryTheatre.find({ creator: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('story', 'title author ageGroup audience language coverImage isPublished');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load your theatre versions.' });
  }
});

router.get('/story/:storyId', async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId).select('title author ageGroup audience language isPublished');
    if (!story || !story.isPublished) return res.status(404).json({ success: false, message: 'Published theatre not found.' });

    const audience = `${story.ageGroup || ''} ${story.audience || ''}`.toLowerCase();
    const isAdultStory = /adult|teen/.test(audience) && !/kids|children/.test(audience);
    if (isAdultStory) {
      const viewer = await getOptionalUser(req);
      if (!viewer || !['adult', 'author', 'admin'].includes(viewer.role)) {
        return res.status(viewer ? 403 : 401).json({ success: false, message: 'This theatre is restricted to adult readers.' });
      }
    }

    const theatre = await StoryTheatre.findOne({ story: story._id, isPublished: true })
      .populate('creator', 'name')
      .lean();
    if (!theatre) return res.status(404).json({ success: false, message: 'This story does not have a published theatre version yet.' });
    res.json({ success: true, data: { ...theatre, story } });
  } catch (error) {
    const status = error.name === 'CastError' ? 404 : 500;
    res.status(status).json({ success: false, message: status === 404 ? 'Published theatre not found.' : 'Could not load the theatre.' });
  }
});

router.get('/edit/:storyId', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const story = await getOwnedStory(req.params.storyId, req.user._id);
    if (!story && req.user.role !== 'admin') return res.status(404).json({ success: false, message: 'Story not found in your workspace.' });
    const theatre = story ? await StoryTheatre.findOne({ story: story._id, creator: req.user._id }) : await StoryTheatre.findOne({ story: req.params.storyId });
    res.json({ success: true, story, data: theatre });
  } catch (error) {
    const status = error.name === 'CastError' ? 404 : 500;
    res.status(status).json({ success: false, message: status === 404 ? 'Story not found.' : 'Could not load theatre editor.' });
  }
});

router.put('/:storyId', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const story = await getOwnedStory(req.params.storyId, req.user._id);
    if (!story && req.user.role !== 'admin') return res.status(404).json({ success: false, message: 'You can only create theatre for your own stories.' });
    const targetStory = story || await Story.findById(req.params.storyId);
    if (!targetStory) return res.status(404).json({ success: false, message: 'Story not found.' });

    const performance = normalizePerformance(req.body);
    if (!performance.scenes.length) return res.status(400).json({ success: false, message: 'Add at least one scene before saving.' });
    if (performance.characters.some(character => !character.name)) return res.status(400).json({ success: false, message: 'Every character needs a name.' });
    const knownCharacters = new Set(performance.characters.map(character => character.name));
    if (performance.scenes.some(scene => scene.dialogues.some(line => line.speaker && !knownCharacters.has(line.speaker)))) {
      return res.status(400).json({ success: false, message: 'Dialogue speakers must match a character.' });
    }

    const creatorId = story ? req.user._id : (targetStory.addedBy || req.user._id);
    const theatre = await StoryTheatre.findOneAndUpdate(
      { story: targetStory._id, creator: creatorId },
      { $set: performance, $setOnInsert: { story: targetStory._id, creator: creatorId } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: theatre });
  } catch (error) {
    console.error('Story theatre save failed:', error);
    const status = error.name === 'CastError' ? 404 : error.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ success: false, message: error.message || 'Could not save theatre.' });
  }
});

module.exports = router;
