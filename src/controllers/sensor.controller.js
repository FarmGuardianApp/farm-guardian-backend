const sensorService = require('../services/sensor.service');
const predictionService = require('../services/prediction.service');
const analyticsService = require('../services/analytics.service'); // --- NEW ---
const alertService = require('../services/alert.service'); // --- NEW ---

async function receiveSensorData(req, res) {
    const { farmId } = req.params;
    const sensorData = req.body; // Pass the whole body

    // ... (validation) ...
    if (sensorData.temperature === undefined || /*...all 5 checks...*/ sensorData.ph === undefined) {
        return res.status(400).json({ error: 'All 5 sensor fields are required.' });
    }

    try {
        // Step 1: Write raw data to InfluxDB
        sensorService.writeSensorData(farmId, sensorData);

        // Step 2: Get prediction
        const predictionResult = await predictionService.getPrediction(sensorData);
        if (!predictionResult) {
            return res.status(202).send({ message: 'Data accepted, but prediction failed.' });
        }
        
        console.log(`Prediction received for farm ${farmId}:`, predictionResult);

        // --- NEW: Step 3 ---
        // Save the full prediction JSON to MongoDB
        await analyticsService.savePrediction({ farmId, ...predictionResult });

        // --- NEW: Step 4 ---
        // Loop through the ML model's alerts and create them
        if (predictionResult.alerts && predictionResult.alerts.length > 0) {
            for (const alertMsg of predictionResult.alerts) {
                // We parse the alert message to get the details
                // e.g., "WARNING: Humidity is high (Value: 78.2)"
                const parts = alertMsg.split(' ');
                const status = `${parts[0].toLowerCase()}_${parts[3]}`; // "warning_high"
                const sensor = parts[1].toLowerCase(); // "humidity"
                
                await alertService.createAlert({
                    farmId: farmId,
                    sensor: sensor,
                    status: status,
                    message: alertMsg,
                });
            }
        }
        
        res.status(202).send({ message: 'Data accepted and processed.' });

    } catch (error) {
        console.error(`Error processing sensor data for farm ${farmId}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

async function getLatestSensorData(req, res) {
    const { farmId } = req.params;
    try {
        // Step 1: Get the latest raw values from InfluxDB
        const rawData = await sensorService.getLatestSensorData(farmId);
        if (!rawData) {
            return res.status(404).json({ error: 'No sensor data found for this farm.' });
        }

        // --- NEW: Step 2 ---
        // We must add the "age" hack just like the prediction service does
        // to get a valid score.
        const dataWithAge = {
            temperature: rawData.temperature,
            humidity: rawData.humidity,
            pressure: rawData.pressure,
            tds: rawData.tds,
            ph: rawData.ph,
            age_weeks: 6 // Hard-coded demo value
        };

        // Step 3: Get the *status* of that data from the ML model
        const predictionResult = await predictionService.getPrediction(dataWithAge);
        if (!predictionResult) {
            // If ML fails, just send the raw data
            return res.status(200).json(rawData);
        }

        // Step 4: Send the full, rich ML object to the mobile app
        // This object contains the scores and statuses we need for the colors
        res.status(200).json(predictionResult);

    } catch (error) {
        console.error(`Error getting latest sensor data for farm ${farmId}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

module.exports = {
    receiveSensorData,
    getLatestSensorData,
};