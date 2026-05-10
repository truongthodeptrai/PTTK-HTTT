const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

// Register
router.post('/register', AuthController.register);

// Login
router.post('/login', AuthController.login);

// Profile
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;