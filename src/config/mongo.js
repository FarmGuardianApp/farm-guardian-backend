const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'farmGuardianAnalytics';
let db;

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (e) {
    console.error('Failed to connect to MongoDB', e);
    process.exit(1); // Exit the app if we can't connect
  }
}

// Function to get the database instance
const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized! Call connectToMongo first.');
  }
  return db;
};

module.exports = { connectToMongo, getDb };