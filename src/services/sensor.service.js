// src/services/sensor.service.js - Contains all database logic for sensor data.

// Import the influx module (no change)
const influx = require('../config/influx'); 

// --- UPDATED ---
// This function just passes the data along to the influx module.
function writeSensorData(farmId, data) {
    influx.writeSensorData(farmId, data);
}

// --- NEW ---
// This function calls the new 'read' function from our influx module.
async function getLatestSensorData(farmId) {
    return await influx.getLatestSensorData(farmId);
}

// --- UPDATED EXPORTS ---
module.exports = {
    writeSensorData,
    getLatestSensorData, // We must export the new function
};