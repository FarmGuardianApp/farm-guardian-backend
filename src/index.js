// src/index.js
const express = require('express');
const { connectToMongo } = require('./config/mongo'); // --- NEW ---
const farmRoutes = require('./routes/farm.routes');
const sensorRoutes = require('./routes/sensor.routes');
const authRoutes = require('./routes/auth.routes');
const alertRoutes = require('./routes/alert.routes'); // --- NEW ---

const app = express();
const port = 3000;

app.use(express.json());

// --- API Routes ---
app.use('/api/farms', farmRoutes);
app.use('/api', sensorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', alertRoutes); // --- NEW ---

app.get('/health', async (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- NEW ---
// We wrap the server start in a function to connect to Mongo first.
async function startServer() {
    await connectToMongo(); // Connect to MongoDB
    
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer(); // Start the server