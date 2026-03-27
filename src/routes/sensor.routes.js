// src/routes/sensor.routes.js - Defines endpoints for sensor data.

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');

// This POST route is for WRITING data from the Python script
router.post('/farms/:farmId/sensor-data', sensorController.receiveSensorData);

// --- NEW ---
// This GET route is for READING data for the mobile app's dashboard
router.get('/farms/:farmId/sensor-data/latest', sensorController.getLatestSensorData);

module.exports = router;