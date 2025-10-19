// src/controllers/sensor.controller.js - Handles request/response for sensor data.

const sensorService = require('../services/sensor.service');

function receiveSensorData(req, res) {
    const { farmId } = req.params;
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ error: 'Temperature and humidity are required.' });
    }

    try {
        sensorService.writeSensorData(farmId, { temperature, humidity });
        res.status(202).send({ message: 'Data accepted.' });
    } catch (error) {
        console.error(`Error processing sensor data for farm ${farmId}:`, error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

module.exports = {
    receiveSensorData,
};
