const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      if (this.client) {
        return this.db;
      }

      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      console.log('🔄 Connecting to MongoDB Atlas...');
      console.log('📡 Connection URI (masked):', uri.replace(/\/\/.*@/, '//***:***@'));

      // Create a MongoClient with a MongoClientOptions object to set the Stable API version
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000, // Increased timeout
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority'
      });

      // Connect the client to the server
      await this.client.connect();
      console.log('🔗 MongoDB client connected');
      
      // Send a ping to confirm a successful connection
      await this.client.db("admin").command({ ping: 1 });
      console.log("✅ Successfully connected to MongoDB Atlas!");

      // Get the database
      this.db = this.client.db(process.env.DB_NAME || 'goat_ecommerce');
      console.log(`📊 Using database: ${process.env.DB_NAME || 'goat_ecommerce'}`);
      
      // Create indexes for better performance
      await this.createIndexes();
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      
      // Provide helpful error messages
      if (error.code === 'ENOTFOUND') {
        console.error('🔍 DNS Resolution failed. Please check:');
        console.error('   1. Your internet connection');
        console.error('   2. MongoDB Atlas cluster hostname');
        console.error('   3. Network firewall settings');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('🚫 Connection refused. Please check:');
        console.error('   1. MongoDB Atlas cluster is running');
        console.error('   2. Network access settings in Atlas');
        console.error('   3. IP whitelist configuration');
      } else if (error.message.includes('authentication failed')) {
        console.error('🔐 Authentication failed. Please check:');
        console.error('   1. Username and password are correct');
        console.error('   2. User has proper database permissions');
        console.error('   3. Password special characters are URL encoded');
      }
      
      throw error;
    }
  }

  async createIndexes() {
    try {
      console.log('🔧 Creating database indexes...');
      
      // Users collection indexes
      await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ createdAt: 1 });
      console.log('✅ Users indexes created');

      // Products collection indexes (without text index for API strict mode)
      await this.db.collection('products').createIndex({ name: 1 });
      await this.db.collection('products').createIndex({ description: 1 });
      await this.db.collection('products').createIndex({ category: 1 });
      await this.db.collection('products').createIndex({ brand: 1 });
      await this.db.collection('products').createIndex({ price: 1 });
      await this.db.collection('products').createIndex({ createdAt: -1 });
      await this.db.collection('products').createIndex({ isFeatured: 1 });
      await this.db.collection('products').createIndex({ isNew: 1 });
      await this.db.collection('products').createIndex({ isSale: 1 });
      console.log('✅ Products indexes created');

      // Orders collection indexes
      await this.db.collection('orders').createIndex({ userId: 1 });
      await this.db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
      await this.db.collection('orders').createIndex({ status: 1 });
      await this.db.collection('orders').createIndex({ paymentStatus: 1 });
      await this.db.collection('orders').createIndex({ createdAt: -1 });
      console.log('✅ Orders indexes created');

      console.log('✅ All database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
      // Don't throw the error, just log it so the server can still start
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('✅ MongoDB connection closed');
    }
  }

  async healthCheck() {
    try {
      await this.client.db("admin").command({ ping: 1 });
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}

// Create a singleton instance
const database = new Database();

module.exports = database;