// src/index.js - This is the main entry point for the application.

const express = require('express');
const farmRoutes = require('./routes/farm.routes');
const sensorRoutes = require('./routes/sensor.routes');
const authRoutes = require('./routes/auth.routes'); // Import the new auth routes

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// --- API Routes ---
// Any request starting with /api/farms will be handled by the farm router.
app.use('/api/farms', farmRoutes);

// Any request for sensor data will be handled by the sensor router.
app.use('/api', sensorRoutes);

// Any request starting with /api/auth will be handled by the new auth router.
app.use('/api/auth', authRoutes);


// Health Check endpoint to verify the server is running
app.get('/health', async (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

