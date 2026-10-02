const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true },
  description: { type: String },
  desc: { type: String },
  content: { type: String },
  fullContent: [String],
  pages: [{
    chapter: String,
    title: String,
    content: [String]
  }],
  coverImage: { type: String, default: '' },
  genre: { type: String },
  language: { type: String, default: 'English' },
  synopsis: { type: String },
  ageGroup: {
    type: String,
    default: 'all'
  },
  audience: { type: String, default: 'All' },
  category: { type: String },
  icon: { type: String, default: '📖' },
  color: { type: String, default: '#F59E0B' },
  readingTime: { type: Number, default: 10 },
  readTime: { type: String, default: '10 min' },
  rating: { type: Number, default: 4.8 },
  tags: [String],
  isPublished: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Compound indexes for user queries and library filtering
StorySchema.index({ addedBy: 1, createdAt: -1 });
StorySchema.index({ genre: 1, isPublished: 1 });

module.exports = mongoose.model('Story', StorySchema);
