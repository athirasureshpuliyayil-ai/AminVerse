const mongoose = require('mongoose');

const AnimationProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creatorName: { type: String, default: 'Studio Creator' },
  creatorRole: { type: String, default: 'Adult' },
  creatorEmail: { type: String, default: '' },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  story: { type: String },
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  characters: [{
    name: String,
    avatar: String,
    appearance: String,
    personality: String
  }],
  scenes: [{
    sceneNumber: Number,
    number: Number,
    title: String,
    description: String,
    image: String,
    imageUrl: String,
    videoUrl: String,
    videoStatus: { type: String, enum: ['queued', 'processing', 'completed', 'failed', 'idle'], default: 'completed' },
    taskId: String,
    provider: { type: String, default: '8scale' },
    model: { type: String, default: 'wan-2.2' },
    videoPrompt: String,
    error: String,
    animationEngine: String,
    dialogue: String,
    narration: String,
    durationSec: Number
  }],
  engine: { type: String, default: 'ltx' },
  engineName: { type: String, default: 'LTX Studio' },
  animationStyle: {
    type: String,
    default: 'cinematic'
  },
  style: { type: String, default: 'Cinematic 8K' },
  aspectRatio: { type: String, default: '16:9 Cinema' },
  resolution: { type: String, default: '1080p Full HD' },
  fileSize: { type: String, default: '18.4 MB' },
  status: {
    type: String,
    default: 'Completed'
  },
  videoUrl: { type: String, default: '' },
  poster: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  duration: { type: String, default: '24s' },
  durationSec: { type: Number, default: 24 },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });

// Compound indexes for fast user dashboard lookups and queue processing
AnimationProjectSchema.index({ user: 1, createdAt: -1 });
AnimationProjectSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('AnimationProject', AnimationProjectSchema);
