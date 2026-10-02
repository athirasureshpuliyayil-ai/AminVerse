const mongoose = require('mongoose');

const MuseumExhibitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an exhibit title'],
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  room: {
    type: String,
    required: [true, 'Please provide a museum room'],
    trim: true,
    default: 'Malayalam Literature'
  },
  category: {
    type: String,
    trim: true,
    default: 'Classics'
  },
  author: {
    type: String,
    trim: true,
    default: ''
  },
  era: {
    type: String,
    trim: true,
    default: ''
  },
  keyWorks: [{
    type: String,
    trim: true
  }],
  quote: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    enum: ['English', 'Malayalam', 'Hindi', 'All'],
    default: 'English'
  },
  ageGroup: {
    type: String,
    enum: ['all', 'kids', 'adult'],
    default: 'all'
  },
  description: {
    type: String,
    default: ''
  },
  content: [{
    type: String,
    default: ''
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    default: ''
  },
  accentColor: {
    type: String,
    default: '#F59E0B'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

MuseumExhibitSchema.index({ room: 1, language: 1, isPublished: 1 });
MuseumExhibitSchema.index({ featured: 1, createdAt: -1 });

module.exports = mongoose.model('MuseumExhibit', MuseumExhibitSchema);

