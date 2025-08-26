const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('🧪 Testing MongoDB Atlas Connection...\n');
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.log('Please check your .env file');
    return;
  }

  console.log('📋 Connection Details:');
  console.log('   URI (masked):', uri.replace(/\/\/.*@/, '//***:***@'));
  console.log('   Database:', process.env.DB_NAME || 'goat_ecommerce');
  console.log('');

  let client;
  
  try {
    console.log('🔄 Creating MongoDB client...');
    
    // Create client with various connection options
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority'
    });

    console.log('🔗 Attempting to connect...');
    await client.connect();
    console.log('✅ Client connected successfully!');

    console.log('🏓 Testing ping...');
    await client.db("admin").command({ ping: 1 });
    console.log('✅ Ping successful!');

    console.log('📊 Testing database access...');
    const db = client.db(process.env.DB_NAME || 'goat_ecommerce');
    const collections = await db.listCollections().toArray();
    console.log(`✅ Database accessible! Found ${collections.length} collections`);

    if (collections.length > 0) {
      console.log('📁 Collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

    console.log('\n🎉 Connection test completed successfully!');
    console.log('Your MongoDB Atlas connection is working properly.');

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.code === 'ENOTFOUND') {
      console.log('\n🔍 DNS Resolution Issue:');
      console.log('   • Check your internet connection');
      console.log('   • Verify the cluster hostname in your connection string');
      console.log('   • Try using a different DNS server (8.8.8.8, 1.1.1.1)');
      console.log('   • Check if your firewall is blocking MongoDB connections');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication Issue:');
      console.log('   • Verify your username and password');
      console.log('   • Check if special characters in password are URL encoded');
      console.log('   • Ensure the user has proper database permissions');
      console.log('   • Try creating a new database user in MongoDB Atlas');
    } else if (error.message.includes('IP not in whitelist')) {
      console.log('\n🌐 Network Access Issue:');
      console.log('   • Add your IP address to MongoDB Atlas whitelist');
      console.log('   • Or allow access from anywhere (0.0.0.0/0) for testing');
      console.log('   • Check Network Access settings in MongoDB Atlas');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🚫 Connection Refused:');
      console.log('   • Check if MongoDB Atlas cluster is running');
      console.log('   • Verify cluster configuration');
      console.log('   • Check network access settings');
    }
    
    console.log('\n💡 Troubleshooting Tips:');
    console.log('   1. Go to MongoDB Atlas dashboard');
    console.log('   2. Check cluster status (should be running)');
    console.log('   3. Verify Network Access settings');
    console.log('   4. Check Database Access (users and permissions)');
    console.log('   5. Try connecting from MongoDB Compass first');
    
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔒 Connection closed');
    }
  }
}

// Run the test
testConnection().catch(console.error);