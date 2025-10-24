// src/controllers/sensor.controller.js - Updated to call the ML service

const sensorService = require('../services/sensor.service');
const predictionService = require('../services/prediction.service'); // Import the new service

async function receiveSensorData(req, res) {
    const { farmId } = req.params;
    const { temperature, humidity } = req.body;
    const sensorData = { temperature, humidity };

    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ error: 'Temperature and humidity are required.' });
    }

    try {
        // Step 1: Write the raw data to InfluxDB (as before).
        sensorService.writeSensorData(farmId, sensorData);

        // --- NEW ---
        // Step 2: Send the data to the ML service to get a prediction.
        console.log('Requesting prediction from ML service...');
        const predictionResult = await predictionService.getPrediction(sensorData);

        // Step 3: Log the result. In a real app, we would save this prediction
        // to our PostgreSQL database or trigger an alert.
        if (predictionResult) {
            console.log(`Prediction received for farm ${farmId}:`, predictionResult);
        } else {
            console.log(`Could not get prediction for farm ${farmId}.`);
        }

        // Respond to the client that the data was accepted.
        res.status(202).send({ message: 'Data accepted and is being processed.' });

    } catch (error) {
        console.error(`Error processing sensor data for farm ${farmId}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

module.exports = {
    receiveSensorData,
};

