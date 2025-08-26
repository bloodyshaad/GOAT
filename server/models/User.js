const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const database = require('../config/database');

class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.phone = userData.phone;
    this.role = userData.role || 'customer';
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
    this.isEmailVerified = userData.isEmailVerified || false;
    this.emailVerifiedAt = userData.emailVerifiedAt || null;
    this.lastLoginAt = userData.lastLoginAt || null;
    this.loginAttempts = userData.loginAttempts || 0;
    this.lockUntil = userData.lockUntil || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Save user to database
  async save() {
    try {
      await this.hashPassword();
      const db = database.getDb();
      const result = await db.collection('users').insertOne(this);
      return { ...this, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const db = database.getDb();
      return await db.collection('users').findOne({ 
        email: email.toLowerCase(),
        isActive: true 
      });
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const db = database.getDb();
      return await db.collection('users').findOne({ 
        _id: new ObjectId(id),
        isActive: true 
      });
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate JWT token
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Verify JWT token
  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  // Update user
  static async updateById(id, updateData) {
    try {
      const db = database.getDb();
      updateData.updatedAt = new Date();
      
      // Hash password if it's being updated
      if (updateData.password) {
        const salt = await bcrypt.genSalt(12);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }

      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get user profile (without password)
  static async getProfile(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove password from response
      const { password, ...userProfile } = user;
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete user
  static async deleteById(id) {
    try {
      const db = database.getDb();
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isActive: false,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Mark email as verified
  static async markEmailAsVerified(id) {
    try {
      const db = database.getDb();
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }

      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  static async updateLastLogin(id) {
    try {
      const db = database.getDb();
      await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            lastLoginAt: new Date(),
            loginAttempts: 0,
            lockUntil: null,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // Increment login attempts
  static async incrementLoginAttempts(email) {
    try {
      const db = database.getDb();
      const maxAttempts = 5;
      const lockTime = 30 * 60 * 1000; // 30 minutes

      const user = await User.findByEmail(email);
      if (!user) return;

      const attempts = (user.loginAttempts || 0) + 1;
      const updateData = {
        loginAttempts: attempts,
        updatedAt: new Date()
      };

      // Lock account if max attempts reached
      if (attempts >= maxAttempts) {
        updateData.lockUntil = new Date(Date.now() + lockTime);
      }

      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: updateData }
      );

      return attempts;
    } catch (error) {
      throw error;
    }
  }

  // Check if account is locked
  static async isAccountLocked(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) return false;

      if (user.lockUntil && user.lockUntil > new Date()) {
        return true;
      }

      // Clear lock if expired
      if (user.lockUntil && user.lockUntil <= new Date()) {
        await User.updateById(user._id, {
          loginAttempts: 0,
          lockUntil: null
        });
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  // Get all users (admin only)
  static async getAll(page = 1, limit = 10, search = '') {
    try {
      const db = database.getDb();
      const skip = (page - 1) * limit;
      
      let query = { isActive: true };
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await db.collection('users')
        .find(query)
        .project({ password: 0 }) // Exclude password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('users').countDocuments(query);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  static async getStatistics() {
    try {
      const db = database.getDb();
      
      const stats = await db.collection('users').aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            verifiedUsers: { $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] } },
            lockedUsers: { $sum: { $cond: [{ $gt: ['$lockUntil', new Date()] }, 1, 0] } }
          }
        }
      ]).toArray();

      if (stats.length === 0) {
        return {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          lockedUsers: 0,
          verificationRate: 0
        };
      }

      const result = stats[0];
      const verificationRate = result.activeUsers > 0 ? 
        (result.verifiedUsers / result.activeUsers * 100).toFixed(2) : 0;

      return {
        totalUsers: result.totalUsers,
        activeUsers: result.activeUsers,
        verifiedUsers: result.verifiedUsers,
        lockedUsers: result.lockedUsers,
        verificationRate: parseFloat(verificationRate)
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;