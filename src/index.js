// src/index.js - This is now our main entry point. It's much cleaner!

const express = require('express');
const farmRoutes = require('./routes/farm.routes');
const sensorRoutes = require('./routes/sensor.routes');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// --- Routes ---
// Any request starting with /api/farms will be handled by our farm router.
app.use('/api/farms', farmRoutes);

// Any request for sensor data will be handled by the sensor router.
app.use('/api', sensorRoutes);


// Health Check (can stay here as it's a general check)
app.get('/health', async (req, res) => {
    // For a real app, we'd import and check DB connections from the config folder.
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
