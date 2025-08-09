// Test database connection
// Run this with: node scripts/test-db.js

const mongoose = require('mongoose')

async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables')
      console.log('Please create a .env.local file with your MongoDB connection string')
      return
    }
    
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    
    console.log('✅ Successfully connected to MongoDB!')
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String })
    const TestModel = mongoose.model('Test', testSchema)
    
    const testDoc = new TestModel({ test: 'connection successful' })
    await testDoc.save()
    
    console.log('✅ Successfully created test document')
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id })
    console.log('✅ Test document cleaned up')
    
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
