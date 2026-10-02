const mongoose = require('mongoose');

const RadioAudioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an audio title'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a radio category'],
    enum: [
      'Music',
      'Stories',
      'Mini Novels',
      'Poetry',
      'Author Stories',
      'Famous Lives',
      'Scientists',
      'Astronauts & Space',
      'Literature Talks'
    ]
  },
  language: {
    type: String,
    required: [true, 'Please select a language'],
    enum: ['English', 'Malayalam', 'Hindi'],
    default: 'English'
  },
  languageCode: {
    type: String,
    default: 'en-GB'
  },
  audioType: {
    type: String,
    enum: ['file', 'speech'],
    default: 'file'
  },
  narrationText: {
    type: String,
    trim: true,
    maxlength: [12000, 'Narration text cannot exceed 12000 characters']
  },
  seedKey: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String,
    required: [true, 'Please provide an audio file URL']
  },
  coverImage: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: '0:00'
  },
  durationSeconds: {
    type: Number,
    default: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  creatorName: {
    type: String,
    default: 'AnimVerse Studio'
  },
  creatorRole: {
    type: String,
    default: 'author'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  ageGroup: {
    type: String,
    enum: ['all', 'kids', 'adult'],
    default: 'all'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  playsCount: {
    type: Number,
    default: 0
  },
  viewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for fast category/language filtering and admin search
RadioAudioSchema.index({ category: 1, language: 1, status: 1, isActive: 1 });
RadioAudioSchema.index({ creator: 1, createdAt: -1 });
RadioAudioSchema.index({ isFeatured: 1, playsCount: -1 });
RadioAudioSchema.index({ seedKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('RadioAudio', RadioAudioSchema);
