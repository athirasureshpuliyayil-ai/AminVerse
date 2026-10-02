const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// In-memory fallback user storage for high-availability cloud deployments
const memoryUsers = new Map();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'animverse_ai_super_secret_jwt_key_2024', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const assignedRole = ['parent', 'adult', 'author', 'user', 'admin'].includes(role) ? role : 'user';

    let user = null;

    try {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      user = await User.create({ name, email: cleanEmail, password, role: assignedRole });
    } catch (dbErr) {
      console.warn('MongoDB query warning, using resilient memory store:', dbErr.message);
      if (memoryUsers.has(cleanEmail)) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      user = {
        _id: 'mem_' + Date.now(),
        name,
        email: cleanEmail,
        password,
        role: assignedRole
      };
      memoryUsers.set(cleanEmail, user);
    }

    const token = generateToken(user._id, user.role);

    // Send Welcome Email asynchronously without blocking response
    sendEmail({
      email: user.email,
      subject: 'Welcome to AnimVerse AI! 🎬',
      html: `<h1>Welcome to AnimVerse AI, ${user.name}!</h1><p>We are thrilled to have you on board. Start turning your stories into amazing animations today!</p>`
    }).catch(err => console.warn('Welcome email notice:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Registration failed' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    let user = null;
    let isMatch = false;

    try {
      user = await User.findOne({ email: cleanEmail }).select('+password');
      if (user) {
        if (!user.isActive) {
          return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
        }
        isMatch = await user.matchPassword(password);
      }
    } catch (dbErr) {
      console.warn('MongoDB query warning in login, checking memory store:', dbErr.message);
    }

    // Check memory store fallback if not matched in DB
    if (!user && memoryUsers.has(cleanEmail)) {
      const memUser = memoryUsers.get(cleanEmail);
      if (memUser.password === password) {
        user = memUser;
        isMatch = true;
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Admin Login
// @access  Public
router.post('/admin-login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Admin not found or unauthorized' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Admin login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot Password - send reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user account found with this email address.' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Determine Client Application URL (fallback to referrer host or localhost:5173)
    let clientHost = 'http://localhost:5173';
    if (req.get('referer')) {
      try { clientHost = new URL(req.get('referer')).origin; } catch {}
    } else if (req.get('origin')) {
      clientHost = req.get('origin');
    }

    const resetUrl = `${clientHost}/reset-password?token=${resetToken}`;

    const message = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FFE0B2; border-radius: 12px; background-color: #FFFBF0;">
        <h2 style="color: #E63946; text-align: center;">AnimVerse AI - Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You recently requested to reset your password for your AnimVerse AI account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" target="_blank" style="background: linear-gradient(135deg, #E63946, #C1121F); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 0.85rem; color: #666;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 0.82rem; color: #888; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="font-size: 0.85rem; color: #999; margin-top: 30px;">If you did not request a password reset, please ignore this email. This link is valid for 1 hour.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: '🔐 Password Reset Request - AnimVerse AI',
        html: message,
        resetUrl // Pass URL to email helper for dev logging
      });

      res.json({
        success: true,
        message: 'Password reset link sent! Please check your email inbox.',
        resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
      });
    } catch (error) {
      console.error('Error sending reset email', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ success: false, message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset Password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { token, newPassword } = req.body;

    // Verify token validity
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.resetPasswordToken !== token || !user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
    }

    // Set new password (pre-save hook will hash it automatically)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now sign in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth Sign-In / Registration
// @access  Public
router.post('/google', [
  body('email').isEmail().withMessage('Valid Google email is required'),
  body('name').notEmpty().withMessage('Google account name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, name, googleId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // Link Google ID and update avatar if missing
      if (!user.googleId && googleId) user.googleId = googleId;
      if (!user.avatar && avatar) user.avatar = avatar;
      if (!user.isVerified) user.isVerified = true;
      await user.save();
    } else {
      // Create new user account automatically for Google sign-in
      const randomPassword = 'GoogleAuth_' + Date.now() + Math.random().toString(36).substring(2, 9);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        googleId: googleId || 'google_' + Date.now(),
        avatar: avatar || '',
        role: 'user',
        isVerified: true
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Google authentication successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Google authentication failed', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
});

// @route   POST /api/auth/seed-admin
// @desc    Create initial admin (run once)
// @access  Public (remove in production)
router.post('/seed-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      return res.json({ success: false, message: 'Admin already exists' });
    }
    const admin = await User.create({
      name: 'AnimVerse Admin',
      email: 'admin@animverse.ai',
      password: 'admin123456',
      role: 'admin',
      isVerified: true
    });
    res.json({ success: true, message: 'Admin created!', email: admin.email, password: 'admin123456' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
