const database = require('../config/database');
const { ObjectId } = require('mongodb');

class EmailVerification {
  constructor(data) {
    this.userId = data.userId;
    this.email = data.email;
    this.token = data.token;
    this.type = data.type || 'verification'; // 'verification', 'password-reset'
    this.expiresAt = data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    this.isUsed = data.isUsed || false;
    this.attempts = data.attempts || 0;
    this.maxAttempts = data.maxAttempts || 3;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.metadata = data.metadata || {};
  }

  // Save email verification record
  async save() {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      // Remove any existing verification for this email and type
      await collection.deleteMany({
        email: this.email,
        type: this.type,
        isUsed: false
      });

      const result = await collection.insertOne({
        userId: this.userId ? new ObjectId(this.userId) : null,
        email: this.email,
        token: this.token,
        type: this.type,
        expiresAt: this.expiresAt,
        isUsed: this.isUsed,
        attempts: this.attempts,
        maxAttempts: this.maxAttempts,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        metadata: this.metadata
      });

      this._id = result.insertedId;
      return this;
    } catch (error) {
      console.error('Error saving email verification:', error);
      throw new Error('Failed to save email verification');
    }
  }

  // Find verification by token
  static async findByToken(token, type = 'verification') {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      const verification = await collection.findOne({
        token,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!verification) {
        return null;
      }

      return new EmailVerification(verification);
    } catch (error) {
      console.error('Error finding verification by token:', error);
      throw new Error('Failed to find verification');
    }
  }

  // Find verification by email
  static async findByEmail(email, type = 'verification') {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      const verification = await collection.findOne({
        email,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!verification) {
        return null;
      }

      return new EmailVerification(verification);
    } catch (error) {
      console.error('Error finding verification by email:', error);
      throw new Error('Failed to find verification');
    }
  }

  // Find verification by user ID
  static async findByUserId(userId, type = 'verification') {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      const verification = await collection.findOne({
        userId: new ObjectId(userId),
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!verification) {
        return null;
      }

      return new EmailVerification(verification);
    } catch (error) {
      console.error('Error finding verification by user ID:', error);
      throw new Error('Failed to find verification');
    }
  }

  // Mark verification as used
  async markAsUsed() {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      await collection.updateOne(
        { _id: this._id },
        {
          $set: {
            isUsed: true,
            updatedAt: new Date()
          }
        }
      );

      this.isUsed = true;
      this.updatedAt = new Date();
      return this;
    } catch (error) {
      console.error('Error marking verification as used:', error);
      throw new Error('Failed to mark verification as used');
    }
  }

  // Increment attempt count
  async incrementAttempts() {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      await collection.updateOne(
        { _id: this._id },
        {
          $inc: { attempts: 1 },
          $set: { updatedAt: new Date() }
        }
      );

      this.attempts += 1;
      this.updatedAt = new Date();
      return this;
    } catch (error) {
      console.error('Error incrementing attempts:', error);
      throw new Error('Failed to increment attempts');
    }
  }

  // Check if verification is valid
  isValid() {
    const now = new Date();
    return !this.isUsed && 
           this.expiresAt > now && 
           this.attempts < this.maxAttempts;
  }

  // Check if verification is expired
  isExpired() {
    return new Date() > this.expiresAt;
  }

  // Check if max attempts reached
  isMaxAttemptsReached() {
    return this.attempts >= this.maxAttempts;
  }

  // Delete verification
  async delete() {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      await collection.deleteOne({ _id: this._id });
      return true;
    } catch (error) {
      console.error('Error deleting verification:', error);
      throw new Error('Failed to delete verification');
    }
  }

  // Clean up expired verifications (static method for cleanup job)
  static async cleanupExpired() {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      const result = await collection.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isUsed: true, updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Delete used tokens older than 7 days
        ]
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} expired email verifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired verifications:', error);
      throw new Error('Failed to cleanup expired verifications');
    }
  }

  // Get verification statistics
  static async getStatistics(startDate, endDate) {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      const matchStage = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const stats = await collection.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            verified: { $sum: { $cond: [{ $eq: ['$isUsed', true] }, 1, 0] } },
            expired: { $sum: { $cond: [{ $lt: ['$expiresAt', new Date()] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $and: [{ $eq: ['$isUsed', false] }, { $gt: ['$expiresAt', new Date()] }] }, 1, 0] } },
            byType: {
              $push: {
                type: '$type',
                isUsed: '$isUsed',
                isExpired: { $lt: ['$expiresAt', new Date()] }
              }
            }
          }
        }
      ]).toArray();

      if (stats.length === 0) {
        return {
          total: 0,
          verified: 0,
          expired: 0,
          pending: 0,
          verificationRate: 0,
          typeBreakdown: {}
        };
      }

      const result = stats[0];
      const verificationRate = result.total > 0 ? (result.verified / result.total * 100).toFixed(2) : 0;

      // Calculate type breakdown
      const typeBreakdown = {};
      result.byType.forEach(item => {
        if (!typeBreakdown[item.type]) {
          typeBreakdown[item.type] = { total: 0, verified: 0, expired: 0, pending: 0 };
        }
        typeBreakdown[item.type].total++;
        if (item.isUsed) typeBreakdown[item.type].verified++;
        else if (item.isExpired) typeBreakdown[item.type].expired++;
        else typeBreakdown[item.type].pending++;
      });

      return {
        total: result.total,
        verified: result.verified,
        expired: result.expired,
        pending: result.pending,
        verificationRate: parseFloat(verificationRate),
        typeBreakdown
      };
    } catch (error) {
      console.error('Error getting verification statistics:', error);
      throw new Error('Failed to get verification statistics');
    }
  }

  // Resend verification (with rate limiting)
  static async canResendVerification(email, type = 'verification') {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      // Check if there's a recent verification sent (within last 5 minutes)
      const recentVerification = await collection.findOne({
        email,
        type,
        createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
      });

      return !recentVerification;
    } catch (error) {
      console.error('Error checking resend eligibility:', error);
      return false;
    }
  }

  // Get user's verification history
  static async getUserVerificationHistory(userId, limit = 10) {
    try {
      const db = database.getDb();
      const collection = db.collection('email_verifications');

      const history = await collection.find({
        userId: new ObjectId(userId)
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

      return history.map(item => new EmailVerification(item));
    } catch (error) {
      console.error('Error getting user verification history:', error);
      throw new Error('Failed to get verification history');
    }
  }
}

module.exports = EmailVerification;