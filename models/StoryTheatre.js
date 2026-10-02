const mongoose = require('mongoose');

const DialogueSchema = new mongoose.Schema({
  speaker: { type: String, trim: true, maxlength: 80, default: '' },
  text: { type: String, trim: true, required: true, maxlength: 2000 }
}, { _id: true });

const SceneSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxlength: 120, default: '' },
  background: {
    type: String,
    enum: ['forest', 'castle', 'night', 'meadow', 'ocean', 'library', 'stage'],
    default: 'stage'
  },
  backgroundImage: { type: String, trim: true, maxlength: 500, default: '' },
  dialogues: { type: [DialogueSchema], default: [] }
}, { _id: true });

const CharacterSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 80 },
  role: { type: String, trim: true, maxlength: 120, default: '' },
  appearance: { type: String, trim: true, maxlength: 240, default: '' },
  illustration: { type: String, trim: true, maxlength: 8, default: '🎭' },
  color: { type: String, match: /^#[0-9a-fA-F]{6}$/, default: '#F59E0B' },
  position: { type: String, enum: ['left', 'center', 'right'], default: 'center' }
}, { _id: true });

const StoryTheatreSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  characters: { type: [CharacterSchema], default: [] },
  scenes: { type: [SceneSchema], default: [] },
  isPublished: { type: Boolean, default: true },
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

StoryTheatreSchema.index({ story: 1, creator: 1 }, { unique: true });
StoryTheatreSchema.index({ isPublished: 1, updatedAt: -1 });

module.exports = mongoose.model('StoryTheatre', StoryTheatreSchema);
