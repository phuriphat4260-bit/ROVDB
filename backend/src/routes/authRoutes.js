const express = require('express');
const router = express.Router();
const { login, register, getMe, protect } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

module.exports = router;
