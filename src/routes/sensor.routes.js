// src/routes/sensor.routes.js - Defines endpoints for sensor data.

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');

// Matches POST /api/farms/:farmId/sensor-data
router.post('/farms/:farmId/sensor-data', sensorController.receiveSensorData);

module.exports = router;
