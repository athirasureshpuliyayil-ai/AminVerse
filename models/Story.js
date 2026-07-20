const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  coverImage: { type: String, default: '' },
  genre: { type: String },
  language: { type: String, default: 'English' },
  ageGroup: {
    type: String,
    enum: ['children', 'teen', 'adult', 'all'],
    default: 'all'
  },
  category: { type: String },
  readingTime: { type: Number, default: 5 },
  tags: [String],
  isPublished: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
