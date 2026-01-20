const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/signup',authController.createUser)
router.post('/login',authController.login)
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.get('/profile', protect, authController.getProfile);
module.exports = router;
