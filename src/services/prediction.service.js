// src/services/prediction.service.js - Communicates with our ML API

const axios = require('axios');

// --- THIS IS THE FIX ---
// We now point to the specific /predict/environmental endpoint
const ML_API_URL = 'http://localhost:8000/predict/environmental';

/**
 * Sends sensor data to the ML model and returns the prediction.
 * @param {object} sensorData - The sensor data object (e.g., { temperature: 25.5, ... }).
 * @returns {Promise<object>} The prediction response from the ML API.
 */
async function getPrediction(sensorData) {
  try {
    // --- THIS IS THE HACK FOR THE DEMO ---
    // We are hard-coding the 'age_weeks' to 6 (for an "adult" flock)
    // to satisfy the new ML model's requirement.
    // Later, we will fetch this from our PostgreSQL 'farms' table.
    const payload = {
      ...sensorData,
      age_weeks: 6 
    };
    // -------------------------------------

    // We use axios to send a POST request to our FastAPI server.
    const response = await axios.post(ML_API_URL, payload);
    
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