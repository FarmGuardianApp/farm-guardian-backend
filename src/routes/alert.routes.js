const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');

// Matches GET /api/farms/:farmId/alerts
router.get('/farms/:farmId/alerts', alertController.getAlerts);

module.exports = router;