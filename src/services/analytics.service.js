const { getDb } = require('../config/mongo');

/**
 * Saves a prediction result object to the 'predictions' collection in MongoDB.
 * @param {object} predictionData - The JSON object from the ML service.
 */
async function savePrediction(predictionData) {
  try {
    const db = getDb();
    const collection = db.collection('predictions');
    
    // Add a timestamp to the data
    const dataToInsert = {
      ...predictionData,
      createdAt: new Date(),
    };

    await collection.insertOne(dataToInsert);
    console.log('Prediction data saved to MongoDB');
  } catch (error) {
    console.error('Error saving prediction to MongoDB:', error);
  }
}

module.exports = {
  savePrediction,
};