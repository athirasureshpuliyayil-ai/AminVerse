const mongoose = require('mongoose');

const AnimationProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  story: { type: String },
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  characters: [{
    name: String,
    age: String,
    gender: String,
    appearance: String,
    personality: String
  }],
  scenes: [{
    sceneNumber: Number,
    description: String,
    characters: [String],
    emotion: String,
    background: String,
    cameraAngle: String,
    imageUrl: String,
    dialogue: String,
    narration: String
  }],
  animationStyle: {
    type: String,
    enum: ['cartoon', 'anime', 'comic', 'fantasy', 'pixar', 'cinematic', 'watercolor'],
    default: 'cartoon'
  },
  voiceStyle: { type: String, default: 'male' },
  musicTheme: { type: String, default: 'adventure' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  videoUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AnimationProject', AnimationProjectSchema);
