const EmailVerification = require('../models/EmailVerification');
const cron = require('node-cron');

class CleanupService {
  constructor() {
    this.isRunning = false;
    this.jobs = [];
  }

  // Start all cleanup jobs
  start() {
    if (this.isRunning) {
      console.log('🧹 Cleanup service is already running');
      return;
    }

    console.log('🧹 Starting cleanup service...');
    
    // Clean up expired email verifications every hour
    const emailCleanupJob = cron.schedule('0 * * * *', async () => {
      try {
        console.log('🧹 Running email verification cleanup...');
        const deletedCount = await EmailVerification.cleanupExpired();
        console.log(`🧹 Cleaned up ${deletedCount} expired email verifications`);
      } catch (error) {
        console.error('❌ Email verification cleanup failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // Clean up old user sessions every 6 hours
    const sessionCleanupJob = cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('🧹 Running session cleanup...');
        await this.cleanupOldSessions();
        console.log('🧹 Session cleanup completed');
      } catch (error) {
        console.error('❌ Session cleanup failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // Database maintenance every day at 2 AM
    const dbMaintenanceJob = cron.schedule('0 2 * * *', async () => {
      try {
        console.log('🧹 Running database maintenance...');
        await this.performDatabaseMaintenance();
        console.log('🧹 Database maintenance completed');
      } catch (error) {
        console.error('❌ Database maintenance failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // Start all jobs
    emailCleanupJob.start();
    sessionCleanupJob.start();
    dbMaintenanceJob.start();

    this.jobs = [emailCleanupJob, sessionCleanupJob, dbMaintenanceJob];
    this.isRunning = true;

    console.log('✅ Cleanup service started successfully');
    console.log('📅 Scheduled jobs:');
    console.log('   - Email verification cleanup: Every hour');
    console.log('   - Session cleanup: Every 6 hours');
    console.log('   - Database maintenance: Daily at 2 AM UTC');
  }

  // Stop all cleanup jobs
  stop() {
    if (!this.isRunning) {
      console.log('🧹 Cleanup service is not running');
      return;
    }

    console.log('🛑 Stopping cleanup service...');
    
    this.jobs.forEach(job => {
      if (job) {
        job.stop();
        job.destroy();
      }
    });

    this.jobs = [];
    this.isRunning = false;

    console.log('✅ Cleanup service stopped');
  }

  // Manual cleanup trigger
  async runManualCleanup() {
    try {
      console.log('🧹 Running manual cleanup...');
      
      // Clean expired email verifications
      const emailCleanupCount = await EmailVerification.cleanupExpired();
      console.log(`🧹 Cleaned up ${emailCleanupCount} expired email verifications`);
      
      // Clean old sessions
      await this.cleanupOldSessions();
      
      // Database maintenance
      await this.performDatabaseMaintenance();
      
      console.log('✅ Manual cleanup completed successfully');
      
      return {
        success: true,
        emailVerificationsDeleted: emailCleanupCount,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Manual cleanup failed:', error);
      throw error;
    }
  }

  // Clean up old user sessions (locked accounts, etc.)
  async cleanupOldSessions() {
    try {
      const database = require('../config/database');
      const db = database.getDb();
      
      // Clear expired account locks
      const result = await db.collection('users').updateMany(
        { 
          lockUntil: { $lt: new Date() },
          lockUntil: { $ne: null }
        },
        {
          $set: {
            loginAttempts: 0,
            lockUntil: null,
            updatedAt: new Date()
          }
        }
      );

      console.log(`🔓 Unlocked ${result.modifiedCount} expired account locks`);
      return result.modifiedCount;
    } catch (error) {
      console.error('❌ Session cleanup error:', error);
      throw error;
    }
  }

  // Perform database maintenance tasks
  async performDatabaseMaintenance() {
    try {
      const database = require('../config/database');
      const db = database.getDb();
      
      // Update statistics
      const collections = ['users', 'email_verifications', 'orders', 'products'];
      const stats = {};
      
      for (const collection of collections) {
        try {
          const count = await db.collection(collection).countDocuments();
          stats[collection] = count;
        } catch (error) {
          console.error(`❌ Failed to count ${collection}:`, error);
          stats[collection] = 'error';
        }
      }
      
      console.log('📊 Database statistics:', stats);
      
      // Compact collections (if supported)
      try {
        await db.command({ compact: 'email_verifications' });
        console.log('🗜️ Compacted email_verifications collection');
      } catch (error) {
        // Compact might not be supported in all MongoDB deployments
        console.log('ℹ️ Collection compaction not available or failed');
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Database maintenance error:', error);
      throw error;
    }
  }

  // Get cleanup service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.jobs.length,
      nextRuns: this.isRunning ? {
        emailCleanup: 'Every hour',
        sessionCleanup: 'Every 6 hours',
        dbMaintenance: 'Daily at 2 AM UTC'
      } : null,
      lastManualRun: this.lastManualRun || null
    };
  }

  // Get cleanup statistics
  async getStatistics(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const emailStats = await EmailVerification.getStatistics(startDate, new Date());
      
      return {
        period: `Last ${days} days`,
        emailVerifications: emailStats,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Failed to get cleanup statistics:', error);
      throw error;
    }
  }
}

// Create singleton instance
const cleanupService = new CleanupService();

module.exports = cleanupService;