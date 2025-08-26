const express = require('express');
const router = express.Router();
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const emailService = require('../services/emailService');
const { validate, userSchemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user with email verification
// @access  Public
router.post('/register', validate(userSchemas.register), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (email not verified initially)
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      isEmailVerified: false
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Generate verification token
    const verificationToken = emailService.generateVerificationToken();
    
    // Save verification record
    const emailVerification = new EmailVerification({
      userId: savedUser._id,
      email: savedUser.email,
      token: verificationToken,
      type: 'verification'
    });
    await emailVerification.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        savedUser.email,
        savedUser.name,
        verificationToken
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails, but log it
    }

    // Generate JWT token (user can still browse but needs verification for purchases)
    const token = User.generateToken(savedUser._id);

    // Remove password from response
    const { password: _, ...userResponse } = savedUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: userResponse,
        token,
        emailVerificationSent: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(userSchemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = User.generateToken(user._id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.getProfile(req.user._id);
    
    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, validate(userSchemas.updateProfile), async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();

    const updatedUser = await User.updateById(req.user._id, updateData);
    
    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, validate(userSchemas.changePassword), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await User.comparePassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await User.updateById(req.user._id, { password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      userId: req.user._id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @route   POST /api/auth/verify-email
// @desc    Verify user email with token
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find verification record
    const verification = await EmailVerification.findByToken(token, 'verification');
    
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    if (!verification.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired or been used'
      });
    }

    // Mark email as verified
    await User.markEmailAsVerified(verification.userId);
    
    // Mark verification as used
    await verification.markAsUsed();

    // Get updated user
    const user = await User.findById(verification.userId);
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to GOAT.',
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Private
router.post('/resend-verification', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if can resend (rate limiting)
    const canResend = await EmailVerification.canResendVerification(user.email, 'verification');
    if (!canResend) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 5 minutes before requesting another verification email'
      });
    }

    // Generate new verification token
    const verificationToken = emailService.generateVerificationToken();
    
    // Save new verification record
    const emailVerification = new EmailVerification({
      userId: user._id,
      email: user.email,
      token: verificationToken,
      type: 'verification'
    });
    await emailVerification.save();

    // Send verification email
    await emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findByEmail(email);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Check if can resend (rate limiting)
    const canResend = await EmailVerification.canResendVerification(email, 'password-reset');
    if (!canResend) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 5 minutes before requesting another password reset'
      });
    }

    // Generate reset token
    const resetToken = emailService.generateResetToken();
    
    // Save reset record (expires in 1 hour)
    const passwordReset = new EmailVerification({
      userId: user._id,
      email: user.email,
      token: resetToken,
      type: 'password-reset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });
    await passwordReset.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken
    );

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find reset record
    const resetRecord = await EmailVerification.findByToken(token, 'password-reset');
    
    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    if (!resetRecord.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired or been used'
      });
    }

    // Update password
    await User.updateById(resetRecord.userId, { 
      password: newPassword,
      loginAttempts: 0,
      lockUntil: null
    });
    
    // Mark reset as used
    await resetRecord.markAsUsed();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// @route   GET /api/auth/email-status
// @desc    Get email verification status
// @access  Private
router.get('/email-status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for pending verification
    const pendingVerification = await EmailVerification.findByUserId(user._id, 'verification');

    res.json({
      success: true,
      data: {
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        hasPendingVerification: !!pendingVerification,
        canResendVerification: !user.isEmailVerified && 
          await EmailVerification.canResendVerification(user.email, 'verification')
      }
    });
  } catch (error) {
    console.error('Email status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email status'
    });
  }
});

module.exports = router;