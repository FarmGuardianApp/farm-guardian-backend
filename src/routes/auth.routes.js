const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Matches POST /api/auth/register
router.post('/register', authController.register);

// Matches POST /api/auth/verify
router.post('/verify', authController.verifyOtp);

module.exports = router;
