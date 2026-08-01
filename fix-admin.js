const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/capstoneproject');
    
    // We need to require the User model, but we can just use the native collection to see what's there
    const User = require('./models/User');
    
    let admin = await User.findOne({ email: 'admin@animverse.ai' });
    
    if (!admin) {
      console.log('Admin user not found! Creating one...');
      admin = await User.create({
        name: 'AnimVerse Admin',
        email: 'admin@animverse.ai',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      console.log('✅ Admin user created successfully.');
    } else {
      console.log('Admin user found! Resetting password to admin123456...');
      admin.password = 'admin123456';
      await admin.save();
      console.log('✅ Admin password reset successfully.');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

fixAdmin();
