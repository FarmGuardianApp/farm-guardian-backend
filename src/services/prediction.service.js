// src/services/prediction.service.js - Communicates with our ML API

const axios = require('axios');

// The URL where our Python ML service is running
const ML_API_URL = 'http://localhost:8000/predict';

/**
 * Sends sensor data to the ML model and returns the prediction.
 * @param {object} sensorData - The sensor data object (e.g., { temperature: 25.5, humidity: 60 }).
 * @returns {Promise<object>} The prediction response from the ML API.
 */
async function getPrediction(sensorData) {
  try {
    // We use axios to send a POST request to our FastAPI server.
    const response = await axios.post(ML_API_URL, sensorData);
    
    // The actual data from the response is in the `data` property.
    return response.data;

  } catch (error) {
    console.error('Error calling prediction API:', error.message);
    // If the ML service is down or there's an error, we return null.
    return null;
  }
}

module.exports = {
  getPrediction,
};
