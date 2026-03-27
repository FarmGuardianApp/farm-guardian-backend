// src/routes/farm.routes.js - Defines all endpoints related to farms.

const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farm.controller');

// Matches GET /api/farms
router.get('/', farmController.getAllFarms);

// Matches POST /api/farms
router.post('/', farmController.createFarm);

// Matches PUT /api/farms/:id
router.put('/:id', farmController.updateFarm);

// Matches DELETE /api/farms/:id
router.delete('/:id', farmController.deleteFarm);

module.exports = router;
