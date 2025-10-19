// src/services/sensor.service.js - Contains all database logic for sensor data.

const influx = require('../config/influx'); // We will create this file next

function writeSensorData(farmId, data) {
    // This logic is mostly the same, just moved to a service file.
    influx.writeSensorData(farmId, data);
}

module.exports = {
    writeSensorData,
};
