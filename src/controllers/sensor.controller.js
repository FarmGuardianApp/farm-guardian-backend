// src/controllers/sensor.controller.js

const sensorService = require('../services/sensor.service');
const predictionService = require('../services/prediction.service'); 

// --- UPDATED ---
async function receiveSensorData(req, res) {
    const { farmId } = req.params;
    // Destructure all 5 fields from the request
    const { temperature, humidity, pressure, tds, ph } = req.body;
    const sensorData = { temperature, humidity, pressure, tds, ph };

    // Updated validation to check for all 5 fields
    if (temperature === undefined || humidity === undefined || pressure === undefined || tds === undefined || ph === undefined) {
        return res.status(400).json({ error: 'All 5 sensor fields are required: temperature, humidity, pressure, tds, ph.' });
    }

    try {
        // Step 1: Write all 5 data fields to InfluxDB.
        sensorService.writeSensorData(farmId, sensorData);

        // Step 2: Get a health prediction.
        // (Our ML model still only uses temp/humidity, which is fine)
        console.log('Requesting prediction from ML service...');
        const predictionResult = await predictionService.getPrediction({ temperature, humidity });

        if (predictionResult) {
            console.log(`Prediction received for farm ${farmId}:`, predictionResult);
        } else {
            console.log(`Could not get prediction for farm ${farmId}.`);
        }

        res.status(202).send({ message: 'Data accepted and is being processed.' });

    } catch (error) {
        console.error(`Error processing sensor data for farm ${farmId}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

// --- NEW ---
// This is the brand new function to send the latest data to the mobile app.
async function getLatestSensorData(req, res) {
    const { farmId } = req.params;
    try {
        // Call the service, which calls influx.js, which queries the database
        const data = await sensorService.getLatestSensorData(farmId);
        
        if (!data) {
            // Send a 404 if no data has been received yet
            return res.status(404).json({ error: 'No sensor data found for this farm.' });
        }
        // Send the data back to the mobile app
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error getting latest sensor data for farm ${farmId}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

// --- UPDATED EXPORTS ---
module.exports = {
    receiveSensorData,
    getLatestSensorData, // We must export the new function
};